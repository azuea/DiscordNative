import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { withSetPropAction } from "./helpers/withSetPropAction";

export const UserModel = types
  .model("User", {
    uid: types.maybe(types.string),
    emailVerified: types.maybe(types.boolean),
    // email: types.maybe(types.string),
    // isAnonymous: types.maybe(types.boolean),
  })
  .actions(withSetPropAction)
  .actions(self => ({
  }));


export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
export const createUserDefaultModel = () => types.optional(UserModel, {});
