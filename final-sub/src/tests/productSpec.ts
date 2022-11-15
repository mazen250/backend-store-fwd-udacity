import app from '../server'
import supertest from 'supertest'
import { Product, ProductStore } from '../models/productModel'
import client from '../database'
import { User, UserStore } from '../models/user'
const store = new ProductStore()
const userStore = new UserStore()

const user: User = {
  email: 'productTest24@gmail.com',
  first_name: 'productTest',
  last_name: 'productTest_last',
  password: '1234',
} as User

const product: Product = {
  name: 'test',
  price: 10,
  category: 'test',
  created_at: new Date(),
  updated_at: new Date(),
  description: 'test',
  quantity: 10,
} as Product
const product2: Product = {
  name: 'test',
  price: 10,
  category: 'test',
  created_at: new Date(),
  updated_at: new Date(),
  description: 'test',
  quantity: 10,
} as Product

describe('Product Model', () => {
  it('should have an addProduct method', () => {
    expect(store.addProduct).toBeDefined()
  })
  it('should have a showAllProducts method', () => {
    expect(store.showAllProducts).toBeDefined()
  })
  it('should have a getProductById method', () => {
    expect(store.getProductById).toBeDefined()
  })
  it('should have a getProductsByCategory method', () => {
    expect(store.getProductsByCategory).toBeDefined()
  })
  it('should have a deleteProductById method', () => {
    expect(store.deleteProduct).toBeDefined()
  })
  it('should have a updateProductById method', () => {
    expect(store.updateProduct).toBeDefined()
  })

  beforeAll(async () => {
    //add product to database
    await store.addProduct(product)
  })

  afterAll(async () => {
    const conn = await client.connect()
    await conn.query('DELETE FROM product')
    conn.release()
  })

  it('should add a product', async () => {
    const result: Product = await store.addProduct(product2)
    expect(result.name).toEqual(product.name)
  })

  it('should show all products', async () => {
    const result: Product[] = await store.showAllProducts()
    expect(result.length).toBeGreaterThanOrEqual(1)
  })
})

//test endpoints
describe('Product Endpoints', () => {
  let authToken = ''
  beforeAll(async () => {
    await userStore.add(user)
    //add product to database
    await store.addProduct(product)
    const response = await supertest(app)
      .post('/login')
      .send({ email: user.email, password: user.password })
    const { token } = response.body
    //console.log("response = "+token);
    authToken = token
  })

  afterAll(async () => {
    const conn = await client.connect()
    await conn.query('DELETE FROM product')
    await conn.query('DELETE FROM users')
    conn.release()
  })
  //test add product endpoint
  it('should add a product', async () => {
    const result = await supertest(app)
      .post('/addProduct')
      .set('auth-token', authToken)
      .send(product2)
    expect(result.status).toEqual(200)
  })
  //test show all products endpoint
  it('should show all products', async () => {
    const result = await supertest(app)
      .get('/products')
      .set('auth-token', authToken)
    expect(result.status).toEqual(200)
  })

  //test get product by id endpoint
  it('should get product by id', async () => {
    const result = await supertest(app)
      .get('/products/1')
      .set('auth-token', authToken)
    expect(result.status).toEqual(200)
  })
  //test get product by category endpoint
  it('should get product by category', async () => {
    const result = await supertest(app)
      .get('/products/category/test')
      .set('auth-token', authToken)
    expect(result.status).toEqual(200)
  })
})
