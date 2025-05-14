import { gql } from "@apollo/client";

export const ADD_COMMENT = gql`
mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    contenu
    dateCreation
    auteur {
      avatar
      prenom
    }
  }
}
`