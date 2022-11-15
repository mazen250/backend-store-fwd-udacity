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
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authHandler_1 = __importDefault(require("./authHandler"));
const requestOwner_1 = __importDefault(require("../middleware/requestOwner"));
const store = new user_1.UserStore();
//register function
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        id: 0,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
    };
    const users = yield store.add(user);
    res.json(users);
});
//retrive all users for testing
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
    const users = yield store.index();
    res.json({ users, requestOwnerInfo });
});
//login function
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield store.login(req.body.email, req.body.password);
    if (user) {
        //assign a token with payload of id and email only
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET, {
            expiresIn: 86400, // expires in 24 hours
        });
        res.header('auth-token', token).send({ username: user.email, token });
    }
    else {
        res.status(401);
        res.json('wrong email or password');
    }
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
        const userId = parseInt(req.params.id);
        const user = yield store.show(userId);
        res.status(200).json({ email: user.email, id: user.id, requestOwnerInfo });
    }
    catch (err) {
        res.status(401).json(err);
    }
});
const deletee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestOwnerInfo = yield (0, requestOwner_1.default)(req, res);
    const user = yield store.delete(req.params.id);
    res.json({ email: user.email, id: user.id, requestOwnerInfo });
});
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('test');
});
const userRoutes = (app) => {
    app.get('/users', authHandler_1.default, index);
    app.post('/register', register);
    app.post('/login', login);
    app.get('/user/:id', authHandler_1.default, show);
    app.delete('/deleteUser/:id', authHandler_1.default, deletee);
    app.get('/test', authHandler_1.default, test);
};
exports.default = userRoutes;
