import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { IconAvatar } from "../shared/UserAvatar";
import AddToPhotosRoundedIcon from '@mui/icons-material/AddToPhotosRounded';
import { RoomItem } from "../chat/RoomItem";
import { Stack } from "@mui/material";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import Messages from "../chat/Messages";
import { bindMsg2MsgElement, bindRoom2RoomElement, email2userTypeKey, genDefaultRoomType, genDefaultUserType } from "../../db/dataLoader";
import LogoutIcon from '@mui/icons-material/Logout';
import { useSignOut, useUserState } from "../auth/Auth";
import { useNavigate } from "react-router-dom";
import { RoutePages } from "../../util/router/RoutePages";
import MyAlert, { MyAlertProps, MyDefaultAlerts } from "../shared/MyAlert";
import { ContentType, MessageElement, RoomElement, RoomType, UserID, UserType } from "../../types/ChatType";
import { msg_ref, room_ref, room_root_ref, single_msg_ref, user_ref, user_ref_use_email } from "../auth/AuthHelper";
import { Unsubscribe, get, onValue, push, update } from "firebase/database";
import { MessageType } from "../../types/ChatType";
import { MemberList } from "../chat/Settings";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export var bindingRoomsRef = {
  callback: () => {}
}

export default function Home() {
  const theme = useTheme();
  const userState = useUserState();
  const nav = useNavigate()
  const signOut = useSignOut();

  const [userType, setUserType] = React.useState(genDefaultUserType())
  const [roomList, setRoomList] = React.useState(new Array<RoomElement>());
  const [messages, setMessages] = React.useState(new Array<MessageElement>());

  const [curRoom, setCurRoom] = React.useState(-1);
  const [showRoomList, setShowRoomList] = React.useState(false);
  const [showSetting, setShowSetting] = React.useState(false);
  // const [showProfile, setShowProfile] = React.useState(false)
  const [myAlert, setMyAlert] = React.useState(MyDefaultAlerts.NO_ALERT)
  const [roomUsers, setRoomUsers] = React.useState(new Map<UserID, UserType>())

  let userTypeUnsubscribe: Unsubscribe | undefined;
  let messagesUnsubscribe: Unsubscribe | undefined;

  React.useEffect(() => {
    let initialized = false;
    if (!initialized && userState.state === 'signed_in') {
      InitUser().then((curUserType: UserType | undefined) => {
        console.log('Initialized user')
        InitRooms(curUserType).then(() => {
          console.log('Initialized room')
        })
      }).catch(err => { console.log(err.message) })
    }
    return () => { initialized = true }
  }, [userState])

  const InitUser = async () => {
    if (userState.state !== 'signed_in')
      return
    let query = user_ref(userState.user)
    let _userType: UserType = (await get(query)).val()
    if (!_userType) { // new user
      _userType = genDefaultUserType()
      _userType.name = userState.user.displayName!
      _userType.email = userState.user.email!
      await update(query, _userType)
    }
    setUserType(_userType)
    userTypeUnsubscribe = onValue(query, snapshot => {
      let _tmpUT: UserType = snapshot.val()
      setUserType(_tmpUT)
      InitRooms() // maybe user room list changes
    })
    return _userType
  }

  /**
   * Update user type locally and remotely.
   */
  const UpdateUserType = (newUserType: UserType) => {
    if (userState.state !== 'signed_in')
      return
    let query = user_ref(userState.user)
    update(query, newUserType);
    setUserType(newUserType)
  }

  const InitRooms = async (curUserType?: UserType) => {
    setCurRoom(-1)
    let localUserType = curUserType ? curUserType : userType;
    let res = new Array<RoomElement>()
    if (!localUserType.rooms) {
      localUserType.rooms = new Array()
    }
    // push room first
    for (let i = 0; i < localUserType.rooms.length; ++i) {
      let query = room_ref(localUserType.rooms[i])
      let roomContent: RoomType = (await get(query)).val()
      res.push(bindRoom2RoomElement(roomContent, query))
    }
    // then assign unSub
    for (let i = 0; i < localUserType.rooms.length; ++i) {
      let query = room_ref(localUserType.rooms[i])
      let unSub = onValue(query, snapshot => {
        let cl = [...roomList]
        let res = cl.find(r => {r.ref.key === query.key})
        if (res) {
          res.room = snapshot.val()
          setRoomList(cl)
        }
      })
      res[i].unSub = unSub;
    }
    setRoomList(res)
  }

  /**
   * Add a new room to current user
   */
  const AddRoom = async () => {
    if (userState.state !== 'signed_in') {
      let idol_template = MyDefaultAlerts.IDOL_FAL_ALERT
      idol_template.title = 'Cannot create new room if you haven\'t signed in'
      idol_template.onClose = () => {
        setMyAlert(MyDefaultAlerts.NO_ALERT)
      },
      setMyAlert(idol_template);
      return
    }
    let newRoomRef = await push(room_root_ref)
    let copyRooms = userType.rooms ? userType.rooms : new Array<string>()
    UpdateUserType({
      ...userType,
      rooms: copyRooms.concat(newRoomRef.key!)
    })
    let newRoom = genDefaultRoomType()
    newRoom.members.push(email2userTypeKey(userType.email))
    if (!userType.rooms)
      userType.rooms = new Array()
    update(newRoomRef, newRoom) // no need to await
    let unSub = onValue(newRoomRef, snapshot => {
      let cl = [...roomList]
      let res = cl.find(r => {r.ref.key === newRoomRef.key})
      if (res) {
        res.room = snapshot.val()
        setRoomList(cl)
      }
    })
    let copyRoomList = roomList.concat(bindRoom2RoomElement(newRoom, newRoomRef, unSub))
    setRoomList(copyRoomList)
  }

  const InviteUser = async (email: string) => {
    if (userState.state !== 'signed_in' || curRoom === -1) {
      let idol_template = MyDefaultAlerts.IDOL_FAL_ALERT
      idol_template.title = 'Cannot invite new user if you haven\'t select any room'
      idol_template.onClose = () => {
        setMyAlert(MyDefaultAlerts.NO_ALERT)
      },
      setMyAlert(idol_template);
      return
    }
    console.log(`Inviting user with email: ${email}`);
    let newAccountRef = user_ref_use_email(email);
    let newAccount: UserType = (await get(newAccountRef)).val()
    if (newAccount)
      console.log(`Found user: ${newAccount}`)
    else 
      console.log(`User with email ${email} DNE`)
    // update new user
    if (!newAccount.rooms)
      newAccount.rooms = new Array()
    newAccount.rooms.push(roomList[curRoom].ref.key!)
    update(newAccountRef, newAccount);

    // update new room
    let copyRooms: Array<RoomElement> = [...roomList];
    let uid = email2userTypeKey(newAccount.email)
    if (!copyRooms[curRoom].room.members.find(m => m === uid)) {
      console.log("Welcome new user...")
      copyRooms[curRoom].room.members.push(uid)
      update(copyRooms[curRoom].ref, copyRooms[curRoom].room);
      setRoomList(copyRooms)
      // update current room map
      setRoomUsers(roomUsers.set(uid, newAccount))
    } else {
      console.log("The user is currently in this room...")
    }
  }

  const InitMessages = async (index: number) => {
    console.log(`Initialize messages for room: ${index}`)
    // if (userState.state !== 'signed_in' || index == -1) {
    if (userState.state !== 'signed_in') {
      setMessages(new Array())
      return
    }
    if (messagesUnsubscribe) {// release old monitor
      console.log(`release old message listener`)
      messagesUnsubscribe()
    }
    let query = msg_ref(roomList[index].ref.key!)
    let msgs: Array<MessageType> = (await get(query)).val()
    if (!msgs) {
      console.log(`Room ${index} has no message, finish message initialization`)
      setMessages(new Array())
      return
    }
    console.log(`fetched messages: ${JSON.stringify(msgs)}`)
    setMessages(msgs.map(bindMsg2MsgElement))
    messagesUnsubscribe = onValue(query, snapshot => {
      let _msgs: Array<MessageType> = snapshot.val()
      setMessages(_msgs.map(bindMsg2MsgElement))
    })
  }

  /**
   * Update one messages locally and remotely.
   */
  const UpdateOneMessages = (msgs: Array<MessageElement>, at: number) => {
    let query = single_msg_ref(roomList[curRoom].ref.key!, at)
    update(query, msgs[at].msg);
    setMessages(msgs);
  }

  const AddMessage = async (content: string) => {
    if (curRoom == -1 || userState.state !== 'signed_in') {
      let idol_template = MyDefaultAlerts.IDOL_FAL_ALERT
      idol_template.title = 'Cannot send message if you\'re not in a room'
      idol_template.onClose = () => {
        setMyAlert(MyDefaultAlerts.NO_ALERT)
      },
      setMyAlert(idol_template);
      return;
    }
    let msgs = [...messages] ?? new Array()
    UpdateOneMessages(msgs.concat(bindMsg2MsgElement({
      time: (new Date()).toISOString(),
      uid: email2userTypeKey(userType.email),
      type: ContentType.NORMAL, // more features in the future
      msg: content
    })), msgs.length)
  }

  const DeleteMessage = async (index: number) => {
    let copyMsgs = [...messages]
    copyMsgs[index].msg.type = ContentType.DELETED
    UpdateOneMessages(copyMsgs, index)
  }

  const ReleaseMonitor = () => {
    if (messagesUnsubscribe) {
      messagesUnsubscribe();
      messagesUnsubscribe = undefined
    }
    setMessages(new Array())
    for (let r of roomList) {
      if (r.unSub)
        r.unSub()
    }
    setRoomList(new Array())
    if (userTypeUnsubscribe) {
      userTypeUnsubscribe()
      userTypeUnsubscribe = undefined
    }
  }

  const handleDrawerOpen = () => {
    setShowRoomList(true);
    console.log("draw open")
  };

  const handleDrawerClose = () => {
    setShowRoomList(false);
    let copyRoomList = [...roomList]
    for (let i = 0; i < copyRoomList.length; ++i)
      copyRoomList[i].isInput = false;
    setRoomList([...copyRoomList]);
    console.log("draw close")
  };

  const handleSelected = async (index: number) => {
    // select old one, no update needed
    if (userState.state === 'uninitialized' || index == curRoom) 
      return
    setCurRoom(index);
    let copyRoomList = [...roomList]
    for (let i = 0; i < copyRoomList.length; ++i)
      copyRoomList[i].selected = false;
    copyRoomList[index].selected = true;
    setRoomList([...copyRoomList]);
    // update user map of current room
    let res = new Map<UserID, UserType>()
    for (let m of roomList[index].room.members) {
      let _userType: UserType = (await get(user_ref_use_email(m))).val()
      res.set(m, _userType)
    }
    setRoomUsers(res)
    await InitMessages(index);
  };

  const handleToggleInput = (
    index: number, 
    mode: 'flip' | 'set' | 'reset' = 'flip', 
    commit = true) => 
  {
    if (userState.state === 'uninitialized') 
      return
    let newValue: boolean;
    switch (mode) {
    case 'flip':
      newValue = !roomList[index].isInput;
      break;
    case 'set':
      newValue = true;
      break;
    case 'reset':
      newValue = false;
      break;
    default:
      throw new Error("Unknown toggle option")
    }
    if (newValue) { // must open
      setShowRoomList(true);
    } else { // must close
      setShowRoomList(true);
    }
    roomList.forEach((ele, i) => {
      ele.isInput = false
      if (index == i) {
        if (newValue) { // enable input
          // prepare for name editing
          ele.cache_input = ele.room.name
        } else if (commit && ele.cache_input.trim().length != 0) {
          // commit edition
          ele.room.name = ele.cache_input;
          update(ele.ref, ele.room);
        }
      }
    })
    roomList[index].isInput = newValue;
    setRoomList([...roomList]);
  }

  const handleCreateRoom = async () => {
    if (userState.state === 'uninitialized') 
      return
    await AddRoom();
  }

  const handleEditRoomName = (index: number, name: string) => {
    roomList[index].cache_input = name
    setRoomList([...roomList])
  }

  const handleToggleEditMessage = (
    index: number, 
    mode: 'set' | 'reset' | 'flip' = 'flip', 
    commit = true) => 
  {
    let newValue: boolean;
    switch (mode) {
    case 'flip':
      newValue = !messages[index].isInput;
      break;
    case 'set':
      newValue = true;
      break;
    case 'reset':
      newValue = false;
      break;
    default:
      throw new Error("Unknown toggle option")
    }
    messages.forEach((ele, i) => {
      ele.isInput = false
      if (index == i) {
        if (newValue) { // enable input
          // prepare for name editing
          ele.cache_input = ele.msg.msg;
        } else if (commit || (ele.cache_input.trim().length != 0 && ele.cache_input.trim() !== ele.msg.msg)) {
          // commit edition
          ele.msg.msg = ele.cache_input;
          ele.msg.type = ContentType.EDITED;
          UpdateOneMessages([...messages], index)
        }
      }
    })
    messages[index].isInput = newValue;
    setMessages([...messages]);
  }

  const handleEditMessage = (index: number, cur_msg: string) => {
    let copyMsgs = [...messages]
    copyMsgs[index].cache_input = cur_msg
    setMessages(copyMsgs)
  }

  const handleOpenSetting = () => {
    if (curRoom !== -1) {
      setShowSetting(true);
    } else {
      let idol_template = MyDefaultAlerts.IDOL_FAL_ALERT
      idol_template.title = 'Cannot open room setting since no room is selected'
      idol_template.onClose = () => {
        setMyAlert(MyDefaultAlerts.NO_ALERT)
      },
      setMyAlert(idol_template);
    }
  }

  const handleCloseSetting = () => {
    setShowSetting(false);
  }

  // const handleEditProfile = (type: 'wallpaper' | 'motto', payload: { wallpaper?: SrcUrl, motto?: string }) => {
  //   if (userState.state === 'uninitialized')
  //     return
  //   switch (type) {
  //   case 'wallpaper':
  //     userType.profile.wallpaper = payload.wallpaper
  //     break;
  //   case 'motto':
  //     userType.profile.motto = payload.motto
  //     break;
  //   }
  //   UpdateUserType(userType)
  // }

  const getCurRoomNameState = () => {
    if (userState.state === 'uninitialized') {
      return 'No room for anonymous user'
    } else if (curRoom != -1 && curRoom < roomList.length) {
      return `Room: ${roomList[curRoom].room.name}`
    } else {
      return `No room is selected`
    }
  }

  const getUserState = () => {
    if (userState.state === 'uninitialized') {
      return 'anonymous user'
    } else {
      return `user: ${userType.name}`
    }
  }

  const handleSignOut = () => {
    let idol_template: MyAlertProps
    if (userState.state === 'signed_in') {
      idol_template = {
        title: "Success!",
        body: `${userType.name} has signed out successfully :)`,
        src: MyDefaultAlerts.IDOL_SUC_ALERT.src,
        tag: "Good bye!",
        showing: MyDefaultAlerts.IDOL_SUC_ALERT.showing,
        onClose: () => {
          idol_template.showing = false
          nav(RoutePages.PAGE_INDEX.path)
        },
      }
    } else {
      idol_template = {
        title: "Warning!",
        body: `You haven't signed in... :(`,
        src: MyDefaultAlerts.IDOL_FAL_ALERT.src,
        tag: "Oops!",
        showing: MyDefaultAlerts.IDOL_FAL_ALERT.showing,
        severity: 'warning',
        onClose: () => {
          idol_template.showing = false
          nav(RoutePages.PAGE_INDEX.path)
        },
      }
    }
    ReleaseMonitor()
    signOut.signOut()
    setMyAlert(idol_template);
  }

  return (
    <>
      {
        myAlert.showing &&
        <MyAlert {...myAlert} />
      }
      <Stack spacing={2}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={showRoomList}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(showRoomList && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {`${getCurRoomNameState()}, ${getUserState()}`}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Stack direction="row" spacing={1}>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    handleOpenSetting()
                  }}
                  edge="start"
                >
                  <SettingsRoundedIcon />
                  {/* <PersonAddAlt1Icon /> */}
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={handleSignOut}
                  edge="start"
                >
                  <LogoutIcon />
                </IconButton>
              </Stack>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={showRoomList}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {
                roomList.map((r_ele, index) => {
                  return (
                    <RoomItem 
                      room_ele={r_ele}
                      open={showRoomList}
                      index={index}
                      key={index}
                      usingAvatar={{
                        type: 'String'
                      }}
                      handleSelected={handleSelected}
                      handleToggleInput={handleToggleInput}
                      handleEditRoomName={handleEditRoomName}
                    />
                )})
              }
            </List>
            <Divider />
            <ListItem key={"Create a room"} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: showRoomList ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={async () => {
                  await handleCreateRoom();
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: showRoomList ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <IconAvatar {...{ icon: <AddToPhotosRoundedIcon /> }} />
                </ListItemIcon>
                <ListItemText
                  primary={"Create new room"}
                  sx={{ opacity: showRoomList ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Drawer>
          <Box component="main" >
            <DrawerHeader />
            {
              (roomList.length > curRoom && 
                <Messages
                  userType={userType}
                  messages={messages}
                  roomUsers={roomUsers}
                  AddMessage={AddMessage}
                  DeleteMessage={DeleteMessage}
                  handleEditMessage={handleEditMessage}
                  handleToggleEditMessage={handleToggleEditMessage}
                />
              )
            }
            <Divider />
          </Box>
        </Box>
        <>
        {
          // showProfile && <Profile userType={userType} handleEditProfile={handleEditProfile} />
        }
        </>
        <>
        {
          showSetting &&
          <MemberList
            open={showSetting}
            roomUsers={roomUsers}
            onClose={handleCloseSetting}
            handleAddAccount={InviteUser}
          />
        }
        </>
      </Stack>
    </>
  );
}
