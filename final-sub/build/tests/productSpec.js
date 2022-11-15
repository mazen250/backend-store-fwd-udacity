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
const productModel_1 = require("../models/productModel");
const database_1 = __importDefault(require("../database"));
const user_1 = require("../models/user");
const store = new productModel_1.ProductStore();
const userStore = new user_1.UserStore();
const user = {
    email: 'productTest24@gmail.com',
    first_name: 'productTest',
    last_name: 'productTest_last',
    password: '1234',
};
const product = {
    name: 'test',
    price: 10,
    category: 'test',
    created_at: new Date(),
    updated_at: new Date(),
    description: 'test',
    quantity: 10,
};
const product2 = {
    name: 'test',
    price: 10,
    category: 'test',
    created_at: new Date(),
    updated_at: new Date(),
    description: 'test',
    quantity: 10,
};
describe('Product Model', () => {
    it('should have an addProduct method', () => {
        expect(store.addProduct).toBeDefined();
    });
    it('should have a showAllProducts method', () => {
        expect(store.showAllProducts).toBeDefined();
    });
    it('should have a getProductById method', () => {
        expect(store.getProductById).toBeDefined();
    });
    it('should have a getProductsByCategory method', () => {
        expect(store.getProductsByCategory).toBeDefined();
    });
    it('should have a deleteProductById method', () => {
        expect(store.deleteProduct).toBeDefined();
    });
    it('should have a updateProductById method', () => {
        expect(store.updateProduct).toBeDefined();
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //add product to database
        yield store.addProduct(product);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield database_1.default.connect();
        yield conn.query('DELETE FROM product');
        conn.release();
    }));
    it('should add a product', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.addProduct(product2);
        expect(result.name).toEqual(product.name);
    }));
    it('should show all products', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.showAllProducts();
        expect(result.length).toBeGreaterThanOrEqual(1);
    }));
});
//test endpoints
describe('Product Endpoints', () => {
    let authToken = '';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userStore.add(user);
        //add product to database
        yield store.addProduct(product);
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/login')
            .send({ email: user.email, password: user.password });
        const { token } = response.body;
        //console.log("response = "+token);
        authToken = token;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield database_1.default.connect();
        yield conn.query('DELETE FROM product');
        yield conn.query('DELETE FROM users');
        conn.release();
    }));
    //test add product endpoint
    it('should add a product', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(server_1.default)
            .post('/addProduct')
            .set('auth-token', authToken)
            .send(product2);
        expect(result.status).toEqual(200);
    }));
    //test show all products endpoint
    it('should show all products', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(server_1.default)
            .get('/products')
            .set('auth-token', authToken);
        expect(result.status).toEqual(200);
    }));
    //test get product by id endpoint
    it('should get product by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(server_1.default)
            .get('/products/1')
            .set('auth-token', authToken);
        expect(result.status).toEqual(200);
    }));
    //test get product by category endpoint
    it('should get product by category', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(server_1.default)
            .get('/products/category/test')
            .set('auth-token', authToken);
        expect(result.status).toEqual(200);
    }));
});
