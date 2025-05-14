import { useMutation } from "@apollo/client";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { UPDATE_USER } from "../../graphql/mutations/updateUser";
import { GET_USER } from "../../graphql/queries/user";
import { useTheme } from "../../theme/themeContext";
import { UserAtom } from "../../utils/atoms";

export default function Setting() {
  const theme = useTheme();
  const user = useAtomValue(UserAtom);
  const [token, setToken] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [userUpdate, setUserUpdate] = useState({
    pseudo: "",
    mdp: "",
    avatar: "",
  });

  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  useEffect(() => {
    SecureStore.getItemAsync("token").then(setToken);
  }, []);

  const [updateUser] = useMutation(UPDATE_USER, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    refetchQueries: [{ query: GET_USER, variables: { userId: user?.id } }],
    onCompleted() {
      Alert.alert("Profil mis à jour !");
    },
  });

  const handleUpdate = async () => {
    const filteredUpdate = Object.fromEntries(
      Object.entries(userUpdate).filter(([_, value]) => value !== "")
    );

    if (Object.keys(filteredUpdate).length === 0) {
      Alert.alert("Aucune modification envoyée.");
      return;
    }

    try {
      await updateUser({
        variables: {
          updateUserId: user?.id,
          input: filteredUpdate,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur lors de la mise à jour.");
    }
  };

  const uploadToCloudinary = async (base64: string) => {
    const file = `data:image/jpeg;base64,${base64}`;
  
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "avatars");
  
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error?.message || "Erreur Cloudinary");
      }
  
      return data.secure_url as string;
    } catch (err) {
      console.error("Erreur Cloudinary:", err);
      Alert.alert("Erreur lors de l'envoi de l'image.");
      return null;
    }
  };
  

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission refusée", "L’accès à la galerie est requis.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].base64) {
      const uploadedUrl = await uploadToCloudinary(result.assets[0].base64);
      if (uploadedUrl) {
        setImageUri(uploadedUrl);
        setUserUpdate((prev) => ({ ...prev, avatar: uploadedUrl }));
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.Container, { backgroundColor: theme.colors.background }]}
    >
      <Avatar
        src={
          imageUri
            ? { uri: imageUri }
            : user?.avatar
            ? { uri: user.avatar }
            : require("../../assets/images/bobMartin.png")
        }
        alt={user?.prenom || ""}
      />
      <Button txt="Ajouter une image" onPress={pickImage} />
      <View style={styles.BoxInfo}>
        <Text style={[styles.txtSetting, { color: theme.colors.text }]}>
          Prénom: {user?.prenom}
        </Text>
        <Text style={[styles.txtSetting, { color: theme.colors.text }]}>
          Nom: {user?.nom}
        </Text>
        <Text style={[styles.txtSetting, { color: theme.colors.text }]}>
          Email: {user?.email}
        </Text>
      </View>
      <View style={styles.BoxInput}>
        <Input
          label="Pseudo"
          onChangeText={(text) =>
            setUserUpdate({ ...userUpdate, pseudo: text })
          }
          value={userUpdate.pseudo}
        />
        <Input
          label="Mot de passe"
          secureTextEntry
          onChangeText={(text) => setUserUpdate({ ...userUpdate, mdp: text })}
          value={userUpdate.mdp}
        />
        <Button txt="Mettre à jour" onPress={handleUpdate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 20,
    marginTop: 30
  },
  BoxInfo: {
    alignItems: "flex-start",
  },
  BoxInput: {
    marginTop: 30,
    alignItems: "center",
  },
  txtSetting: {
    margin: 10,
  },
});
