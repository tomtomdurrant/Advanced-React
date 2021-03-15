import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth'
import { User } from './schemas/User';
import { CartItem } from './schemas/CartItem';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { Product } from './schemas/Product';
import { Order } from './schemas/Order';
import { Role } from './schemas/Role';
import { OrderItem } from './schemas/OrderItem';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from "./mutations/index"
import { permissionsList } from './schemas/fields';

const databaseURL = process.env.DATABASE_URL || 'No database URL';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long a user stays signed in?
  secret: process.env.COOKIE_SECRET,
};

const {withAuth} = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
    // TODO Add initial roles
    },
    passwordResetLink: {
      async sendToken(args) {
        await sendPasswordResetEmail(args.token, args.identity);
      }
    }
})

export default withAuth(config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    async onConnect({keystone}) {
        if (process.argv.includes('--seed-data')) {
            await insertSeedData(keystone);
        }
    },
  },
  lists: createSchema({
    // * This is where you add your schemas/items
    User,
    Product,
    ProductImage,
    CartItem,
    OrderItem,
    Order,
    Role
  }),
  extendGraphqlSchema,
  ui: {
      // Show the UI only for people who pass the test
    isAccessAllowed: ({session}) => {
        console.log('the session is ', session);
        return !!session?.data;
    }
  },
  session: withItemData(statelessSessions(sessionConfig), {
    // This response is a GraphQL query
    User: `id name email password role { ${permissionsList.join(' ')} }`
  }),
}));
