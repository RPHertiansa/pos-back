const db = require('../configs/db');

const users = {
    register: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO users SET ?`, data, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    login: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email = '${data.email}'`,  (err, result) => {
                if (err) {
                    reject (new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    logout:(id) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE users SET refreshToken = null WHERE id='${id}'`,
            (err,result)=> {
                if (err) {
                    reject (new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }, 
    updateRefreshToken:(token,id) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE users SET refreshToken='${token}' WHERE id='${id}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    newPassword:(password,userkey) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE users SET password='${password}' WHERE userkey='${userkey}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    resetKey:(email) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE users SET userkey= null WHERE email='${email}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    updateUserKey:(userKey,email) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE users SET userkey='${userKey}' WHERE email='${email}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    checkRefreshToken: (refreshToken) => {
        return new Promise((resolve,reject)=>{
            db.query(`SELECT * FROM users WHERE refreshToken='${refreshToken}'`, 
            (err,result) =>{
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })  
    },
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users`, (err, result) => {
                if (err) {
                    reject (new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getDetail: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE id ='${id}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    update: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET ? WHERE id=?`, [data, id], (err, result) => {
                if(err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM users WHERE id = '${id}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    activateUser: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET is_active = 1 WHERE email = '${data}'`, (err,result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    getEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email ='${email}'`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    if(result.length > 0){
                        resolve(result)
                    }else{
                        reject(`Email tidak ditemukan`)
                    }
                }
            })
        })
    }
};
module.exports = users