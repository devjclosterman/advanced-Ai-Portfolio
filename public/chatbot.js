window.onload = function () {
  let messageHistory = [];
    const BACKEND_URL = 'https://advanced-ai-portfolio.onrender.com/api/chat';  
  
  const personaPrompt = {
    default: "You are a helpful AI assistant on a portfolio site.",
    friendly: "You are a friendly and upbeat assistant.",
    sarcastic: "You are witty and sarcastic, but still helpful.",
    coach: "You are a motivational career coach who gives short, powerful advice."
  };

  const chatToggle = document.getElementById('chat-toggle');
  const chatbox = document.getElementById('chatbox');
  const chatLog = document.getElementById('chat-log');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const persona = document.getElementById('persona');
  

  chatToggle.onclick = () => chatbox.classList.toggle('hidden');
  sendBtn.onclick = handleSend;
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  document.getElementById('clear-chat').onclick = () => {
  chatLog.innerHTML = '';
  messageHistory = [];
};

  async function handleSend() {
    const userText = userInput.value.trim();
    if (!userText) return;
    appendMessage('user', userText);
    messageHistory.push({ role: 'user', content: userText });
    userInput.value = '';

    appendMessage('bot', '...');

    const payload = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: personaPrompt[persona.value] },
        ...messageHistory
      ]
    };

    try {
        const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Something went wrong...';
      messageHistory.push({ role: 'assistant', content: reply });
      updateLastBotMessage(reply);
    } catch (err) {
      updateLastBotMessage('⚠️ Error connecting to AI.');
    }
  }

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    chatLog.appendChild(div);
    typeWriter(text, div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function updateLastBotMessage(text) {
    const messages = chatLog.querySelectorAll('.message.bot');
    if (messages.length > 0) messages[messages.length - 1].innerText = text;
  }

  function typeWriter(text, element) {
    let i = 0;
    element.innerText = '';
    (function type() {
      if (i < text.length) {
        element.innerText += text.charAt(i);
        i++;
        setTimeout(type, 25);
      }
    })();
  }
};
