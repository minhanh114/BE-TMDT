const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const OrderDetail = require("../models/order-detail")

exports.getOrderDetail = catchAsyncErrors(async (req, res, next) => {
    const order = await OrderDetail.find({
        orderId: req.params.id
    }
    )
    res.status(200).json({
        success: true,
        order
    })
})