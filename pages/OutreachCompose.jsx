
import React, { useState, useEffect, useCallback, useRef } from "react";
import { OutreachLogs, MailThreads, Mailbox, Message, MailThread, CoachContact, Athlete, TargetedSchool } from "@/api/entities";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Send, Users, Filter, Copy, Wand2, RefreshCw, Plus, CheckCircle, AlertCircle, Loader2, Settings, RefreshCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { debounce } from "lodash";
import { syncReplies as syncGmailReplies } from "@/api/functions";
import IdentitySetup from "../components/identity/IdentitySetup";

// Helper for new inbox/send API
async function sendEmailViaInbox(payload) {
  const response = await fetch("/functions/mail/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to send email");
  }
  return data;
}

// Toast system component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <span>{message}</span>
      </div>
    </div>
  );
}

// Helper for Gmail email sending
async function sendEmailGmail(payload) {
  const response = await fetch("/api/sendEmailGmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (response.status === 401) {
    throw new Error("Gmail session expired. Please re-link your account.");
  }
  if (!response.ok) {
    throw new Error(data.error || "Unknown Gmail sending error");
  }
  return { success: true, id: data.id, ...data }; // Consistent return structure, using 'id' for message ID
}

// Helper for fetching current identity
async function getCurrentIdentity() {
  try {
    const identityResponse = await fetch("/functions/identity/public", {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "me" })
    });
    if (identityResponse.ok) {
      const identityData = await identityResponse.json();
      if (identityData.ok && identityData.identity) {
        return identityData.identity;
      }
    }
  } catch (err) {
    console.warn("[OutreachCompose] Could not load RecruitBridge identity:", err);
  }
  return null;
}

