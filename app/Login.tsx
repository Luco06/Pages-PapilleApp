import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";
import TextAuthPage from "../components/TextAuthPage";
import Title from "../components/Title";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme/themeContext";

const LoginScreen = () => {
  const theme = useTheme();
  const [mdp, setMdp] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();


  const handleLogin = async () => {
    try {
      await login(email.toLowerCase(), mdp);
    } catch (error: any) {
      console.error("Login error", error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <Title title="Pages & Papilles" />
      <TextAuthPage txt="Connexion" />
      <Input
        value={email}
        onChangeText={(text) => setEmail(text)}
        label="Email"
        autoComplete="email"
      />
      <Input
        secureTextEntry={!showPassword}
        value={mdp}
        onChangeText={(text) => setMdp(text)}
        label="Mot de passe"
        autoComplete="password"
        iconRight={
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <AntDesign
              name={showPassword ? "eye" : "eyeo"}
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>
        }
      />
      <Button txt="Se connecter" onPress={handleLogin} />
      <Pressable
        style={[
          styles.PressableTxt,
          {
            margin: theme.spacing.md,
            marginTop: theme.spacing.md,
          },
        ]}
      >
        <Link href={"/Signin"}>
          <Text
            style={{ fontSize: theme.fontSize.small, color: theme.colors.text }}
          >
            Pas encore inscrit ?
          </Text>
        </Link>
      </Pressable>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  PressableTxt: {
    alignSelf: "flex-end",
  },
});

export default LoginScreen;
