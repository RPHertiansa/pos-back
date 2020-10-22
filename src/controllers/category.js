const categoryModel = require('../models/category');
const {success, failed, successWithMeta} = require('../helpers/response');
const redis = require ('redis')
const client = redis.createClient()

const category = {
    getAll: (req, res) => {
        try {
            const category = !req.query.category ? '' : req.query.category
            const sort = !req.query.sort ? 'id' : req.query.sort
            const type = !req.query.type ? 'ASC' : req.query.type
            const limit = !req.query.limit ? 9 : parseInt(req.query.limit)
            const page = !req.query.page ? 1 : parseInt(req.query.page)
            const offset = page === 1 ? 0 : (page-1)*limit
            categoryModel.getAll(category, sort, type, limit, offset)
            .then((result) => {
                
                client.set('categoryKey', JSON.stringify(result))
                const totalData = result[0].count
                const meta = {
                    totalData,
                    totalPage: Math.ceil(totalData/limit),
                    currentPage: page
                }
                successWithMeta(res, result, meta, 'Get all category success')
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    getDetail: (req, res) => {
        try {
            const id = req.params.id
            categoryModel.getDetail(id)
            .then((result) => {
                client.del('categoryKey')
                success(res, result, "Here is the category you search")
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    insert: (req,res) => {
        try {
            const body = req.body
            categoryModel.insert(body)
            .then((result) => {
                client.del('categoryKey')
                success(res, result, 'category is inserted')
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
            categoryModel.update(body, id)
            .then((result) => {
                client.del('categoryKey')
                success(res, result, 'category is updated')
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
            categoryModel.delete(id)
            .then((result) => {
                client.del('categoryKey')
                success(res, result, 'category is deleted!')
            })
            .catch((err) => {
                failed(res, [], err.message)
            })    
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    }
    
}

module.exports = category