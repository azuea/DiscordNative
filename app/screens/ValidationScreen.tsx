import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Screen, Text, Button } from "app/components"

import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import auth from "@react-native-firebase/auth"

interface ValidationScreenProps extends AppStackScreenProps<"Validation"> {}

type ValidationScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, "Validation">

export const ValidationScreen: FC<ValidationScreenProps> = observer(function ValidationScreen() {
  const navigation = useNavigation<ValidationScreenNavigationProp>()
  
  const { authModel } = useStores()

  useEffect(() => {
    const interval = setInterval(() => {
      authModel.reloadUser()
    }, 5000) // Poll every 5 seconds
    console.log("interval run")

    return () => clearInterval(interval)
  }, [])



  useEffect(() => {
    if (authModel.user?.emailVerified === true) navigation.navigate("Welcome")
  }, [authModel.user])

  return (
    <Screen style={$root} preset="fixed">
      <Text text="Validation" style={$header} />
      <Text
        text="A verification email has been sent. Please check your email and verify your account to proceed."
        style={$infoText}
      />
      <Button
        text="Logout"
        style={$button}
        textStyle={$buttonText}
        onPress={() => auth().signOut()}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  padding: 16,
  backgroundColor: "#f5f5f5",
  justifyContent: "center",
  paddingHorizontal: 30,
}

const $header: TextStyle = {
  fontSize: 32,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 24,
  color: "#333",
  paddingVertical: 10,
}

const $infoText: TextStyle = {
  fontSize: 16,
  color: "#333",
  textAlign: "center",
  marginBottom: 20,
}

const $button: ViewStyle = {
  backgroundColor: "#1e90ff",
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
}

const $buttonText: TextStyle = {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
}
