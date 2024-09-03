import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { ListItem, Screen } from "app/components"
import { colors } from "app/theme"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

type ServerOptionsNavigationProps = NativeStackNavigationProp<AppStackParamList, "ServerOptions">

interface ServerOptionsScreenProps extends AppStackScreenProps<"ServerOptions"> {}

export const ServerOptionsScreen: FC<ServerOptionsScreenProps> = observer(
  function ServerOptionsScreen() {
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    const navigation = useNavigation<ServerOptionsNavigationProps>()
    return (
      <Screen style={$root} preset="fixed" safeAreaEdges={["top"]}>
        <ListItem textStyle={{ color: "white" }}>Join Server</ListItem>
        <ListItem
          textStyle={{ color: "white" }}
          onPress={() => navigation.navigate("ServerCreation")}
        >
          Create Server
        </ListItem>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  padding: 20,
  backgroundColor: colors.palette.serverbg,
}
