import { gql } from "@apollo/client";

export const DELETE_COMMENT = gql`
mutation DeleteComment($deleteCommentId: ID!) {
  deleteComment(id: $deleteCommentId) {
    message
  }
}
`