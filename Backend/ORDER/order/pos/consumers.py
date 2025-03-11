import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import PosTemporarySelection
from .serializers import PosTemporarySelectionSerializer

class PosSelectionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'pos_selection_{self.session_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        selection_data = data.get('selection')

        if action in ['add', 'update', 'remove']:
            # Handle the selection change
            response = await self.handle_selection_change(action, selection_data)
            
            # Broadcast to group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'selection_change',
                    'message': response
                }
            )

    async def selection_change(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def handle_selection_change(self, action, selection_data):
        # Handle database operations based on action
        if action == 'add':
            selection = PosTemporarySelection.objects.create(**selection_data)
        elif action == 'update':
            selection = PosTemporarySelection.objects.filter(
                id=selection_data['id']).first()
            for key, value in selection_data.items():
                setattr(selection, key, value)
            selection.save()
        elif action == 'remove':
            selection = PosTemporarySelection.objects.filter(
                id=selection_data['id']).first()
            selection.delete()

        return {
            'action': action,
            'selection': PosTemporarySelectionSerializer(selection).data
            if action != 'remove' else selection_data
        }
