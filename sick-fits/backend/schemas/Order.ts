import { integer, relationship, text, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';
import formatMoney from '../lib/formatMoney';

const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: () => false,
    delete: () => false,
  },
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver(item) {
        console.log(item);
        
        return `${formatMoney(item.total)}`;
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});

export { Order };
