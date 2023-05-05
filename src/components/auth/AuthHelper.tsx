import { User } from "firebase/auth"
import { DatabaseReference, get, ref as db_ref, update } from "firebase/database"
import { RoomID, MessageID, RoomType } from "../../types/ChatType"
import { useDatabase } from "../../db/firebase"
import { email2userTypeKey } from "../../db/dataLoader";

const db = useDatabase();

export const user_path = (user: User): string => {
  return `/user/${email2userTypeKey(user.email!)}`
}

export const user_ref = (user: User): DatabaseReference => {
  return db_ref(db, user_path(user))
}

export const user_path_use_email = (email: string): string => {
  return `/user/${email2userTypeKey(email)}`
}

export const user_ref_use_email = (email: string): DatabaseReference => {
  return db_ref(db, user_path_use_email(email))
}

const room_root_path = "/rooms"

export const room_root_ref =  db_ref(db, room_root_path)

export const room_path = (roomId: RoomID): string => {
  return `${room_root_path}/${roomId}`
}

export const room_ref = (roomId: RoomID): DatabaseReference => {
  return db_ref(db, room_path(roomId))
}

export const room_count_ref: DatabaseReference = db_ref(db, `/rooms/count`)

export const msg_path = (roomId: RoomID): string => {
  return `/msgs/${roomId}`
}

/**
 * Return messages root of current room
 * @param roomId room containing messages
 * @returns messages reference
 */
export const msg_ref = (roomId: RoomID): DatabaseReference => {
  return db_ref(db, msg_path(roomId))
}

const single_msg_path = (roomId: RoomID, msgId: MessageID): string => {
  return `/msgs/${roomId}/${msgId}`
}

export const single_msg_ref = (roomId: RoomID, msgId: MessageID): DatabaseReference => {
  return db_ref(db, single_msg_path(roomId, msgId))
}

export const getRoomCount = async () => {
  try {
    let { count } = (await get(room_count_ref)).val()
    let remote: RoomType = (await get(room_ref(count))).val()
    if (remote)
      update(room_count_ref, { count: ++count });
    return count
  } catch { // no room count yet!
    await update(room_count_ref, { count: 0 });
    await getRoomCount() // recursive check updated
  }
}