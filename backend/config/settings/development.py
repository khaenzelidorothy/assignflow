from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

# Add debug toolbar in development
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware'] + MIDDLEWARE

INTERNAL_IPS = ['127.0.0.1', 'localhost']

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Disable password validation in development
AUTH_PASSWORD_VALIDATORS = []
