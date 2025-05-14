import { gql } from "@apollo/client"

export const UPDATE_RECIPE = gql`
mutation UpdateRecette($updateRecetteId: ID!, $input: UpdateRecetteInput!) {
    updateRecette(id: $updateRecetteId, input: $input) {
      id
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
    }
  }
  `