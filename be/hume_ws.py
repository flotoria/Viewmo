import os
import dotenv
from server import app
from fastapi import WebSocket
import websocket
import _thread
import time
import rel

dotenv.load_dotenv()

API_KEY = os.getenv('API_KEY')


def on_message(ws, message):
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_open(ws):
    print("Opened connection")

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://api.hume.ai/v0/evi/chat?api_key=NhrtiolurQQVkophwWGP7o6txzGx4HpkcrPfHHNfVwPAzDbm",
                              on_open=on_open,
                              on_message=on_message,
                              on_error=on_error,
                              on_close=on_close)

    ws.run_forever(dispatcher=rel, reconnect=5)  # Set dispatcher to automatic reconnection, 5 second reconnect delay if connection closed unexpectedly