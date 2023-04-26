import Avatar from "@mui/material/Avatar";
import { User } from "firebase/auth";
import { DatabaseReference } from "firebase/database";

export type UserID = string;
export type RoomID = number;

/**
 * For future usage :)
 */
export enum ContentType {
  NORMAL,
  DELETED,
  CODE,
  SPOILER,
}

export type MessageType = {
  /**
   * Primary key. also the message id
   */
  time: Date;
  uid: UserID;
  type: ContentType;
  msg: string;
};


/**
 * Fir Message.tsx
 * (inner data of RoomType)
 * at database: /rooms/{roomId}/
 */
export type MessagePackage = {
  roomId: RoomID;
  content: Array<MessageType | null>
  /**
   * point to url of itself
   */
  self: DatabaseReference
  /**
   * point to (next) url of same type
   */
  next: DatabaseReference
}

/**
 * For Room.tsx
 * at database: /rooms/
 */
export type RoomType = {
  /**
   * Name of chatroom
   * TODO: this is editable!
   */
  name: string;
  members: Array<UserID>;
  /**
   * 
   */
  messages: MessagePackage
};

/**
 * For Home.tsx, current user only
 * at database: /users/
 */
export type UserType = {
  rooms: Array<RoomID>;
};

/**
 * For current user profile
 * at database: /profiles/
 */
export type ProfileType = {
  avatar: DatabaseReference;
  wallpaper: DatabaseReference;
  motto: string;
}