const express = require('express');
const bodyParser = require('body-parser');
const productRouter = require('./src/routes/product')
const historyRouter = require('./src/routes/history')
const categoryRouter = require('./src/routes/category')
const usersRouter = require('./src/routes/users')
const path = require('path')
const ejs = require('ejs')

const cors = require('cors')


const { PORT } = require('./src/helpers/env')

const app = express();

app.set('views', path.join(__dirname,'src/views'))
app.set('view engine', 'ejs')
app.use(express.static('src/views'))


app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('src/upload'))
app.use('/api/v1/product', productRouter)
app.use('/api/v1/history', historyRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/users', usersRouter)


app.listen(PORT, () => {
    console.log(`
                                Server is running on localhost port ${PORT}!
                                        Database connected!`)
});
