import { ListItemText, TextField } from "@mui/material";
import { ChangeEventHandler, KeyboardEventHandler } from "react";

type ValidEditProps = {
  open: boolean;
  value: string;
  handleKeyDown: KeyboardEventHandler<HTMLDivElement>
  handleChange: ChangeEventHandler<HTMLInputElement>;
  handleDoubleClick?: () => void;
  isInput: boolean;
  error: boolean;
  label?: string;
}

function ValidEditor(props: ValidEditProps) {
  return (
    <>
    {
      props.isInput ? (
        <TextField
          label={props.label ? props.label : "Room name"} variant='filled'
          value={props.value}
          onKeyDown={props.handleKeyDown}
          onChange={props.handleChange}
          error={props.error}
          autoFocus
        />
      ) : (
        <ListItemText
          onDoubleClick={props.handleDoubleClick}
          primary={props.value}
          sx={{ opacity: props.open ? 1 : 0 }}
        />
      )
    }
    </>
  );
}

type MessageEditProps = {
  content: string;
  handleKeyDown: KeyboardEventHandler<HTMLInputElement>
  handleChange: ChangeEventHandler<HTMLInputElement>;
  handleDoubleClick: () => void;
  disableEdit: () => void;
  isInput: boolean;
}

function MessageEditor(props: MessageEditProps) {
  return (
    <>
    {
      props.isInput ? (
          <TextField
            variant="filled"
            value={props.content}
            onKeyDown={props.handleKeyDown}
            onChange={props.handleChange}
            fullWidth sx={{ ml: 0, mt: 1, mr: 0 }}
            autoFocus
            onBlur={() => {props.disableEdit()}}
          />
      ) : (
        <ListItemText
          onDoubleClick={props.handleDoubleClick}
          primary={props.content}
        />
      )
    }
    </>
  );
}

export { ValidEditor, MessageEditor };