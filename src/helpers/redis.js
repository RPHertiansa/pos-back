// const redis = require('redis')
// const client = redis.createClient()
// const { success, successWithMeta } = require('../helpers/response')
// const _ = require('lodash')

// const redisGate = {
//     getProduct: (req, res, next) => {
        
//         client.get("productKey", (err, data) => {
//             if (data) {
//                 data = JSON.parse(data)

//                 const name = !req.query.name ? null : req.query.name
//                 const sort = !req.query.sort ? '' : req.query.sort
//                 const type = !req.query.type ? '' : req.query.type

//                 const limit = !req.query.limit ? 9 : parseInt(req.query.limit)
//                 const page = !req.query.page ? 1 : parseInt(req.query.page)
//                 const start = page === 1 ? 0 : (page*limit)-limit
//                 const offset = start === 0 ? limit : start*limit

//                 const sorted = _.orderBy(data, [sort], [type])
//                 let redisData = sorted

//                 if(name !== null) {
//                     const search = sorted.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
//                     redisData = search
//                 }
//                 res.send({
//                     message: "Get all data from Redis success",
//                     success: true,
//                     meta : {
//                         totalData : redisData.length,
//                         totalPage : Math.ceil(redisData.length/limit),
//                         page
//                     },
//                     data: redisData.slice(start, offset)
//                 })
//             } else {
//                 next()
//             }
//         })
//     },
//     getHistory: (req, res, next) => {
//         client.get("historyKey", (err, data) => {
//             if (data) {
//                 data = JSON.parse(data)

//                 const cashier = !req.query.cashier ? null : req.query.cashier
//                 const sort = !req.query.sort ? '' : req.query.sort
//                 const type = !req.query.type ? '' : req.query.type

//                 const limit = !req.query.limit ? 9 : parseInt(req.query.limit)
//                 const page = !req.query.page ? 1 : parseInt(req.query.page)
//                 const start = page === 1 ? 0 : (page*limit)-limit
//                 const offset = start === 0 ? limit : start*limit

//                 const sorted = _.orderBy(data, [sort], [type])
//                 let redisData = sorted

//                 if(cashier !== null) {
//                     const search = sorted.filter(item => item.cashier.toLowerCase().includes(cashier.toLowerCase()))
//                     redisData = search
//                 }
//                 res.send({
//                     message: "Get all data from Redis success",
//                     success: true,
//                     meta : {
//                         totalData : redisData.length,
//                         totalPage : Math.ceil(redisData.length/limit),
//                         page
//                     },
//                     data: redisData.slice(start, offset)
//                 })
//             } else {
//                 next()
//             }
//         })
//     },
//     getCategory: (req, res, next) => {
//         client.get("categoryKey", (err, data) => {
//             if (data) {
//                 data = JSON.parse(data)

//                 const category = !req.query.category ? null : req.query.category
//                 const sort = !req.query.sort ? '' : req.query.sort
//                 const type = !req.query.type ? '' : req.query.type

//                 const limit = !req.query.limit ? 9 : parseInt(req.query.limit)
//                 const page = !req.query.page ? 1 : parseInt(req.query.page)
//                 const start = page === 1 ? 0 : (page*limit)-limit
//                 const offset = start === 0 ? limit : start*limit

//                 const sorted = _.orderBy(data, [sort], [type])
//                 let redisData = sorted

//                 if(category !== null) {
//                     const search = sorted.filter(item => item.category.toLowerCase().includes(category.toLowerCase()))
//                     redisData = search
//                 }
//                 res.send({
//                     message: "Get all data from Redis success",
//                     success: true,
//                     meta : {
//                         totalData : redisData.length,
//                         totalPage : Math.ceil(redisData.length/limit),
//                         page
//                     },
//                     data: redisData.slice(start, offset)
//                 })
//             } else {
//                 next()
//             }
//         })
//     },
//     getUsers: (req, res, next) => {
//         client.get("usersKey", (err, data) => {
//             if (data) {
//                 data = JSON.parse(data)

//                 const name = !req.query.name ? null : req.query.name
//                 const sort = !req.query.sort ? '' : req.query.sort
//                 const type = !req.query.type ? '' : req.query.type

//                 const limit = !req.query.limit ? 9 : parseInt(req.query.limit)
//                 const page = !req.query.page ? 1 : parseInt(req.query.page)
//                 const start = page === 1 ? 0 : (page*limit)-limit
//                 const offset = start === 0 ? limit : start*limit

//                 const sorted = _.orderBy(data, [sort], [type])
//                 let redisData = sorted

//                 if(name !== null) {
//                     const search = sorted.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
//                     redisData = search
//                 }
//                 res.send({
//                     message: "Get all data from Redis success",
//                     success: true,
//                     meta : {
//                         totalData : redisData.length,
//                         totalPage : Math.ceil(redisData.length/limit),
//                         page
//                     },
//                     data: redisData.slice(start, offset)
//                 })
//             } else {
//                 next()
//             }
//         })
//     }
// }

// module.exports = redisGate