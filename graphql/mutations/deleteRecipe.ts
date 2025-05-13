import { gql } from "@apollo/client";

export const DELETE_RECIPE = gql`
mutation DeleteRecette($deleteRecetteId: ID!) {
  deleteRecette(id: $deleteRecetteId) {
    message
  }
}
`