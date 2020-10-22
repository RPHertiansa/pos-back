const db = require('../configs/db');

const history = {
    getAll: (cashier, sort, type, limit, offset) => {
        return new Promise((resolve, reject) => {
          db.query(`SELECT * , (SELECT COUNT(*) FROM history) AS count FROM history WHERE cashier LIKE '%${cashier}%' ORDER BY ${sort} ${type} LIMIT ${offset}, ${limit}`, (err, result) => {
            if(err){
              reject(new Error(err))
            } else {
              resolve(result)
            }
          })
        })
      },
    getDetail: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM history WHERE id='${id}'`, (err, result) => {
                if(err){
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insert: (body) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO history (cashier, invoice) VALUES ('${body.cashier}', '${body.invoice}')`, (err, result) => {
                if(err){
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            } )
        })
    },

    insertDetail: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO detail_history SET ?`, data, (err, result) => {
                if(err){
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            } )
        })
    },

    update: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE history SET
            cashier='${data.cashier}',
            invoice='${data.invoice}' 
            WHERE id='${id}'`,
            (err, result) => {
                if(err){
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM history WHERE id='${id}'`, (err, result) =>{
                if(err){
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = history