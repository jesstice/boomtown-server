import { pool } from '../database/index';

function renameId(rows) {
    return rows.map(row => Object.keys(row).reduce((acc, user) => {
           acc = {...row, id: row.userid};
           delete acc.userid;
           return acc;
        }));
}

export function getUsers() {
    return pool.query(`SELECT * FROM user_profiles`)
        .then(response => renameId(response.rows))
        .catch(errors => console.log('Error executing users query', error.stack));
}

export function getUser(id) {
    return pool.query(`SELECT * FROM user_profiles WHERE userid='${id}'`)
        .then(response => renameId(response.rows)[0])
        .catch(errors => console.log('Error executing user query', error.stack));
}

export function getItems() {
    return pool.query(`SELECT * FROM items`)
        .then(response => response.rows)
        .catch(errors => console.log('Error executing items query', error.stack));
}

export function getItem(id) {
    return pool.query(`SELECT * FROM items WHERE userid='${id}'`)
        .then(response => response.rows)
        .catch(errors => console.log('Error executing item query', error.stack));
}
