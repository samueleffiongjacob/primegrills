# Prime Grills Order Service API Documentation

This service handles all ordering operations including customer management, food products, orders, and POS operations.

## API Endpoints

### Customer Management
- `GET /api/customers/` - List all customers
- `POST /api/customers/` - Create a new customer
- `GET /api/customers/{id}/` - Retrieve customer details
- `PUT /api/customers/{id}/` - Update customer details
- `DELETE /api/customers/{id}/` - Delete customer
- `POST /api/customers/get_or_create/` - Get or create customer by email

### Food Products
- `GET /api/products/` - List all food products
- `POST /api/products/` - Create a new food product
- `GET /api/products/{id}/` - Retrieve product details
- `PUT /api/products/{id}/` - Update product details
- `DELETE /api/products/{id}/` - Delete product
- Query Parameters:
  - `is_available` - Filter by availability
  - `search` - Search by name or description

### Orders
- `GET /api/orders/` - List all orders
- `POST /api/orders/` - Create a new order
- `GET /api/orders/{id}/` - Retrieve order details
- `PUT /api/orders/{id}/` - Update order details
- `DELETE /api/orders/{id}/` - Delete order
- `POST /api/orders/create_with_items/` - Create order with multiple items
- `GET /api/orders/my_orders/` - Get authenticated user's orders
- `GET /api/orders/pending_orders/` - List pending orders
- `GET /api/orders/unpaid_orders/` - List unpaid orders
- `GET /api/orders/all_orders/` - List all orders
- `PUT /api/orders/{id}/update_status/` - Update order status
- `PUT /api/orders/{id}/update_payment_status/` - Update payment status

### Order Items
- `GET /api/order-items/` - List all order items
- `POST /api/order-items/` - Create order item
- `GET /api/order-items/{id}/` - Retrieve order item details
- `PUT /api/order-items/{id}/` - Update order item
- `DELETE /api/order-items/{id}/` - Delete order item

### POS Operations

#### Payment Methods
- `GET /api/payment-methods/` - List all payment methods
- `POST /api/payment-methods/` - Add new payment method
- `PUT /api/payment-methods/{id}/` - Update payment method
- `DELETE /api/payment-methods/{id}/` - Delete payment method

#### Transactions
- `GET /api/transactions/` - List all transactions
- `POST /api/transactions/` - Create new transaction
- `GET /api/transactions/{id}/` - Get transaction details
- `POST /api/transactions/{id}/process_payment/` - Process payment for transaction

#### Daily Reports
- `GET /api/daily-reports/` - List all daily reports
- `GET /api/daily-reports/today/` - Get today's report
- `POST /api/daily-reports/` - Create daily report

#### POS Real-time Selection (WebSocket)
WebSocket endpoint: `ws://domain/ws/pos/selection/{session_id}/`

Actions:
- Connect to session
- Add selection
- Update selection
- Remove selection

## Models

### Customer
- name
- email (unique)
- phone
- address
- city
- state
- zip

### FoodProduct
- name
- description
- price
- is_available

### Order
- customer
- order_id (auto-generated)
- status (PENDING/COMPLETED/CANCELLED)
- payment_status
- total_amount
- special_instructions
- created_at
- updated_at

### Transaction
- order
- payment_method
- amount
- status (PENDING/COMPLETED/FAILED/REFUNDED)
- reference_number
- processed_by
- timestamps

## Authentication
Most endpoints require authentication. Include the authentication token in the header:

## Response Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Order Status Flow

```
PENDING → PROCESSING → COMPLETED
         └→ CANCELLED
```

## Payment Status Flow

```
PENDING → PAID
         └→ FAILED
```

## Example Usage

### Create Order

```bash
POST /api/orders/create_with_items/
{
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "items": [
    {
      "food_product": 1,
      "quantity": 2
    }
  ],
  "special_instructions": "Extra spicy"
}
```

### Response

```json
{
  "order": {
    "id": 1,
    "status": "PENDING",
    "payment": "PENDING",
    "total_amount": "25.98",
    "special_instructions": "Extra spicy"
  },
  "items": [
    {
      "id": 1,
      "food_product": 1,
      "quantity": 2,
      "price_at_time": "12.99",
      "subtotal": "25.98"
    }
  ]
}
```

## Development Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Start development server:
```bash
python manage.py runserver
```

## Testing

Run tests using:
```bash
python manage.py test
