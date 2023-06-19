const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên thể loại không được để trống'],
        trim: true,
        maxLength: [100, 'Tên thể loại không được dài quá 100 ký tự']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [200, 'Mô thể loại không được dài quá 200 ký tự']
    }
    ,
    status: {
        type: Boolean,
        trim: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Category', categorySchema);