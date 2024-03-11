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

let clients = [];

function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function createMessageElement(content, id) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  const messageText = document.createElement('span');
  messageText.classList.add('message-text');
  messageText.textContent = content;

  const messageSender = document.createElement('span');
  messageSender.classList.add('message-sender');
  messageSender.textContent = 'You: ';

  messageElement.appendChild(messageSender);
  messageElement.appendChild(messageText);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    messageElement.remove();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'delete', id }));
      }
    });
  });

  messageElement.appendChild(deleteButton);

  return messageElement;
}

wss.on('connection', (ws) => {
  clients.push(ws);

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'image') {
      const messageId = generateMessageId();
      const messageElement = createMessageElement(parsedMessage.content, messageId);

      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'image',
            content: parsedMessage.content,
            id: messageId,
          }));
        }
      });
    } else if (parsedMessage.type === 'delete') {
      const messageElement = document.getElementById(parsedMessage.id);
      if (messageElement) {
        messageElement.remove();
      }
    } else {
      // Handle other message types here
    }
  });

  ws.on('close', () => {
    clients = clients.filter((client) => client !== ws);
  });
});

server.listen(3000);