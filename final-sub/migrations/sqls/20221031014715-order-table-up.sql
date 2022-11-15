/* Replace with your SQL commands */
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id bigint references users(id),
    status VARCHAR(255)
)