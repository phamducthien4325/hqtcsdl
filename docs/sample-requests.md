# Sample Requests

## Authentication

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@classicmodels.local\",\"password\":\"Admin123!\"}"
```

## Customers

```bash
curl "http://localhost:4000/api/customers?page=1&pageSize=10&country=France&search=Atelier" \
  -H "Authorization: Bearer <token>"
```

## Orders

```bash
curl "http://localhost:4000/api/orders?status=Shipped&dateFrom=2004-01-01&dateTo=2004-12-31" \
  -H "Authorization: Bearer <token>"
```

## Analytics

```bash
curl http://localhost:4000/api/analytics/dashboard \
  -H "Authorization: Bearer <token>"
```

## Reports

```bash
curl "http://localhost:4000/api/reports/sales/export?format=csv" \
  -H "Authorization: Bearer <token>" \
  -o sales-report.csv
```

## Chatbot

```bash
curl -X POST http://localhost:4000/api/chatbot/query \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"Top 5 customers this year\"}"
```
