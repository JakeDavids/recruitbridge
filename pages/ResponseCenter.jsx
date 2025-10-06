
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Search,
  RefreshCw,
  Send,
  Loader2,
  Mail,
  Clock
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const API_BASE = "/functions/api/threads";

// Robust fetch helper with proper error handling
async function fetchJson(url, init = {}) {
  const res = await fetch(url, { credentials: 'include', ...init });
  const ct = res.headers.get('content-type') || '';
  const text = await res.text();
  let data = null;
  
  if (ct.includes('application/json')) {
    try { 
      data = JSON.parse(text); 
    } catch (e) {
      // Ignore JSON parse errors, data stays null
    }
  }
  
  if (!res.ok) {
    console.error('[threads api] error', { url, status: res.status, ct, text });
    throw new Error((data && (data.detail || data.message)) || `HTTP ${res.status}`);
  }
  
  return data ?? {};
}

export default function ResponseCenter() {
  const [user, setUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadThreads = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        limit: String(50),
        ...(searchTerm && { q: searchTerm }),
        ...(unreadOnly && { unreadOnly: 'true' })
      });

      const data = await fetchJson(`${API_BASE}/list?${qs.toString()}`);
      setThreads(data.items || []);
    } catch (error) {
      console.error("Error loading threads:", error);
    }
    setLoading(false);
  }, [searchTerm, unreadOnly]);

  useEffect(() => {
    loadUser();
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const loadThread = async (threadId) => {
    setLoadingThread(true);
    try {
      const data = await fetchJson(`${API_BASE}/get?id=${encodeURIComponent(threadId)}`);
      
      setSelectedThread(data.thread);
      setThreadMessages(data.messages || []);

      // Mark as read if unread
      if (data.thread.unreadCount > 0) {
        await markAsRead(threadId);
      }
    } catch (error) {
      console.error("Error loading thread:", error);
    }
    setLoadingThread(false);
  };

  const markAsRead = async (threadId) => {
    try {
      await fetchJson(`${API_BASE}/markRead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: threadId })
      });

      // Update thread in list
      setThreads(prev => prev.map(t =>
        t.id === threadId ? { ...t, unreadCount: 0 } : t
      ));

      // Update selected thread
      if (selectedThread?.id === threadId) {
        setSelectedThread(prev => ({ ...prev, unreadCount: 0 }));
      }
    } catch (error) {
      console.error("Error marking thread as read:", error);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedThread || !user) return;

    setSendingReply(true);

    try {
      // Find the other participant (not the current user)
      const userEmail = user.username ? `${user.username}@recruitbridge.net` : user.gmailEmail;
      const recipientEmail = selectedThread.participants.find(p =>
        p.toLowerCase() !== userEmail?.toLowerCase()
      );

      if (!recipientEmail) {
        alert("Could not determine recipient email");
        return;
      }

      // Get the last inbound message for In-Reply-To header
      const lastInboundMessage = [...threadMessages]
        .reverse()
        .find(msg => msg.direction === 'inbound');

      const replySubject = selectedThread.subject.startsWith('Re: ')
        ? selectedThread.subject
        : `Re: ${selectedThread.subject}`;

      const response = await fetch('/functions/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Thread-Id': selectedThread.id,
          ...(lastInboundMessage?.messageId && {
            'In-Reply-To': lastInboundMessage.messageId
          })
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: replySubject,
          text: replyText
        })
      });

      const result = await response.json();

      if (result.ok) {
        // Add message to current view immediately
        const newMessage = {
          id: `temp_${Date.now()}`,
          direction: 'outbound',
          from: userEmail,
          to: [recipientEmail],
          subject: replySubject,
          text: replyText,
          createdAt: new Date().toISOString()
        };

        setThreadMessages(prev => [...prev, newMessage]);
        setReplyText("");

        // Update thread in list
        setThreads(prev => prev.map(t =>
          t.id === selectedThread.id
            ? {
                ...t,
                lastMessageAt: new Date().toISOString(),
                lastSnippet: replyText.substring(0, 140)
              }
            : t
        ));
      } else {
        alert(`Failed to send reply: ${result.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    }

    setSendingReply(false);
  };

  const getOtherParticipant = (participants) => {
    if (!user) return '';
    const userEmail = user.username ? `${user.username}@recruitbridge.net` : user.gmailEmail;
    return participants.find(p => p.toLowerCase() !== userEmail?.toLowerCase()) || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Response Center</h1>
            <p className="text-slate-600">Manage coach replies and conversations</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel: Thread List */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={loadThreads}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {/* Search and filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="unread-only"
                    checked={unreadOnly}
                    onCheckedChange={setUnreadOnly}
                  />
                  <Label htmlFor="unread-only" className="text-sm">
                    Unread only
                  </Label>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : threads.length === 0 ? (
                <div className="text-center py-8 px-4 text-slate-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-xs mt-2">
                    Coaches will reply to: {user?.username ? `${user.username}@recruitbridge.net` : 'your email'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 p-4">
                  {threads.map(thread => (
                    <div
                      key={thread.id}
                      onClick={() => loadThread(thread.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedThread?.id === thread.id
                          ? 'bg-blue-50 border-l-4 border-l-blue-500'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {getOtherParticipant(thread.participants)}
                          </p>
                          <p className="font-medium text-sm truncate mt-1">
                            {thread.subject}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {thread.unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {thread.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(new Date(thread.lastMessageAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 truncate">
                        {thread.lastSnippet}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Panel: Thread Messages */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedThread ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg truncate">
                    {selectedThread.subject}
                  </CardTitle>
                  <CardDescription>
                    with {getOtherParticipant(selectedThread.participants)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loadingThread ? (
                      <div className="flex items-center justify-center h-40">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : (
                      threadMessages.map(message => (
                        <div
                          key={message.id}
                          className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.direction === 'outbound'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 text-slate-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            <p className={`text-xs mt-2 ${
                              message.direction === 'outbound' ? 'text-blue-100' : 'text-slate-500'
                            }`}>
                              {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Reply Composer */}
                  <div className="border-t p-4">
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500">
                          Replying to {getOtherParticipant(selectedThread.participants)}
                        </p>
                        <Button
                          onClick={sendReply}
                          disabled={!replyText.trim() || sendingReply}
                          size="sm"
                        >
                          {sendingReply ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a thread from the left to view messages</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
