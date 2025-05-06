import { useQuery } from "@apollo/client";
import { FlashList } from "@shopify/flash-list";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CardRecipe from "../components/CardRecipe";
import CardRecipeDetails from "../components/CardRecipeDetails";
import Comment from "../components/Comment";
import { GET_RECIPE } from "../graphql/queries/recipes";
import { useTheme } from "../theme/themeContext";
import { RecipeType, UserAtom } from "../utils/atoms";

export default function Home() {
  const theme = useTheme();
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [user] = useAtom(UserAtom);

  const { data, loading, error } = useQuery(GET_RECIPE);

  const formatDate = (timestamp: string): string => {
    const dateInMillis = parseInt(timestamp, 10); // Convertir en nombre
    if (isNaN(dateInMillis)) {
      return "Date invalide"; // Gérer le cas où la conversion échoue
    }

    const date = new Date(dateInMillis); // Créer un objet Date à partir du timestamp
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };
  useEffect(() => {
    if (loading) {
      console.log("Chargement...");
      return;
    }
    if (error) {
      console.error("Erreur:", error);
      return;
    }
    if (data?.recettes) {
      const publicRecipes = data.recettes.filter(
        (recipe: RecipeType) => recipe.est_public === true
      );
      setRecipes(publicRecipes);
    }
  }, [data, loading, error, setRecipes, user, selectedRecipe]);

  const handleRecipeClick = (recipe: RecipeType) => {
    setSelectedRecipe(recipe);
  };
  const closeModal = () => {
    setSelectedRecipe(null);
  };
  return (
    <SafeAreaView
      style={[styles.Container, { backgroundColor: theme.colors.background }]}
    >
      <FlashList
        data={recipes}
        estimatedItemSize={600}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.CenteredCardWrapper}>
            <CardRecipe
              onPress={() => handleRecipeClick(item)}
              titre={item.titre}
              auteur={item.auteur.prenom}
              bgImage={{ uri: item.img }}
              couvert={item.nb_person}
              cuission={item.tps_cook}
              tep_prep={item.tps_prep}
              dificulty={item.dificulty}
              categorie={item.categorie}
            />
          </View>
        )}
      />
      <Modal
        visible={!!selectedRecipe}
        animationType="slide"
        transparent={true}
      >
        <View
          style={[
            styles.ModalWrapper,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.CenteredCardWrapper}>
            <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
              <CardRecipeDetails
                titre={selectedRecipe?.titre || ""}
                auteur={selectedRecipe?.auteur.prenom || ""}
                bgImage={{ uri: selectedRecipe?.img || "" }}
                couvert={selectedRecipe?.nb_person || ""}
                cuission={selectedRecipe?.tps_cook || ""}
                tep_prep={selectedRecipe?.tps_prep || ""}
                dificulty={selectedRecipe?.dificulty || ""}
                categorie={selectedRecipe?.categorie || ""}
                ingredients={selectedRecipe?.ingredients || []}
                instructions={
                  Array.isArray(selectedRecipe?.instructions)
                    ? selectedRecipe.instructions
                    : []
                }
              />
              {selectedRecipe?.commentaire?.map((item, index) => (
                <Comment
                  key={index}
                  contenu={item.contenu}
                  avatar={item.auteur.avatar}
                  prenom={item.auteur.prenom}
                  date={formatDate(item.dateCreation)}
                />
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.CloseButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={closeModal}
            >
              <Text style={[styles.CloseText, { color: theme.colors.text }]}>
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  CenteredCardWrapper: {
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  CloseButton: {
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
  },
  CloseText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  ModalWrapper: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
