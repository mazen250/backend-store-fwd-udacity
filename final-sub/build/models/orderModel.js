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
exports.ordersStore = void 0;
const database_1 = __importDefault(require("../database"));
class ordersStore {
    //add new order , check first that user exist
    create(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                //make sure user exist
                console.log(order.user_id);
                const sql = 'select * from users where id = $1';
                const result = yield conn.query(sql, [order.user_id]);
                if (result.rows.length === 0) {
                    throw new Error('user does not exist');
                }
                else {
                    const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
                    const result = yield conn.query(sql, [order.status, order.user_id]);
                    conn.release();
                    return result.rows[0];
                }
            }
            catch (err) {
                throw new Error(`could not add new order. Error: ${err}`);
            }
        });
    }
    //show all orders
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM orders';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`could not get orders. Error: ${err}`);
            }
        });
    }
    //add product to order
    addProductToOrder(order_id, product_id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'select * from orders where id = $1';
                const result = yield conn.query(sql, [order_id]);
                if (result.rows.length === 0) {
                    throw new Error('order does not exist');
                }
                else {
                    const sql = 'INSERT INTO order_product (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
                    const result = yield conn.query(sql, [order_id, product_id, quantity]);
                    conn.release();
                    return result.rows[0];
                }
            }
            catch (err) {
                throw new Error(`could not add product to order. Error: ${err}`);
            }
        });
    }
    //show all products in an order
    showOrderProducts(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM order_product where order_id = $1';
                const result = yield conn.query(sql, [order_id]);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`could not find order ${order_id}. Error: ${err}`);
            }
        });
    }
    //get orders of the a user by user id
    showUserOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM orders WHERE user_id=($1)';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`could not find order ${id}. Error: ${err}`);
            }
        });
    }
    //change order status to complete
    changeStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'UPDATE orders SET status=($1) WHERE id=($2)';
                const result = yield conn.query(sql, [status, id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`could not change status of order ${id}. Error: ${err}`);
            }
        });
    }
    //delete order by id
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'DELETE FROM orders WHERE id=($1)';
                const result = yield conn.query(sql, [id]);
                conn.release();
                if (result) {
                    return 'deleted';
                }
                else {
                    return 'not deleted';
                }
            }
            catch (err) {
                return `could not delete order. ${err}`;
            }
        });
    }
    // show order by id
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'SELECT * FROM orders WHERE id=($1)';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`could not find order ${id}. Error: ${err}`);
            }
        });
    }
}
exports.ordersStore = ordersStore;
