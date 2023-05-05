import { ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import { RoomElement } from "../../types/ChatType";
import { IconAvatar, IconAvatarProps, StringAvatar } from "../shared/UserAvatar";
import { ValidEditor } from "./EditableList";

type RoomItemProps = {
  room_ele: RoomElement;
  open: boolean;
  index: number;
  usingAvatar: {
    type: 'String' | 'Icon',
    payload?: IconAvatarProps
  };
  handleSelected: (index: number) => void;
  handleToggleInput: (index: number, mode?: "flip" | "set" | "reset", commit?: boolean) => void;
  handleEditRoomName: (index: number, name: string) => void;
};

export const RoomItem = (props: RoomItemProps) => {
  const {
    room_ele,
    open,
    index,
    usingAvatar,
    handleSelected,
    handleToggleInput,
    handleEditRoomName,
  } = props;


  return (
    <ListItem
      disablePadding sx={{ display: "block" }}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
        onClick={() => {
          handleSelected(index);
        }}
        selected={room_ele.selected}
        onDoubleClick={() => {
          handleToggleInput(index, "set");
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {
            usingAvatar.type === 'String' ?
              <StringAvatar {...{ name: room_ele.room.name, variant: "rounded" }} /> :
              <IconAvatar {...usingAvatar.payload!} />
          }
        </ListItemIcon>
        <ValidEditor
          open={open}
          error={(room_ele.isInput ? room_ele.cache_input.length : room_ele.room.name.length) == 0}
          value={room_ele.isInput ? room_ele.cache_input : room_ele.room.name}
          handleKeyDown={(e) => {
            if (e.key === "Enter") {
              handleToggleInput(index, "reset");
            } else if (e.key === 'Escape') {
              handleToggleInput(index, "reset", false);
            }
          }}
          handleChange={(e) => {
            handleEditRoomName(index, e.target.value);
          }}
          handleDoubleClick={async () => {
            handleToggleInput(index, "set");
          }}
          isInput={room_ele.isInput}
        />
      </ListItemButton>
    </ListItem>
  );
};
