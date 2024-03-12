const ws = new WebSocket('ws://localhost:3000');

let username = '';
let recipient = '';

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
const fileInput = document.getElementById('file-input');
const attachFile = document.getElementById('attach-file');
const attachGif = document.getElementById('attach-gif');

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message || !recipient) return;

  // Send the message to the server
  ws.send(JSON.stringify({ type: 'message', sender: username, recipient, content: message }));

  // Clear the input field
  messageInput.value = '';
});

attachFile.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const message = event.target.result;

    // Send the file to the server
    ws.send(JSON.stringify({ type: 'file', sender: username, recipient, content: message }));
  };

  reader.readAsDataURL(file);
});

attachGif.addEventListener('click', () => {
  const gifUrl = prompt('Por favor, insira o URL do GIF:');
  if (!gifUrl || !recipient) return;

  // Send the GIF URL to the server
  ws.send(JSON.stringify({ type: 'gif', sender: username, recipient, content: gifUrl }));
});

// Function to set recipient
function setRecipient(selectedRecipient) {
  recipient = selectedRecipient;
}
