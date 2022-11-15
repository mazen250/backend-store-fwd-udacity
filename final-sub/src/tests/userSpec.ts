import app from '../server'
import client from '../database'
import { User, UserStore } from '../models/user'
import supertest from 'supertest'

const store = new UserStore()

const user: User = {
  email: 'test@gmail.com',
  first_name: 'test',
  last_name: 'test_last',
  password: '1234',
} as User

const user2: User = {
  email: 'test2@gmail.com',
  first_name: 'test2',
  last_name: 'test_last2',
  password: '1234',
} as User

describe('User Model', () => {
  it('should have add method', () => {
    expect(store.add).toBeDefined()
  })
  it('should have index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have login method', () => {
    expect(store.login).toBeDefined()
  })

  it('should have show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have delete method', () => {
    expect(store.delete).toBeDefined()
  })

  afterAll(async () => {
    const conn = await client.connect()
    await conn.query('DELETE FROM users')
    conn.release()
  })

  //test add method
  it('should add a user', async () => {
    const createdUser: User = await store.add(user)
    expect(createdUser.email).toEqual(user.email)
  })

  it('should add another user to database and make sure it is not empty', async () => {
    await store.add(user2)
    const result = await store.index()
    expect(result.length).toBeGreaterThanOrEqual(1)
  })

  //test login method
  it('should login a user', async () => {
    const loggedUser = await store.login(user.email, user.password)
    if (loggedUser) {
      // console.log("logged user = "+loggedUser.email);
      expect(loggedUser.email).toEqual(user.email)

      expect(loggedUser.email).toEqual(user.email)
    }
  })
})

describe('User Routes', () => {
  //test login endpoint
  let authToken = ''
  beforeAll(async () => {
    //add user to database
    await store.add(user)
    const response = await supertest(app)
      .post('/login')
      .send({ email: user.email, password: user.password })
    const { token } = response.body
    //console.log("response = "+token);
    authToken = token
  })

  afterAll(async () => {
    //delete all users from database
    const conn = await client.connect()
    await conn.query('DELETE FROM users')
    conn.release()
  })

  it('should login a user', async () => {
    const response = await supertest(app)
      .post('/login')
      .send({ email: user.email, password: user.password })
    const { token } = response.body
    //console.log("response = "+token);
    authToken = token
    expect(response.status).toEqual(200)
  })

  //test register endpoint
  it('should register a user', async () => {
    const response = await supertest(app).post('/register').send(user2)
    expect(response.status).toEqual(200)
  })

  //test delete endpoint
  it('should delete a user', async () => {
    const response = await supertest(app).delete('/deleteUser/1')
    expect(response.status).toEqual(401) //not authorized
  })

  //test index endpoint
  it('should get all users', async () => {
    const response = await supertest(app)
      .get('/users')
      .set('auth-token', authToken)
      .set('Content-Type', 'application/json')
    expect(response.status).toEqual(200)
  })
})
