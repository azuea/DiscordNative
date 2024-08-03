import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { AuthStore } from "./Auth"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authModel: types.optional(AuthStore, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
