import { gql } from "@apollo/client";

export const DELETE_FAV = gql`
mutation RemoveFavoris($userId: ID!, $recetteId: ID!) {
  removeFavoris(userId: $userId, recetteId: $recetteId) {
    favoris {
      id
    }
  }
}
`