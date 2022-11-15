"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_DB_TEST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT, NODE_ENV, } = process.env;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client;
console.log(NODE_ENV);
if (NODE_ENV == 'test') {
    console.log('now the env is test');
    client = new pg_1.Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB_TEST,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: parseInt(POSTGRES_PORT),
    });
}
else {
    console.log('now the env is dev');
    client = new pg_1.Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: parseInt(POSTGRES_PORT),
    });
}
exports.default = client;
