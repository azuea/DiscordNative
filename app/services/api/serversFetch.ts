import firestore from "@react-native-firebase/firestore"


type server = {
  serverID: string
  serverName: string
}

export function listenToServers(
  userID: string,
  setServers: React.Dispatch<React.SetStateAction<server[]>>,
) {
  const serverRef = firestore().collection("userServers").doc(userID)
  const unsubscribe = serverRef.onSnapshot(
    (documentSnapshot) => {
      if (documentSnapshot.exists) {
        const serverIDS = documentSnapshot.get("serverIDS") as server[] | null;
        
        if (serverIDS) {
          setServers(serverIDS);
        } else {
          console.log("listener returned null/no servers")
          setServers([]);
        }
      } else {
        serverRef.set({ serverIDS: firestore.FieldValue.arrayUnion() })
        //   console.warn("Real-time update: Document does not exist.")
      }
    },
    (error) => {
      console.error("Error with server list updates:", error)
    },
  )

  return unsubscribe
}
