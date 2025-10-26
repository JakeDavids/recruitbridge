
import React, { useState, useEffect } from "react";
import { Athlete, School, TargetedSchool, CoachContact, Outreach } from "@/api/entities";
import { User } from "@/api/entities";
import { InvokeLLM, SendEmail } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Clipboard, Check, Wand2, User as UserIcon, Mail, ExternalLink, Plus, AlertCircle, Sparkles as SparklesIcon, X, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const staffDirectoryLinks = {
  "University of Louisville": "https://gocards.com/staff-directory",
  "University of Miami": "https://miamihurricanes.com/staff-directory/football/",
  "Clemson University": "https://clemsontigers.com/staff-directory/",
  "University of Florida": "https://floridagators.com/sports/football/coaches",
  "Vanderbilt University": "https://vucommodores.com/staff-directory/football/",
  "Rice University": "https://riceowls.com/staff-directory",
  "Southern Methodist University": "https://smumustangs.com/sports/football/coaches",
  "Louisiana State University": "https://lsusports.net/staff-directory/",
  "University of Mississippi": "https://olemisssports.com/staff-directory",
  "University of North Texas": "https://meangreensports.com/staff-directory",
  "Virginia Tech": "https://hokiesports.com/staff-directory/department/football",
  "United States Naval Academy": "https://navysports.com/staff-directory",
  "University of South Carolina": "https://gamecocksonline.com/staff-directory/football-803-777-4271/",
  "Boston College": "https://bceagles.com/staff-directory",
  "Syracuse University": "https://cuse.com/staff-directory",
  "University of Texas at San Antonio": "https://goutsa.com/sports/football/coaches",
  "University of South Florida": "https://gousfbulls.com/sports/football/coaches",
  "Auburn University": "https://auburn.edu/sports/football/coaches",
  "University of Memphis": "https://gotigersgo.com/staff-directory",
  "United States Military Academy": "https://goarmywestpoint.com/sports/football/coaches",
  "University of Alabama at Birmingham": "https://uabsports.com/sports/football/coaches/1000",
  "University of Alabama": "https://rolltide.com/sports/football/coaches",
  "University of Kentucky": "https://ukathletics.com/staff-directory",
  "University of Oklahoma": "https://soonersports.com/staff-directory",
  "University of North Carolina at Charlotte": "https://charlotte49ers.com/staff-directory",
  "University of Missouri": "https://mutigers.com/staff-directory",
  "Florida State University": "https://seminoles.com/staff-directory",
  "Georgia Institute of Technology": "https://ramblinwreck.com/sports/football/coaches",
  "University of Arkansas": "https://arkansasrazorbacks.com/staff-directory",
  "Wake Forest University": "https://godeacs.com/staff-directory",
  "University of Texas at Austin": "https://texassports.com/sports/football/coaches",
  "Florida Atlantic University": "https://fausports.com/staff-directory",
  "University of Pittsburgh": "https://pittsburghpanthers.com/sports/football/coaches",
  "Tulane University": "https://tulanegreenwave.com/sports/football/coaches",
  "University of Georgia": "https://georgiadogs.com/staff-directory",
  "University of Tulsa": "https://tulsahurricane.com/sports/football/coaches",
  "North Carolina State University": "https://gopack.com/sports/football/coaches",
  "University of California, Berkeley": "https://calbears.com/sports/football/coaches",
  "University of Virginia": "https://virginiasports.com/sports/football/coaches",
  "University of Tennessee": "https://utsports.com/sports/football/coaches",
  "Stanford University": "https://gostanford.com/staff-directory/department/football",
  "University of North Carolina at Chapel Hill": "https://goheels.com/sports/football/coaches",
  "Duke University": "https://goduke.com/staff-directory",
  "Mississippi State University": "https://hailstate.com/staff-directory",
  "Texas A&M University": "https://12thman.com/sports/football/coaches",
  "East Carolina University": "https://ecupirates.com/sports/football/coaches",
  "Temple University": "https://owlsports.com/staff-directory"
};

