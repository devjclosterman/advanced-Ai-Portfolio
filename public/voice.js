window.addEventListener('DOMContentLoaded', () => {
  const micBtn = document.getElementById('mic-btn');
  const userInput = document.getElementById('user-input');

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    micBtn.disabled = true;
    micBtn.title = 'Speech recognition not supported';
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.addEventListener('click', () => {
    recognition.start();
    micBtn.innerText = '🎙️ Listening...';
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    micBtn.innerText = '🎤';
  };

  recognition.onerror = (event) => {
    console.error('Voice recognition error:', event.error);
    micBtn.innerText = '🎤';
  };

  recognition.onend = () => {
    micBtn.innerText = '🎤';
  };
});