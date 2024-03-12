const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const indexFile = fs.readFileSync('index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexFile);
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocket.Server({ server });

let users = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'username') {
      const username = parsedMessage.username;
      users[username] = ws;
    } else if (parsedMessage.type === 'message') {
      const sender = parsedMessage.sender;
      const recipient = parsedMessage.recipient;
      const content = parsedMessage.content;

      if (recipient in users) {
        users[recipient].send(JSON.stringify({ type: 'message', sender, content }));
      }
    }
  });

  ws.on('close', () => {
    // Remove user from users object
    for (let key in users) {
      if (users[key] === ws) {
        delete users[key];
        break;
      }
    }
  });
});

server.listen(3000);
