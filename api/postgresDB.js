import { pool } from '../database/index';
import admin from '../database/firebase';

export function getUsers() {
    return pool.query(`SELECT * FROM user_profiles`)
        .then(response => response.rows)
        .catch(errors => console.log(errors));
}

export function getUser(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await pool.query(`SELECT * FROM user_profiles WHERE id='${id}'`);
            const fbUser = await admin.auth().getUser(id);
            user = user.rows[0];
            user = {...user, email: fbUser.email };
            resolve(user);
        } catch(error) {
            console.log(error);
            reject(error);
        }
    })
}

export function createUser(args, context) {
    return new Promise(async (resolve, reject) => {
        try {
            let fbUser = await admin.auth().createUser({
                email: args.email,
                password: args.password,
            });
            const query = {
                text: 'INSERT INTO user_profiles(fullname, bio, id) VALUES($1, $2, $3) RETURNING *',
                values: [args.fullname, args.bio, fbUser.uid],
            }
            let pgUser = await pool.query(query.text, query.values);
            const user = {...pgUser.rows[0], email: fbUser.email, id: fbUser.uid};
            resolve(user);
        } catch(error) {
            console.log(error);
            reject(error);
        }
    })
}

export function getItems() {
    return pool.query(`SELECT * FROM items`)
        .then(response => response.rows)
        .catch(errors => console.log(errors));
}

export function getItem(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let item = await pool.query(`SELECT * FROM items WHERE id='${id}'`);
            // const fbUser = await admin.auth().getUser(id);
            item = item.rows[0];
            // item = {...user, imageURL: fbUser.imageURL };
            resolve(item);
        } catch(error) {
            console.log(error);
            reject(error);
        }
    })
}

export function getUserOwnedItems(id) {
    return pool.query(`SELECT * FROM items WHERE itemowner='${id}'`)
        .then(response => {
            return response.rows
        })
        .catch(errors => console.log(errors));
}

export function getUserBorrowedItems(id) {
    return pool.query(`SELECT * FROM items WHERE borrower='${id}'`)
        .then(response => response.rows)
        .catch(errors => console.log(errors));
}

export function postNewItem(newItem) {
    return new Promise(async (resolve, reject) => {
        try {
            // let fbUser = await admin.auth().createUser({
            //     email: args.email,
            //     password: args.password,
            // });
            // const query = {
            //     text: 'INSERT INTO user_profiles(fullname, bio, userid) VALUES($1, $2, $3) RETURNING *',
            //     values: [args.fullname, args.bio, fbUser.uid],
            // }
            // let pgUser = await pool.query(query.text, query.values);
            // const user = {...pgUser.rows[0], email: fbUser.email, id: fbUser.uid};
            // resolve(user);
        } catch(error) {
            console.log(error);
            reject(error);
        }
    })
}

export function getTags() {
    return pool.query(`SELECT * FROM tags`)
        .then(response => response.rows)
        .catch(errors => console.log(errors));
}

export function getItemTags(id) {
    return pool.query(`
        SELECT items.id, itemtags.tagid
            FROM items INNER JOIN itemtags ON (items.id = itemtags.itemid)
            WHERE items.id = ${id}`)
        .then(response => response.rows)
        .catch(errors => console.log(errors));

}

export function getFilteredItems(id) {
    return pool.query(`
        SELECT * FROM items
            INNER JOIN itemtags ON (items.id = itemtags.itemid)
            WHERE itemtags.tagid = ${id}`)
        .then(response => response.rows)
        .catch(errors => console.log(errors));

}
