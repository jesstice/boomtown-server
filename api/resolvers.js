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
            return psql.getItems();
        },
        item: (root, { id }, context) => {
            return context.loaders.Item.load(id);
        },
        tags: () => {
            return psql.getTags();
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
        itemowner: (item, args, context) => {
            return context.loaders.User.load(item.itemowner);
        },
        borrower: (item, args, context) => {
            if (!item.borrower) return null;
            return context.loaders.User.load(item.borrower);
        },
        tags: (item, args, context) => {
            return context.loaders.ItemTags.load(item.id);
        }
    },

    Mutation: {
        addItem: (root, args) => {
            const newItem = {
                title: args.title,
                description: args.description,
                imageUrl: args.imageUrl,
                tags: args.tags,
                itemowner: args.itemowner,
                createdOn: Math.floor(Date.now() / 1000),
                available: true,
                borrower: null
            };
            return json.postNewItem(newItem);
        },
        addUser: (root, args, context) => {
            return psql.createUser(args, context) 
        }
    }
}

export default resolveFunctions;
