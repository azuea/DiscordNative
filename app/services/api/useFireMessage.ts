import { useEffect, useState } from "react"
import firestore from "@react-native-firebase/firestore"
import generateUUID from "./uuidGenerator"

interface Message {
  messageID: string
  senderID: string
  content: string
  timestamp: Date
}

type SendMessageParameter = {
  senderID: string
  content: string
}

const useFireMessage = (serverID: string, channelID: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const channelRef = firestore()
    .collection("server")
    .doc(serverID)
    .collection("channels")
    .doc(channelID)
    .collection("messages")

  useEffect(() => {
    // Set up listener for real-time updates
    // setMessages([])
    const unsubscribe = channelRef.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const messageData = change.doc.data()
            const message = {
              messageID: change.doc.id,
              senderID: messageData.senderID,
              content: messageData.content,
              timestamp: messageData.timestamp.toDate(),
            }
            setMessages((prev) => [...prev, message])
          }
        })
      },
      (error) => {
        console.error("error listening to message changes: ", error)
      },
    )

    // Clean up listener on unmount
    return () => {
      console.log("messages cleaner run")
      return unsubscribe()
    }
  }, [channelID])

  const sendMessage = async (message: SendMessageParameter) => {
    try {
      const messageUUID = await generateUUID()
      await channelRef.doc(messageUUID).set({
        messageID: messageUUID,
        senderID: message.senderID,
        content: message.content,
        timestamp: firestore.Timestamp.fromDate(new Date()),
      })
    } catch (error) {
      console.error("Error sending message: ", error)
    }
  }

  return {
    sendMessage,
    messages,
  }
}

export default useFireMessage
