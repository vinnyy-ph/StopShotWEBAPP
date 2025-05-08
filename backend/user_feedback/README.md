 User Feedback Endpoints

1. Submit Feedback
Endpoint: http://127.0.0.1:8000/api/feedback/api/feedback
Method:POST  
Description: Allows users to submit feedback.

Sample Post Data:
json sample:
{
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "feedback_text": "Great service and atmosphere!",
    "experience_rating": 5
}


2. Respond to Feedback
Endpoint: http://127.0.0.1:8000/api/feedback/<feedback_id>/response/
Method: POST
Feature Description: Allows the owner to respond to feedback and notify the user via email  (This can be done viea api endpoint or stright management via django admin)

Sample Json:
{
    "response_text": "Thank you for your feedback! We're glad you enjoyed your experience."
}


3. Fetch/GET All Customer Feedback
Endpoint: http://127.0.0.1:8000/api/feedback/
Method: GET
Feature Description: Returns all the Customer Feedback
   


