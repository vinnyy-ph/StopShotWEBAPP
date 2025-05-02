#!/bin/bash

# Activate the virtual environment
source /var/app/venv/*/bin/activate

# Change to the app directory
cd /var/app/current/

# Run migrations only on the leader instance
if [[ $EB_IS_COMMAND_LEADER == "true" ]]; then
  echo "Running Django migrations on leader instance..."
  python manage.py migrate --noinput
  if [ $? -eq 0 ]; then
    echo "Migrations completed successfully."
  else
    echo "Migrations failed!"
    exit 1 # Exit with error code if migrations fail
  fi
else
  echo "Skipping migrations on non-leader instance."
fi

# Deactivate the virtual environment (optional but good practice)
deactivate 