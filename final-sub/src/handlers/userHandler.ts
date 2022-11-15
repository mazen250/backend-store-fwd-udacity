import express from 'express'
import { UserStore, User } from '../models/user'
import jwt from 'jsonwebtoken'
import auth from './authHandler'
import requestOwner from '../middleware/requestOwner'
const store = new UserStore()

//register function
const register = async (req: express.Request, res: express.Response) => {
  const user: User = {
    id: 0,
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
  }
  const users = await store.add(user)
  res.json(users)
}

//retrive all users for testing
const index = async (req: express.Request, res: express.Response) => {
  const requestOwnerInfo = await requestOwner(req, res)
  const users = await store.index()
  res.json({ users, requestOwnerInfo })
}

//login function
const login = async (req: express.Request, res: express.Response) => {
  const user = await store.login(req.body.email, req.body.password)
  if (user) {
    //assign a token with payload of id and email only
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    )
    res.header('auth-token', token).send({ username: user.email, token })
  } else {
    res.status(401)
    res.json('wrong email or password')
  }
}

const show = async (req: express.Request, res: express.Response) => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const userId: number = parseInt(req.params.id)
    const user = await store.show(userId)
    res.status(200).json({ email: user.email, id: user.id, requestOwnerInfo })
  } catch (err) {
    res.status(401).json(err)
  }
}

const deletee = async (req: express.Request, res: express.Response) => {
  const requestOwnerInfo = await requestOwner(req, res)
  const user = await store.delete(req.params.id)
  res.json({ email: user.email, id: user.id, requestOwnerInfo })
}

const test = async (req: express.Request, res: express.Response) => {
  res.send('test')
}

const userRoutes = (app: express.Application) => {
  app.get('/users', auth, index)
  app.post('/register', register)
  app.post('/login', login)
  app.get('/user/:id', auth, show)
  app.delete('/deleteUser/:id', auth, deletee)
  app.get('/test', auth, test)
}

export default userRoutes
