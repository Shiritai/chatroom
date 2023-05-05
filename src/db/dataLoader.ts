/**
 * dataloader.ts
 * Contains default data, data loaders and data mappers
 * Author: Shiritai
 */

import { DatabaseReference, Unsubscribe } from "firebase/database";
import { MessageType, ProfileType, RoomType, RoomElement, UserType } from "../types/ChatType";

/**
 * Map email into key of userType (uid)
 * @param email email of some user
 * @returns key of userType (as uid) of that user
 */
export const email2userTypeKey = (email: string): string => {
  return email.replaceAll('@', '_').replaceAll('.', '=')
}

/**
 * Map reversely from key of userType (uid) to email
 * @param userTypeKey key of userType (uid)
 * @returns email of that user
 */
export const userTypeKey2email = (userTypeKey: string): string => {
  return userTypeKey.replaceAll('=', '.').replaceAll('_', '@')
}

export const genDefaultProf: () => ProfileType = () => {
  return {
    motto: "",
  }
};


export const genDefaultUserType: () => UserType = () => {
  return {
    name: 'Anonymous User',
    email: 'unknown@unknownmail.com',
    rooms: new Array(),
    profile: genDefaultProf(),
  }
};

export const genDefaultRoomType: () => RoomType = () => {
  return {
    name: "Unnamed Room",
    members: new Array(),
    messages: new Array(),
  }
};

export function bindRoom2RoomElement(room: RoomType, ref: DatabaseReference, unSub?: Unsubscribe): RoomElement {
  return {
    room: room,
    selected: false,
    isInput: false,
    cache_input: "",
    ref: ref,
    unSub: unSub
  }
}

export function bindMsg2MsgElement(msg: MessageType) {
  return {
    msg: msg,
    isInput: false,
    cache_input: "",
  }
}