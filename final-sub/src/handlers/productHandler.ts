import express from 'express'
import { Product, ProductStore } from '../models/productModel'
import auth from './authHandler'
import requestOwner from '../middleware/requestOwner'

const store = new ProductStore()

const addProduct = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const product: Product = {
      id: 0,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      created_at: new Date(),
      updated_at: new Date(),
      description: req.body.description,
      quantity: req.body.quantity,
      
    } as Product
    if (
      product.name &&
      product.price &&
      product.category &&
      product.description &&
      product.quantity
    ) {
      const products = await store.addProduct(product)
      res.json({ products, requestOwnerInfo })
    } else {
      res.status(401)
      res.json('missing required fields')
    }
  } catch (err) {
    res.status(401)
    res.json(err)
  }
}
const showAllProducts = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const products = await store.showAllProducts()

    res.json({ products, requestOwnerInfo })
  } catch (err) {
    res.status(401)
    res.json(err)
  }
}

const getProductById = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const product = await store.getProductById(
      req.params.id as unknown as number
    )
    res.json({ product, requestOwnerInfo })
  } catch (err) {
    res.status(401)
    res.json(err)
  }
}

const getProductsByCategory = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const products = await store.getProductsByCategory(
      req.params.category as unknown as string
    )
    res.json({ products, requestOwnerInfo })
  } catch (err) {
    res.status(401)
    res.json(err)
  }
}

const deleteProduct = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const product = await store.deleteProduct(
      req.params.id as unknown as number
    )
    res.json({ message: 'deleted', product, requestOwnerInfo })
  } catch (err) {
    res.status(401)
    res.json(err)
  }
}

const productRoutes = (app: express.Application) => {
  //add new product
  app.post('/addProduct', auth, addProduct)
  //show all products
  app.get('/products', auth, showAllProducts)
  //show product by id
  app.get('/products/:id', auth, getProductById)
  //show products by category
  app.get('/products/category/:category', auth, getProductsByCategory)
  //delete product by id
  app.delete('/product/:id', auth, deleteProduct)
}

export default productRoutes
