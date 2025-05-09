# User Feedback Endpoints

## 1. Submit Feedback
**Endpoint:** `http://127.0.0.1:8000/api/feedback/api/feedback`  
**Method:** `POST`  
**Description:** Allows users to submit feedback.

**Sample Request Body:**
```json
{
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "feedback_text": "Great service and atmosphere!",
    "experience_rating": 5
}


## 2. Respond to Feedback
**Endpoint:** `http://127.0.0.1:8000/api/feedback/<feedback_id>/response/`  
**Method:** `POST`  
**Description:** Allows the owner to respond to feedback and notify the user via email (This can be done via API endpoint or directly through Django admin).

**Sample Request Body:**
```json
{
    "response_text": "Thank you for your feedback! We're glad you enjoyed your experience."
}


## 3. Get All Customer Feedback
**Endpoint:** `http://127.0.0.1:8000/api/feedback/`  
**Method:** `GET`  
**Description:** Returns all customer feedback submissions with responses.

