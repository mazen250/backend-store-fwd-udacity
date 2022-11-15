/* Replace with your SQL commands */
CREATE TABLE order_product (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint references orders(id),
    product_id bigint references product(id)
)