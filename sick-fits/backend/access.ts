import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// Access control returns a yes or no value depending on the user's session

export function isSignedIn({session}: ListAccessArgs): boolean {
  return !!session;
}

const generatedPermissions = Object.fromEntries(permissionsList.map(permission => 
    [
        permission, 
        function ({session}: ListAccessArgs) {
            return !!session?.data.role?.[permission];
        }
    ])
);

// check if somebody meets a criteria, yes or no
export const permissions = {
    ...generatedPermissions,
    // Example of adding an additional permission function
    isAwesome({session}: ListAccessArgs) {
        return session.data.name.includes("tom");
    }
}

// rule based function 
// rules can return a boolean, or a filter which limits the products they can manage
export const rules = {
    canManageProducts({session}: ListAccessArgs) {
        // do they have the permission of canManageProduct
        if (!isSignedIn({session})) {
            console.log("not signed in");
            return false;
        }
        if (permissions.canManageProducts({session})) {
            return true;
        }
        // if not, do they own this item?
        return { user: { id: session.itemId } };
    },
    canOrder({session}: ListAccessArgs) {
        if (!isSignedIn({session})) {
            console.log("not signed in");
            return false;
        }
        // do they have the permission of canManageProduct
        if (permissions.canManageCart({session})) {
            return true;
        }
        // if not, do they own this item?
        return { user: { id: session.itemId } };
    },
    canManageOrderItems({session}: ListAccessArgs) {
        // do they have the permission of canManageProduct
        if (!isSignedIn({session})) {
            console.log("not signed in");
            return false;
        }
        if (permissions.canManageCart({session})) {
            return true;
        }
        // if not, do they own this item?
        return { order: { user: { id: session.itemId } } };
    },
    canReadProducts({session}: ListAccessArgs) {
        if (!isSignedIn({session})) {
            console.log("not signed in");
            return false;
        }
        if (permissions.canManageProducts({ session })) {
            return true; // they can read everything
        }
        // they should only see available products
        return { status: 'AVAILABLE' };
    },
    canManageUsers({session}: ListAccessArgs) {
        if (!isSignedIn({session})) {
            console.log("not signed in");
            return false;
        }
        // do they have the permission of canManageUsers
        if (permissions.canManageUsers({session})) {
            return true;
        }
        // otherwise they can only update themselves
        return { id: session.itemId };
    }
}
