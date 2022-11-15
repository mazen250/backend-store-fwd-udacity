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
const server_1 = __importDefault(require("../server"));
const supertest_1 = __importDefault(require("supertest"));
const database_1 = __importDefault(require("../database"));
const orderModel_1 = require("../models/orderModel");
const productModel_1 = require("../models/productModel");
const user_1 = require("../models/user");
const store = new orderModel_1.ordersStore();
const productStore = new productModel_1.ProductStore();
const userStore = new user_1.UserStore();
// const order: orders = {
//     user_id: 10,
//     status: "active",
// } as orders;
const product3 = {
    name: 'test3',
    price: 10,
    category: 'test3',
    created_at: new Date(),
    updated_at: new Date(),
    description: 'test3',
    quantity: 10,
};
const product4 = {
    name: 'test4',
    price: 10,
    category: 'test4',
    created_at: new Date(),
    updated_at: new Date(),
    description: 'test4',
    quantity: 10,
};
const user = {
    email: 'productTest2@gmail.com',
    first_name: 'productTest',
    last_name: 'productTest_last',
    password: '1234',
};
const user2 = {
    email: 'orderTest2@gmail.com',
    first_name: 'orderTest',
    last_name: 'orderTest_last',
    password: '1234',
};
const user3 = {
    email: 'productTest3@gmail.com',
    first_name: 'productTest',
    last_name: 'productTest_last',
    password: '1234',
};
const user4 = {
    email: 'orderTest4@gmail.com',
    first_name: 'orderTest',
    last_name: 'orderTest_last',
    password: '1234',
};
//test order model
describe('Order Model', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //add two products to test on them
        yield productStore.addProduct(product3);
        yield productStore.addProduct(product4);
        yield userStore.add(user);
        yield userStore.add(user2);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield database_1.default.connect();
        yield conn.query('DELETE FROM order_product');
        yield conn.query('DELETE FROM orders');
        yield conn.query('DELETE FROM product');
        yield conn.query('DELETE FROM users');
        conn.release();
    }));
    it('should have an addOrder method', () => {
        expect(store.create).toBeDefined();
    });
    it('should have a showAllOrders method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a add product to order method', () => {
        expect(store.addProductToOrder).toBeDefined();
    });
    it('should have a show product of order method', () => {
        expect(store.showOrderProducts).toBeDefined();
    });
    it('should have a show user order method', () => {
        expect(store.showUserOrder).toBeDefined();
    });
    it('should have change state order ', () => {
        expect(store.changeStatus).toBeDefined();
    });
    it('should have delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('shoud have show order by id method', () => {
        expect(store.show).toBeDefined();
    });
});
//test order routes
describe('Order Routes', () => {
    let authToken = '';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //add two products to test on them
        yield productStore.addProduct(product3);
        yield productStore.addProduct(product4);
        yield userStore.add(user3);
        yield userStore.add(user4);
        //login user1
        const response = yield (0, supertest_1.default)(server_1.default).post('/login').send({
            email: user3.email,
            password: user3.password,
        });
        const { token } = response.body;
        authToken = token;
        //if user not created create it
        const testUser = yield userStore.add({
            email: 'sdsd@gmail.com',
            first_name: 'sdsd',
            last_name: 'sdsd',
            password: '1234',
        });
        //console.log("user1 created with id "+testUser.id);
        //create order for created user
        const createdOrder = yield store.create({
            user_id: testUser.id,
            status: 'active',
        });
        console.log('created order with user id ' +
            createdOrder.user_id +
            ' and order id ' +
            createdOrder.id);
        //console.log(createdOrder);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield database_1.default.connect();
        yield conn.query('DELETE FROM order_product');
        yield conn.query('DELETE FROM orders');
        yield conn.query('DELETE FROM product');
        yield conn.query('DELETE FROM users');
        conn.release();
    }));
    it('should have a create order route', () => __awaiter(void 0, void 0, void 0, function* () {
        //get all users from database
        const allUsers = yield userStore.index();
        //console.log("all user = "+allUsers[0].id);
        const userId = allUsers[0].id;
        //create order for the first user in database
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/createOrder')
            .set('auth-token', authToken)
            .send({
            user_id: userId,
            status: 'active',
        });
        expect(response.status).toBe(200);
    }));
    it('should have a show all orders route', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/showOrders')
            .set('auth-token', authToken);
        const { orders } = response.body;
        expect(orders.length).toBeGreaterThanOrEqual(1);
    }));
    // it('should have a add product to order route', async () => {
    //   //get all orders form database
    //   const allOrders = await store.index()
    //   console.log('all orders = ' + allOrders[0].id)
    //   //first order
    //   const orderId = allOrders[0].id
    //   const response = await supertest(app)
    //     .post('/addProductToOrder')
    //     .set('auth-token', authToken)
    //     .send({
    //       order_id: orderId,
    //       product_id: product3.id,
    //       quantity: 1,
    //     })
    //   //console.log(response.body);
    //   expect(response.status).toBe(200)
    // })
    //show order products
    it('should have a show order products route', () => __awaiter(void 0, void 0, void 0, function* () {
        //get all orders form database
        const allOrders = yield store.index();
        //first order
        //console.log('all orders length = ' + allOrders.length)
        const orderId = allOrders[0].id;
        //console.log('order id = ' + orderId)
        // add product to order to make sure it has product to show
        yield store.addProductToOrder(orderId, product4.id, 1);
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/showOrderProducts')
            .set('auth-token', authToken)
            .send({
            order_id: orderId,
        });
        const { orderProducts } = response.body;
        //console.log('order products = ' + response.body.orderProducts)
        expect(orderProducts.length).toBeGreaterThanOrEqual(1);
    }));
    //show user order
    it('should have a show user order route', () => __awaiter(void 0, void 0, void 0, function* () {
        //get all users from database
        const allUsers = yield userStore.index();
        //first user
        const userId = allUsers[0].id;
        //create order for the first user in database
        yield store.create({
            user_id: userId,
            status: 'active',
        });
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/showUserOrder')
            .set('auth-token', authToken)
            .send({
            user_id: userId,
        });
        const { userOrders } = response.body;
        expect(userOrders.length).toBeGreaterThanOrEqual(1);
    }));
    //change status
    it('should have a change status route', () => __awaiter(void 0, void 0, void 0, function* () {
        //get all orders from database
        const allOrders = yield store.index();
        //first order
        const orderId = allOrders[0].id;
        const response = yield (0, supertest_1.default)(server_1.default)
            .put('/changeStatus')
            .set('auth-token', authToken)
            .send({
            id: orderId,
            status: 'completed',
        });
        expect(response.status).toBe(200);
    }));
});
