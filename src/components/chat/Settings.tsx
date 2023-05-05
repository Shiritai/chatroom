import * as React from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import { UserID, UserType } from "../../types/ChatType";
import { UserAvatar } from "../shared/UserAvatar";
import { ValidEditor } from "./EditableList";
import { isValidEmail } from "../../util/function/TextChecker";

export interface MemberListProps {
  open: boolean;
  roomUsers: Map<UserID, UserType>;
  // selectedValue: string;
  onClose: () => void;
  handleAddAccount: (email: string) => void;
}

export function MemberList(props: MemberListProps) {
  // const { onClose, selectedValue, open } = props;
  const { open, roomUsers, onClose, handleAddAccount } = props;
  const [email, setEmail] = React.useState("");
  const [isInput, setIsInput] = React.useState(false);

  const handleClose = () => {
    // onClose(selectedValue);
    onClose();
  };

  const handleListItemClick = () => {
    // onClose(email);
  };

  const handleToggleAddAccount = (mode: 'commit' | 'reset' | 'open') => {
    switch (mode) {
    case 'commit':
      if (isValidEmail(email))
        handleAddAccount(email);
      setEmail("");
      setIsInput(false);
      break;
    case 'reset':
      setEmail("");
      setIsInput(false);
      break;
    case 'open':
      setEmail("");
      setIsInput(true);
      break;
    }
  };

  const handleEditEmail = (em: string) => {
    setEmail(em)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Room member setting</DialogTitle>
      <List sx={{ pt: 0 }}>
        {Array.from(roomUsers).map(([uid, userType]) => (
          <ListItem
            disableGutters
            key={uid}
          >
            <ListItemButton
              onClick={() => handleListItemClick()}
              key={userType.email}
            >
              <ListItemAvatar>
                <UserAvatar user={userType} />
              </ListItemAvatar>
              <ListItemText
                primary={userType.name}
                secondary={userType.email}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleToggleAddAccount('open')}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            {/* <ListItemText primary="Add account" /> */}
            <ValidEditor
              open={true}
              value={isInput ? email : "Add account"}
              handleKeyDown={e => {
                if (e.key === 'Enter') {
                  handleToggleAddAccount('commit')
                } else if (e.key === 'Escape') {
                  handleToggleAddAccount('reset')
                }
              }}
              handleChange={e => {
                handleEditEmail(e.target.value)
              }}
              isInput={isInput}
              error={!isValidEmail(email)}
              label={'Email of user to add...'}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}
