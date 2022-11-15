import express, { NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const auth = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  const token = req.header('auth-token')
  if (!token) return res.status(401).send('Access Denied')
  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string)
    next()
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
}

export default auth
