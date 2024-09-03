import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ActivityIndicator, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, TextField, Button } from "app/components"
import { colors, spacing } from "app/theme"
import { useStores } from "app/models"
import serverCreate from "app/services/api/serverCreate"
import { useNavigation } from "@react-navigation/native"
import { HomeTabParamList } from "app/navigators/HomeTab"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"

type ServerCreationScreenNavigationProps = BottomTabNavigationProp<HomeTabParamList, "Home">

interface ServerCreationScreenProps extends AppStackScreenProps<"ServerCreation"> {}

export const ServerCreationScreen: FC<ServerCreationScreenProps> = observer(
  function ServerCreationScreen() {
    const [serverName, setServerName] = useState("")
    const [buttonState, setButtonState] = useState(false)

    const { authModel } = useStores()
    const navigation = useNavigation<ServerCreationScreenNavigationProps>()

    return (
      <Screen style={$root} preset="fixed" safeAreaEdges={["top"]}>
        <TextField
          value={serverName}
          onChangeText={setServerName}
          containerStyle={$textField}
          autoCapitalize="none"
          placeholder="Enter Server Name"
        />
        {buttonState ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <Button
            text="Submit"
            preset="default"
            disabled={buttonState}
            style={[{ paddingVertical: 5 }, { borderRadius: 0 }]}
            onPress={async () => {
              let serverID = ""
              try {
                setButtonState(true)
                // console.log(authModel.user?.uid)
                if (typeof authModel.user?.uid === "string") {
                  serverID = await serverCreate(serverName, authModel.user?.uid)
                } else {
                  console.error("User ID is not available.")
                }
              } catch (error) {
                console.error("Failed to create server: ", error)
              } finally {
                navigation.navigate("Home", { newServerID: serverID })
              }
            }}
          />
        )}
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  padding: 20,
  backgroundColor: colors.palette.serverbg,
  justifyContent: "center",
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}
