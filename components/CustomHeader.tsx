import { Image } from "expo-image";
import { usePathname, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme/themeContext";
import { UserAtom } from "../utils/atoms";

export default function CustomHeader() {
  const theme = useTheme();
  const { logout } = useAuth();
  const user = useAtomValue(UserAtom);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion");
    }
    closeMenu();
  };
  const goTo = (path: string) => {
    if (pathname !== path) {
      closeMenu();
      router.push(path);
    } else {
      closeMenu();
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.primary }}>
      <View style={styles.HeaderContainer}>
        <Text
          style={{ fontSize: theme.fontSize.medium, color: theme.colors.text }}
        >
          {" "}
          Bonjour, {user?.prenom}
        </Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Image
                contentFit="fill"
                style={styles.AvatarWrapper}
                source={
                  user?.avatar
                    ? { uri: user.avatar }
                    : require("../assets/images/bobMartin.png")
                }
              />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => goTo("/Home")} title="Acceuil" />
          <Menu.Item onPress={() => goTo("/(tabs)/Profile")} title="Profile" />
          <Menu.Item onPress={() => goTo("/(tabs)/Setting")} title="Paramètre" />
          <Menu.Item onPress={handleLogout} title="Déconnexion" />
        </Menu>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  AvatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "transparent",
  },
});
