
# microsoft/settings.py - Import into main settings.py
MICROSOFT_CALLBACK_URL = 'http://localhost:8000/auth/microsoft/callback/'

SOCIALACCOUNT_PROVIDERS = {
    'microsoft': {
        'APP': {
            'client_id': 'YOUR_MICROSOFT_CLIENT_ID',
            'secret': 'YOUR_MICROSOFT_CLIENT_SECRET',
            'key': '',
            'tenant': 'common',  # For multi-tenant applications
        },
        'SCOPE': ['openid', 'email', 'profile', 'User.Read'],
    }
}