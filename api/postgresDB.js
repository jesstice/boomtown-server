import { pool } from '../database/index';
import admin from '../database/firebase';

export function getUsers() {
    return pool.query(`SELECT * FROM user_profiles`)
        .then(response => renameId(response.rows))
        .catch(errors => console.log('Error executing users query', error.stack));
}

export function getUser(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await pool.query(`SELECT * FROM user_profiles WHERE userid='${id}'`);
            const fbUser = await admin.auth().getUser(id);
            user = renameId(user.rows)[0];
            user = {...user, email: fbUser.email };
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
        .catch(errors => console.log('Error executing items query', error.stack));
}

export function getItem(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let item = await pool.query(`SELECT * FROM items WHERE itemid='${id}'`);
            // const fbUser = await admin.auth().getUser(id);
            item = renameItemId(item.rows)[0];
            // item = {...user, imageURL: fbUser.imageURL };
            resolve(item);
        } catch(error) {
            console.log(error);
            reject(error);
        }
    })
}

export function getUserOwnedItems(id) {
    return pool.query(`SELECT * FROM items WHERE itemOwner='${id}'`)
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
        // try {
        //     let fbUser = await admin.auth().createUser({
        //         email: args.email,
        //         password: args.password,
        //     });
        //     const query = {
        //         text: 'INSERT INTO user_profiles(fullname, bio, userid) VALUES($1, $2, $3) RETURNING *',
        //         values: [args.fullname, args.bio, fbUser.uid],
        //     }
        //     let pgUser = await pool.query(query.text, query.values);
        //     const user = {...pgUser.rows[0], email: fbUser.email, id: fbUser.uid};
        //     resolve(user);
        // } catch(error) {
        //     console.log(error);
        //     reject(error);
        // }
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
                text: 'INSERT INTO user_profiles(fullname, bio, userid) VALUES($1, $2, $3) RETURNING *',
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

function renameId(rows) {
    return rows.map(row => Object.keys(row).reduce((acc, user) => {
           acc = {...row, id: row.userid};
           delete acc.rowname;
           return acc;
        }));
}

function renameItemId(rows) {
    return rows.map(row => Object.keys(row).reduce((acc, user) => {
           acc = {...row, id: row.itemid};
           delete acc.itemid;
           return acc;
        }));
}
