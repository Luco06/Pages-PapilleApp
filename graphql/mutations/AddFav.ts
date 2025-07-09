import { gql } from "@apollo/client";

export const ADD_FAV = gql`
  mutation AddFavoris($userId: ID!, $recetteId: ID!) {
    addFavoris(userId: $userId, recetteId: $recetteId) {
      id
    }
  }
`;
