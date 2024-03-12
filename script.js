const ws = new WebSocket('ws://localhost:3000');

let username = '';

ws.onopen = () => {
  // Get user's username
  username = prompt('Por favor, insira seu nome de usuário:');
  ws.send(JSON.stringify({ type: 'username', username }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'message') {
    // Display the received message
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.sender}: ${message.content}`;
    messages.appendChild(messageElement);
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  // Send the message to the server
  ws.send(JSON.stringify({ type: 'message', sender: username, content: message }));

  // Clear the input field
  messageInput.value = '';
});
