/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { MessageSquare, Trash2, CheckCircle, Mail, Phone, Globe } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data);
      }
    } catch (_error) {
      // Silently ignore error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelectToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.length === messages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(messages.map(msg => msg._id));
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      });
      
      if (response.ok) {
        fetchMessages();
      }
    } catch (_error) {
      alert('Failed to mark message as read');
    }
  };

  const deleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`/api/messages/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setSelectedIds(prev => prev.filter(item => item !== id));
          fetchMessages();
        }
      } catch (_error) {
        alert('Failed to delete message');
      }
    }
  };

  const deleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected messages?`)) {
      try {
        const response = await fetch('/api/messages/bulk', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds })
        });
        if (response.ok) {
          setSelectedIds([]);
          fetchMessages();
        }
      } catch (_error) {
        alert('Failed to delete selected messages');
      }
    }
  };

  const deleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL messages? This cannot be undone.')) {
      try {
        const response = await fetch('/api/messages/bulk', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ all: true })
        });
        if (response.ok) {
          setSelectedIds([]);
          fetchMessages();
        }
      } catch (_error) {
        alert('Failed to delete all messages');
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif text-primary">Inquiry Inbox</h1>
          <p className="text-xs sm:text-base text-gray-500 mt-1">Manage incoming messages from potential clients and partners.</p>
        </div>
      </div>

      {/* Bulk Actions Header */}
      {messages.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[24px] border border-gray-100 shadow-xs">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="selectAll"
              className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
              checked={messages.length > 0 && selectedIds.length === messages.length}
              onChange={handleSelectAllToggle}
            />
            <label htmlFor="selectAll" className="text-xs sm:text-sm font-semibold text-primary cursor-pointer select-none">
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All Messages'}
            </label>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {selectedIds.length > 0 && (
              <button
                onClick={deleteSelected}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete Selected</span>
              </button>
            )}
            <button
              onClick={deleteAll}
              className="flex items-center space-x-2 border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Delete All</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6">
        {(messages || []).map((msg) => (
          <div 
            key={msg._id} 
            className={`bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[32px] border transition-all flex flex-col sm:flex-row items-start gap-4 group ${
              msg.status === 'unread' 
                ? 'border-secondary/30 shadow-lg shadow-secondary/5' 
                : 'border-gray-100 shadow-xs'
            }`}
          >
            {/* Selection Checkbox & Icon */}
            <div className="flex items-center justify-between w-full sm:w-auto shrink-0 sm:pt-1">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer accent-secondary"
                  checked={selectedIds.includes(msg._id)}
                  onChange={() => handleSelectToggle(msg._id)}
                />
                <div className={`p-2.5 sm:p-3 rounded-xl ${msg.status === 'unread' ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'}`}>
                  <MessageSquare size={18} />
                </div>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="flex items-center space-x-1 sm:hidden">
                {msg.status === 'unread' && (
                  <button 
                    onClick={() => markAsRead(msg._id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors cursor-pointer"
                    title="Mark as Read"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button 
                  onClick={() => deleteMessage(msg._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex-grow min-w-0 w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-primary text-base sm:text-lg flex items-center gap-2">
                    <span>{msg.name}</span>
                    {msg.status === 'unread' && (
                      <span className="bg-secondary/15 text-secondary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">New</span>
                    )}
                  </div>
                  <div className="text-xs text-mist flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1">
                    <a href={`mailto:${msg.email}`} className="flex items-center hover:text-secondary transition-colors hover:underline">
                      <Mail size={12} className="mr-1 shrink-0" /> <span className="truncate max-w-[200px] sm:max-w-none">{msg.email}</span>
                    </a>
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="flex items-center hover:text-secondary transition-colors hover:underline">
                        <Phone size={12} className="mr-1 shrink-0" /> {msg.phone}
                      </a>
                    )}
                    <span className="flex items-center">
                      <Globe size={12} className="mr-1 shrink-0" /> {msg.inquiryType || 'General'}
                    </span>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden sm:flex items-center space-x-1">
                  {msg.status === 'unread' && (
                    <button 
                      onClick={() => markAsRead(msg._id)}
                      className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-colors cursor-pointer"
                      title="Mark as Read"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMessage(msg._id)}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="text-gray-600 text-xs sm:text-sm leading-relaxed bg-pearl/50 p-4 sm:p-6 rounded-2xl border border-gray-50 italic">
                "{msg.message}"
              </div>
              <div className="mt-3 text-right">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Received {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        {!loading && (messages || []).length === 0 && (
          <div className="text-center py-20 sm:py-32 text-gray-400 font-serif italic text-base sm:text-lg">Inbox is currently empty.</div>
        )}
      </div>
    </div>
  );
}
