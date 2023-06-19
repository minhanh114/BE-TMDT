const express = require('express');
const cors = require('cors');

const app = express();

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv');
const path = require('path')
const morgan = require('morgan')

const errorMiddleware = require('./middlewares/errors')

// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: '.env' })
dotenv.config({ path: '.env' })

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :response-time ms :date[iso]'))
app.use(cookieParser())
app.use(fileUpload());
app.use(cors());



// Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');
const category = require('./routes/category')

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1', order)
app.use('/api/v1', category)


if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app