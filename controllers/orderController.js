const Order = require('../models/order');
const Product = require('../models/product');
const OrderDetail = require('../models/order-detail')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const orderDetail = require('../models/order-detail');

// Create a new order   =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await Order.create({
        numberOfItems: orderItems.length,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    for(const product of orderItems){
        const oderDetails = new OrderDetail({
            orderId: order._id,
            product: product.product,
            name: product.name,
            price: product.price,
            discount: product.discount,
            image: product.image,
            quantity: product.quantity
        });

        await oderDetails.save();

    }

    res.status(200).json({
        success: true,
        order
    })
})


// Get single order   =>   /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('Không tìm thấy đơn hàng nào có ID này', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        orders
    })
})


// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (order.orderStatus === 'Đã giao hàng') {
        return next(new ErrorHandler('Bạn đã giao đơn đặt hàng này', 400))
    }

    const orderDetail =  await OrderDetail.find({orderId: order._id});
    
    orderDetail.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status,
        order.deliveredAt = Date.now()

    await order.save()

    if (order.orderStatus === "Đã giao hàng") {
        order.paymentInfo.status = "succeeded"
    }  // sửa đoạn này
    await order.save()

    res.status(200).json({
        success: true,
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false })
}



// GET MONTHLY INCOME
exports.getMonthlyIncome = async (req, res, next) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        let income = await Order.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: { // $project : chỉ định các field mong muốn truy vấn.
                    month: { $month: "$createdAt" },
                    sales: "$totalPrice",
                },
            },
            {
                $group: { // $group: nhóm các document theo điều kiện nhất định
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
}