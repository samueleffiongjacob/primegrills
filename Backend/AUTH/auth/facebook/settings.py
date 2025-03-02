# facebook/settings.py - Import into main settings.py
FACEBOOK_CALLBACK_URL = 'http://localhost:8000/auth/facebook/callback/'

SOCIALACCOUNT_PROVIDERS = {
    'facebook': {
        'APP': {
            'client_id': 'YOUR_FACEBOOK_APP_ID',
            'secret': 'YOUR_FACEBOOK_APP_SECRET',
            'key': ''
        },
        'SCOPE': ['email', 'public_profile'],
        'FIELDS': [
            'id',
            'email',
            'name',
            'first_name',
            'last_name',
            'picture'
        ]
    }
}