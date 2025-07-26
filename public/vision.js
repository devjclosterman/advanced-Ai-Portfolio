window.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('image-upload');

  imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];
      const userText = document.getElementById('user-input').value.trim() || 'Analyze this image';
      const persona = document.getElementById('persona').value;

      const payload = {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `You are an AI with vision capabilities. Respond as ${persona}.` },
          {
            role: 'user',
            content: [
              { type: 'text', text: userText },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ]
      };

      appendImageToChat(file);
      appendMessage('bot', 'Analyzing image...');

      try {
        const res = await fetch('/api/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || 'Could not interpret the image.';
        updateLastBotMessage(reply);
      } catch (err) {
        updateLastBotMessage('⚠️ Error analyzing image.');
      }
    };
    reader.readAsDataURL(file);
  });
});

function appendImageToChat(file) {
  const chatLog = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'message user';
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  img.style.maxWidth = '100%';
  img.style.borderRadius = '10px';
  div.appendChild(img);
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}