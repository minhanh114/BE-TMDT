const express = require('express');

const router = express.Router();

const {
    createCategory,
    getCategorys,
    updateCategory,
    deleteCategory,
    getCategoryById
} = require('../controllers/categoryController')

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/admin/category/new').post(isAuthenticatedUser , createCategory);
router.route('/admin/category').get(getCategorys);
router.route('/admin/category/:id').get(getCategoryById);

router.route('/admin/category/:id')
        .put(isAuthenticatedUser, updateCategory)
        .delete(isAuthenticatedUser, deleteCategory);

module.exports = router;