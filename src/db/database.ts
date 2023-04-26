import {
  DataSnapshot,
  DatabaseReference,
  get,
  onValue,
  ref,
  update,
} from "firebase/database";
import { useAuthState } from "../components/auth/Auth";
import { useDatabase, useAuth } from "./firebase";
import {
  MessagePackage,
  ProfileType,
  RoomID,
  RoomType,
  UserType,
} from "../types/ChatType";
import { User, updateCurrentUser } from "firebase/auth";

const db = useDatabase();
const auth = useAuth();
export const PublicRoomId = 0;
const PublicRoomRef = ref(db, `/rooms/${PublicRoomId}`);

export default class ChatDatabase {
  private user: User;
  private userType: UserType | null;
  /**
   * User reference, ref to /users/
   */
  private user_ref: DatabaseReference;
  private prof_ref: DatabaseReference;
  private profile: ProfileType | null;

  private pinnedRooms: Map<RoomID, [RoomType, DatabaseReference]>;

  constructor() {
    if (!useAuthState().state.user) {
      throw new Error("ChatDBInitializeException: User DNE!");
    }
    this.user = useAuthState().state.user!!;
    this.pinnedRooms = new Map();
    this.userType = this.profile = null;

    this.user_ref = ref(db, `/users/${this.user.uid}`);
    get(this.user_ref)
      .then((snapshot) => {
        const usr: UserType = snapshot.val();
        this.userType = {
          rooms: usr.rooms ?? [],
        };
        for (let roomId of this.userType.rooms) {
          this.bindRoomData(roomId, ref(db, `/rooms/${roomId}`));
        }
        this.setUserType = this.genSetMemberFn(this.userType, this!.user_ref);
        this.useUserType = this.getUseMemberFn(this.userType, this.setUserType);

        onValue(this.user_ref, (snapshot) => {
          this.setUserType!(snapshot.val(), false);
        });
      })
      .catch((reason) => {
        alert(`FirebaseGetException: ${reason}`);
      });

    this.prof_ref = ref(db, `/profiles/${this.user.uid}`);
    get(this.prof_ref)
      .then((snapshot) => {
        let prof: ProfileType = snapshot.val();
        this.profile = {
          avatar: prof.avatar ?? null,
          wallpaper: prof.wallpaper ?? null,
          motto: prof.motto ?? "",
        };
        this.setProfile = this.genSetMemberFn(this.profile, this!.prof_ref);
        this.useProfile = this.getUseMemberFn(this.profile, this.setProfile);

        onValue(this.prof_ref, (snapshot) => {
          this.setProfile!(snapshot.val(), false);
        });
      })
      .catch((reason) => {
        alert(`FirebaseGetException: ${reason}`);
      });

    // fetch public room
    this.bindRoomData(PublicRoomId, PublicRoomRef);
    this.userUser = this.getUseMemberFn(this.user, this.setUser);
  }

  private bindRoomData(roomId: number, ref: DatabaseReference) {
    get(ref)
      .then((snapshot) => {
        let room: RoomType = snapshot.val();
        room = {
          name: room.name ?? "Unnamed Room",
          members: room.members ?? [this.user.uid],
          messages: room.messages ?? { context: [], next: null },
        };
        this.pinnedRooms.set(roomId, [room, ref]);
        onValue(ref, sn => {
          this.setRoom(roomId)(sn.val(), false)
        })
      })
      .catch((reason) => {
        alert(`Failed to fetch chatroom (roomId: ${roomId}) since ${reason}`);
      });
  }

  private setUser(newUser: User) {
    if (Object.is(this.user, newUser)) {
      console.log("Try to update same database object, terminate update");
      return;
    }
    console.log(`Ready to update ${this.user} with ${newUser}`);
    Object.assign(this.user, newUser);
    updateCurrentUser(auth, this.user);
    console.log(`After update, this.user is ${this.user}`);
  }

  private genSetMemberFn<T extends Object>(member: T, ref: DatabaseReference) {
    return (newMember: T, upload = true) => {
      if (Object.is(member, newMember)) {
        console.log("Try to update same database object, terminate update");
        return;
      }
      console.log(`Ready to update ${member} with ${newMember}`);
      Object.assign(member, newMember);
      if (upload) update(ref, member);
      console.log(`After update, member is ${member}`);
    };
  }

  private getUseMemberFn<T extends Object>(
    member: T,
    setFn: (newMember: T) => void
  ) {
    return (): {
      getter: T;
      setter: (newMember: T) => void;
    } => {
      return { getter: member, setter: setFn };
    };
  }

  private setUserType?: (newMember: UserType, upload?: boolean) => void;
  public useUserType?: () => {
    getter: UserType;
    setter: (newMember: UserType) => void;
  };
  private setProfile?: (newMember: ProfileType, upload?: boolean) => void;
  public useProfile?: () => {
    getter: ProfileType;
    setter: (newMember: ProfileType) => void;
  };
  public userUser?: (newMember: User, upload?: boolean) => void;

  private genSetRoomFn(roomId: RoomID) {
    return (newRoom: RoomType, upload = true) => {
      let [room, ref] = this.pinnedRooms.get(roomId)!
      if (Object.is(room, newRoom)) {
        console.log("Try to update same database object, terminate update");
        return;
      }
      console.log(`Ready to update ${room} with ${newRoom}`);
      Object.assign(room, newRoom);
      if (upload) update(ref, room);
      console.log(`After update, room is ${room}`);
    };
  }

  private getUseRoomFn(
    roomId: RoomID,
    setFn: (newRoom: RoomType) => void
  ) {
    return (): {
      getter: RoomType;
      setter: (newRoom: RoomType) => void;
    } => {
      return { getter: this.pinnedRooms.get(roomId)![0], setter: setFn };
    };
  }

  private setRoom = (roomId: RoomID) => this.genSetRoomFn(roomId)

  public useRoom = (roomId: RoomID) =>
    this.getUseRoomFn(roomId, this.genSetRoomFn(roomId))()

  public unwrapMessage(snapshot: DataSnapshot): MessagePackage | null {
    return snapshot.val();
  }

  public loadNextMessagePackage(
    mp: MessagePackage
  ): [Promise<DataSnapshot>, (d: DataSnapshot) => MessagePackage | null] {
    return [get(mp.next), this.unwrapMessage];
  }

  public updateMessage(mp: MessagePackage, callback: () => void) {
    update(mp.self, mp).then(callback);
  }
}
