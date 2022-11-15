import app from '../server'
import supertest from 'supertest'
import client from '../database'
import { orders, ordersStore } from '../models/orderModel'
import { Product, ProductStore } from '../models/productModel'
import { User, UserStore } from '../models/user'
const store = new ordersStore()
const productStore = new ProductStore()
const userStore = new UserStore()

// const order: orders = {

//     user_id: 10,
//     status: "active",
// } as orders;

const product3: Product = {
  name: 'test3',
  price: 10,
  category: 'test3',
  created_at: new Date(),
  updated_at: new Date(),
  description: 'test3',
  quantity: 10,
} as Product

const product4: Product = {
  name: 'test4',
  price: 10,
  category: 'test4',
  created_at: new Date(),
  updated_at: new Date(),
  description: 'test4',
  quantity: 10,
} as Product

const user: User = {
  email: 'productTest2@gmail.com',
  first_name: 'productTest',
  last_name: 'productTest_last',
  password: '1234',
} as User

const user2: User = {
  email: 'orderTest2@gmail.com',
  first_name: 'orderTest',
  last_name: 'orderTest_last',
  password: '1234',
} as User

const user3: User = {
  email: 'productTest3@gmail.com',
  first_name: 'productTest',
  last_name: 'productTest_last',
  password: '1234',
} as User

const user4: User = {
  email: 'orderTest4@gmail.com',
  first_name: 'orderTest',
  last_name: 'orderTest_last',
  password: '1234',
} as User

//test order model
describe('Order Model', () => {
  beforeAll(async () => {
    //add two products to test on them
    await productStore.addProduct(product3)
    await productStore.addProduct(product4)


    await userStore.add(user)
    await userStore.add(user2)
  })

  afterAll(async () => {
    const conn = await client.connect()
    await conn.query('DELETE FROM order_product')
    await conn.query('DELETE FROM orders')
    await conn.query('DELETE FROM product')
    await conn.query('DELETE FROM users')
    conn.release()
  })

  it('should have an addOrder method', () => {
    expect(store.create).toBeDefined()
  })
  it('should have a showAllOrders method', () => {
    expect(store.index).toBeDefined()
  })
  it('should have a add product to order method', () => {
    expect(store.addProductToOrder).toBeDefined()
  })
  it('should have a show product of order method', () => {
    expect(store.showOrderProducts).toBeDefined()
  })
  it('should have a show user order method', () => {
    expect(store.showUserOrder).toBeDefined()
  })
  it('should have change state order ', () => {
    expect(store.changeStatus).toBeDefined()
  })
  it('should have delete method', () => {
    expect(store.delete).toBeDefined()
  })
  it('shoud have show order by id method', () => {
    expect(store.show).toBeDefined()
  })
})

//test order routes

describe('Order Routes', () => {
  let authToken = ''
  beforeAll(async () => {
    //add two products to test on them
    await productStore.addProduct(product3)
    await productStore.addProduct(product4)

    await userStore.add(user3)
    await userStore.add(user4)
    //login user1
    const response = await supertest(app).post('/login').send({
      email: user3.email,
      password: user3.password,
    })
    const { token } = response.body
    authToken = token

    //if user not created create it
    const testUser = await userStore.add({
      email: 'sdsd@gmail.com',
      first_name: 'sdsd',
      last_name: 'sdsd',
      password: '1234',
    } as User)
    //console.log("user1 created with id "+testUser.id);

    //create order for created user
    const createdOrder = await store.create({
      user_id: testUser.id,
      status: 'active',
    } as orders)
    console.log(
      'created order with user id ' +
        createdOrder.user_id +
        ' and order id ' +
        createdOrder.id
    )
    //console.log(createdOrder);
  })

  afterAll(async () => {
    const conn = await client.connect()
    await conn.query('DELETE FROM order_product')
    await conn.query('DELETE FROM orders')
    await conn.query('DELETE FROM product')
    await conn.query('DELETE FROM users')
    conn.release()
  })

  it('should have a create order route', async () => {
    //get all users from database
    const allUsers = await userStore.index()
    //console.log("all user = "+allUsers[0].id);
    const userId = allUsers[0].id
    //create order for the first user in database
    const response = await supertest(app)
      .post('/createOrder')
      .set('auth-token', authToken)
      .send({
        user_id: userId,
        status: 'active',
      })
    expect(response.status).toBe(200)
  })

  it('should have a show all orders route', async () => {
    const response = await supertest(app)
      .get('/showOrders')
      .set('auth-token', authToken)
    const { orders } = response.body
    expect(orders.length).toBeGreaterThanOrEqual(1)
  })

  //show order products
  it('should have a show order products route', async () => {
    //get all orders form database
    const allOrders = await store.index()
    //first order
    //console.log('all orders length = ' + allOrders.length)

    const orderId = allOrders[0].id
    //console.log('order id = ' + orderId)

    // add product to order to make sure it has product to show
    await store.addProductToOrder(orderId, product4.id, 1)

    const response = await supertest(app)
      .get('/showOrderProducts')
      .set('auth-token', authToken)
      .send({
        order_id: orderId,
      })
    const { orderProducts } = response.body
    //console.log('order products = ' + response.body.orderProducts)
    expect(orderProducts.length).toBeGreaterThanOrEqual(1)
  })

  //show user order
  it('should have a show user order route', async () => {
    //get all users from database
    const allUsers = await userStore.index()
    //first user
    const userId = allUsers[0].id
    //create order for the first user in database
    await store.create({
      user_id: userId,
      status: 'active',
    } as orders)

    const response = await supertest(app)
      .get('/showUserOrder')
      .set('auth-token', authToken)
      .send({
        user_id: userId,
      })
    const { userOrders } = response.body
    expect(userOrders.length).toBeGreaterThanOrEqual(1)
  })

  //change status
  it('should have a change status route', async () => {
    //get all orders from database
    const allOrders = await store.index()
    //first order
    const orderId = allOrders[0].id
    const response = await supertest(app)
      .put('/changeStatus')
      .set('auth-token', authToken)
      .send({
        id: orderId,
        status: 'completed',
      })
    expect(response.status).toBe(200)
  })
})
