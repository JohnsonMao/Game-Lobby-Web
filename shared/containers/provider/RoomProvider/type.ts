import { Room } from "@/requests/rooms";

export const enum REDUCER_ACTION_TYPE {
  INITIALIZE_ROOM,
  ADD_PLAYER,
  REMOVE_PLAYER,
  UPDATE_HOST,
  UPDATE_ROOM_STATUS,
  TOGGLE_USER_READY_STATUS,
  CLEAN_UP_ROOM,
}

export type Initialize_ROOMAction = {
  type: REDUCER_ACTION_TYPE.INITIALIZE_ROOM;
  payload: Room.Infomation;
};

export type AddPlayerAction = {
  type: REDUCER_ACTION_TYPE.ADD_PLAYER;
  payload: Omit<Room.User, "isReady">;
};

export type RemovePlayerAction = {
  type: REDUCER_ACTION_TYPE.REMOVE_PLAYER;
  payload: Pick<Room.User, "id">;
};

export type UpdateHostAction = {
  type: REDUCER_ACTION_TYPE.UPDATE_HOST;
  payload: Pick<Room.User, "id">;
};

export type UpdateRoomStatus = {
  type: REDUCER_ACTION_TYPE.UPDATE_ROOM_STATUS;
  payload: Pick<Room.Infomation, "status">;
};

export type UpdateUserReadyStatus = {
  type: REDUCER_ACTION_TYPE.TOGGLE_USER_READY_STATUS;
  payload: Pick<Room.User, "id">;
};

export type CleanUpRoomAction = {
  type: REDUCER_ACTION_TYPE.CLEAN_UP_ROOM;
};

export type ReducerAction =
  | Initialize_ROOMAction
  | AddPlayerAction
  | RemovePlayerAction
  | UpdateHostAction
  | UpdateRoomStatus
  | UpdateUserReadyStatus
  | CleanUpRoomAction;
