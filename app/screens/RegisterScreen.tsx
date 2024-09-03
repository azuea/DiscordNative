import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps, AppStackParamList } from "app/navigators"
import { Screen, Text, TextField, Button } from "app/components"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { colors } from "app/theme"
import validateEmail from "app/utils/validateEmail"
import validatePassword from "app/utils/validatePassword"

type RegisterScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, "Register">

interface RegisterScreenProps extends AppStackScreenProps<"Register"> {}

export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationError, setValidationError] = useState({ email: "", password: "" })
  const [submissionError, setSubmissionError] = useState("")
  const navigation = useNavigation<RegisterScreenNavigationProp>()

  function emailHandler(email: string) {
    setEmail(email)
    if (validateEmail(email) === true || email === "") {
      setValidationError((prev) => ({ ...prev, email: "" }))
    } else {
      setValidationError((prev) => ({ ...prev, email: "Invalid email address" }))
    }
  }

  function passwordHandler(password: string) {
    setPassword(password)
    if (validatePassword(password) === true || password === "") {
      setValidationError((prev) => ({ ...prev, password: "" }))
    } else {
      setValidationError((prev) => ({ ...prev, password: "Invalid password" }))
    }
  }

  const handleRegister = async () => {
    if (validateEmail(email) && validatePassword(password)) {
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password)
        const user = userCredential.user

        console.log(user.uid + " register " + user.emailVerified)

        await user.sendEmailVerification()
        navigation.navigate("Validation")
      } catch (error) {
        const firebaseError = error as FirebaseAuthTypes.NativeFirebaseAuthError
        console.error("Error registering:", firebaseError.message)
        setSubmissionError("An account with that email already exists!")
      }
    } else {
      setValidationError({
        email: validateEmail(email) ? "" : "Invalid email address",
        password: validatePassword(password) ? "" : "Invalid password",
      })
    }
  }

  return (
    <Screen style={$root} preset="fixed">
      <Text text="Register" style={$header} />

      <TextField
        placeholder="Email"
        value={email}
        onChangeText={emailHandler}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={$textField}
      />
      {validationError.email ? (
        <Text size="xxs" style={$errorStyle}>
          {validationError.email}
        </Text>
      ) : null}

      <TextField
        placeholder="Password"
        value={password}
        onChangeText={passwordHandler}
        secureTextEntry
        containerStyle={$textField}
      />
      {validationError.password ? (
        <Text size="xxs" style={$errorStyle}>
          {validationError.password}
        </Text>
      ) : null}

      {submissionError ? (
        <Text size="xxs" style={$errorStyle}>
          {submissionError}
        </Text>
      ) : null}

      <Text size="xxs" style={$linkText} onPress={() => navigation.navigate("Login")}>
        Already have an account? Log in
      </Text>

      <Button text="Register" style={$button} textStyle={$buttonText} onPress={handleRegister} />
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

const $errorStyle: TextStyle = {
  color: colors.palette.angry500,
  padding: 0,
  marginBottom: 5,
}

const $textField: ViewStyle = {
  marginBottom: 9,
  backgroundColor: "#FFF",
  borderColor: "gray",
}

const $linkText: TextStyle = {
  fontSize: 14,
  color: "#1e90ff",
  textAlign: "center",
  marginBottom: 5,
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
