import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { ContentType, MessageElement, UserID, UserType } from "../../types/ChatType";
import stringToColor from "../../util/function/StringToColor";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { MessageEditor } from "./EditableList";
import { StringAvatar } from "../shared/UserAvatar";
import { genDefaultUserType } from "../../db/dataLoader";

type MessageItemProps = {
  msg_ele: MessageElement;
  index: number;
  curUserType: UserType;
  roomUsers: Map<UserID, UserType>;
  handleEditMessage: (index: number, cur_msg: string) => void;
  handleToggleEditMessage: (index: number, mode: 'set' | 'reset' | 'flip', commit?: boolean) => void;
  handleDeleteMsg: (index: number) => void;
};

export const MessageItem = (props: MessageItemProps) => {
  const { msg_ele, index, roomUsers, curUserType, handleEditMessage, handleToggleEditMessage, handleDeleteMsg } = props;
  let ret: React.ReactNode
  let userType = roomUsers.get(msg_ele.msg.uid) ?? genDefaultUserType()
  switch (msg_ele.msg.type) {
  case ContentType.NORMAL:
    ret = (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <StringAvatar name={userType.name} />
        </ListItemAvatar>
        <Stack>
          {/* user name */}
          <Stack direction={'row'}>
            <ListItemText
              primary={userType.name}
              primaryTypographyProps={{
                style: {
                  color: stringToColor(userType.name),
                },
                fontWeight: "bold",
              }}
              secondary={`${userType.email} at ${(new Date(msg_ele.msg.time)).toLocaleString()}`}
            />
          </Stack>
          {/* <ListItemText primary={msg_ele.msg.msg} /> */}
          <MessageEditor
            content={msg_ele.isInput ? msg_ele.cache_input : msg_ele.msg.msg}
            handleKeyDown={(e) => {
              if (e.key === "Enter") {
                handleToggleEditMessage(index, 'reset')
              } else if (e.key === 'Escape') {
                handleToggleEditMessage(index, 'reset', false)
              }
            }}
            handleChange={(e) => {
              handleEditMessage(index, e.target.value)
            }}
            handleDoubleClick={async () => {
              handleToggleEditMessage(index, 'set');
            }}
            isInput={msg_ele.isInput}
            disableEdit={() => handleToggleEditMessage(index, 'reset')}
          />
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <ListItemIcon>
          {
            (curUserType.email === userType.email) &&
            <ListItemButton
              onClick={() => {
                handleDeleteMsg(index);
              }}
            >
              <DeleteForeverRoundedIcon />
            </ListItemButton>
          }
        </ListItemIcon>
      </ListItem>
    );
    break;
  case ContentType.DELETED:
    ret = (
      <ListItemText
        primary={`${curUserType.name} unsent this message`}
      />
    )
    break;
  default:
    ret = (<></>) // unimplemented
    break;
  }

  return ret
};
