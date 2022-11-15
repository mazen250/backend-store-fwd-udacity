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
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserStore {
    add(userr) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                //get a user with same email
                const sql1 = 'SELECT * FROM users WHERE email=($1)';
                const result1 = yield conn.query(sql1, [userr.email]);
                const exsiteduser = result1.rows[0];
                if (exsiteduser) {
                    throw new Error(`User with email ${userr.email} already exists`);
                }
                else {
                    const sql = 'INSERT INTO users (email,first_name,last_name, password) VALUES ($1, $2,$3,$4) RETURNING *';
                    const hash = bcrypt_1.default.hashSync(userr.password, 10);
                    if (userr.email &&
                        userr.first_name &&
                        userr.last_name &&
                        userr.password) {
                        const result = yield conn.query(sql, [
                            userr.email,
                            userr.first_name,
                            userr.last_name,
                            hash,
                        ]);
                        const user = result.rows[0];
                        conn.release();
                        return user;
                    }
                    else {
                        throw new Error(`fields are missing`);
                    }
                }
            }
            catch (err) {
                throw new Error(`Could not add new user ${userr.email}. Error: ${err}`);
            }
        });
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM users';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Could not get users. Error: ${err}`);
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM users WHERE email=($1)';
                const result = yield conn.query(sql, [email]);
                const user = result.rows[0];
                conn.release();
                if (user) {
                    if (bcrypt_1.default.compareSync(password, user.password)) {
                        return user;
                    }
                }
                return null;
            }
            catch (err) {
                throw new Error(`Could not login user ${email}. Error: ${err}`);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'SELECT * FROM users WHERE id=($1)';
                const conn = yield database_1.default.connect();
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Could not find user ${id}. Error: ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'DELETE FROM users WHERE id=($1)';
                const conn = yield database_1.default.connect();
                const result = yield conn.query(sql, [id]);
                const user = result.rows[0];
                conn.release();
                return user;
            }
            catch (err) {
                throw new Error(`Could not delete user ${id}. Error: ${err}`);
            }
        });
    }
}
exports.UserStore = UserStore;
