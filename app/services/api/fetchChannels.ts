import firestore from "@react-native-firebase/firestore"
import { channelType } from "app/screens"

 

export function listenToChannels(
  serverID: string,
  setChannelData: React.Dispatch<React.SetStateAction<channelType[]>>,
  setLocalID: React.Dispatch<React.SetStateAction<string>>,
) {
  // console.log("listen to channels at server: ", serverID)
  const channelRef = firestore().collection("server").doc(serverID).collection("channels")
  console.log("Listener added for serverID:", serverID)

  const unsubscribe = channelRef.onSnapshot(
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const channelData = change.doc.data()

        if (change.type === "added") {
          const newChannel = {
            channelID: change.doc.id,
            channelName: channelData.channelName,
            creationDate: channelData.creationDate.toDate(),
            createdBy: channelData.createdBy,
          }
          console.log("\n serverID: ", serverID, "\n channels List: \n", newChannel)

          setChannelData((prevChannels) => [...prevChannels, newChannel])
        }
      })
    },
    (error) => {
      console.error("Error listening to channel changes: ", error)
    },
  )
  setLocalID("")

  return () => {
    console.log("Listener removed for serverID:", serverID)
    return unsubscribe()
  }
}
