import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const UserModel = types
  .model("User")
  .props({
    uid: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setUser(user: FirebaseAuthTypes.User | null) {
      if (user) {
        self.setProp("uid", user.uid)
      } else {
        self.setProp("uid", "")
      }
    },
  }))

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
