const messages = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const fileInput = document.getElementById('file-input');
const attachFile = document.getElementById('attach-file');
const attachGif = document.getElementById('attach-gif');

// Generate a unique ID for each message
function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add a message to the chat
function addMessage(message, sender) {
  const messageElement = createMessageElement(message, generateMessageId());
  messages.appendChild(messageElement);
}

// Handle form submission
messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    // Check if the message contains a link
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urlMatch = message.match(urlPattern);

    if (urlMatch) {
      // Send each link separately
      urlMatch.forEach((url) => {
        addMessage(`[${url}](${url})`, 'You');
      });
    } else {
      addMessage(message, 'You');
    }

    messageInput.value = '';

    // Send the message to the server
    ws.send(JSON.stringify({ type: 'image', content: message }));
  });

// Handle file attachment
attachFile.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const message = event.target.result;
    addMessage(message, 'You');

    // Send the message to the server
    ws.send(JSON.stringify({ type: 'image', content: message }));
  };

  reader.readAsDataURL(file);
});

// Handle GIF attachment
attachGif.addEventListener('click', () => {
  // You can use a GIF library or API to handle GIFs
});

// Create a message element
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
    ws.send(JSON.stringify({ type: 'delete', id }));
  });

  messageElement.appendChild(deleteButton);

  return messageElement;
}
