import { types, SnapshotIn, SnapshotOut } from "mobx-state-tree"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { UserModel } from "./User"

export const AuthStore = types
  .model("AuthStore", {
    user: types.maybeNull(UserModel),
    verified: types.maybe(types.boolean),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setUser(user: FirebaseAuthTypes.User | null) {
      if (user) {
        self.setProp(
          "user",
          UserModel.create({
            uid: user.uid,
            emailVerified: user.emailVerified,
            // email: user.email,
          }),
        )
      } else {
        self.setProp("user", null)
      }
    },
    setVerified(verified: boolean) {
      self.verified = verified
    },
    startAuthListener() {
      const unsubscribe = auth().onAuthStateChanged((user) => {
        // console.log(" firebase Listener : " + user?.uid + " " + user?.emailVerified)
        self.setProp("user", { uid: user?.uid, emailVerified: user?.emailVerified })
        self.setProp("verified", user?.emailVerified || false)
      })
      return unsubscribe
    },
    async reloadUser() {
      const user = auth().currentUser

      if (user) {
        await user.reload()
        self.setProp("user", { uid: user?.uid, emailVerified: user?.emailVerified })
      }
    },
  }))


export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStore> {}
export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStore> {}

// *! note to self
/*
 * The Firebase onAuthStateChanged listener typically triggers when there are
 * significant changes to the user's authentication state, such as signing in,
 * signing out, or changing the user's profile, email verified is not one of them.
 */
