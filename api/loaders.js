import DataLoader from 'dataloader';
import { getUser, getItem, getUserOwnedItems, getUserBorrowedItems, getItemTags } from './postgresDB';

export default function() {
    return {
        UserOwnedItems: new DataLoader(ids => (
            Promise.all(ids.map(id => getUserOwnedItems(id)))
        )),
        UserBorrowedItems: new DataLoader(ids => (
            Promise.all(ids.map(id => getUserBorrowedItems(id)))
        )),
        User: new DataLoader(ids => (
            Promise.all(ids.map(id => getUser(id)))
        )),
        Item: new DataLoader(ids => (
            Promise.all(ids.map(id => getItem(id)))
        )),
        ItemTags: new DataLoader(ids => (
            Promise.all(ids.map(id => getItemTags(id)))
        ))
    };
}
