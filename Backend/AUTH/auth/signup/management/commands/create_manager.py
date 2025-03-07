from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "Creates a manager user with the email 'manager@primegrills.com' and password 'prime'."

    def handle(self, *args, **kwargs):
        email = "manager@primegrills.com"
        password = "prime"
        role = "Manager"

        # Check if the user already exists
        user, created = User.objects.get_or_create(email=email)

        if created:
            # Set user attributes
            user.username = "manager"
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True  # Ensure the user is active
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Successfully created manager user: {email}"))
        else:
            # Update user attributes if they already exist
            user.username = "manager"
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True  # Ensure the user is active
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Updated existing manager user: {email}"))

        # Assign the 'Manager' role (assuming you have a role field in your User model)
        if hasattr(user, "role"):
            user.role = role
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Assigned role '{role}' to user: {email}"))