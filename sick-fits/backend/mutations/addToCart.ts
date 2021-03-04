import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from "../.keystone/schema-types";
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('adding to cart');
  
  // 1. Query current user and see if they are signed in
  const session = context.session as Session;
  if (!session.itemId) {
      throw new Error("Unauthorized")
  }
  // 2. Query current user cart
  const allCartItems = await context.lists.CartItem.findMany({
      where: { user: { id: session.itemId }, product: { id: productId } },
      resolveFields: 'id,quantity'
  });
  console.log(allCartItems);
  
  const [ existingCartItem ] = allCartItems;
  if (existingCartItem) {
      console.log(`There are ${existingCartItem.quantity} of that item in the cart. Add 1 `);
      return await context.lists.CartItem.updateOne({ 
          id: existingCartItem.id, 
          data: { quantity: existingCartItem.quantity + 1 }
      });
      
  }
  console.log("That item was not in the cart. Adding");
  
  return await context.lists.CartItem.createOne({
      data: {
          product: { connect: { id: productId } },
          user: { connect: { id: session.itemId } },
      }
  })
  // 3. See if the item they are adding is already in their cart
}
