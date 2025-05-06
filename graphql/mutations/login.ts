import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $mdp: String!) {
    loginUser(email: $email, mdp: $mdp) {
      token
      user {
        id
        email
        nom
        prenom
        avatar
        pseudo
        favoris {
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
          auteur {
            prenom
          }
          dateCreation
          commentaire {
            contenu
            dateCreation
            auteur {
              prenom
            }
          }
        }
        recettes {
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
          auteur {
            prenom
          }
          dateCreation
          commentaire {
            contenu
            dateCreation
            auteur {
              prenom
            }
          }
        }
      }
    }
  }
`;
