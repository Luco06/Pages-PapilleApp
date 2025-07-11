import { useMutation } from "@apollo/client";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";
import TextAuthPage from "../components/TextAuthPage";
import Title from "../components/Title";
import { SINGN_USER } from "../graphql/mutations/singn";
import { useTheme } from "../theme/themeContext";

const SigninScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    prenom: "",
    nom: "",
    email: "",
    mdp: "",
  });
  const [createUser,{}] = useMutation(SINGN_USER, {
    onCompleted(data){
      console.log(data, "UserInscription");
      router.push("/Login")
    },
  });
  const handleSingn = async () => {
    try {
      const normalizedUserInfo = {
        ...userInfo,
        email: userInfo.email.toLowerCase().trim()
      };
      await createUser({ variables: { input: normalizedUserInfo } });
    } catch (error) {
      console.error("Singn error", error);
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
      <TextAuthPage txt="Inscription" />
      <Input
        value={userInfo.prenom}
        onChangeText={(text) => setUserInfo({...userInfo, prenom: text})}
        label="Prénom"
      />
      <Input value={userInfo.nom} onChangeText={(text) => setUserInfo({...userInfo, nom: text})} label="Nom" />
      <Input
        value={userInfo.email}
        onChangeText={(text) => setUserInfo({...userInfo, email:text})}
        label="Email"
      />
      <Input
        value={userInfo.mdp}
        onChangeText={(text)=> setUserInfo({...userInfo, mdp: text})}
        label="Mot de passe"
        secureTextEntry={!showPassword}
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
      <Button onPress={handleSingn} txt="S'inscrire" />
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
