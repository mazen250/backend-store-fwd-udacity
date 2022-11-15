# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

#### Users

- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders

- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

### BACKEND IMPLEMENTATION

## DATABASE SCHEMA

- user

  - id (primary key , auto increment)
  - email
  - firstName
  - lastName
  - password (stored as hash using bcrypt)

- product

  - id (primary key , auto increment)
  - name
  - price
  - category
  - description
  - created_at
  - updated_at
  - quantity

- order

  - id ((primary key , auto increment)
  - user_id
  - status

- order_product
  - id (primary key , auto increment)
  - order_id (foreign key to order table)
  - product_id (foreign key to product table)
  - quantity

# NOTE FOR DATABASE : steps to create an order, user will create an order with /createOrder endpoint, then he will add products to the order with /addProductToOrder endpoint, then he will update the order status with /changeStatus endpoint , then the user can see the order product that has the same order id with /getOrderProducts endpoint, then he can see his own order with /showUserOrders endpoint

## API Endpoints

# user routes

- POST /regirster : to create a new user (body: firstName, lastName, email, password)
- POST /login : to login a user (body: email, password) (returns a token)
- GET /users : to get all users (token required)
- GET /user/:id : to get a single user (token required)
- DELETE /deleteUser/:id : to delete a user (token required)

# product routes

- POST /addProduct : to create a new product (body: name, price, category,description,quantity) (token required)
- GET /products : to get all products (token required)
- GET /products/:id : to get a single product (token required)
- GET /products/category/:category : to get all products by category (token required)
- DELETE /product/:id : to delete a product (token required)

# order routes

- GET /showOrders : to get all orders (token required)
- GET /showOrderProducts : to get a single order (token required) (body: order_id)
- GET /showUserOrders : to get all orders of a user (token required) (body: user_id)
- POST /createOrder : to create a new order (body: user_id) (token required)
- POST /addProductToOrder : to add a product to an order (body: order_id, product_id, quantity) (token required)
- PUT /changeStatus : to update the status of an order (body:id, status) (token required)

# NOTE: if the quantity of a product is less than the quantity of the order, the order will not be created and if it is available it will be created and the quantity of the product will be updated

### TESTING

# NOTE: the test specs are in the src/tests folder and each file test a single model, there is a testing structure that i followed to test the project, some files will have more lines of code but it will always follow the same structure below, test phase use separate database and after the tests are done the tables are dropped.

- each file is devided into two parts

  - first part is test that all the function exists and then test those function to make sure they work as expected, first we import the models and stores and create instance to test on them if needed, then each describe method will have test suits and beforeAllto create the instance of the model and afterAll to drop the table, then we test the function and make sure it works as expected.

  - second part is to test the endpoints itself with separated describe method and beforeAll to create the instance of the model and afterAll to drop the table, then we test the endpoints and make sure it works as expected.
