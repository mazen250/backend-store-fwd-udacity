import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import userRoutes from './handlers/userHandler'
import productRoutes from './handlers/productHandler'
import order_routes from './handlers/orderHandler'
const app: express.Application = express()
//const address = "0.0.0.0:3000"

app.use(bodyParser.json())

userRoutes(app)
productRoutes(app)
order_routes(app)
app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log(`starting app on: localhost:3000`)
})

export default app
