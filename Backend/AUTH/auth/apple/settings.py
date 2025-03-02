# apple/settings.py - Import into main settings.py
APPLE_CALLBACK_URL = 'http://localhost:8000/auth/apple/callback/'

SOCIALACCOUNT_PROVIDERS = {
    'apple': {
        'APP': {
            'client_id': 'YOUR_APPLE_CLIENT_ID',
            'secret': 'YOUR_APPLE_CLIENT_SECRET',
            'key': 'YOUR_APPLE_KEY_ID',
            'certificate_key': 'YOUR_APPLE_PRIVATE_KEY'
        },
        'SCOPE': ['email', 'name'],
        'TEAM_ID': 'YOUR_APPLE_TEAM_ID',
    }
}