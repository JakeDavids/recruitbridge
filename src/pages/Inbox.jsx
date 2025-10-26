import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Trash2, RefreshCw, Inbox as InboxIcon } from "lucide-react";

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const unreadParam = filter === 'unread' ? '?unreadOnly=true' : '';
      const response = await fetch(`/functions/inbox/list${unreadParam}`);
      
      if (response.status === 200) {
        const data = await response.json();
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    
    if (!message.isRead) {
      try {
        const response = await fetch('/functions/inbox/markRead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId: message.id, isRead: true })
        });
        
        if (response.ok) {
          setMessages(messages.map(m => 
            m.id === message.id ? { ...m, isRead: true } : m
          ));
          setUnreadCount(Math.max(0, unreadCount - 1));
        }
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm('Delete this message?')) return;
    
    try {
      const response = await fetch('/functions/inbox/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      });
      
      if (response.ok) {
        setMessages(messages.filter(m => m.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <InboxIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Inbox</h1>
            <p className="text-slate-600">Manage your incoming messages</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Message List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Messages</CardTitle>
                <Button variant="ghost" size="icon" onClick={loadMessages}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Unread
                  {unreadCount > 0 && (
                    <Badge className="ml-2" variant="secondary">{unreadCount}</Badge>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 text-center text-slate-500">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages {filter === 'unread' ? 'unread' : 'yet'}</p>
                </div>
              ) : (
                <div className="divide-y">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      onClick={() => handleSelectMessage(message)}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                      } ${!message.isRead ? 'font-semibold' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm text-slate-900 truncate flex-1">
                          {message.fromName || message.from}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          {formatDate(message.receivedAt)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-700 truncate mb-1">
                        {message.subject}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {message.textBody.substring(0, 100)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message Viewer */}
          <Card className="lg:col-span-2">
            {selectedMessage ? (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{selectedMessage.subject}</CardTitle>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div>
                          <strong>From:</strong> {selectedMessage.fromName || selectedMessage.from}
                          {selectedMessage.fromName && (
                            <span className="text-slate-400"> ({selectedMessage.from})</span>
                          )}
                        </div>
                        <div><strong>To:</strong> {selectedMessage.to}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(selectedMessage.receivedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedMessage.htmlBody ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: selectedMessage.htmlBody }}
                      className="prose prose-sm max-w-none"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {selectedMessage.textBody}
                    </pre>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-slate-400">
                  <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a message to read</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}