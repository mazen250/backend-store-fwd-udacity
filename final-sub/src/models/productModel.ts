import client from '../database'

export type Product = {
  id: number
  name: string
  price: number
  category: string
  created_at: Date
  updated_at: Date
  description: string
  quantity: number
  number_of_sales: number
}

export class ProductStore {
  async addProduct(product: Product): Promise<Product> {
    try {
      const conn = await client.connect()
      const sqlQuery =
        'INSERT INTO product (name,price,category,description,quantity) VALUES ($1,$2,$3,$4,$5) RETURNING *'
      if (
        product.name &&
        product.price &&
        product.category &&
        product.description &&
        product.quantity
      ) {
        const exec = await conn.query(sqlQuery, [
          product.name,
          product.price,
          product.category,
          product.description,
          product.quantity,
        ])
        const newProduct = exec.rows[0]
        conn.release()
        return newProduct
      } else {
        throw new Error(`all fields are required`)
      }
    } catch (err) {
      throw new Error(`could not add product ${err}`)
    }
  }
  async showAllProducts(): Promise<Product[]> {
    try {
      const conn = await client.connect()
      const sqlQuery = 'SELECT * FROM product'
      const exec = await conn.query(sqlQuery)
      conn.release()
      return exec.rows
    } catch (err) {
      throw new Error(`could not get products ${err}`)
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const conn = await client.connect()
      const sqlQuery = 'SELECT * FROM product WHERE id=($1)'
      const exec = await conn.query(sqlQuery, [id])
      conn.release()
      return exec.rows[0]
    } catch (err) {
      throw new Error(`could not get product ${err}`)
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const conn = await client.connect()
      const query = 'SELECT * FROM product WHERE category=($1)'
      const exec = await conn.query(query, [category])
      conn.release
      return exec.rows
    } catch (err) {
      throw new Error(`could not get products ${err}`)
    }
  }

  async deleteProduct(id: number) {
    try {
      const conn = await client.connect()
      const sqlQuery = 'DELETE FROM product WHERE id=($1)'
      const exec = await conn.query(sqlQuery, [id])
      conn.release()
      return exec.rows[0]
    } catch (err) {
      return `could not delete product ${err}`
    }
  }

  async updateProduct(id: number, product: Product): Promise<Product | string> {
    try {
      const conn = await client.connect()
      const sqlQuery =
        'UPDATE product SET name=($1),price=($2),category=($3),description=($4),quantity=($5) WHERE id=($6) RETURNING *'
      const exec = await conn.query(sqlQuery, [
        product.name,
        product.price,
        product.category,
        product.description,
        product.quantity,
        id,
      ])
      conn.release()
      if (exec) {
        return 'deleted'
      } else {
        return 'could not delete product'
      }
    } catch (err) {
      throw new Error(`could not update product ${err}`)
    }
  }

  // add number of sales
  async addNumberOfSales(id: number): Promise<Product> {
    try {
      const conn = await client.connect()
      //get current number of sales
      const sqlQuery = 'SELECT number_of_sales FROM product WHERE id=($1)'
      const exec = await conn.query(sqlQuery, [id])
      const currentNumberOfSales = exec.rows[0].number_of_sales
      //add 1 to current number of sales
      const newNumberOfSales = currentNumberOfSales + 1

      //update number of sales
      const sqlQuery2 =
        'UPDATE product SET number_of_sales=($1) WHERE id=($2) RETURNING *'
      const ex=  await conn.query(sqlQuery2, [newNumberOfSales, id])
       if(ex){
         conn.release()
            return ex.rows[0]
       }
       else{
            throw new Error(`could not add number of sales`)
       }
  }
  catch (err) {
    throw new Error(`could not update product ${err}`)
  }}

  // update quantity
  async updateQuantity(id: number, quantity: number): Promise<Product> {
    try {
      const conn = await client.connect()
      const sqlQuery =
        'UPDATE product SET quantity=($1) WHERE id=($2) RETURNING *'
      const exec = await conn.query(sqlQuery, [quantity, id])
      conn.release()
      return exec.rows[0]
    } catch (err) {
      throw new Error(`could not update product ${err}`)
    }
  }

  
}
