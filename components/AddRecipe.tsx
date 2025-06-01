import { useMutation } from "@apollo/client";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dialog, List, Portal } from "react-native-paper";
import { ADD_RECIPE } from "../graphql/mutations/addRecipe";
import { GET_USER } from "../graphql/queries/user";
import { useTheme } from "../theme/themeContext";
import { UserAtom } from "../utils/atoms";
import Button from "./Button";
import Input from "./Input";
import SwitchComponent from "./Switch";



export default function addRecipe() {
  const theme = useTheme();
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const user = useAtomValue(UserAtom);
  const [token, setToken] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isFavoris, setIsFavoris] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [addRecipe, setAddRecipe] = useState({
    titre: "",
    description: "",
    ingredients: [""],
    instructions: [""],
    nb_person: "",
    tps_cook: "",
    tps_prep: "",
    categorie: "",
    dificulty: "",
    img: "",
    est_public: false,
    note: "",
    auteur: user?.id,
    favoris: false,
  });
  const [visible, setVisible] = useState(false);
  const openDialog = () => setVisible(true);
  const closeDialog = () => setVisible(false);
  useEffect(() => {
    const tokenStore = SecureStore.getItem("token");
    setToken(tokenStore);
  }, []);

  const uploadToCloudinary = async (base64: string) => {
    const file = `data:image/jpeg;base64,${base64}`;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "avatars");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

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
        setAddRecipe((prev) => ({ ...prev, img: uploadedUrl }));
      }
    }
  };
  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...addRecipe.ingredients];
    newIngredients[index] = value;
    setAddRecipe({ ...addRecipe, ingredients: newIngredients });
  };
  const removeIngredient = (index: number) => {
    if (Array.isArray(addRecipe.ingredients)) {
      const newIngredients = addRecipe.ingredients.filter(
        (_, i) => i !== index
      );
      setAddRecipe({ ...addRecipe, ingredients: newIngredients });
    }
  };
  const addIngredient = () => {
    setAddRecipe({
      ...addRecipe,
      ingredients: [...addRecipe.ingredients, ""],
    });
  };

  const handleInstructionChange = (index: number, value: string) => {
    if (Array.isArray(addRecipe.instructions)) {
      const newInstructions: string[] = [...addRecipe.instructions];
      newInstructions[index] = value;
      setAddRecipe({ ...addRecipe, instructions: newInstructions });
    }
  };

  const addInstruction = () => {
    setAddRecipe({
      ...addRecipe,
      instructions: [...addRecipe.instructions, ""],
    });
  };

  const removeInstruction = (index: number) => {
    if (Array.isArray(addRecipe.instructions)) {
      const newInstructions = addRecipe.instructions.filter(
        (_, i) => i !== index
      );
      setAddRecipe({ ...addRecipe, instructions: newInstructions });
    }
  };

  const [CreateRecette] = useMutation(ADD_RECIPE, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    refetchQueries: [{ query: GET_USER, variables: { userId: user?.id } }],
    onCompleted: () => {
    setVisible(false)
      alert("Recette Ajouter !");
    },
  });
  const handleCreate = async () => {
    const filteredCreate = Object.fromEntries(
      Object.entries(addRecipe).filter(([_unused, value]) => value !== "")
    );
    if (Object.keys(filteredCreate).length === 0) {
      alert("Aucuns champs envoyer.");
      return;
    }
    try {
      await CreateRecette({
        variables: {
          input: filteredCreate,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la création ! :", error);
    }
  };
  return (
    <>
      <TouchableOpacity onPress={openDialog} style={styles.IconWrapper}>
        <AntDesign name="plus" size={30} color={theme.colors.primary} />
      </TouchableOpacity>
      <Portal>
        <Dialog
          style={{ backgroundColor: theme.colors.background }}
          visible={visible}
          onDismiss={closeDialog}
        >
          <ScrollView contentContainerStyle={styles.Container}>
            <Dialog.Content>
              {addRecipe.img && (
                <View
                  style={[
                    styles.ImageContainer,
                    { borderColor: theme.colors.primary },
                  ]}
                >
                  <Image source={addRecipe.img} style={styles.StyledImage} />
                </View>
              )}
              <Button txt="Ajouter une image" onPress={pickImage} />
              <Input
                label="Titre"
                value={addRecipe.titre}
                onChangeText={(text) =>
                  setAddRecipe({ ...addRecipe, titre: text })
                }
              />
              <Input
                label="Description"
                value={addRecipe.description}
                onChangeText={(text) =>
                  setAddRecipe({ ...addRecipe, description: text })
                }
              />
              <Text
                style={{
                  fontSize: theme.fontSize.medium,
                  color: theme.colors.primary,
                }}
              >
                Ingrédients
              </Text>
              {addRecipe.ingredients.map((ingredient, index) => (
                <Input
                  key={index}
                  value={ingredient}
                  onChangeText={(text) => handleIngredientChange(index, text)}
                  label={`Ingrédient: ${index + 1}`}
                  style={{ right: -35 }}
                  iconRight={
                    <Pressable onPress={() => removeIngredient(index)}>
                      <Feather
                        name="trash-2"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </Pressable>
                  }
                />
              ))}
              <Button txt="Aouter un ingrédient" onPress={addIngredient} />

              <Text
                style={{
                  fontSize: theme.fontSize.medium,
                  color: theme.colors.primary,
                }}
              >
                Instructions
              </Text>
              {addRecipe.instructions.map((instruction, index) => (
                <Input
                  key={index}
                  value={instruction}
                  onChangeText={(text) => handleInstructionChange(index, text)}
                  label={`Instruction: ${index + 1}`}
                  style={{ right: -35 }}
                  iconRight={
                    <Pressable onPress={() => removeInstruction(index)}>
                      <Feather
                        name="trash-2"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </Pressable>
                  }
                />
              ))}
              <Button txt="Aouter une Instruction" onPress={addInstruction} />

              <Input
                label="Nombre de personne"
                value={addRecipe.nb_person}
                onChangeText={(text) =>
                  setAddRecipe({ ...addRecipe, nb_person: text })
                }
              />
              <View style={styles.BoxInput}>
                <Input
                  label="Temps de péparation"
                  value={addRecipe.tps_prep}
                  onChangeText={(text) =>
                    setAddRecipe({ ...addRecipe, tps_prep: text })
                  }
                />
                <Input
                  label="Temps de cuisson"
                  value={addRecipe.tps_cook}
                  onChangeText={(text) =>
                    setAddRecipe({ ...addRecipe, tps_cook: text })
                  }
                />
              </View>
              <View style={{flexDirection: "row", alignSelf:"center", gap:5 }}>
        <List.Section style={styles.BoxList} title={addRecipe.dificulty}>
          <List.Accordion
            style={{ backgroundColor: theme.colors.primary, borderRadius: 20 }}
            title="Difficulté"
          >
            <List.Item
              onPress={() =>
                setAddRecipe({ ...addRecipe, dificulty: "Facile" })
              }
              title="Facile"
            />
            <List.Item
              onPress={() =>
                setAddRecipe({ ...addRecipe, dificulty: "Moyen" })
              }
              title="Moyen"
            />
            <List.Item
              onPress={() =>
                setAddRecipe({ ...addRecipe, dificulty: "Difficile" })
              }
              title="Difficile"
            />
          </List.Accordion>
        </List.Section>
        <List.Section style={styles.BoxList} title={addRecipe.categorie}>
          <List.Accordion
            style={{ backgroundColor: theme.colors.primary, borderRadius: 20, justifyContent:"center" }}
            title="Catégorie"
          >
            <List.Item
              onPress={() =>
                setAddRecipe({ ...addRecipe, categorie: "Viande" })
              }
              title="Viande"
            />
            <List.Item
              onPress={() =>
                setAddRecipe({ ...addRecipe, categorie: "Végétarien" })
              }
              title="Végétarien"
            />
            <List.Item
              onPress={() =>
                setAddRecipe({ ...addRecipe, categorie: "Poisson" })
              }
              title="Poisson"
            />
            <List.Item
              onPress={() =>
                setAddRecipe({ ...addRecipe, categorie: "Desserts" })
              }
              title="Dessert"
            />
            <List.Item
              onPress={() =>
                setAddRecipe({ ...addRecipe, categorie: "Sauce" })
              }
              title="Sauce"
            />
            <List.Item
              onPress={() =>
                setAddRecipe({ ...addRecipe, categorie: "Boisson" })
              }
              title="Boisson"
            />
          </List.Accordion>
        </List.Section>
      </View>
      <View style={{ gap: 60, flexDirection: "row",justifyContent:"center" }}>
        <SwitchComponent
          label="Publique"
          onChange={(check) => {
            setIsPublic(check);
            setAddRecipe({ ...addRecipe, est_public: check });
          }}
          value={addRecipe?.est_public}
        />
        <SwitchComponent
          label="Favoris"
          onChange={(check) => {
            setIsFavoris(check);
            setAddRecipe({ ...addRecipe, favoris: check });
          }}
          value={addRecipe?.favoris}
        />
      </View>
            </Dialog.Content>
            <Dialog.Actions style={{ alignSelf: "center" }}>
              <Button txt="Annuler" onPress={closeDialog} />
              <Button txt="Ajouter" onPress={handleCreate} />
            </Dialog.Actions>
          </ScrollView>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: "column",
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
  },
  IconWrapper: {
    position: "absolute",
    left: 0,
    padding: 8,
  },
  ImageContainer: {
    flexGrow: 1,
    width: 160,
    height: 130,
    overflow: "hidden",
    margin: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  StyledImage: {
    width: "100%",
    height: "100%",
  },
  BoxInput: {
    flexDirection: "row",
    alignContent:"center",
    width:"60%"
  },
  BoxList: {
    borderRadius: 20,
    width: "55%",
  },
});
