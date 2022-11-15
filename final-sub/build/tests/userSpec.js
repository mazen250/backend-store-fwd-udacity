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
const database_1 = __importDefault(require("../database"));
const user_1 = require("../models/user");
const supertest_1 = __importDefault(require("supertest"));
const store = new user_1.UserStore();
const user = {
    email: 'test@gmail.com',
    first_name: 'test',
    last_name: 'test_last',
    password: '1234',
};
const user2 = {
    email: 'test2@gmail.com',
    first_name: 'test2',
    last_name: 'test_last2',
    password: '1234',
};
describe('User Model', () => {
    it('should have add method', () => {
        expect(store.add).toBeDefined();
    });
    it('should have index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have login method', () => {
        expect(store.login).toBeDefined();
    });
    it('should have show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have delete method', () => {
        expect(store.delete).toBeDefined();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield database_1.default.connect();
        yield conn.query('DELETE FROM users');
        conn.release();
    }));
    //test add method
    it('should add a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield store.add(user);
        expect(createdUser.email).toEqual(user.email);
    }));
    it('should add another user to database and make sure it is not empty', () => __awaiter(void 0, void 0, void 0, function* () {
        yield store.add(user2);
        const result = yield store.index();
        expect(result.length).toBeGreaterThanOrEqual(1);
    }));
    //test login method
    it('should login a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const loggedUser = yield store.login(user.email, user.password);
        if (loggedUser) {
            // console.log("logged user = "+loggedUser.email);
            expect(loggedUser.email).toEqual(user.email);
            expect(loggedUser.email).toEqual(user.email);
        }
    }));
});
describe('User Routes', () => {
    //test login endpoint
    let authToken = '';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //add user to database
        yield store.add(user);
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/login')
            .send({ email: user.email, password: user.password });
        const { token } = response.body;
        //console.log("response = "+token);
        authToken = token;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //delete all users from database
        const conn = yield database_1.default.connect();
        yield conn.query('DELETE FROM users');
        conn.release();
    }));
    it('should login a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/login')
            .send({ email: user.email, password: user.password });
        const { token } = response.body;
        //console.log("response = "+token);
        authToken = token;
        expect(response.status).toEqual(200);
    }));
    //test register endpoint
    it('should register a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/register').send(user2);
        expect(response.status).toEqual(200);
    }));
    //test delete endpoint
    it('should delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).delete('/deleteUser/1');
        expect(response.status).toEqual(401); //not authorized
    }));
    //test index endpoint
    it('should get all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/users')
            .set('auth-token', authToken)
            .set('Content-Type', 'application/json');
        expect(response.status).toEqual(200);
    }));
});
