/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  // DarkTheme,
  // DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
// import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { useStores } from "app/models"
import { HomeTab, HomeTabParamList } from "./HomeTab"

// import { FirebaseAuthTypes } from "@react-native-firebase/auth";

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Login: undefined
  Register: undefined
  Validation: undefined
  HomeTab: NavigatorScreenParams<HomeTabParamList>
  ServerOptions: undefined
  ServerCreation: undefined
  ServerJoin: undefined
  Channel: { serverID: string; channelID: string }
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}
// ! defining parameters passed, routeName: obj with each param, undefined for no params.

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// ! restrict the generic to one of the keys of appstackparamlist,
// ! basically a shortcut to define props types to the component.

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()
// ! attach the param list as generic when creating the navigator

const AppStack = observer(function AppStack() {
  const { authModel } = useStores()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.palette.basic,
        // statusBarColor: colors.palette.darkest,
      }}
    >
      {authModel.user?.uid ? (
        <>
          {authModel.user.emailVerified ? (
            <>
              <Stack.Screen name="HomeTab" component={HomeTab} />
              <Stack.Screen name="ServerOptions" component={Screens.ServerOptionsScreen} />
              <Stack.Screen name="ServerCreation" component={Screens.ServerCreationScreen} />
              <Stack.Screen name="ServerJoin" component={Screens.ServerJoinScreen} />
              <Stack.Screen name="Channel" component={Screens.ChannelScreen} />
            </>
          ) : (
            <Stack.Screen name="Validation" component={Screens.ValidationScreen} />
          )}

          {/* 🔥 Your authenticated screens go here */}
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Screens.LoginScreen} />
          <Stack.Screen name="Register" component={Screens.RegisterScreen} />

          {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
        </>
      )}
    </Stack.Navigator>
  )
})

export interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {
  // user: FirebaseAuthTypes.User | null; // main navigator props go here
}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  // const colorScheme = useColorScheme()
  // const { user, ...restProps } = props

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
