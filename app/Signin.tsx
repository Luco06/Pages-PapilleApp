import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";
import TextAuthPage from "../components/TextAuthPage";
import Title from "../components/Title";
import { useTheme } from "../theme/themeContext";

const SigninScreen = () => {
  const theme = useTheme();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [mdp, setMdp] = useState("");
  const [email, setEmail] = useState("");
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
      <TextAuthPage txt="Inscription" />
      <Input
        value={prenom}
        onChangeText={(text) => setPrenom(text)}
        label="Prénom"
      />
      <Input value={nom} onChangeText={(text) => setNom(text)} label="Nom" />
      <Input
        value={email}
        onChangeText={(text) => setEmail(text)}
        label="Email"
      />
      <Input
        value={mdp}
        onChangeText={(text) => setMdp(text)}
        label="Mot de passe"
      />
      <Button txt="S'inscrire" />
      <Pressable
        style={[
          styles.PressableTxt,
          {
            margin: theme.spacing.md,
            marginTop: theme.spacing.md,
          },
        ]}
        onPress={() => console.log("go to Inscription")}
      >
        <Link href={"/Login"}>
          <Text
            style={{ fontSize: theme.fontSize.small, color: theme.colors.text }}
          >
            Déja un compte ?
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

export default SigninScreen;
