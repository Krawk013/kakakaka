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
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  const messageText = document.createElement('span');
  messageText.classList.add('message-text');
  messageText.textContent = message;

  const messageSender = document.createElement('span');
  messageSender.classList.add('message-sender');
  messageSender.textContent = sender + ': ';

  messageElement.appendChild(messageSender);
  messageElement.appendChild(messageText);
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
  });

// Handle file attachment
attachFile.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
  
    if (!file.type.startsWith('image/')) {
      return;
    }
  
    const messageId = generateMessageId();
    const messageElement = document.createElement('div');
    messageElement.id = messageId;
    messageElement.classList.add('message');
  
    const messageText = document.createElement('span');
    messageText.classList.add('message-text');
  
    const messageSender = document.createElement('span');
    messageSender.classList.add('message-sender');
    messageSender.textContent = 'You: ';
  
    messageElement.appendChild(messageSender);
    messageElement.appendChild(messageText);
    messages.appendChild(messageElement);
  
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const message = event.target.result;
      messageText.textContent = `[Image](${messageId})`;
      messageText.style.backgroundImage = `url(${message})`;
      messageText.style.backgroundSize = 'contain';
      messageText.style.backgroundRepeat = 'no-repeat';
    };
  
    reader.readAsDataURL(file);
  });
  
  // Add a message to the chat
  function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
  
    const messageText = document.createElement('span');
    messageText.classList.add('message-text');
    messageText.textContent = message;
  
    const messageSender = document.createElement('span');
    messageSender.classList.add('message-sender');
    messageSender.textContent = sender + ': ';
  
    messageElement.appendChild(messageSender);
    messageElement.appendChild(messageText);
    messages.appendChild(messageElement);
  }
  
  // Handle form submission
  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
  
    const message = messageInput.value.trim();
    if (!message) return;
  
    // Check if the message contains an image link
    const urlPattern = /\[(Image)\]\((\S+)\)/g;
    const urlMatch = message.match(urlPattern);
  
    if (urlMatch) {
      // Send each image link separately
      urlMatch.forEach((match) => {
        const [, type, url] = match.match(urlPattern)[1];
        if (type === 'Image') {
          const messageId = generateMessageId();
          const messageElement = document.createElement('div');
          messageElement.id = messageId;
          messageElement.classList.add('message');
  
          const messageText = document.createElement('span');
          messageText.classList.add('message-text');
          messageText.textContent = `[Image](${messageId})`;
          messageText.style.backgroundImage = `url(${url})`;
          messageText.style.backgroundSize = 'contain';
          messageText.style.backgroundRepeat = 'no-repeat';
  
          const messageSender = document.createElement('span');
          messageSender.classList.add('message-sender');
          messageSender.textContent = 'You: ';
  
          messageElement.appendChild(messageSender);
          messageElement.appendChild(messageText);
          messages.appendChild(messageElement);
        }
      });
    } else {
      addMessage(message, 'You');
    }
  
    messageInput.value = '';
  });