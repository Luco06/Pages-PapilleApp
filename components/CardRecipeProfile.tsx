import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Dialog, Portal } from 'react-native-paper';
import { useTheme } from "../theme/themeContext";
import Button from "./Button";

interface RecipeCardProps {
  titre: string;
  auteur: string;
  bgImage: any;
  couvert: string;
  cuission: string;
  tep_prep: string;
  dificulty: string;
  categorie: string;
  publique: boolean;
  onPress: () => void;
  onPressDialog: () => void;
}

export default function CardRecipeProfile({
  titre,
  auteur,
  bgImage,
  couvert,
  tep_prep,
  dificulty,
  categorie,
  publique,
  cuission,
  onPress,
  onPressDialog
}: RecipeCardProps) {
    const theme = useTheme();
    const [visible, setVisible] = useState(false)
    const openDialog = ()=> setVisible(true)
    const closeDialog = ()=> setVisible(false)
  return (
    <Pressable style={styles.Container} onPress={onPress} onLongPress={openDialog}>
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
            <Text style={[styles.FooterText, {color: theme.colors.text}]}>Publique: {publique ? "Oui" : "Non"}</Text>
        </View>
   <Portal>
    <Dialog style={{backgroundColor:theme.colors.background}} visible={visible} onDismiss={closeDialog}>
        <Dialog.Content>
            <Text style={{color:theme.colors.text, fontSize:theme.fontSize.medium}}>Êtes-vous sûr de vouloir supprimer cette recette?</Text>
        </Dialog.Content>
       <Dialog.Actions>
       <Button txt="Annuler"  onPress={closeDialog}/>
          <Button txt="Oui"  onPress={onPressDialog}/>
       </Dialog.Actions>
    </Dialog>
   </Portal>
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
        width:'100%',
        marginBottom: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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
        height: 200,
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