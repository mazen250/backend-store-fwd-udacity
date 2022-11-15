"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productModel_1 = require("../models/productModel");
const authHandler_1 = __importDefault(require("./authHandler"));
const requestOwner_1 = __importDefault(require("../middleware/requestOwner"));
const store = new productModel_1.ProductStore();
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const product = {
            id: 0,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            created_at: new Date(),
            updated_at: new Date(),
            description: req.body.description,
            quantity: req.body.quantity,
        };
        if (product.name &&
            product.price &&
            product.category &&
            product.description &&
            product.quantity) {
            const products = yield store.addProduct(product);
            res.json({ products, requestOwnerInfo });
        }
        else {
            res.status(401);
            res.json('missing required fields');
        }
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
});
const showAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const products = yield store.showAllProducts();
        res.json({ products, requestOwnerInfo });
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
});
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const product = yield store.getProductById(req.params.id);
        res.json({ product, requestOwnerInfo });
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
});
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const products = yield store.getProductsByCategory(req.params.category);
        res.json({ products, requestOwnerInfo });
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const product = yield store.deleteProduct(req.params.id);
        res.json({ message: 'deleted', product, requestOwnerInfo });
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
});
const productRoutes = (app) => {
    //add new product
    app.post('/addProduct', authHandler_1.default, addProduct);
    //show all products
    app.get('/products', authHandler_1.default, showAllProducts);
    //show product by id
    app.get('/products/:id', authHandler_1.default, getProductById);
    //show products by category
    app.get('/products/category/:category', authHandler_1.default, getProductsByCategory);
    //delete product by id
    app.delete('/product/:id', authHandler_1.default, deleteProduct);
};
exports.default = productRoutes;
