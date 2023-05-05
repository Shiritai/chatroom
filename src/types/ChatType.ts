import { DatabaseReference, Unsubscribe } from "firebase/database";

// export type Email = string
export type UserID = string;
export type UserName = string;
export type RoomID = string;
export type MessageID = number;
/**
 * Url of firestore source
 */
export type SrcUrl = string;

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
   * Primary key, index of Messages
   */
  time: string;
  uid: string;
  // uid: UserID;
  type: ContentType;
  msg: string;
};

/**
 * TODO: can implement message management
 * with MessagePackage in the future
 * for better performance
 * 
 * Fir Message.tsx
 * (inner data of RoomType)
 * at database: /rooms/{roomId}/
 */
export type MessagePackage = {
  roomId: RoomID;
  content: Array<MessageType | null>;
  /**
   * point to url of itself
   */
  self?: DatabaseReference;
  /**
   * point to (next) url of same type
   */
  next?: DatabaseReference;
};

/**
 * For Room.tsx
 * at database: /rooms/
 */
export type RoomType = {
  /**
   * Name of chatroom
   */
  name: string;
  members: Array<UserID>;
  /**
   * Can be implemented in the future :)
   */
  // messages?: MessagePackage;
  messages: Array<MessageType>
  icon?: SrcUrl;
};

/**
 * For Home.tsx, current user only
 * at database: /users/
 */
export type UserType = {
  name: string;
  email: string;
  rooms: Array<RoomID>;
  profile: ProfileType;
};

// export type UserElement = {
//   userType: UserType;
// };

/**
 * For current user profile
 * at database: /profiles/
 */
export type ProfileType = {
  avatar?: SrcUrl;
  wallpaper?: SrcUrl;
  motto?: string;
};

/**
 * Chat room element in frontend
 */
export type RoomElement = {
  room: RoomType;
  /**
   * Whether we're in some room
   */
  selected: boolean;
  /**
   * Whether we're inputting
   */
  isInput: boolean;
  /**
   * Cache inputting name
   */
  cache_input: string;
  ref: DatabaseReference;
  unSub?: Unsubscribe;
};

/**
 * Chat room element in frontend
 */
export type MessageElement = {
  msg: MessageType;
  /**
   * Whether we're inputting
   */
  isInput: boolean;
  /**
   * Cache old message content
   */
  cache_input: string;
};
