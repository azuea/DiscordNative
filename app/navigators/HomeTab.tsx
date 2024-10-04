import React from "react"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { HomeScreen, NotificationsScreen, UserProfileScreen } from "app/screens"
import { CompositeScreenProps } from "@react-navigation/native"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { colors, spacing, typography } from "../theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TextStyle, ViewStyle } from "react-native"
import { Icon } from "app/components"

export type HomeTabParamList = {
  Home: { newServerID?: string }
  Notifications: undefined
  User: undefined
}

export type HomeTabScreenProps<T extends keyof HomeTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<HomeTabParamList>()
export function HomeTab() {
  const { bottom } = useSafeAreaInsets()
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 50 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="home"
              color={focused ? colors.palette.neutral100 : colors.palette.discordGrey}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="notification"
              color={focused ? colors.palette.neutral100 : colors.palette.discordGrey}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="user"
              color={focused ? colors.palette.neutral100 : colors.palette.discordGrey}
              size={25}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.palette.basic,
  borderTopColor: colors.palette.borderTab,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.xxxs,
}

const $tabBarLabel: TextStyle = {
  fontSize: 10,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.palette.neutral100,
}
