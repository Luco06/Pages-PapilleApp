import { gql } from "@apollo/client";

export const ADD_RECIPE = gql`
mutation CreateRecette($input: CreateRecetteInput!) {
  createRecette(input: $input) {
    titre
    description
    ingredients
    tps_prep
    tps_cook
    nb_person
    dificulty
    est_public
    cout
    note
    instructions
    categorie
    img
    favoris
    auteur {
      prenom
    }
  }
}
`