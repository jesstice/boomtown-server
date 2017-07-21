import fetch from 'node-fetch';
import * as json from './jsonServer';

const resolveFunctions = {
    Query: {
        users() {
             return json.getUsers();
        },
        user(root, { id }) {
            return json.getUser(id)
        },
        items() {
            return json.getItems();
        },
        item(root, { id }) {
            return json.getItem(id);
        }
    },

    User: {
        items(user) {
            return json.getFilteredItemOwner(user);
        },
        borrowed(user) {
            return json.getFilteredItemBorrower(user);
        }
    },

    Item: {
        itemOwner(item) {
            return json.getUser(item.itemOwner);
        },
        borrower(item) {
            if (!item.borrower) return null;
            return json.getUser(item.borrower);
        }
    },

    Mutation: {
        addItem(root, args) {
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
