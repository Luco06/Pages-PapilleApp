import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/themeContext";

interface RecipeCardDetailsProps {
  titre: string;
  auteur: string;
  bgImage: any;
  couvert: string;
  cuission: string;
  tep_prep: string;
  dificulty: string;
  categorie: string;
  publique?: boolean;
  ingredients: string[];
  instructions: string[];
}

export default function CardRecipeDetails({
  titre,
  auteur,
  bgImage,
  couvert,
  cuission,
  tep_prep,
  dificulty,
  categorie,
  ingredients,
  instructions,
  publique
}: RecipeCardDetailsProps) {
  const theme = useTheme();
  return (
    <View style={styles.Container}>
      <View
        style={[
          styles.Header,
          {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <Text style={[styles.HeaderText, { color: theme.colors.text }]}>
          {titre}
        </Text>
        <Text style={[styles.HeaderText, { color: theme.colors.text }]}>
          Par: {auteur}
        </Text>
      </View>
      <View style={styles.ImageContainer}>
        <Image contentFit="cover"  style={styles.StyledImage} source={bgImage} />
      </View>
      <View
        style={[
          styles.Footer,
          {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <Text style={[styles.FooterText, { color: theme.colors.text }]}>
          Couvert: {couvert}
        </Text>
        <Text style={[styles.FooterText, { color: theme.colors.text }]}>
          Cuisson: {cuission}
        </Text>
        <Text style={[styles.FooterText, { color: theme.colors.text }]}>
          Préparation: {tep_prep}
        </Text>
        <Text style={[styles.FooterText, { color: theme.colors.text }]}>
          Difficulté: {dificulty}
        </Text>
        <Text style={[styles.FooterText, { color: theme.colors.text }]}>
          Catégorie: {categorie}
        </Text>
        <Text style={[styles.FooterText, { color: theme.colors.text }]}>
          Publique: {publique ? "Non" : "Oui"}
        </Text>
      </View>
      <View style={styles.Section}>
        <Text
          style={[
            styles.SectionTitle,
            { color: theme.colors.text, fontSize: theme.fontSize.large },
          ]}
        >
          Ingrédients
        </Text>
        <View style={styles.List}>
          {ingredients.map((ingredient, index) => (
            <Text
              style={[styles.ListItem, { color: theme.colors.text }]}
              key={index}
            >
              {ingredient}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.Section}>
        <Text
          style={[
            styles.SectionTitle,
            { color: theme.colors.text, fontSize: theme.fontSize.large },
          ]}
        >
          Instructions
        </Text>
        <View style={styles.OrderedList}>
          {instructions.map((instruction, index) => (
            <Text style={[styles.OrderedItem, {color:theme.colors.text}]} key={index}>
              {index + 1}. {instruction}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 8,
    width: "95%",
    marginBottom: 16,
    elevation: 5,
  },
  Header: {
    borderWidth: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  HeaderText: {
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    fontWeight: "bold",
  },
  ImageContainer: {
    flexGrow: 1,
    width: "100%",
    height: 300,
    position: "relative",
    overflow: "hidden",
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
    alignItems: "center",
    padding: 2,
  },
  FooterText: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    margin: 4,
    width: "45%",
  },
  Section: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  SectionTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  List: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    margin: 16,
  },
  ListItem: {
    width: "48%",
    textAlign: "left",
    marginBottom: 8,
  },
  OrderedList: {
    width: "90%",
    margin: 16,
  },
  OrderedItem: {
    textAlign: "left",
    marginBottom: 8,
  },
});
