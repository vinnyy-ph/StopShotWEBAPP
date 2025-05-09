# User Message Endpoints

## 1. Submit a Message
**Endpoint:** `http://127.0.0.1:8000/api/message/`  
**Method:** `POST`  
**Description:** Allows users to send a message to the management team.

**Sample Request Body:**
```json
{
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "1234567890",
    "message_text": "I have a question about your services."
}