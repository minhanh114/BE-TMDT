const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Category = require("../models/category");
const APIFeatures = require("../utils/apiFeatures");

const categoryController = {
    createCategory: catchAsyncErrors(async (req, res, next) => {

        const { name, description } = req.body;

        if (!name) {
            return next(new ErrorHandler('Tên nhà sản xuất không được để trống', 400));
        }

        if (!description) {
            return next(new ErrorHandler('Mô tả không được để trống', 400));
        }

        const category = await Category.create(
            {
                name, description
            }

        );

        res.status(201).json({
            success: true,
            category
        })
    }),

    // Get all products   =>   /api/v1/products?keyword=apple
    getCategorys: catchAsyncErrors(async (req, res, next) => {

        const resPerPage = 12;
        const categoryCount = await Category.countDocuments();

        const apiFeatures = new APIFeatures(Category.find(), req.query)
            .search()
            .filter()

        let category = await apiFeatures.query;
        let filteredCategoryCount = category.length;

        apiFeatures.pagination(resPerPage)
        category = await apiFeatures.query;

        res.status(200).json({
            success: true,
            categoryCount,
            resPerPage,
            filteredCategoryCount,
            category
        })
    }),
    getCategoryById: catchAsyncErrors(async (req, res, next) => {
        const category = await Category.findById(req.params.id);

        if (!category) {
            throw new ErrorHandler("Không tìm thấy thể loại", 404);
        }
        res.status(200).json({
            success: true,
            category
        })
    }),
    updateCategory: catchAsyncErrors(async (req, res, next) => {
        const checkCategory = await Category.findById(req.params.id);

        if (!checkCategory) {
            throw new ErrorHandler("Không tìm thấy thể loại", 404);
        }

        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        
        res.status(200).json({
            success: true,
            category
        })
    }),

    deleteCategory: catchAsyncErrors(async (req, res, next) => {
        const category = await Category.findById(req.params.id);

        if (!category) {
            throw new ErrorHandler("Không tìm thấy thể loại", 404)
        }
        await Category.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            message: 'Xóa thể loại sản phẩm thành công'
        })
    })
}

module.exports = categoryController