export default function OutreachCompose() {
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [targetedSchools, setTargetedSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoaches, setSelectedCoaches] = useState(new Set()); 
  const [loading, setLoading] = useState(true);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [generating, setGenerating] = useState(false);
  
  const [sending, setSending] = useState(0); // 0: not sending, 1: in progress, 2: finished
  const [sendProgress, setSendProgress] = useState(0);
  const [sendResults, setSendResults] = useState([]);
  const [bulkSending, setBulkSending] = useState(false);
  const [sentCoaches, setSentCoaches] = useState(new Set()); // To track successfully sent coaches in current session

  const [recruitBridgeIdentity, setRecruitBridgeIdentity] = useState(null);
  const [loadingIdentity, setLoadingIdentity] = useState(true); // New state for identity loading
  const [showIdentitySetup, setShowIdentitySetup] = useState(false); // New state for dismissible identity setup modal
  
  const [user, setUser] = useState(null);
  
  const [sendingMethod, setSendingMethod] = useState("recruitbridge");
  
  const [toast, setToast] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const colorPalette = React.useMemo(() => ([
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-rose-100 text-rose-800 border-rose-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200",
    "bg-teal-100 text-teal-800 border-teal-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    "bg-lime-100 text-lime-800 border-lime-200",
    "bg-sky-100 text-sky-800 border-sky-200"
  ]), []);
  const schoolColorMapRef = React.useRef({});

  const getSchoolColorClass = React.useCallback((schoolKey) => {
    const key = String(schoolKey || "").toLowerCase();
    if (!key) return "bg-slate-100 text-slate-700 border-slate-200";
    if (!schoolColorMapRef.current[key]) {
      // deterministic index by simple hash
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
      }
      const idx = hash % colorPalette.length;
      schoolColorMapRef.current[key] = colorPalette[idx];
    }
    return schoolColorMapRef.current[key];
  }, [colorPalette]);


  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  // Function to load identity as per prompt
  const loadIdentity = useCallback(async () => {
    setLoadingIdentity(true);
    try {
      const identityData = await getCurrentIdentity();
      setRecruitBridgeIdentity(identityData); // Update existing state
    } catch (error) {
      console.error("Error loading identity:", error);
    }
    setLoadingIdentity(false);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [currentUser, coachData] = await Promise.all([
        User.me(),
        CoachContact.list()
      ]);
      
      setUser(currentUser);
      setCoaches(coachData);

      if (currentUser && currentUser.id) {
        const athleteData = await Athlete.filter({ created_by: currentUser.email });
        const currentAthlete = athleteData[0];
        if (currentAthlete && currentAthlete.id) {
          const targetedData = await TargetedSchool.filter({ athlete_id: currentAthlete.id });
          setTargetedSchools(targetedData);
        }
      }

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('gmail') === 'linked') {
        showToast("Gmail account linked successfully!", "success");
        // No need to setSendingMethod here, the useEffect below will handle it
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (urlParams.get('error')) {
        showToast(`Gmail linking failed: ${urlParams.get('error')}`, "error");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }, [showToast]);

  // Combined effect to load all necessary data
  useEffect(() => {
    loadData();
    loadIdentity(); // Load identity on component mount
  }, [loadData, loadIdentity]); // Added loadIdentity dependency for useCallback

  // Effect to determine sending method and manage IdentitySetup modal once user and identity are loaded
  useEffect(() => {
    if (!user || loading) return;

    const isConfigured = !!(recruitBridgeIdentity?.address || user?.gmailLinked || user?.emailIdentityType);
    setShowIdentitySetup(!isConfigured);
    
    if (user?.gmailLinked) {
      setSendingMethod("gmail");
    } else if (recruitBridgeIdentity?.address) {
      setSendingMethod("recruitbridge");
    } else {
      setSendingMethod("recruitbridge");
    }
  }, [loading, user, recruitBridgeIdentity]);


  const filterCoaches = useCallback(() => {
    let filtered = coaches;

    if (searchTerm) {
      filtered = filtered.filter(coach => 
        coach.coach_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.coach_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const targetedSchoolIds = new Set(targetedSchools.map(ts => ts.school_id));
    filtered = filtered.filter(coach => targetedSchoolIds.has(coach.school_id));

    if (selectedSchool !== "all") {
      filtered = filtered.filter(coach => coach.school_id === selectedSchool);
    }

    setFilteredCoaches(filtered);
  }, [coaches, searchTerm, selectedSchool, targetedSchools]);

  useEffect(() => {
    filterCoaches();
  }, [filterCoaches]);


  const getUniqueSchools = () => {
    const targetedSchoolIds = new Set(targetedSchools.map(ts => ts.school_id));
    const uniqueSchoolIdsInTargeted = [...new Set(coaches
      .filter(coach => targetedSchoolIds.has(coach.school_id))
      .map(coach => coach.school_id)
    )];
    
    return uniqueSchoolIdsInTargeted;
  };

  const handleCoachSelection = (coachId, selected) => {
    setSelectedCoaches(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (selected) newSelected.add(coachId);
      else newSelected.delete(coachId);
      return newSelected;
    });
  };

  const handleSelectAll = (checked) => {
    setSelectedCoaches(checked ? new Set(filteredCoaches.map(c => c.id)) : new Set());
  };

  const generateWithAI = useCallback(async () => {
    setGenerating(true);
    try {
      const prompt = `Write a short, engaging, and professional email to a college coach. 
                      The email should express strong interest in their program and highlight enthusiasm.
                      Include placeholders for customization:
                      - [Coach's Name]
                      - [College Name]
                      - [Your Name]
                      - [Your Sport]
                      - [A specific reason you are interested in their program or a recent team achievement/statistic]
                      
                      Subject: Interest in [College Name] [Your Sport] Program - [Your Name]

                      Body:
                      Dear Coach [Coach's Name],

                      My name is [Your Name], and I am a [Your Sport] athlete from [Your High School/Club]. I am writing to express my strong interest in your [College Name] [Your Sport] program. I have been following your team's success, particularly [A specific reason you are interested in their program or a recent team achievement/statistic], and I am very impressed.

                      I believe my skills and dedication would be a great asset to your team. I am eager to learn more about your program and how I might contribute.

                      Thank you for your time and consideration. I look forward to hearing from you.

                      Sincerely,
                      [Your Name]
                      [Your Contact Info/Link to highlight video if applicable]
                      `;
      const response = await InvokeLLM({prompt});
      if (response) {
        const [generatedSubject, ...generatedBodyLines] = response.split('\n').filter(line => line.trim() !== '');
        setEmailSubject(generatedSubject.replace('Subject: ', ''));
        setEmailBody(generatedBodyLines.join('\n'));
        showToast("Email generated successfully!", "success");
      }
    } catch (error) {
      console.error("Error generating email:", error);
      showToast("Failed to generate email.", "error");
    }
    setGenerating(false);
  }, [showToast]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  const handleGmailRelink = () => {
    window.location.href = "/api/gmail/auth/start";
  };

  const getUserEmailAddress = () => {
    if (sendingMethod === 'gmail' && user?.gmailEmail) {
      return user.gmailEmail;
    } else if (sendingMethod === 'recruitbridge' && recruitBridgeIdentity?.address) {
      return recruitBridgeIdentity.address;
    }
    return "Setup Required";
  };
  
  const isIdentityConfigured = !!recruitBridgeIdentity?.address || user?.gmailLinked || user?.emailIdentityType;

  const subjectSuggestions = [
    "Interest in [School Name] Football Program - [Your Name]",
    "[Your Name] - [Position] from [High School] - Class of [Year]",
    "Recruiting Inquiry: [Your Name] - [Position]",
    "[Your Name] - [State] [Position] Seeking Opportunity",
    "Class of [Year] [Position] - [Your Name]"
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSend = useCallback(async (coach) => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    if (!emailSubject || !emailBody) {
      return { success: false, error: "Email subject and body cannot be empty." };
    }

    let success = false;
    let errorMessage = null;
    let messageId = null;

    try {
      let response;
      if (sendingMethod === 'gmail') {
        response = await sendEmailGmail({
          to: coach.coach_email,
          subject: emailSubject,
          text: emailBody,
        });
        if (response.success) {
          success = true;
          messageId = response.id;
        } else {
          throw new Error(response.error || 'Failed to send Gmail email');
        }
      } else { 
        if (!recruitBridgeIdentity?.address && !user?.emailIdentityType) { // Check for address or generic emailIdentityType
          throw new Error("Email sending identity not configured.");
        }
        
        response = await sendEmailViaInbox({
          to: coach.coach_email,
          subject: emailSubject,
          text: emailBody,
        });
        
        if (response && response.ok) {
          success = true;
          messageId = response.id;
        } else {
          throw new Error(response?.detail || 'Failed to send email');
        }
      }

      if (success) {
        const mailboxes = await Mailbox.filter({ userId: user.id });
        const relevantMailbox = mailboxes.find(m => 
          sendingMethod === 'gmail' ? m.type === 'GMAIL' : (m.replyTo && m.replyTo.includes('recruitbridge.net')) || m.type === user.emailIdentityType
        );
        const mailboxId = relevantMailbox?.id;

        try {
          if (mailboxId) {
            const fromAddress = relevantMailbox.address;
            const participants = [coach.coach_email.toLowerCase(), fromAddress.toLowerCase()].sort().join(",");
            
            let thread;
            const existingThreads = await MailThread.filter({ userId: user.id, subject: emailSubject, participants });

            if (existingThreads.length > 0) {
              thread = existingThreads[0];
            } else {
              thread = await MailThread.create({ userId: user.id, subject: emailSubject, participants });
            }

            await Message.create({
              threadId: thread.id,
              mailboxId: mailboxId,
              direction: "OUT",
              to: coach.coach_email,
              from: fromAddress,
              subject: emailSubject,
              text: emailBody,
              providerId: messageId,
              status: 'sent',
            });
          }

          if (coach.response_status !== 'contacted') {
            await CoachContact.update(coach.id, { response_status: "contacted" });
          }
        } catch (logError) {
          console.warn("Failed to log outreach or update coach status:", logError.message || logError);
        }
        
        setSentCoaches(prev => new Set(prev).add(coach.id));
      }

    } catch (error) {
      console.error("Sending error:", error.message || error);
      errorMessage = error.message || error.toString() || 'Unknown error occurred';
      success = false;
    }
    
    return { success, error: errorMessage, messageId };
  }, [user, emailSubject, emailBody, sendingMethod, recruitBridgeIdentity, setSentCoaches]);
  
  const handleBulkSend = async () => {
    if (selectedCoaches.size === 0 || !emailSubject || !emailBody) {
      showToast("Please select coaches and fill out the email subject and body.", "error");
      return;
    }
    if (!isIdentityConfigured) {
      showToast("Please configure an email sending identity first.", "error");
      setShowIdentitySetup(true); // Use new state
      return;
    }

    setBulkSending(true);
    setSending(1);
    setSendProgress(0);
    setSendResults([]);

    const selectedCoachesList = coaches.filter(coach => selectedCoaches.has(coach.id));
    let overallSuccessCount = 0;
    let overallFailCount = 0;
    const currentSendResults = [];

    for (let i = 0; i < selectedCoachesList.length; i++) {
      const coach = selectedCoachesList[i];
      
      const result = await handleSend(coach);
      
      if (result.success) {
        overallSuccessCount++;
        currentSendResults.push({ coach, status: "sent", error: null });
      } else {
        overallFailCount++;
        const errorMsg = result.error || 'Unknown error';
        currentSendResults.push({ coach, status: "failed", error: errorMsg });
        console.error(`Failed to send to ${coach.coach_name}:`, errorMsg);
      }
      setSendResults([...currentSendResults]);
      setSendProgress(((i + 1) / selectedCoachesList.length) * 100);
    }

    setBulkSending(false);
    setSending(2);
    
    showToast(`Bulk send complete: ${overallSuccessCount} sent, ${overallFailCount} failed.`, overallFailCount === 0 ? "success" : "error");
    setSelectedCoaches(new Set());
    loadData(); // Reload data to update coach statuses
    loadIdentity(); // Reload identity in case setup changed during send process
  };

  const handleSyncReplies = async () => {
    setSyncing(true);
    showToast("Syncing Gmail replies...", "success");
    try {
      const { data } = await syncGmailReplies();
      showToast(`Synced ${data.synced} new messages!`, "success");
    } catch (error) {
      console.error("Sync error:", error);
      showToast("Failed to sync replies.", "error");
    }
    setSyncing(false);
  };

  const selectedCoachDetails = coaches.filter(c => selectedCoaches.has(c.id));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Only show modal if not configured */}
      {!(recruitBridgeIdentity?.address || user?.gmailLinked || user?.emailIdentityType) && showIdentitySetup && (
        <Dialog open={showIdentitySetup} onOpenChange={setShowIdentitySetup}>
          <DialogContent className="max-w-2xl w-full mx-4">
             <IdentitySetup 
              onClose={() => setShowIdentitySetup(false)}
              onSuccess={async () => {
                setShowIdentitySetup(false);
                await loadIdentity();
              }} 
            />
          </DialogContent>
        </Dialog>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Outreach Center</h1>
              <p className="text-slate-600">Select coaches and send personalized emails</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setShowIdentitySetup(true)} className="flex items-center gap-2"> 
              <Settings className="w-4 h-4" />
              Email Settings
            </Button>
            {user?.gmailLinked && (
              <Button variant="outline" onClick={handleSyncReplies} disabled={syncing} className="flex items-center gap-2">
                {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                Sync Replies
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Coach Selection */}
          <Card className="md:col-span-1 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-500" />
                Coaches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Search coaches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by school" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Target Schools</SelectItem>
                    {getUniqueSchools().map(schoolId => {
                      const schoolCoach = coaches.find(c => c.school_id === schoolId);
                      return schoolCoach ? (
                        <SelectItem key={schoolId} value={schoolId}>
                          {schoolCoach.school_name || `School ${schoolId}`}
                        </SelectItem>
                      ) : null;
                    })}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectAll"
                    checked={selectedCoaches.size === filteredCoaches.length && filteredCoaches.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="selectAll">Select All ({selectedCoaches.size}/{filteredCoaches.length})</Label>
                </div>
                <Separator />
                <div className="max-h-[60vh] overflow-y-auto">
                  {filteredCoaches.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No coaches found from your target schools.</p>
                  ) : (
                    filteredCoaches.map(coach => (
                      <div key={coach.id} className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-md">
                        <Checkbox
                          id={`coach-${coach.id}`}
                          checked={selectedCoaches.has(coach.id)}
                          onCheckedChange={(checked) => handleCoachSelection(coach.id, checked)}
                        />
                        <Label htmlFor={`coach-${coach.id}`} className="block w-full">
                          <p className="font-medium">{coach.coach_name}</p>
                          <p className="text-sm text-slate-600">{coach.coach_title} - {coach.school_name}</p>
                          <p className="text-xs text-slate-500">{coach.coach_email}</p>
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Composer */}
          <div className="md:col-span-2 space-y-6">
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>Email Composer</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="email">
                  <TabsList>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="x" disabled>X (Coming Soon)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="email" className="space-y-4">
                    <div>
                      <Label htmlFor="to" className="font-semibold">To:</Label>
                      <div className="mt-1 border rounded-lg p-2 bg-slate-50 h-20 overflow-y-auto">
                        {selectedCoachDetails.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedCoachDetails.map(coach => (
                              <Badge
                                key={coach.id}
                                variant="secondary"
                                title={coach.school_name || 'School'}
                                className={`${getSchoolColorClass(coach.school_id || coach.school_name)} border`}
                              >
                                {coach.coach_name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400">Select coaches from the list on the left</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="subject">Subject</Label>
                        <div className="text-xs text-slate-500">
                          💡 <strong>Tip:</strong> Use your name, position, and graduation year
                        </div>
                      </div>
                      <Input
                        id="subject"
                        placeholder="Interest in [School Name] Football Program - [Your Name]"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="mt-1"
                      />
                      <div className="mt-2 text-xs text-slate-500">
                        <p><strong>Examples:</strong></p>
                        <ul className="list-disc list-inside">
                          {subjectSuggestions.slice(0, 3).map((suggestion, idx) => (
                            <li key={idx} className="truncate">{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="body">Body</Label>
                      <Textarea
                        id="body"
                        placeholder="Craft your compelling message..."
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        rows={10}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={generateWithAI} disabled={generating} variant="outline" className="flex items-center gap-2">
                        {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        Generate with AI
                      </Button>
                      <Button onClick={() => copyToClipboard(emailSubject + '\n\n' + emailBody)} variant="outline" className="flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        Copy Email
                      </Button>
                      <Button onClick={() => { setEmailSubject(''); setEmailBody(''); }} variant="outline" className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Clear
                      </Button>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-semibold mt-4 mb-2">Email Preview</h3>
                    <div className="border rounded-lg p-4 bg-slate-50 min-h-[150px]">
                      {emailSubject && <p className="font-bold mb-2">Subject: {emailSubject}</p>}
                      {(emailSubject || emailBody) && <Separator className="my-2" />}
                      {emailBody && (
                        <ReactMarkdown className="prose prose-sm max-w-none">
                          {emailBody}
                        </ReactMarkdown>
                      )}
                      {!emailSubject && !emailBody && (
                        <p className="text-slate-400 text-center py-8">
                          Start composing your message to see the preview here
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">Sending via:</span>
                          <span className="text-sm font-medium text-slate-800">{getUserEmailAddress()}</span>
                        </div>
                        <Select 
                          value={sendingMethod} 
                          onValueChange={setSendingMethod} 
                          disabled={!user?.gmailLinked && !recruitBridgeIdentity?.address && !user?.emailIdentityType}
                        >
                          <SelectContent>
                            <SelectItem value="recruitbridge" disabled={!recruitBridgeIdentity?.address && !user?.emailIdentityType}>RecruitBridge</SelectItem>
                            {user?.gmailLinked && (
                              <SelectItem value="gmail">Gmail</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">
                          Selected: {selectedCoaches.size}
                        </span>
                        <Button
                          onClick={handleBulkSend}
                          disabled={bulkSending || selectedCoaches.size === 0 || !emailSubject || !emailBody || !isIdentityConfigured}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600"
                        >
                          {bulkSending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Send Emails
                        </Button>
                      </div>
                    </div>
                    
                    {sending > 0 && (
                      <div className="mt-4 space-y-2">
                        <Progress value={sendProgress} className="w-full" />
                        <p className="text-sm text-slate-600 text-center">
                          Sending {Math.round(sendProgress)}% complete ({sendResults.length}/{selectedCoaches.size})
                        </p>
                        {sending === 2 && sendResults.length > 0 && (
                          <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                            {sendResults.map((result, index) => (
                              <div key={index} className="flex items-center text-sm gap-2">
                                {result.status === "sent" ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className={result.status === "sent" ? "text-slate-700" : "text-red-700"}>
                                  {result.coach.coach_name} ({result.coach.coach_email}): {result.status} {result.error ? `- ${result.error}` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
