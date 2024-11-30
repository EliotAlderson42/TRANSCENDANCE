"""
ASGI config for Transcendance project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from authentication import routing as auth_routing
from pong import routing as pong_routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Transcendance.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            auth_routing.websocket_urlpatterns + pong_routing.websocket_urlpatterns
        )
    ),
})
# application = get_asgi_application()
