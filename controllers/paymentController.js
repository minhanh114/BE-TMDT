const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({ // create content payment
        amount: req.body.amount,
        currency: 'vnd',

        metadata: { integration_check: 'accept_a_payment' } // Các đối tượng Stripe có thể cập nhật — bao gồm Tài khoản , Khoản phí , Khách hàng , Nội dung thanh toán , Tiền hoàn lại , Đăng ký và Chuyển khoản —có thông số. 
    });

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret // Json API client_secret
    })

})

exports.processPaymentOnDelivery = catchAsyncErrors(async (req, res, next) => {
    // Thực hiện xử lý thanh toán khi nhận hàng ở đây

    // Điều chỉnh thông tin thanh toán và tạo đối tượng thanh toán
    const paymentInfo = {
        amount: req.body.amount,
        currency: 'vnd',
        paymentMethod: 'cash-on-delivery', // Phương thức thanh toán khi nhận hàng
        orderStatus: 'pending' // Trạng thái chờ thanh toán khi nhận hàng
    };

    console.log(paymentInfo)
    // Lưu thông tin thanh toán vào cơ sở dữ liệu hoặc thực hiện các xử lý khác tùy thuộc vào ứng dụng của bạn

    // Gửi phản hồi thành công
    res.status(200).json({
        success: true,
        message: 'Đặt hàng thành công. Vui lòng thanh toán khi nhận hàng.'
    });
});


// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })

})