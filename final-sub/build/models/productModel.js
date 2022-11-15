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
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    addProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sqlQuery = 'INSERT INTO product (name,price,category,description,quantity) VALUES ($1,$2,$3,$4,$5) RETURNING *';
                if (product.name &&
                    product.price &&
                    product.category &&
                    product.description &&
                    product.quantity) {
                    const exec = yield conn.query(sqlQuery, [
                        product.name,
                        product.price,
                        product.category,
                        product.description,
                        product.quantity,
                    ]);
                    const newProduct = exec.rows[0];
                    conn.release();
                    return newProduct;
                }
                else {
                    throw new Error(`all fields are required`);
                }
            }
            catch (err) {
                throw new Error(`could not add product ${err}`);
            }
        });
    }
    showAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sqlQuery = 'SELECT * FROM product';
                const exec = yield conn.query(sqlQuery);
                conn.release();
                return exec.rows;
            }
            catch (err) {
                throw new Error(`could not get products ${err}`);
            }
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sqlQuery = 'SELECT * FROM product WHERE id=($1)';
                const exec = yield conn.query(sqlQuery, [id]);
                conn.release();
                return exec.rows[0];
            }
            catch (err) {
                throw new Error(`could not get product ${err}`);
            }
        });
    }
    getProductsByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const query = 'SELECT * FROM product WHERE category=($1)';
                const exec = yield conn.query(query, [category]);
                conn.release;
                return exec.rows;
            }
            catch (err) {
                throw new Error(`could not get products ${err}`);
            }
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sqlQuery = 'DELETE FROM product WHERE id=($1)';
                const exec = yield conn.query(sqlQuery, [id]);
                conn.release();
                return exec.rows[0];
            }
            catch (err) {
                return `could not delete product ${err}`;
            }
        });
    }
    updateProduct(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sqlQuery = 'UPDATE product SET name=($1),price=($2),category=($3),description=($4),quantity=($5) WHERE id=($6) RETURNING *';
                const exec = yield conn.query(sqlQuery, [
                    product.name,
                    product.price,
                    product.category,
                    product.description,
                    product.quantity,
                    id,
                ]);
                conn.release();
                if (exec) {
                    return 'deleted';
                }
                else {
                    return 'could not delete product';
                }
            }
            catch (err) {
                throw new Error(`could not update product ${err}`);
            }
        });
    }
    // add number of sales
    addNumberOfSales(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                //get current number of sales
                const sqlQuery = 'SELECT number_of_sales FROM product WHERE id=($1)';
                const exec = yield conn.query(sqlQuery, [id]);
                const currentNumberOfSales = exec.rows[0].number_of_sales;
                //add 1 to current number of sales
                const newNumberOfSales = currentNumberOfSales + 1;
                //update number of sales
                const sqlQuery2 = 'UPDATE product SET number_of_sales=($1) WHERE id=($2) RETURNING *';
                const ex = yield conn.query(sqlQuery2, [newNumberOfSales, id]);
                if (ex) {
                    conn.release();
                    return ex.rows[0];
                }
                else {
                    throw new Error(`could not add number of sales`);
                }
            }
            catch (err) {
                throw new Error(`could not update product ${err}`);
            }
        });
    }
    // update quantity
    updateQuantity(id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sqlQuery = 'UPDATE product SET quantity=($1) WHERE id=($2) RETURNING *';
                const exec = yield conn.query(sqlQuery, [quantity, id]);
                conn.release();
                return exec.rows[0];
            }
            catch (err) {
                throw new Error(`could not update product ${err}`);
            }
        });
    }
}
exports.ProductStore = ProductStore;
