import fetch from 'node-fetch';
import * as json from './jsonServer';
import * as psql from './postgresDB';
import { pool } from '../database/index';

const resolveFunctions = {
    Query: {
        users: () => {
             return psql.getUsers();
        },
        user: (root, { id }, context) => {
            return context.loaders.User.load(id);
        },
        items: () => {
            return json.getItems();
        },
        item: (root, { id }, context) => {
            return context.loaders.Item.load(id);
        }
    },

    User: {
        items: (user, args, context) => {
            return context.loaders.UserOwnedItems.load(user.id);
        },
        borrowed: (user, args, context) => {
            return context.loaders.UserBorrowedItems.load(user.id);
        }
    },

    Item: {
        itemOwner: (item, args, context) => {
            return context.loaders.User.load(item.itemOwner);
        },
        borrower: (item, args, context) => {
            if (!item.borrower) return null;
            return context.loaders.User.load(item.borrower);
        }
    },

    Mutation: {
        addItem: (root, args) => {
            const newItem = {
                title: args.title,
                description: args.description,
                imageUrl: args.imageUrl,
                tags: args.tags,
                itemOwner: args.itemOwner,
                createdOn: Math.floor(Date.now() / 1000),
                available: true,
                borrower: null
            };
            return json.postNewItem(newItem);
        }
    }
}

export default resolveFunctions;
