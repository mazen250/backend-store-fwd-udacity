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
const orderModel_1 = require("../models/orderModel");
const authHandler_1 = __importDefault(require("./authHandler"));
const requestOwner_1 = __importDefault(require("../middleware/requestOwner"));
const productModel_1 = require("../models/productModel");
const store = new orderModel_1.ordersStore();
const productStore = new productModel_1.ProductStore();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const orders = yield store.index();
        res.json({ orders, requestOwnerInfo });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const user_id = req.body.user_id;
        const status = 'active';
        const order = {
            user_id,
            status,
        };
        const newOrder = yield store.create(order);
        res.json({ newOrder, requestOwnerInfo });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const addProductToOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check if product exists and quantity is available
        const product = yield productStore.getProductById(req.body.product_id);
        if (product) {
            console.log(product);
            if (product.quantity >= req.body.quantity) {
                const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
                const order_id = req.body.order_id;
                const product_id = req.body.product_id;
                const quantity = req.body.quantity;
                const newOrderProduct = yield store.addProductToOrder(order_id, product_id, quantity);
                yield productStore.addNumberOfSales(product_id);
                yield productStore.updateQuantity(product_id, product.quantity - quantity);
                res.json({ newOrderProduct, requestOwnerInfo });
            }
            else {
                res.status(400);
                res.json('quantity not available');
            }
        }
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const showOrderProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const order_id = req.body.order_id;
        const orderProducts = yield store.showOrderProducts(order_id);
        res.json({ orderProducts, requestOwnerInfo });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const showUserOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const user_id = req.body.user_id;
        const userOrders = yield store.showUserOrder(user_id);
        res.json({ userOrders, requestOwnerInfo });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
//change status of order by id
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const id = req.body.id;
        const status = req.body.status;
        const updatedOrder = yield store.changeStatus(id, status);
        res.json({ updatedOrder, requestOwnerInfo });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const order_routes = (app) => {
    app.get('/showOrders', authHandler_1.default, index);
    app.post('/createOrder', authHandler_1.default, create);
    app.post('/addProductToOrder', authHandler_1.default, addProductToOrder);
    app.get('/showOrderProducts', authHandler_1.default, showOrderProducts);
    app.get('/showUserOrder', authHandler_1.default, showUserOrder);
    app.put('/changeStatus', authHandler_1.default, changeStatus);
};
exports.default = order_routes;
