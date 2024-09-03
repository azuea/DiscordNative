import React, { FC, useEffect, useState, useRef } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, FlatList , useWindowDimensions } from "react-native"
import { AppStackParamList } from "app/navigators"
import { Screen, Text, ListView, ListItem } from "app/components"
import { CompositeNavigationProp, useNavigation , useRoute, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { colors, spacing } from "app/theme"
import { Drawer } from "react-native-drawer-layout"
import { type ContentStyle } from "@shopify/flash-list"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { HomeTabParamList } from "app/navigators/HomeTab"
import { listenToServers } from "app/services/api/serversFetch"
import { useStores } from "app/models"
import { listenToChannels } from "app/services/api/fetchChannels"

type HomeScreenRouteProp = RouteProp<HomeTabParamList, "Home">

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, "Home">,
  CompositeNavigationProp<
    NativeStackNavigationProp<AppStackParamList, "ServerOptions">,
    NativeStackNavigationProp<AppStackParamList, "Channel">
  >
>

export type channelType = {
  channelID: string
  channelName: string
  creationDate: Date
  createdBy: string
}

type server = {
  serverID: string
  serverName: string
}

export const HomeScreen: FC = observer(function HomeScreen() {
  const { authModel } = useStores()
  const route = useRoute<HomeScreenRouteProp>()
  const { newServerID = "" } = route.params || {}
  const userID = authModel.user?.uid
  const [channelData, setChannelData] = useState<channelType[]>([])
  const [open, setOpen] = useState(false)
  const [servers, setServers] = useState<server[]>([])
  const [localID, setLocalID] = useState<string>("")
  const [servertouse, setServertouse] = useState("")
  const newServerIDRef = useRef(newServerID)
  const { width } = useWindowDimensions()
  const $drawerInsets = useSafeAreaInsetsStyle(["top"])
  const navigation = useNavigation<HomeScreenNavigationProp>()

  if (!userID) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.palette.serverbg,
        }}
      >
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    )
  }

  useEffect(() => {
    // console.log("ref: ", newServerIDRef.current, " newserverID: ", newServerID)
    if (newServerIDRef.current === newServerID) {
      // * to deal with persistent newServerID from navigation without triggering 2 rerenders
      newServerIDRef.current = ""
      // console.log(newServerIDRef.current, "duplicates found, ref cleaned")
    } else if (newServerIDRef.current !== newServerID) {
      // * if a new server is added
      // console.log(newServerID, "New Server trigger, line 80")
      newServerIDRef.current = newServerID
      setLocalID(newServerID)
      // * the localID is a temp value so that a new server is chosen instead of a selected server
      // * AKA  priority to display a created server by user
      setServertouse(newServerID)

    }
  }, [newServerID])

  useEffect(() => {
    const fetchData = async () => {
      const currentServer = localID || servertouse
      // new server priority > localID
      // selected server > servertouse
      if (!currentServer) return
      // console.log("Current Server: ", currentServer)

      // console.log("UseEffect Trigger")
      setChannelData([])

      const unsubscribe = listenToChannels(currentServer, setChannelData, setLocalID)

      return () => {
        console.log("Cleaning up listener")
        return unsubscribe()
      }
    }

    fetchData()
  }, [servertouse])

  useEffect(() => {
    const unsubscribe = listenToServers(userID, setServers)
    return () => unsubscribe()
  }, [])

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="back"
      swipeEdgeWidth={width * 0.7}
      swipeMinDistance={10}
      renderDrawerContent={() => (
        <View style={[$drawerInsets, $drawer]}>
          {typeof servers === "undefined" || servers.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "white" }}>Add Some Servers to get started!</Text>
              
            </View>
          ) : (
            <>
              <ListView
                contentContainerStyle={$listContentContainer}
                estimatedItemSize={100}
                data={servers}
                keyExtractor={(item) => item.serverID}
                renderItem={({ item }) => (
                  <ListItem
                    textStyle={{ color: "white" }}
                    onPress={() => {
                      // setSelectedServer(item.serverID)
                      setServertouse(item.serverID)
                    }}
                  >
                    {item.serverName}
                  </ListItem>
                )}
              />
            </>
          )}

          <ListItem
            TextProps={{ weight: "bold" }}
            textStyle={{ color: "white" }}
            containerStyle={{ paddingLeft: 20 }}
            onPress={() => navigation.navigate("ServerOptions")}
            topSeparator
          >
            Add Server
          </ListItem>

          {/* <Logout /> */}
        </View>
      )}
    >
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        StatusBarProps={{ backgroundColor: colors.palette.serverbg }}
        contentContainerStyle={$containerStyle}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={$serverRenderContainer}>
            <FlatList
              data={channelData}
              renderItem={({ item }) => (
                <ListItem
                  onPress={() => {
                    navigation.navigate("Channel", {
                      serverID: servertouse,
                      channelID: item.channelID,
                    })
                  }}
                  textStyle={{ color: "white" }}
                >
                  {item.channelName}
                </ListItem>
              )}
              keyExtractor={(item) => item.channelID}
            />
          </View>
        </View>
      </Screen>
    </Drawer>
  )
})

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
}

const $containerStyle: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.serverbg,
  borderLeftColor: colors.palette.serverbg,
  borderLeftWidth: 5,
}

const $drawer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.darkest,
  marginTop: 20,
}

const $serverRenderContainer: ViewStyle = {
  flex: 1,
  padding: 20,
}
