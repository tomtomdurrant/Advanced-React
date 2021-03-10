import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput, OrderCreateInput } from "../.keystone/schema-types";
import { stripeConfig } from '../lib/stripe';

interface Arguments {
    token: string
}
const graphql = String.raw;

export default async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
    console.log("Checking out");
    // make sure they are signed in
    const userId = context.session.itemId;
    if (!userId) {
        throw new Error("Please sign in to order.");
    }
    // get the user
    const user = await context.lists.User.findOne({
        where: { id: userId },
        resolveFields: graphql`
            id
            name
            email
            cart {
                id
                quantity
                product {
                    name
                    price
                    description
                    id
                    photo {
                        id
                        image {
                            id
                            publicUrlTransformed
                        }
                    }
                }

            }
        `
    });
    console.dir(user, { depth: null });

    // filters null products
    const cartItems = user.cart.filter(cartItem => cartItem.product);

    // calc the total price for the order
    const amount = cartItems.reduce(function (tally: number, cartItem: CartItemCreateInput) {
        return tally + cartItem.quantity * (cartItem.product as any).price;
    }, 0);
    console.log(amount);
    
    // create charge with stripe library
    const charge = await stripeConfig.paymentIntents.create({
        amount,
        currency: 'USD',
        confirm: true,
        payment_method: token
    }).catch(err => {
        console.error(err);
        throw new Error(err.message);
    });
    console.log(charge);
    
    // convert cart items to order items
    const orderItems = cartItems.map(cartItem => {
        const orderItem = {
            name: cartItem.product.name,
            description: cartItem.product.description,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            photo: { connect: { id: cartItem.product.photo.id }},
        };
        return orderItem;
    });

    // create order and return it
    const order = await context.lists.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems },
            user: { connect : { id: userId }}
        }
    });

    // clean up cart items
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await context.lists.CartItem.deleteMany({
        ids: cartItemIds
    });

    return order;
}
