import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, TextStyle, ViewStyle } from "react-native"
import { AppStackScreenProps, AppStackParamList } from "app/navigators"
import { Screen, Text } from "app/components"
import { TextField, Button } from "../components"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"

import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type LoginScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, "Login">

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigation = useNavigation<LoginScreenNavigationProp>()

  function emailHandler(email: string) {
    setEmail(email)
  }

  function passwordHandler(password: string) {
    setPassword(password)
  }

  const handleSignUp = async () => {
    try {
      const userInfo = await auth().signInWithEmailAndPassword(email, password)
      const user = userInfo.user

      if (user.emailVerified) {
        console.log("Email verified")
        Alert.alert("Login Success", "Welcome to the app!")
      } else {
        Alert.alert("Email Not Verified", "Please verify your email before logging in.")
        auth().signOut()
      }

      console.log("User signed up")
    } catch (error) {
      const firebaseError = error as FirebaseAuthTypes.NativeFirebaseAuthError
      console.error("Error signing up:", firebaseError.message)
    }
  }

  return (
    <Screen style={$root} preset="fixed">
      <Text text="Login" style={$header} />
      <TextField
        placeholder="Email"
        value={email}
        onChangeText={(value) => emailHandler(value)}
        containerStyle={$textField}
      />
      <TextField
        placeholder="Password"
        value={password}
        onChangeText={(value) => passwordHandler(value)}
        containerStyle={$textField}
        secureTextEntry
      />
      <Text style={$linkText} onPress={() => navigation.navigate("Register")}>
        New here? Make an account
      </Text>
      <Button text="Submit" style={$button} textStyle={$buttonText} onPress={handleSignUp} />
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

const $textField: ViewStyle = {
  marginBottom: 16,
  backgroundColor: "#FFF",
  borderColor: "gray",
}

const $linkText: TextStyle = {
  fontSize: 14,
  color: "#1e90ff",
  textAlign: "center",
  marginTop: 16,
}

const $button: ViewStyle = {
  backgroundColor: "#1e90ff",
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
  // marginTop: 24,
}

const $buttonText: TextStyle = {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
}
