import express from 'express'
import { orders, ordersStore } from '../models/orderModel'
import auth from './authHandler'
import requestOwner from '../middleware/requestOwner'
import { ProductStore } from '../models/productModel'

const store = new ordersStore()
const productStore = new ProductStore()
const index = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const orders = await store.index()
    res.json({ orders, requestOwnerInfo })
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const create = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const user_id = req.body.user_id
    const status = 'active'
    const order: orders = {
      user_id,
      status,
    } as orders
    const newOrder = await store.create(order)
    res.json({ newOrder, requestOwnerInfo })
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const addProductToOrder = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try{
    //check if product exists and quantity is available
    const product = await productStore.getProductById(req.body.product_id)
    if(product){
      console.log(product);
      
      if(product.quantity >= req.body.quantity){
        const requestOwnerInfo = await requestOwner(req, res)
        const order_id = req.body.order_id
        const product_id = req.body.product_id
        const quantity = req.body.quantity
        const newOrderProduct = await store.addProductToOrder(order_id,product_id,quantity)
         await productStore.addNumberOfSales(product_id)
        await productStore.updateQuantity(product_id,product.quantity - quantity)
        res.json({newOrderProduct, requestOwnerInfo})
      }else{
        res.status(400)
        res.json('quantity not available')
      }

  }}
  catch(err){
    res.status(400)
    res.json(err)
  }
}

const showOrderProducts = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const order_id = req.body.order_id
    const orderProducts = await store.showOrderProducts(order_id)
    res.json({ orderProducts, requestOwnerInfo })
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const showUserOrder = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const user_id = req.body.user_id
    const userOrders = await store.showUserOrder(user_id)
    res.json({ userOrders, requestOwnerInfo })
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

//change status of order by id
const changeStatus = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const requestOwnerInfo = await requestOwner(req, res)
    const id = req.body.id
    const status = req.body.status
    const updatedOrder = await store.changeStatus(id, status)
    res.json({ updatedOrder, requestOwnerInfo })
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const order_routes = (app: express.Application): void => {
  app.get('/showOrders', auth, index)
  app.post('/createOrder', auth, create)
  app.post('/addProductToOrder', auth, addProductToOrder)
  app.get('/showOrderProducts', auth, showOrderProducts)
  app.get('/showUserOrder', auth, showUserOrder)
  app.put('/changeStatus', auth, changeStatus)
}

export default order_routes