export default function OutreachPage() {
  const [athlete, setAthlete] = useState(null);
  const [user, setUser] = useState(null);
  const [targetedSchools, setTargetedSchools] = useState([]);
  const [schools, setSchools] = useState([]);
  const [coachContacts, setCoachContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedCoachContactId, setSelectedCoachContactId] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outreachChannel, setOutreachChannel] = useState("email"); // Default to email

  // Email sending states
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Modal states
  const [isAddCoachModalOpen, setIsAddCoachModalOpen] = useState(false);
  const [selectedSchoolForCoach, setSelectedSchoolForCoach] = useState("");
  const [newCoach, setNewCoach] = useState({
    coach_name: "",
    coach_title: "",
    coach_email: "",
    coach_twitter: "",
    response_status: "not_contacted"
  });

  const isAiEnabled = user?.plan === 'core' || user?.plan === 'unlimited';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedSchoolId && targetedSchools.length > 0) {
      setSelectedSchoolId(targetedSchools[0].school_id);
    }
  }, [targetedSchools, selectedSchoolId]);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const athleteData = await Athlete.filter({ created_by: currentUser.email });
      const currentAthlete = athleteData[0] || null;
      
      const [targetedData, schoolData, coachContactData] = await Promise.all([
        currentAthlete ? TargetedSchool.filter({ athlete_id: currentAthlete.id }) : Promise.resolve([]),
        School.list(),
        currentAthlete ? CoachContact.filter({ athlete_id: currentAthlete.id }) : Promise.resolve([])
      ]);

      setAthlete(currentAthlete);
      setTargetedSchools(targetedData);
      setSchools(schoolData);
      setCoachContacts(coachContactData);
    } catch (error) {
      console.error("Error loading outreach data:", error);
    }
    setLoading(false);
  };
  
  const getSchoolDetails = (schoolId) => schools.find(s => s.id === schoolId);
  const getCoachContactDetails = (coachContactId) => coachContacts.find(c => c.id === coachContactId);
  const getCoachesForSchool = (schoolId) => coachContacts.filter(c => c.school_id === schoolId);

  const handleAddCoach = (schoolId) => {
    setSelectedSchoolForCoach(schoolId);
    setNewCoach({
      coach_name: "",
      coach_title: "",
      coach_email: "",
      coach_twitter: "",
      response_status: "not_contacted"
    });
    setIsAddCoachModalOpen(true);
  };

  const handleSaveCoach = async () => {
    if (!athlete || !selectedSchoolForCoach || !newCoach.coach_name) {
      alert("Please fill in at least coach name and select a school.");
      return;
    }
    
    try {
      await CoachContact.create({
        athlete_id: athlete.id,
        school_id: selectedSchoolForCoach,
        ...newCoach,
        response_status: "not_contacted"
      });
      
      setIsAddCoachModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving coach contact:", error);
      alert("An error occurred while saving the coach. Please try again.");
    }
  };

  const handleGenerateMessage = async () => {
    if (!athlete || !selectedCoachContactId) {
        alert("Please select a coach to generate a message.");
        return;
    }

    // Check AI generation limits based on plan
    if (!isAiEnabled) {
        alert("AI message generation requires Core or Unlimited plan. Please upgrade to access this feature!");
        return;
    }

    setGenerating(true);
    setGeneratedMessage("");
    setEmailSubject("");
    setEmailBody("");
    
    const targetCoachContact = getCoachContactDetails(selectedCoachContactId);
    const targetSchool = targetCoachContact ? getSchoolDetails(targetCoachContact.school_id) : null;

    const promptBase = `
        You are an expert in crafting outreach messages for high school athletes to college coaches.
        
        Athlete's Information:
        - Name: ${athlete.first_name} ${athlete.last_name}
        - Sport: ${athlete.sport}, Position: ${athlete.position}, Grad Year: ${athlete.graduation_year}
        - Academics: GPA: ${athlete.gpa}
        - Highlights Link: ${athlete.highlights_url || 'Available upon request'}
    `;

    try {
        let prompt;
        // Since only email outreach is active, the prompt will always be for email.
        prompt = `${promptBase}
            Write a polite, professional, and concise initial outreach email from the athlete to a college coach.
            ${targetCoachContact && targetSchool ? `
            Coach's Information:
            - Name: ${targetCoachContact.coach_name}, Title: ${targetCoachContact.coach_title}
            - School: ${targetSchool?.name}
            ` : ''}
            
            Ensure a professional closing.
            
            Return the response in this exact format:
            Subject: [subject line]
            
            [email body]
        `;

        const result = await InvokeLLM({ prompt });
        setGeneratedMessage(result);
        
        // This parsing logic is for email, which is now the only active channel.
        const subjectMatch = result.match(/Subject:\s*(.*)\n/i);
        const subjectLine = subjectMatch ? subjectMatch[1].trim() : `${athlete.position} | ${athlete.first_name} ${athlete.last_name} | Class of ${athlete.graduation_year}`;
        setEmailSubject(subjectLine);

        const bodyStartIndex = result.indexOf(subjectMatch ? subjectMatch[0] : '\n') + (subjectMatch ? subjectMatch[0].length : 0);
        let body = result.substring(bodyStartIndex).trim();
        if (body.startsWith('Subject:')) {
            body = body.substring(body.indexOf('\n') + 1).trim();
        }
        setEmailBody(body);
        
    } catch (error) {
      console.error("Error generating message:", error);
      setGeneratedMessage("Sorry, there was an error generating the message. Please try again.");
      setEmailSubject("");
      setEmailBody("");
    }
    setGenerating(false);
  };

  const handleSendEmail = async () => {
    if (!athlete || !emailSubject || !emailBody || !user || !selectedCoachContactId) return; 

    // Check outreach limits based on plan
    const isUnlimited = user?.plan === 'unlimited';
    const monthlyLimits = {
        'starter': 25,
        'core': 75,
        'unlimited': Infinity
    };
    
    // This is a simplified check. A full implementation would require tracking usage over time.
    if (!isUnlimited) {
        if (user.plan === 'free' || !user.plan) {
            alert("Please upgrade to send outreach emails!");
            return;
        } else {
            // For paid plans, a real app would check a usage counter.
            // For this demo, we'll just show the concept.
            console.log(`User on ${user.plan} plan can send up to ${monthlyLimits[user.plan]} messages/month.`);
        }
    }

    setSending(true);
    setEmailSent(false);
    
    try {
        const coachContact = getCoachContactDetails(selectedCoachContactId);
        const school = coachContact ? getSchoolDetails(coachContact.school_id) : null;
        
        if (!coachContact || !coachContact.coach_email) {
          alert("This coach doesn't have an email address on file. Please add their email first.");
          setSending(false);
          return;
        }

        await SendEmail({
          from_name: `${athlete.first_name} ${athlete.last_name}`,
          to: coachContact.coach_email,
          subject: emailSubject,
          body: emailBody
        });

        await CoachContact.update(coachContact.id, {
          ...coachContact,
          response_status: "sent",
          date_contacted: new Date().toISOString().split('T')[0]
        });

        await Outreach.create({
          athlete_id: athlete.id,
          coach_id: coachContact.id,
          school_id: school?.id,
          subject: emailSubject,
          message: emailBody,
          message_type: 'initial_outreach',
          status: 'sent',
          sent_date: new Date().toISOString()
        });

        setEmailSent(true);
        loadData();
        
        setTimeout(() => {
          setSelectedCoachContactId("");
          setGeneratedMessage("");
          setEmailSubject("");
          setEmailBody("");
          setEmailSent(false);
        }, 3000);
      
    } catch (error) {
      console.error("Error during email send process:", error);
      alert("An error occurred during the email sending process. Please try again.");
    }
    setSending(false);
  };

  const handleCopy = () => {
    // With only email active, always copy email subject and body
    navigator.clipboard.writeText(`${emailSubject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // handleMarkAsSent function removed as it was specific to non-email outreach (Twitter DM)

  const getStatusColor = (status) => {
    switch (status) {
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'opened':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_contacted':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Send className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">
              Outreach Center
              {(user?.plan === 'core' || user?.plan === 'unlimited') && (
                <Badge variant="outline" className="ml-2 border-purple-300 text-purple-600">
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  AI Enabled
                </Badge>
              )}
            </h1>
            <p className="text-slate-600">Generate and send personalized messages to coaches</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Select School & Coach */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>1. Select Coach to Contact</CardTitle>
              </CardHeader>
              <CardContent>
                {/* School Selection */}
                <div className="mb-6">
                  <Label className="text-base font-medium mb-3 block">Choose School</Label>
                  <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a school..." />
                    </SelectTrigger>
                    <SelectContent>
                      {targetedSchools.map(ts => {
                        const school = getSchoolDetails(ts.school_id);
                        return school ? (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ) : null;
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Coach Management */}
                {selectedSchoolId && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Available Coaches</Label>
                      <div className="flex gap-2">
                        {staffDirectoryLinks[getSchoolDetails(selectedSchoolId)?.name] && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(staffDirectoryLinks[getSchoolDetails(selectedSchoolId)?.name], '_blank')}
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Staff Directory
                          </Button>
                        )}
                        <Button
                          onClick={() => handleAddCoach(selectedSchoolId)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Coach
                        </Button>
                      </div>
                    </div>

                    {/* Coach Cards */}
                    {getCoachesForSchool(selectedSchoolId).length > 0 ? (
                      <div className="space-y-3">
                        {getCoachesForSchool(selectedSchoolId).map(coach => (
                          <Card key={coach.id} className={`cursor-pointer transition-all ${
                            selectedCoachContactId === coach.id 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:bg-slate-50'
                          }`}>
                            <CardContent className="p-4" onClick={() => {
                              if (selectedCoachContactId === coach.id) {
                                setSelectedCoachContactId("");
                              } else {
                                setSelectedCoachContactId(coach.id);
                              }
                            }}>
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">{coach.coach_name}</h4>
                                  <p className="text-sm text-slate-600">{coach.coach_title}</p>
                                  {coach.coach_email ? (
                                    <p className="text-xs text-slate-500 mt-1">{coach.coach_email}</p>
                                  ) : (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                      <AlertCircle className="w-3 h-3"/> No email on file
                                    </p>
                                  )}
                                  {coach.coach_twitter && (
                                    <p className="text-xs text-blue-500 mt-1">{coach.coach_twitter}</p>
                                  )}
                                </div>
                                <Badge className={getStatusColor(coach.response_status)}>
                                  {coach.response_status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <UserIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No coaches added for this school yet.</p>
                        <p className="text-sm">Click "Add Coach" or use the Staff Directory link to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Generate & Send Message */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  2. Generate & Send Message
                  {(user?.plan === 'core' || user?.plan === 'unlimited') && (
                    <Badge variant="outline" className="ml-2 border-purple-300 text-purple-600">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      AI Enabled
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={outreachChannel} onValueChange={(value) => {
                  setOutreachChannel(value);
                  setGeneratedMessage("");
                  setEmailSubject("");
                  setEmailBody("");
                }}>
                  <TabsList className="grid w-full grid-cols-1"> {/* Changed grid-cols-2 to grid-cols-1 */}
                    <TabsTrigger value="email">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </TabsTrigger>
                    {/* X/Twitter tab removed */}
                  </TabsList>

                  <TabsContent value="email" className="space-y-4">
                    <Button 
                      onClick={handleGenerateMessage} 
                      disabled={!isAiEnabled || !selectedCoachContactId || generating} 
                      className="w-full"
                    >
                      {!isAiEnabled ? <Lock className="w-4 h-4 mr-2" />
                        : generating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                      {generating ? 'Generating...' : isAiEnabled ? 'Generate Email with AI' : 'Upgrade to Use AI'}
                    </Button>
                    
                    <div>
                      <Label htmlFor="email-subject">Subject Line</Label>
                      <Input
                        id="email-subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Email subject..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email-body">Email Body</Label>
                      <Textarea
                        id="email-body"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Email content will appear here..."
                        rows={12}
                        className="bg-slate-50"
                      />
                    </div>
                    
                    {emailSent && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">Email sent successfully!</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={handleCopy} className="flex-1">
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Clipboard className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button 
                        onClick={handleSendEmail} 
                        className="flex-1"
                        disabled={sending || !emailSubject || !emailBody || emailSent || !selectedCoachContactId}
                      >
                        {sending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Email
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <p className="text-sm text-blue-800">
                        <X className="w-4 h-4 inline mr-1" />
                        <strong>X (Twitter) Outreach Coming Soon!</strong>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Direct messaging functionality will be available in a future update.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Coach Modal */}
        <Dialog open={isAddCoachModalOpen} onOpenChange={setIsAddCoachModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Coach Contact</DialogTitle>
              <DialogDescription>
                Add a coach from {getSchoolDetails(selectedSchoolForCoach)?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-4 py-4">
              <div>
                <Label htmlFor="coach_name">Coach Name *</Label>
                <Input
                  id="coach_name"
                  value={newCoach.coach_name}
                  onChange={(e) => setNewCoach({...newCoach, coach_name: e.target.value})}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="coach_title">Title/Position</Label>
                <Input
                  id="coach_title"
                  value={newCoach.coach_title}
                  onChange={(e) => setNewCoach({...newCoach, coach_title: e.target.value})}
                  placeholder="e.g., Head Coach, Recruiting Coordinator"
                />
              </div>
              <div>
                <Label htmlFor="coach_email">Email Address</Label>
                <Input
                  id="coach_email"
                  type="email"
                  value={newCoach.coach_email}
                  onChange={(e) => setNewCoach({...newCoach, coach_email: e.target.value})}
                  placeholder="coach@school.edu"
                />
              </div>
              <div>
                <Label htmlFor="coach_twitter">Twitter/X Handle</Label>
                <Input
                  id="coach_twitter"
                  value={newCoach.coach_twitter}
                  onChange={(e) => setNewCoach({...newCoach, coach_twitter: e.target.value})}
                  placeholder="@coachhandle"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCoachModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCoach} disabled={!newCoach.coach_name || !selectedSchoolForCoach}>
                Add Coach
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
