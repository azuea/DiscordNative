import firestore from "@react-native-firebase/firestore"
import generateUUID from "./uuidGenerator"

export default async function serverCreate(name: string, ownerID: string) {
  const serverUUID = await generateUUID()

  const serverRef = firestore().collection("server")
  const userServersRef = firestore().collection("userServers")

  try {
    await serverRef.doc(serverUUID).set(
      {
        creationDate: firestore.Timestamp.fromDate(new Date()),
        ownerID,
        serverName: name,
        usersID: [ownerID],
        serverID: serverUUID,
      },
      { merge: true },
    )

    await userServersRef.doc(ownerID).set(
      {
        serverIDS: firestore.FieldValue.arrayUnion({ serverID: serverUUID, serverName: name }),
      },
      { merge: true },
    )

    const channelsRef = serverRef.doc(serverUUID).collection("channels")

    const channelUUID = await generateUUID()

    await channelsRef.doc(channelUUID).set(
      {
        channelName: "ch1 - server " + name,
        creationDate: firestore.Timestamp.fromDate(new Date()),
        createdBy: ownerID,
        channelID: channelUUID,
      },
      { merge: true },
    )

    await firestore().collection("userData").doc(ownerID).set({
      lastAccessedServer: serverUUID,
    })
  } catch (error) {
    console.log("error creating server : ", error)
  }

  return serverUUID
}
