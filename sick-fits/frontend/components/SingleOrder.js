import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import DisplayError from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      total
      label
      charge
      user {
        name
        email
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          id
          image {
            id
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrder({ id }) {
  const { loading, data, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const order = data?.order;
  console.log(order);
  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - {order.id}</title>
      </Head>
      <h2>Your order {order?.user?.name}</h2>
      <p>
        <span>Order Id:</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(order?.total)}</span>
      </p>

      {order?.items.map((orderItem) => (
        <div className="order-item" key={orderItem.id}>
          <img
            width="150px"
            src={orderItem.photo.image.publicUrlTransformed}
            alt={orderItem.name}
          />
          <div>
            <h2>{orderItem.name}</h2>
            <p>Quantity: {orderItem.quantity}</p>
            <p>Each: {formatMoney(orderItem.price)}</p>
            <p>{orderItem.description}</p>
          </div>
        </div>
      ))}
    </OrderStyles>
  );
}
