import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps, AppStackParamList } from "app/navigators"
import { Screen, Text, TextField, Button } from "app/components"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type RegisterScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, "Register">

interface RegisterScreenProps extends AppStackScreenProps<"Register"> {}

export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const navigation = useNavigation<RegisterScreenNavigationProp>()

  const handleRegister = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password)
      const user = userCredential.user

      await user.sendEmailVerification()
      await auth().signOut()
      setVerificationSent(true)
      Alert.alert("Verification Email Sent", "Please check your email for the verification link.")
    } catch (error) {
      const firebaseError = error as FirebaseAuthTypes.NativeFirebaseAuthError
      console.error(firebaseError)
      Alert.alert("Registration Error", firebaseError.message)
    }
  }

  return (
    <Screen style={$root} preset="fixed">
      <Text text="Register" style={$header} />

      <TextField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={$textField}
      />
      <TextField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={$textField}
      />
      <Text size="xxs" style={$linkText} onPress={() => navigation.navigate("Login")}>
        New here? Make an account
      </Text>

      <Button text="Register" style={$button} textStyle={$buttonText} onPress={handleRegister} />
      {verificationSent && (
        <Text text="A verification email has been sent to your email address. Please verify your email before logging in." />
      )}
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
