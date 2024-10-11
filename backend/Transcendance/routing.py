
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from pong.routing import websocket_urlpatterns  # Importer les WebSocket routes depuis l'application pong

application = ProtocolTypeRouter({
    # Assurez-vous d'inclure les WebSocket routes
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns  # Inclure les routes WebSocket
        )
    ),
})