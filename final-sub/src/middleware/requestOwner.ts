import express from 'express'
import jwt from 'jsonwebtoken'

const requestOwner = async (req: express.Request, res: express.Response) => {
  let userInfo
  const token = req.header('auth-token')
  const decoded = jwt.verify(
    token as string,
    process.env.TOKEN_SECRET as string
  )
  if (decoded) {
    userInfo = decoded
    return userInfo
  } else {
    res.status(401)
    res.json('unauthorized')
  }
}

//helper function

export default requestOwner
