const historyModel = require('../models/history');
const {success, failed, successWithMeta} = require('../helpers/response')


const history = {
    getAll: (req, res) => {
        try {

            const cashier = !req.query.cashier ? '' : req.query.cashier
            const sort = !req.query.sort ? 'id' : req.query.sort
            const type = !req.query.type ? 'ASC' : req.query.type
            const limit = !req.query.limit ? 9 : parseInt(req.query.limit)
            const page = !req.query.page ? 1 : parseInt(req.query.page)
            const offset = page === 1 ? 0 : (page-1)*limit
            historyModel.getAll(cashier, sort, type, limit, offset)
            .then((result) => {     
                
                const meta = {
                    totalData,
                    totalPage: Math.ceil(totalData/limit),
                    currentPage: page
                }
                successWithMeta(res, result, meta, 'Get all transaction data success')
            })
            .catch((err) => {
                failed(res, [], err.message)
            })    
        } catch (error) {
            
        }
    },
    getDetail: (req, res) => {
        try {
            const id = req.params.id
            historyModel.getDetail(id)
            .then((result) => {
                
                success(res, result, "Here is the history you search")
            })
            .catch((err) => {
                failed(res, [], err.message)
            })    
        } catch (error) {
            
        }
    },
    insert: async (req,res) => {
        try {
            const body = req.body
            historyModel.insert(body)  
            .then((result) => {
                
                const masterId = result.insertId
                const addDetail = body.detail.map((item) => {
                    item.id_transaction = masterId
                    historyModel.insertDetail(item)
                })
                Promise.all(addDetail)
                .then(() => {
                    success(res, result, 'Transaction success')
                })
            })
            .catch((err) =>{
                failed(res, [], err.message)
            })    
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    update: (req,res) => {
        try {
            const id = req.params.id
            const body = req.body
            historyModel.update(body, id)
            .then((result) => {
                
                success(res, result, 'history is updated')
            })
            .catch((err) => {
                failed(res, [], err.message)
            })    
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    delete: (req, res) => {
        try {
            const id = req.params.id
            historyModel.delete(id)
            .then((result) => {
                
                success(res, result, 'history is deleted!')
            })
            .catch((err) => {
                failed(res, [], err.message)
            })    
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    }
    
}

module.exports = history