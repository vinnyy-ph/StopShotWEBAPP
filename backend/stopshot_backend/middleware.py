from django.conf import settings

class AuthWarningMiddleware:
    """
    Middleware that adds a warning header when DEBUG_NO_AUTH is enabled.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if getattr(settings, 'DEBUG_NO_AUTH', False):
            response['X-Auth-Warning'] = 'Authentication disabled for development. DO NOT use in production!'
            
        return response 