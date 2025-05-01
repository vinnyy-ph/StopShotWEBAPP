# StopShotWEBAPP
 

# Database SETUP
1. Start with Setting up Database with XAMPP
2. Install Xamp
3. Go to MySQL Admin
4. Create a new database and name it 'stopshop_db'


# Backend SETUP
1. Clone the repo to your local machine
2. In your terminal run 'cd backend'
3. Create your own virtual environment inside backend/ and run:  'python -m venv venv' 
4. Activate your virtual environment by running: 'venv\Scripts\activate'
5. Install Backend Dependencies: 'pip install -r requirements.txt'
6. Update the DATABASES Configuration '\backend\stopshot_backend\settings.py' base on your own MySQL Credentials
7. Run Migrations to sync with Database: 'python manage.py migrate'
8. Run Server: 'python manage.py runserver'


# Creating Admin User
1. 'python manage.py createsuperuser'
2. Fill up all the fields and make sure to remember your Credentials
2. Note: use the email as your username for logging into the Django Admin Interface


# BACKEND SETUP FOR MENU ITEMS
1. RUN MIGRATIONS IN DJANGO
2. OPEN ANY API TESTING PLATFORM YOU PREFER.
3. CREATE A AN HTTP POST REQUEST
4. SET THE API ENDPOINT TO 'http://127.0.0.1:8000/api/menus/bulk-create/'
5. SET THE BODY STRUCTURE TO JSON
6. PASTE THE JSON DATA FOR MENU ITEMS
7. SEND THE REQUEST


