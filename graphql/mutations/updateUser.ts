import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
mutation UpdateUser($updateUserId: ID!, $input: UpdateUserInput!) {
  updateUser(id: $updateUserId, input: $input) {
    id
    nom
    prenom
  }
}
`