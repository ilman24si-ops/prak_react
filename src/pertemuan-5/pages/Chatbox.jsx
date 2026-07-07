import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listChatMessages, sendChatMessage } from '@/lib/apiChat';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';

export default function Chatbox() {
  const { session } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const bottomRef = useRef(null);

  const refresh = async () => {
    try {
      setMessages(await listChatMessages());
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await sendChatMessage({ senderId: session?.user?.id, message: newMessage.trim() });
      setNewMessage('');
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageCircle className="w-7 h-7 text-blue-600" />
          Chatbox
        </h2>
        <p className="text-sm text-slate-500">Hubungi apoteker untuk konsultasi obat dan kesehatan.</p>
      </div>

      {errorMsg && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errorMsg}</div>}

      <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-10">Belum ada pesan. Mulai percakapan!</p>
          )}
          {messages.map((msg) => {
            const mine = msg.sender_id === session?.user?.id;
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                  mine ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                }`}>
                  {!mine && (
                    <p className="text-[10px] font-bold uppercase mb-1 opacity-70">
                      {msg.profiles?.full_name ?? 'User'} · {msg.profiles?.role}
                    </p>
                  )}
                  <p>{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${mine ? 'text-blue-200' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" disabled={loading || !newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
