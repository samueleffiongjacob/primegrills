from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from ...models import StaffProfile  
from django.contrib.auth import authenticate

User = get_user_model()

class Command(BaseCommand):
    help = "Creates a manager user with the email 'manager@primegrills.com' and password 'prime1'."

    def handle(self, *args, **kwargs):
        email = "manager@primegrills.com"
        password = "prime1"
        role = "Manager"

        # Check if the user already exists
        user, created = User.objects.get_or_create(email=email)

        if created:
            # Create the user
            user.name = "Primegrills Manager"
            user.username = "manager"
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.user_type = 'staff'
            user.is_active = True
            user.save()

            # Create the staff profile
            StaffProfile.objects.create(user=user, role=role)
            self.stdout.write(self.style.SUCCESS(f"Successfully created manager user: {email}"))
        else:
            # Update the user
            user.name = "Primegrills Manager"
            user.username = "manager"
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.user_type = 'staff'
            user.is_active = True
            user.save()

            # Update or create the staff profile
            staff_profile, profile_created = StaffProfile.objects.get_or_create(user=user)
            staff_profile.role = role
            staff_profile.save()

            self.stdout.write(self.style.SUCCESS(f"Updated existing manager user: {email}"))

        # Verify the user's credentials
        authenticated_user = authenticate(email=email, password=password)
        if authenticated_user:
            print("Manager authenticated successfully!")
        else:
            print("Failed to authenticate manager.")