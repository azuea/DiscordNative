import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { colors } from "app/theme" // Make sure this includes Discord-like colors
import { ViewStyle, TextStyle, View, ImageStyle } from "react-native"
import { Icon, ListItem, ListView, Screen, TextField, Logout } from "app/components"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import useFireMessage from "app/services/api/useFireMessage"
import { useStores } from "app/models"
import { useRoute, RouteProp } from "@react-navigation/native"

type ChannelScreenRouteProp = RouteProp<AppStackParamList, "Channel">

interface ChannelScreenProps extends AppStackScreenProps<"Channel"> {}


export const ChannelScreen: FC<ChannelScreenProps> = observer(function ChannelScreen() {
  const [message, setMessage] = useState("")
  const { authModel } = useStores()
  const route = useRoute<ChannelScreenRouteProp>()
  const { channelID, serverID } = route.params
  // console.log(serverID, "server < > channelID", channelID)
  const { sendMessage, messages } = useFireMessage(serverID, channelID)

  const handleSend = () => {
    if (!message.trim() || !authModel.user?.uid) return
    sendMessage({ content: message, senderID: authModel.user?.uid })
    console.log("Message sent:", message)
    setMessage("")
  }

  return (
    <Screen preset="scroll" statusBarStyle="light" contentContainerStyle={$root}>
      {/* <Header Title="Chat Screen" /> */}
      <View style={$root}>
        <ListView
          estimatedItemSize={100}
          data={messages}
          renderItem={({ item }) => <ListItem textStyle={$messageText} text={item.content} />}
          keyExtractor={(item) => item.messageID}
        />

        <Logout />
        <View style={$innerStyle}>
          <TextField
            containerStyle={$fieldStyle}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={"#6F707D"}
            // RightAccessory={() => <Icon icon="check" style={{  borderWidth: 1, borderColor: colors.palette.primary100,  }} />}
            style={$textFieldContainer}
            inputWrapperStyle={$inputWrapper}
          />
          <Icon icon="send" color="#ffffff" containerStyle={$send} size={20} onPress={handleSend} />
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  padding: 10,
  backgroundColor: colors.palette.serverbg,
  // justifyContent: "space-between"
}

const $inputWrapper: ViewStyle = {
  backgroundColor: colors.palette.basic,
  borderWidth: 0,
  // marginRight: 20,
}

const $textFieldContainer: TextStyle = {
  fontSize: 16,
  marginBottom: 8,
  backgroundColor: colors.palette.basic,
  color: colors.palette.neutral100,
}

const $send: ImageStyle = {
  backgroundColor: colors.palette.button,
  borderRadius: 20,
  width: 40,
  height: 40,
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: 3,
}

const $fieldStyle: TextStyle = {
  width: "85%",
  fontSize: 16,
  // marginBottom: 8,
  backgroundColor: colors.palette.serverbg,
  marginRight: 15,

  // borderWidth: 2,
  // borderColor: colors.palette.secondary100,
}

const $innerStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: 10,
}

const $messageText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 16,
}
