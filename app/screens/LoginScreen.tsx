import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, TextStyle, ViewStyle } from "react-native"
import { AppStackScreenProps, AppStackParamList } from "app/navigators"
import { Screen, Text } from "app/components"
import { TextField, Button } from "../components"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import validateEmail from "app/utils/validateEmail"
import validatePassword from "app/utils/validatePassword"
import { colors } from "app/theme"
import { useStores } from "app/models"

type LoginScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, "Login">

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationError, setValidationError] = useState({ email: "", password: "" })
  const [submissionError, setSubmissionError] = useState("")
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const { authModel } = useStores()

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

  const handleSignUp = async () => {
    if (validateEmail(email) && validatePassword(password)) {
      try {
        const userInfo = await auth().signInWithEmailAndPassword(email, password)
        const user = userInfo.user
        console.log(user.uid + " login " + user.emailVerified)

        if (user.emailVerified) {
          authModel.setVerified(true)
          console.log("Email verified")
        } else {
          navigation.navigate("Validation")
        }

        console.log("User signed up")
      } catch (error) {
        const firebaseError = error as FirebaseAuthTypes.NativeFirebaseAuthError
        console.error("Error signing up:", firebaseError.message)
        setSubmissionError("Wrong email or password")
      }
    } else {
      Alert.alert("Invalid Input", "Please correct the errors before submitting.")
    }
  }

  return (
    <Screen style={$root} preset="fixed">
      <Text text="Login" style={$header} />
      <TextField
        placeholder="Email"
        value={email}
        onChangeText={emailHandler}
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
        containerStyle={$textField}
        secureTextEntry
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
