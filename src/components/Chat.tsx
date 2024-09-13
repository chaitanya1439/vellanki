import { useState } from 'react';
import axios from 'axios';

const Chat: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (prompt.trim() === '') return;
    setMessages([...messages, { role: 'user', content: prompt }]);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/chat', { prompt });
      setMessages([...messages, { role: 'user', content: prompt }, { role: 'assistant', content: response.data.choices[0].text }]);
      setPrompt('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-300 rounded-lg bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-center text-gray-500">Typing...</p>}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg p-2"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
