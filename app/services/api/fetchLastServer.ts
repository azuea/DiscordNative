import firestore from "@react-native-firebase/firestore"

export async function fetchLastServer(userID: string) {
  // not used at the moment, will save last saved server ID to retain last selected server
  const userDataRef = firestore().collection("userData").doc(userID)

  return await userDataRef.get().then((querySnapshot) => {
    const data = querySnapshot.data()
    if (data !== undefined) {
      return data.lastAccessedServer
    } else {
      return ""
    }
  })
}

export async function setLastServer(userID: string, serverID: string) {
  const userDataRef = firestore().collection("userData").doc(userID)

  return await userDataRef.set({ lastAccessedServer: serverID })
}
