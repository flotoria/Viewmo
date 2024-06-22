from flask import Flask
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
    socketio.run(app, debug=True)