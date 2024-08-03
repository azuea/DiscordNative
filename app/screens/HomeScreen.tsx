import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

// type HomeScreenNavigationProp = 

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="home" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}


// import { useRoute } from "@react-navigation/native";
// import { RouteProp } from "@react-navigation/native";
// import { MyAppStackParamList } from "./path/to/your/types"; // Adjust the import path accordingly

// type ProfileScreenRouteProp = RouteProp<MyAppStackParamList, "Profile">;

// const ProfileScreen: React.FC = () => {
//   const route = useRoute<ProfileScreenRouteProp>();
//   const userId = route.params; // Access userId directly as a string