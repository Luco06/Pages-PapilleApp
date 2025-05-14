import { useMutation } from "@apollo/client";
import Feather from '@expo/vector-icons/Feather';
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { List } from "react-native-paper";
import { UPDATE_RECIPE } from "../graphql/mutations/updateRecipe";
import { GET_USER } from "../graphql/queries/user";
import { useTheme } from "../theme/themeContext";
import { RecipeType, UserAtom } from "../utils/atoms";
import Button from "./Button";
import Input from "./Input";
import SwitchComponent from "./Switch";

interface UpdateRecipeProps {
  recipe: RecipeType | null;
  setIsModalOpen: (value: boolean) => void;
}

export default function UpdateRecipe({ recipe, setIsModalOpen }: UpdateRecipeProps) {
  const theme = useTheme();
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  useEffect(() => {
    const tokenStore = SecureStore.getItem("token");
    setToken(tokenStore)
  }, []);

  const user = useAtomValue(UserAtom);
  const [isPublic, setIsPublic] = useState(recipe?.est_public ?? false);
  const [isFavoris, setIsFavoris] = useState(recipe?.favoris ?? false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [recipeUpdate, setRecipeUpdate] = useState({
    titre: recipe?.titre || "",
    description: recipe?.description || "",
    ingredients: Array.isArray(recipe?.ingredients) ? recipe.ingredients : [""],
    instructions: Array.isArray(recipe?.instructions)
      ? recipe.instructions
      : [""],
    nb_person: recipe?.nb_person || "",
    tps_cook: recipe?.tps_cook || "",
    tps_prep: recipe?.tps_prep || "",
    categorie: recipe?.categorie || "",
    dificulty: recipe?.dificulty || "",
    img: recipe?.img || "",
    est_public: recipe?.est_public ?? false,
    note: recipe?.note || "",
    favoris: recipe?.favoris ?? false,
  });
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
        setRecipeUpdate((prev) => ({ ...prev, img: uploadedUrl }));
      }
    }
  };
  const [updateRecipe] = useMutation(UPDATE_RECIPE, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    refetchQueries: [{ query: GET_USER, variables: { userId: user?.id } }],
    onCompleted: () => {
      setIsModalOpen(false);
      alert("Recette mise à jour !");
    },
  });


  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...recipeUpdate.ingredients];
    newIngredients[index] = value;
    setRecipeUpdate({ ...recipeUpdate, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipeUpdate({
      ...recipeUpdate,
      ingredients: [...recipeUpdate.ingredients, ""],
    });
  };

  const removeIngredient = (index: number) => {
    if (Array.isArray(recipeUpdate.ingredients)) {
      const newIngredients = recipeUpdate.ingredients.filter(
        (_, i) => i !== index
      );
      setRecipeUpdate({ ...recipeUpdate, ingredients: newIngredients });
    }
  };

  const handleInstructionChange = (index: number, value: string) => {
    if (Array.isArray(recipeUpdate.instructions)) {
      const newInstructions: string[] = [...recipeUpdate.instructions];
      newInstructions[index] = value;
      setRecipeUpdate({ ...recipeUpdate, instructions: newInstructions });
    }
  };

  const addInstruction = () => {
    setRecipeUpdate({
      ...recipeUpdate,
      instructions: [...recipeUpdate.instructions, ""],
    });
  };

  const removeInstruction = (index: number) => {
    if (Array.isArray(recipeUpdate.instructions)) {
      const newInstructions = recipeUpdate.instructions.filter(
        (_, i) => i !== index
      );
      setRecipeUpdate({ ...recipeUpdate, instructions: newInstructions });
    }
  };
  return (
    <View style={styles.Container}>
      <View
        style={[styles.ImageContainer, { borderColor: theme.colors.primary }]}
      >
        <Image
          contentFit="cover"
          style={styles.StyledImage}
          source={recipeUpdate.img}
        />
      </View>
      <Button txt="Ajouter une image" onPress={pickImage} />
      <Input
        label="Titre"
        value={recipeUpdate.titre}
        onChangeText={(text) =>
          setRecipeUpdate({ ...recipeUpdate, titre: text })
        }
      />
      <Input
        label="Description"
        value={recipeUpdate.description}
        onChangeText={(text) =>
          setRecipeUpdate({ ...recipeUpdate, description: text })
        }
      />
      <Text
        style={{ fontSize: theme.fontSize.medium, color: theme.colors.text }}
      >
        Ingrédients
      </Text>

      {recipeUpdate?.ingredients.map((ingredient, index) => (
        <Input
          key={index}
          value={ingredient}
          style={{right:-35}}
          iconRight={
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name="trash-2"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          }
          onChangeText={(text) =>
            setRecipeUpdate((prev) => ({
              ...prev,
              ingredients: prev.ingredients.map((ing, i) =>
                i === index ? text : ing
              ),
            }))
          }
        />
      ))}
      <Text
        style={{ fontSize: theme.fontSize.medium, color: theme.colors.text }}
      >
        Instrusctions
      </Text>

      {recipeUpdate?.instructions.map((instruction, index) => (
        <Input
          key={index}
          value={instruction}
          style={{right:-35}}
          iconRight={
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name="trash-2"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          }
          onChangeText={(text) =>
            setRecipeUpdate((prev) => ({
              ...prev,
              instructions: prev.instructions.map((ing, i) =>
                i === index ? text : ing
              ),
            }))
          }
        />
      ))}

      <Input
        label="Nombre de Personnes"
        value={recipeUpdate.nb_person}
        onChangeText={(text) =>
          setRecipeUpdate({ ...recipeUpdate, nb_person: text })
        }
      />

      <View style={styles.BoxInput}>
        <Input
          label="Temps de péparation"
          value={recipeUpdate.tps_prep}
          onChangeText={(text) =>
            setRecipeUpdate({ ...recipeUpdate, tps_prep: text })
          }
        />
        <Input
          label="Temps de cuisson"
          value={recipeUpdate.tps_cook}
          onChangeText={(text) =>
            setRecipeUpdate({ ...recipeUpdate, tps_cook: text })
          }
        />
      </View>
      <View style={{ gap: 30, flexDirection: "row" }}>
        <List.Section style={styles.BoxList} title="">
          <List.Accordion
            style={{ backgroundColor: theme.colors.primary, borderRadius: 20 }}
            title="Difficulté"
          >
            <List.Item
              onPress={() =>
                setRecipeUpdate({ ...recipeUpdate, dificulty: "Facile" })
              }
              title="Facile"
            />
            <List.Item
              onPress={() =>
                setRecipeUpdate({ ...recipeUpdate, dificulty: "Moyen" })
              }
              title="Moyen"
            />
            <List.Item
              onPress={() =>
                setRecipeUpdate({ ...recipeUpdate, dificulty: "Difficile" })
              }
              title="Difficile"
            />
          </List.Accordion>
        </List.Section>
        <List.Section style={styles.BoxList} title="">
          <List.Accordion
            style={{ backgroundColor: theme.colors.primary, borderRadius: 20 }}
            title="Catégorie"
          >
            <List.Item
              onPress={() =>
                setRecipeUpdate({ ...recipeUpdate, categorie: "Viande" })
              }
              title="Viande"
            />
            <List.Item
              onPress={() =>
                setRecipeUpdate({ ...recipeUpdate, categorie: "Végétarien" })
              }
              title="Végétarien"
            />
            <List.Item
              onPress={() =>
                setRecipeUpdate({ ...recipeUpdate, categorie: "Poisson" })
              }
              title="Poisson"
            />
            <List.Item
              onPress={() =>
                setRecipeUpdate({ ...recipeUpdate, categorie: "Dessert" })
              }
              title="Dessert"
            />
            <List.Item
              onPress={() =>
                setRecipeUpdate({ ...recipeUpdate, categorie: "Sauce" })
              }
              title="Sauce"
            />
            <List.Item
              onPress={() =>
                setRecipeUpdate({ ...recipeUpdate, categorie: "Boisson" })
              }
              title="Boisson"
            />
          </List.Accordion>
        </List.Section>
      </View>
      <View style={{ gap: 60, flexDirection: "row" }}>
        <SwitchComponent
          label="Publique"
          onChange={(check) => {
            setIsPublic(check);
            setRecipeUpdate({ ...recipeUpdate, est_public: check });
          }}
          value={recipeUpdate?.est_public}
        />
        <SwitchComponent
          label="Favoris"
          onChange={(check) => {
            setIsFavoris(check);
            setRecipeUpdate({ ...recipeUpdate, favoris: check });
          }}
          value={recipeUpdate?.favoris}
        />
      </View>
      <View style={styles.BoxBtn}>
        <Button txt="Mettre à jour" onPress={()=> updateRecipe({
            variables: { input: recipeUpdate, updateRecetteId: recipe?.id}
        })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: "column",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  Header: {
    borderWidth: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: "100%",
  },
  HeaderText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  ImageContainer: {
    flexGrow: 1,
    width: "70%",
    height: 200,
    overflow: "hidden",
    margin: 10,
    borderRadius: 10,
  },
  StyledImage: {
    width: "100%",
    height: "100%",
  },
  Footer: {
    width: "100%",
    borderWidth: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 2,
  },
  FooterText: {
    margin: 4,
    width: "45%",
  },
  BoxInput: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  BoxBtn: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  BoxList: {
    borderRadius: 20,
    width: "40%",
  },
});
