import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const DELETE_CART_ITEM_MUTATION = gql`
  mutation DELETE_CART_ITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

function update(cache, payload) {
  // Remove the item from the cache
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function DeleteFromCart({ id }) {
  console.log('id is', id);
  const [deleteItem, { loading, error, data }] = useMutation(
    DELETE_CART_ITEM_MUTATION,
    {
      variables: {
        id,
      },
      update,
      // optimisticResponse: {
      //   deleteCartItem: {
      //     __typeName: 'CartItem',
      //     id,
      //   },
      // },
    }
  );

  return (
    <BigButton
      type="button"
      title="Remove this item from the cart"
      onClick={deleteItem}
      disabled={loading}
    >
      &times;
    </BigButton>
  );
}
