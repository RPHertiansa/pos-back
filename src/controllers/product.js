const productModel = require('../models/product');
const {success, failed, successWithMeta} = require('../helpers/response')
const redis = require ('redis')
const client = redis.createClient()
const upload = require('../helpers/upload')
const fs = require('fs')

const product = {
    getAll: (req, res) => {
        try {
            const name = !req.query.name ? '' : req.query.name
            const sort = !req.query.sort ? 'id' : req.query.sort
            const type = !req.query.type ? 'ASC' : req.query.type
            const limit = !req.query.limit ? 9 : parseInt(req.query.limit)
            const page = !req.query.page ? 1 : parseInt(req.query.page)
            const offset = page === 1 ? 0 : (page-1)*limit
            productModel.getAll(name, sort, type, limit, offset)
            .then((result) => {
                client.set('productKey', JSON.stringify(result))
                const totalData = result[0].count
                const meta = {
                    totalData,
                    totalPage: Math.ceil(totalData/limit),
                    currentPage: page
                }
                successWithMeta(res, result, meta, 'Get all product success')
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
            productModel.getDetail(id)
            .then((result) => {
                client.del('productKey')
                success(res, result, `Here is the product with id=${id} that you search`)
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
            upload.single('image')(req, res, (err) => {
                if(err){
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        failed(res, [], "Image size is too big! Please upload another one with size <5mb")
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const body = req.body
                    body.image = req.file.filename
                    productModel.insert(body)
                    .then((result) => {
                        client.del('productKey')
                        success(res, result, `Product is inserted`)
                    })
                    .catch((err) =>{
                        failed(res, [], err.message)
                    })
                }
            })      
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    update:(req, res) => {
        try {
            upload.single('image')(req, res, (err) => {
                if(err){
                    if(err.code === 'LIMIT_FILE_SIZE'){
                        failed(res, [], 'Image size is too big! Please upload another one with size <5mb')
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const id = req.params.id
                    const body = req.body
                    productModel.getDetail(id)
                    .then((result) => {
                        const oldImg = result[0].image
                        body.image = !req.file ? oldImg: req.file.filename
                        if (body.image !== oldImg) {
                            fs.unlink(`src/upload/${oldImg}`, (err) => {
                                if (err) {
                                    failed(res, [], err.message)
                                } else {
                                    productModel.update(body, id)
                                        .then((result) => { 
                                            client.del('productKey')
                                            success(res, result, 'Update success')
                                        })
                                        .catch((err) => {
                                            failed(res, [], err.message)
                                        })
                                }
                            })
                        } else {
                            productModel.update(body, id)
                                .then((result) => {
                                    client.del('productKey')
                                    success(res, result, 'Update success')
                                })
                                .catch((err) => {
                                    failed(res, [], err.message)
                                })
                        }
                    })
                }
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    delete: (req, res) => {
        try {
            const id = req.params.id
            productModel.getDetail(id)
            .then((result) => {
                const image = result[0].image
                fs.unlink(`src/upload/${image}`, (err) => {
                    if(err) {
                        failed(res, [], err.message)
                    } else {
                        productModel.delete(id)
                        .then((result) => {
                            client.del('productKey')
                            success(res, result, `Product with id ${id} is deleted!`)
                        })
                        .catch((err) => {
                            failed(res, [], err.message)
                        })
                    }
                })
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    }
}

module.exports = product