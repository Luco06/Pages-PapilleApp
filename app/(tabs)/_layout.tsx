import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { useAtomValue } from "jotai";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "../../theme/themeContext";
import { UserAtom } from "../../utils/atoms";

export default function TabLayout() {
  const theme = useTheme();
  const user = useAtomValue(UserAtom);
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary, 
          tabBarInactiveTintColor: theme.colors.text, 
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.background
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            header: () => <CustomHeader />,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ size }) => (
              <Image
                source={{ uri: user?.avatar }}
                contentFit="contain"
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Setting"
          options={{
            title: "Paramètres",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
