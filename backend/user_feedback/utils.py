from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from user_management.models import User
import os
import re

# Get the current directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def send_feedback_email(user, feedback_text):
    # Use absolute path to the template
    template_path = os.path.join(BASE_DIR, 'emails', 'feedback_email.html')
    
    # Render template directly from file
    with open(template_path, 'r') as template_file:
        template_content = template_file.read()
    
    # Replace template variables with proper regex to handle spaces in braces
    html_content = re.sub(r'{{\s*user\.first_name\s*}}', user.first_name or '', template_content)
    html_content = re.sub(r'{{\s*user\.last_name\s*}}', user.last_name or '', html_content)
    html_content = re.sub(r'{{\s*user\.email\s*}}', user.email, html_content)
    html_content = re.sub(r'{{\s*feedback_text\s*}}', feedback_text, html_content)
    html_content = re.sub(r'{{\s*logo_url\s*}}', 'https://i.imgur.com/6Hf2QI2.png', html_content)
    
    # Plain text fallback
    plain_text = strip_tags(html_content)
    
    # Create email
    email = EmailMultiAlternatives(
        subject="User Feedback",
        body=plain_text,
        from_email="stopshotsportsbar@gmail.com",
        to=["stopshot.management@gmail.com"],
    )
    
    # Attach HTML content
    email.attach_alternative(html_content, "text/html")
    email.send()

def send_response_email(user, feedback_text, response_text):
    template_path = os.path.join(BASE_DIR, 'emails', 'response_email.html')
    
    with open(template_path, 'r') as template_file:
        template_content = template_file.read()
    
    # Replace template variables with proper regex to handle spaces in braces
    html_content = re.sub(r'{{\s*user\.first_name\s*}}', user.first_name or '', template_content)
    html_content = re.sub(r'{{\s*user\.last_name\s*}}', user.last_name or '', html_content)
    html_content = re.sub(r'{{\s*feedback_text\s*}}', feedback_text, html_content)
    html_content = re.sub(r'{{\s*response_text\s*}}', response_text, html_content)
    html_content = re.sub(r'{{\s*logo_url\s*}}', 'https://i.imgur.com/6Hf2QI2.png', html_content)
    
    # Plain text fallback
    plain_text = strip_tags(html_content)
    
    # Create email
    email = EmailMultiAlternatives(
        subject="Response to Your Feedback",
        body=plain_text,
        from_email="stopshotsportsbar@gmail.com",
        to=[user.email],
    )
    
    # Attach HTML content
    email.attach_alternative(html_content, "text/html")
    email.send()