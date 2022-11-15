import client from '../database'

export type orders = {
  id: number
  status: string
  user_id: number
}

export class ordersStore {
  //add new order , check first that user exist
  async create(order: orders): Promise<orders> {
    try {
      const conn = await client.connect()
      //make sure user exist
      console.log(order.user_id)

      const sql = 'select * from users where id = $1'
      const result = await conn.query(sql, [order.user_id])
      if (result.rows.length === 0) {
        throw new Error('user does not exist')
      } else {
        const sql =
          'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'
        const result = await conn.query(sql, [order.status, order.user_id])
        conn.release()
        return result.rows[0]
      }
    } catch (err) {
      throw new Error(`could not add new order. Error: ${err}`)
    }
  }

  //show all orders
  async index(): Promise<orders[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`could not get orders. Error: ${err}`)
    }
  }

  //add product to order
  async addProductToOrder(
    order_id: number,
    product_id: number,
    quantity: number
  ): Promise<orders> {
    try {
      const conn = await client.connect()
      const sql = 'select * from orders where id = $1'
      const result = await conn.query(sql, [order_id])
      if (result.rows.length === 0) {
        throw new Error('order does not exist')
      } else {
        const sql =
          'INSERT INTO order_product (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *'
        const result = await conn.query(sql, [order_id, product_id, quantity])
        conn.release()
        return result.rows[0]
      }
    } catch (err) {
      throw new Error(`could not add product to order. Error: ${err}`)
    }
  }

  //show all products in an order
  async showOrderProducts(order_id: number): Promise<orders[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM order_product where order_id = $1'
      const result = await conn.query(sql, [order_id])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`could not find order ${order_id}. Error: ${err}`)
    }
  }

  //get orders of the a user by user id
  async showUserOrder(id: number): Promise<orders[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders WHERE user_id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`could not find order ${id}. Error: ${err}`)
    }
  }

  //change order status to complete
  async changeStatus(id: number, status: string): Promise<orders> {
    try {
      const conn = await client.connect()
      const sql = 'UPDATE orders SET status=($1) WHERE id=($2)'
      const result = await conn.query(sql, [status, id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`could not change status of order ${id}. Error: ${err}`)
    }
  }

  //delete order by id
  async delete(id: number): Promise<string> {
    try {
      const conn = await client.connect()
      const sql = 'DELETE FROM orders WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      if (result) {
        return 'deleted'
      } else {
        return 'not deleted'
      }
    } catch (err) {
      return `could not delete order. ${err}`
    }
  }

  // show order by id
  async show(id: number): Promise<orders> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`could not find order ${id}. Error: ${err}`)
    }
  }

  
}
