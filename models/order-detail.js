const mongoose = require("mongoose");

const orderDetailSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Order"
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }

})

module.exports = mongoose.model('OrderDetail', orderDetailSchema)