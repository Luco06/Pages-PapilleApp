import { gql } from "@apollo/client";

export const SINGN_USER = gql`
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    nom
    prenom
    email
  }
}

`