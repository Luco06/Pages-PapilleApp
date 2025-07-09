import { useMutation, useQuery } from "@apollo/client";
import Feather from '@expo/vector-icons/Feather';
import { FlashList } from "@shopify/flash-list";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import * as SecureStore from "expo-secure-store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Button from "../../components/Button";
import CardRecipe from "../../components/CardRecipe";
import CardRecipeDetails from "../../components/CardRecipeDetails";
import Comment from "../../components/Comment";
import Input from "../../components/Input";
import { ADD_COMMENT } from "../../graphql/mutations/AddComment";
import { ADD_FAV } from "../../graphql/mutations/AddFav";
import { DELETE_COMMENT } from "../../graphql/mutations/DeleteComment";
import { DELETE_FAV } from "../../graphql/mutations/DeleteFav";
import { GET_RECIPE } from "../../graphql/queries/recipes";
import { GET_USER } from "../../graphql/queries/user";
import { useTheme } from "../../theme/themeContext";
import { RecipeType, UserAtom } from "../../utils/atoms";

export default function Home() {
  const theme = useTheme();
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [user, setUser] = useAtom(UserAtom); // Utiliser setUser pour pouvoir mettre à jour les favoris
  const [token, setToken] = useState<string | null>(null);
  const [commentaire, setCommentaire] = useState("");

  const { data, loading, error } = useQuery(GET_RECIPE);

  const formatDate = (timestamp: string): string => {
    const dateInMillis = parseInt(timestamp, 10);
    if (isNaN(dateInMillis)) {
      return "Date invalide";
    }

    const date = new Date(dateInMillis);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };
  const { data: userData } = useQuery(GET_USER, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });
  
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

  useEffect(() => {
    const fetchToken = async () => {
      const tokenStore = await SecureStore.getItemAsync("token");
      setToken(tokenStore);
    };
    fetchToken();
  }, []);
  
  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user); // met à jour les favoris depuis la source fraîche
    }
  }, [userData, setUser]);
  
  const handleRecipeClick = (recipe: RecipeType) => {
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };


const [AddFavoris] = useMutation(ADD_FAV,{
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  },
  refetchQueries: [
    { query: GET_USER, variables: { userId: user?.id } }
  ]
})
const [RemoveFavoris]= useMutation(DELETE_FAV, {
  context: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  },
  refetchQueries: [
    { query: GET_USER, variables: { userId: user?.id } }
  ]
})
  // Fonction pour gérer l'ajout/suppression des favoris
  const handleFavoriteToggle = async (recipeId: string, isFavorite: boolean) => {
    if (!user) return;

    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    try {
      if (isFavorite) {
        const {data}= await AddFavoris({
          variables: {
            userId: user?.id,
            recetteId :recipeId,
          }
        });

        console.log("Ajouté aux favoris :", recipeId)
      } else {
        const {data}= await RemoveFavoris({
          variables: {
            userId: user?.id,
            recetteId: recipeId
          }
        });
        console.log("Retiré des favoris :", recipeId);

        }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);
    alert("Erreur lors de la mise à jour des favoris");
    }

  };

  const [DeleteComment] = useMutation(DELETE_COMMENT, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    refetchQueries: [{ query: GET_RECIPE }],
    onCompleted: (data) => {
      alert("Commentaire supprimé !");
      if (selectedRecipe) {
        setSelectedRecipe((prevSelectedRecipe) => {
          if (prevSelectedRecipe) {
            return {
              ...prevSelectedRecipe,
              commentaire: prevSelectedRecipe.commentaire.filter(
                (comment) => comment.id !== data.deleteComment.id
              ),
            };
          }
          return prevSelectedRecipe;
        });
      }
    },
  });

  const handleDeleteComment = (commentId: string) => {
    if (!commentId) return;
    DeleteComment({
      variables: { deleteCommentId: commentId },
    });
  };

  const [CreateComment, {}] = useMutation(ADD_COMMENT, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    refetchQueries: [{ query: GET_RECIPE }],
    onCompleted: () => {
      alert("Commentaire ajouté !");
      setCommentaire("");
    },
  });

  const handleAddComment = () => {
    if (!user?.id || !selectedRecipe?.id || !commentaire.trim()) {
      alert("Le commentaire ne peut pas être vide.");
      return;
    }
    CreateComment({
      variables: {
        input: {
          auteur: user.id,
          recette: selectedRecipe.id,
          contenu: commentaire.trim(),
        },
      },
    });
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
              showFavoriteSwitch={true}
              favoris={user?.favoris.some(fav => fav.id === item.id) || false}
              onFavoriteChange={(value) => handleFavoriteToggle(item.id, value)}
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
                <View key={index} style={styles.CommentBox}>
                  <Comment
                    contenu={item.contenu}
                    avatar={item.auteur.avatar}
                    prenom={item.auteur.prenom}
                    date={formatDate(item.dateCreation)}
                  />
                  {user?.id === item?.auteur.id && (
                    <Pressable onPress={() => handleDeleteComment(item?.id)}>
                      <Feather
                        name="trash-2"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </Pressable>
                  )}
                </View>
              ))}
            </ScrollView>
            <View style={styles.BoxAddComment}>
              <Input value={commentaire} onChangeText={(text) => setCommentaire(text)} />
              <Button txt="Ajouter un commentaire" disabled={!commentaire.trim()} onPress={handleAddComment} />
            </View>
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
  CommentBox: {
    flexDirection: "row",
    alignItems: "center"
  },
  BoxAddComment: {
    alignItems: "center",
    width: "70%"
  }
});