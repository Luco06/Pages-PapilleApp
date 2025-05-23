import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/themeContext";

interface RecipeCardProps {
  titre: string;
  auteur: string;
  bgImage: any;
  couvert: string;
  cuission: string;
  tep_prep: string;
  dificulty: string;
  categorie: string;
  onPress: () => void;
}

export default function CardRecipe({
  titre,
  auteur,
  bgImage,
  couvert,
  tep_prep,
  dificulty,
  categorie,
  cuission,
  onPress
}: RecipeCardProps) {
    const theme = useTheme();
  return (
    <Pressable style={styles.Container} onPress={onPress}>
        <View style={[styles.Header, {backgroundColor: theme.colors.primary, borderColor: theme.colors.primary}]}>
            <Text style={[styles.HeaderText, {color:theme.colors.text}]}>{titre}</Text>
            <Text style={[styles.HeaderText, {color:theme.colors.text}]}>Par: {auteur}</Text>
        </View>
        <View style={styles.ImageContainer}>
            <Image contentFit="cover" style={styles.StyledImage} source={bgImage}/>
        </View>
        <View style={[styles.Footer, {backgroundColor: theme.colors.primary, borderColor: theme.colors.primary}]}>
            <Text style={[styles.FooterText, {color: theme.colors.text}]}>Couvert: {couvert}</Text>
            <Text style={[styles.FooterText, {color: theme.colors.text}]}>Cuisson: {cuission}</Text>
            <Text style={[styles.FooterText, {color: theme.colors.text}]}>Préparation: {tep_prep}</Text>
            <Text style={[styles.FooterText, {color: theme.colors.text}]}>Difficulté: {dificulty}</Text>
            <Text style={[styles.FooterText, {color: theme.colors.text}]}>Catégorie: {categorie}</Text>
        </View>
    </Pressable>
  );
}

const styles  = StyleSheet.create({
    Container: {
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'space-between',
        borderRadius: 12,
        padding: 8,
        width:'95%',
        marginBottom: 16,

    },
    Header: {
        borderWidth:8,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
        width: '100%'
    },
    HeaderText:{
        textAlign: 'center',
        fontWeight: 'bold',
    },
    ImageContainer: {
        flexGrow: 1,
        width: '100%',
        height: 300,
        position: 'relative',
        overflow: 'hidden',
    },
    StyledImage: {
        width: '100%',
        height: '100%',
    },
    Footer: {
        width: '100%',
        borderWidth: 8,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
    },
    FooterText: {
        margin: 4,
        width: '45%',
    }
})