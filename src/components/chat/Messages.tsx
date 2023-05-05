import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import { InputBase, ListSubheader } from '@mui/material';
import { MessageElement, UserID, UserType } from '../../types/ChatType';
import '@fontsource/roboto/500.css';
import { MessageItem } from './MessageItem';
import { UserAvatar } from '../shared/UserAvatar';
import { DateTraverser } from '../../util/function/DateManager';
import React from 'react';
import { useUserState } from '../auth/Auth';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const HiddenItemForFormat = () => {
  return (
    <div style={{
      visibility: 'hidden'
    }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt="Profile Picture" src={'/src/assets/idol.jpg'} />
        </ListItemAvatar>
        <ListItemText primary={"primary"} secondary={"無敵なアイドル様!".repeat(6)} />
      </ListItem>
    </div>
  )
}

export var bindingMsgRef = {
  callback: () => {}
}

export type MessagesProps = {
  userType: UserType,
  messages: Array<MessageElement>,
  roomUsers: Map<UserID, UserType>,
  AddMessage: (content: string) => Promise<void>,
  DeleteMessage: (index: number) => Promise<void>,
  handleEditMessage: (index: number, cur_msg: string) => void,
  handleToggleEditMessage: (index: number, mode?: 'set' | 'reset' | 'flip', commit?: boolean) => void,
}


export default function Messages(props: MessagesProps) {
  const { userType, messages, roomUsers, AddMessage, DeleteMessage, handleToggleEditMessage, handleEditMessage } = props
  const userState = useUserState();
  const textRef = React.useRef<HTMLInputElement>()
  const scrollRef = React.createRef<HTMLLIElement>()

  const handleAddMsg = async () => {
    if (textRef.current && textRef.current.value &&
      textRef.current.value.trim().length > 0) {
      AddMessage(textRef.current.value)
      textRef.current.value = ""
    }
  }

  const handleDeleteMsg = (index: number) => {
    DeleteMessage(index)
  }

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])
  
  let dt: DateTraverser = new DateTraverser()
  
  return (
    <React.Fragment>
      <CssBaseline />
      <List sx={{ mb: 2 }}>
        <HiddenItemForFormat />
        {
          messages && messages.map(({ msg, isInput, cache_input }, index) => {
            if (index === 0) {
              dt = new DateTraverser()
            }
            let date_state = dt.consume(new Date(msg.time))
            return (
              <React.Fragment key={index}>
                {date_state && (
                  <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                    {date_state}
                  </ListSubheader>
                )}
                <MessageItem 
                  msg_ele={{
                    msg: msg,
                    isInput: isInput,
                    cache_input: cache_input
                  }}
                  roomUsers={roomUsers}
                  curUserType={userType}
                  index={index}
                  handleEditMessage={handleEditMessage}
                  handleDeleteMsg={handleDeleteMsg}
                  handleToggleEditMessage={handleToggleEditMessage}
                />
              </React.Fragment>
            )
          })
        }
        {/* Last date info */
        dt.checkLast() && (
          <ListSubheader sx={{ bgcolor: 'background.paper' }}>
            {dt.state}
          </ListSubheader>
        )}
        <li id="scrollHelper" ref={scrollRef} ></li>
      </List>
      <AppBar 
        position='sticky'
        color="primary" sx={{ mb: 0 }}>
        <Toolbar 
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await handleAddMsg()
            }
          }}
        >
          <IconButton
            color="inherit"
            onClick={async () => {
              await handleAddMsg()
            }}
          >
            <SendIcon />
          </IconButton>
          <StyledInputBase
            inputRef={textRef}
            fullWidth
          />
          <Box sx={{ flexGrow: 1 }} />
            <IconButton
              color="inherit"
              onClick={async () => {
                
              }}
            > 
            {
              userState.state === 'signed_in' ?
              <UserAvatar user={userType} /> :
              <Avatar />
            }
            </IconButton>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}