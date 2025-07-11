import { useMutation, useQuery } from "@apollo/client";
import { FlashList } from "@shopify/flash-list";
import * as SecureStore from "expo-secure-store";
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
import AddRecipe from "../../components/AddRecipe";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import CardRecipe from "../../components/CardRecipe";
import CardRecipeDetails from "../../components/CardRecipeDetails";
import CardRecipeProfile from "../../components/CardRecipeProfile";
import Pins from "../../components/Pins";
import UpdateRecipe from "../../components/UpdateRecipe";
import { DELETE_RECIPE } from "../../graphql/mutations/deleteRecipe";
import { GET_USER } from "../../graphql/queries/user";
import { useTheme } from "../../theme/themeContext";
import { RecipeType, UserAtom } from "../../utils/atoms";

export default function Profile() {
  const [user, setUser] = useAtom(UserAtom);
  const [recipes, setRecipes] = useState<RecipeType[]>(user?.recettes ?? []);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [seeFavoris, setSeeFavoris] = useState(false);
  const [favRecipe, setFavRecipe] = useState<RecipeType[]>([]);
  const [filteredFavs, setFilteredFavs] = useState<RecipeType[]>([]);


  useEffect(() => {
    const tokenStore = SecureStore.getItem("token");
    setToken(tokenStore);
  }, []);

  const { data } = useQuery(GET_USER, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const publicRecipes = recipes?.filter(
    (recipe: RecipeType) => recipe.est_public === true
  );

  useEffect(() => {
    if (data) {
      setUser((prev) => (prev ? { ...prev, ...data } : data));
    }
  }, [data, setUser]);

  useEffect(() => {
    if (Array.isArray(user?.recettes)) {
      setRecipes(data?.user.recettes);
      setFilteredRecipes(data?.user.recettes);
      setFavRecipe(data?.user.favoris || []);
    }
  }, [user, data?.user.recettes]);
  
  useEffect(() => {
    if (selectedCategory) {
      setFilteredFavs(
        favRecipe.filter((recipe) => recipe.categorie === selectedCategory)
      );
    } else {
      setFilteredFavs(favRecipe);
    }
  }, [favRecipe, selectedCategory]);
  
  const handleSelectCategory = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);

    if (newCategory) {
      setFilteredRecipes(
        recipes.filter((recipe) => recipe.categorie === newCategory)
      );
    } else {
      setFilteredRecipes(recipes);
    }
  };
  const theme = useTheme();
  const handleRecipeClick = (recipe: RecipeType) => {
    setSelectedRecipe(recipe);
  };
  const closeModal = () => {
    setSelectedRecipe(null);
  };
  const [DeleteRecette] = useMutation(DELETE_RECIPE, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    refetchQueries: [{ query: GET_USER, variables: { userId: user?.id } }],
    onCompleted: () => {
      alert("Recette supprimer !");
    },
  });
  return (
    <SafeAreaView
      style={[styles.Container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.ViewAvatar}>
        <AddRecipe />

        <Avatar
          src={
            user?.avatar
              ? { uri: user.avatar }
              : require("../../assets/images/bobMartin.png")
          }
          alt={user?.prenom || ""}
        />
      </View>

      <View style={styles.BoxInfo}>
        <Text
          style={[
            styles.txtSetting,
            { color: theme.colors.primary, fontSize: theme.fontSize.medium },
          ]}
        >
          {user?.prenom} {user?.nom}
        </Text>
        <View style={styles.BoxRecipe}>
          <Text style={[styles.txtSetting, { color: theme.colors.text }]}>
            Recettes: {recipes?.length || 0}
          </Text>
          <Text style={[styles.txtSetting, { color: theme.colors.text }]}>
            Publiques: {publicRecipes?.length || 0}
          </Text>
          <Text style={[styles.txtSetting, { color: theme.colors.text }]}>
            Favoris: {user?.favoris.length || 0}
          </Text>
        </View>
        <Pins
          onSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
        />
      </View>
      <View style={styles.ViewBtn}>
        <Button
          active={seeFavoris === false}
          onPress={() => setSeeFavoris(false)}
          txt="Mes recettes"
        />
        <Button
          active={seeFavoris === true}
          onPress={() => setSeeFavoris(true)}
          txt="Mes favoris"
        />
      </View>
      {seeFavoris ? (
        <>
          <Text>Favoris</Text>
          {favRecipe && favRecipe.length > 0 ? (
            <FlashList
              data={filteredFavs}
              estimatedItemSize={200}
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
          ) : (
            <Text
              style={{
                color: theme.colors.text,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Aucune recette trouvée dans cette catégorie.
            </Text>
          )}
        </>
      ) : (
        <>
          <Text style={[styles.txtSetting, { color: theme.colors.text }]}>
            Mes Recettes
          </Text>
          {filteredRecipes && filteredRecipes.length > 0 ? (
            <FlashList
              data={filteredRecipes}
              estimatedItemSize={200}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <View style={styles.CenteredCardWrapper}>
                  <CardRecipeProfile
                    onPressDialog={() =>
                      DeleteRecette({
                        variables: {
                          deleteRecetteId: item.id,
                        },
                      })
                    }
                    onPress={() => handleRecipeClick(item)}
                    titre={item.titre}
                    auteur={item.auteur.prenom}
                    bgImage={{ uri: item.img }}
                    couvert={item.nb_person}
                    cuission={item.tps_cook}
                    tep_prep={item.tps_prep}
                    dificulty={item.dificulty}
                    categorie={item.categorie}
                    publique={item.est_public}
                  />
                </View>
              )}
            />
          ) : (
            <Text
              style={{
                color: theme.colors.text,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Aucune recette trouvée dans cette catégorie.
            </Text>
          )}
        </>
      )}
      {seeFavoris ? (
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
          <View style={styles.CenteredCardWrapperModal}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
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
      ) : (
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
            <View style={styles.CenteredCardWrapperModal}>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                <UpdateRecipe
                  setIsModalOpen={closeModal}
                  recipe={selectedRecipe}
                />
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
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 20,
  },
  BoxInfo: {
    alignItems: "center",
  },
  BoxInput: {
    marginTop: 30,
    alignItems: "center",
  },
  BoxRecipe: {
    flexDirection: "row",
    alignContent: "space-between",
  },
  txtSetting: {
    margin: 10,
  },
  CenteredCardWrapper: {
    alignItems: "center",
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
  CenteredCardWrapperModal: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  ViewAvatar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  IconWrapper: {
    position: "absolute",
    left: 0,
    padding: 8,
  },
  ViewBtn: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
  },
});
