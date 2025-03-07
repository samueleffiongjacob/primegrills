# Prime Grills Order Management API

## Endpoints Overview

### Customers
- **GET** `/api/customers/`
  - List all customers
  - Supports search by name, email, phone
  - Filter by city, state

- **POST** `/api/customers/get_or_create/`
  - Get or create customer by email
  - Request body:
  ```json
  {
    "email": "required",
    "name": "optional",
    "phone": "optional",
    "address": "optional",
    "city": "optional",
    "state": "optional",
    "zip": "optional"
  }
  ```

### Food Products
- **GET** `/api/food-products/`
  - List all food products
  - Search by name, description
  - Filter by availability

### Orders
- **GET** `/api/orders/`
  - List all orders
  - Filter by status, customer

- **POST** `/api/orders/create_with_items/`
  - Create new order with items
  - Request body:
  ```json
  {
    "customer": {
      "email": "required",
      "name": "optional",
      "phone": "optional"
    },
    "items": [
      {
        "food_product": "id",
        "quantity": "number"
      }
    ],
    "special_instructions": "optional"
  }
  ```

- **POST** `/api/orders/{id}/update_status/`
  - Update order status
  - Status options: PENDING, PROCESSING, COMPLETED, CANCELLED

- **POST** `/api/orders/{id}/update_payment_status/`
  - Update payment status
  - Status options: PENDING, PAID, FAILED

- **GET** `/api/orders/my_orders/`
  - Get current user's orders

- **GET** `/api/orders/pending_orders/`
  - List all pending orders

- **GET** `/api/orders/unpaid_orders/`
  - List all unpaid orders

- **GET** `/api/orders/all_orders/`
  - List all orders in system

### Order Items
- **GET** `/api/order-items/`
  - List all order items
  - Filter by order, food_product

## Authentication

All endpoints require authentication except:
- Customer creation
- Product listing

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
