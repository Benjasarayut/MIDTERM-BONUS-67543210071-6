# API Testing Guide
1. **Get Books:** `curl http://192.168.56.101:3000/api/books`
2. **Update Book:** `curl -X PUT -H "Content-Type: application/json" -d '{"title":"New Title"}' http://192.168.56.101:3000/api/books/1`