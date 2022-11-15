import client from '../database'
import bcrypt from 'bcrypt'
export type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  password: string
}

export class UserStore {
  async add(userr: User): Promise<User> {
    try {
      const conn = await client.connect()
      //get a user with same email
      const sql1 = 'SELECT * FROM users WHERE email=($1)'
      const result1 = await conn.query(sql1, [userr.email])
      const exsiteduser = result1.rows[0]
      if (exsiteduser) {
        throw new Error(`User with email ${userr.email} already exists`)
      } else {
        const sql =
          'INSERT INTO users (email,first_name,last_name, password) VALUES ($1, $2,$3,$4) RETURNING *'
        const hash = bcrypt.hashSync(userr.password, 10)
        if (
          userr.email &&
          userr.first_name &&
          userr.last_name &&
          userr.password
        ) {
          const result = await conn.query(sql, [
            userr.email,
            userr.first_name,
            userr.last_name,
            hash,
          ])
          const user = result.rows[0]
          conn.release()
          return user
        } else {
          throw new Error(`fields are missing`)
        }
      }
    } catch (err) {
      throw new Error(`Could not add new user ${userr.email}. Error: ${err}`)
    }
  }

  async index(): Promise<User[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`)
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users WHERE email=($1)'
      const result = await conn.query(sql, [email])
      const user = result.rows[0]
      conn.release()
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          return user
        }
      }
      return null
    } catch (err) {
      throw new Error(`Could not login user ${email}. Error: ${err}`)
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const conn = await client.connect()
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`)
    }
  }
  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)'
      const conn = await client.connect()
      const result = await conn.query(sql, [id])
      const user = result.rows[0]
      conn.release()
      return user
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`)
    }
  }
}
