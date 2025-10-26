
import React, { useState, useEffect, useCallback } from "react";
import { CoachContact, School, Athlete, SchoolConnection, TargetedSchool, Outreach, Coach } from "@/api/entities";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableTableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Edit, Bot, Trash2, Plus, Network, Search, Loader2 } from "lucide-react";
import { format } from "date-fns";

function AIFollowUpModal({ isOpen, onClose, coachContact, athlete, onFollowUpGenerated }) {
  const [coachReply, setCoachReply] = useState("");
  const [generatedFollowUp, setGeneratedFollowUp] = useState("");
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    if (!isOpen) {
      setCoachReply("");
      setGeneratedFollowUp("");
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!coachReply) return;
    setGenerating(true);
    const prompt = `
        An athlete, ${athlete?.first_name || 'the athlete'}, received this reply from a coach: "${coachReply}".
        Based on this reply, generate a short, polite, and professional follow-up email.
        If the reply is positive, express thanks and excitement.
        If the reply is neutral or negative, thank the coach for their time and keep the door open.
        Ensure the tone is appropriate for an athlete communicating with a college coach.
    `;
    try {
      const result = await InvokeLLM({ prompt });
      setGeneratedFollowUp(result);
      // Automatically update the status to replied
      await CoachContact.update(coachContact.id, { 
        ...coachContact,
        response_status: "replied",
        follow_up_notes: coachReply
      });
      onFollowUpGenerated();
    } catch(e) {
      console.error("AI Follow-up Error:", e);
      setGeneratedFollowUp("Error generating follow-up. Please try again.");
    }
    setGenerating(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            AI Follow-Up Generator
          </DialogTitle>
          <DialogDescription>
            Paste the coach's reply below and get an AI-generated professional follow-up response
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div>
                <Label htmlFor="coachReply">Coach's Reply</Label>
                <Textarea 
                  id="coachReply" 
                  value={coachReply} 
                  onChange={e => setCoachReply(e.target.value)} 
                  rows={8} 
                  placeholder="Paste the coach's email response here..."
                  className="mt-2"
                />
                <Button onClick={handleGenerate} disabled={generating || !coachReply} className="mt-3 w-full">
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Bot className="w-4 h-4 mr-2"/>
                        Generate Follow-Up
                      </>
                    )}
                </Button>
            </div>
            <div>
                <Label htmlFor="generatedFollowUp">Generated Follow-Up</Label>
                <Textarea 
                  id="generatedFollowUp" 
                  value={generatedFollowUp} 
                  readOnly 
                  rows={8} 
                  className="bg-slate-50 mt-2"
                  placeholder="Your AI-generated follow-up will appear here..."
                />
                {generatedFollowUp && (
                  <Button 
                    variant="outline" 
                    className="mt-3 w-full" 
                    onClick={() => navigator.clipboard.writeText(generatedFollowUp)}
                  >
                    Copy Follow-Up
                  </Button>
                )}
            </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConnectionModal({ isOpen, onClose, coachContact, school, athlete, onConnectionSaved, allSchools, targetedSchools, getSchoolName }) {
  const [newConnection, setNewConnection] = useState({
    connection_type: "family",
    connection_description: "",
    contact_name: "",
    contact_title: "",
    relationship_strength: "moderate",
    notes: ""
  });
  const [localSelectedSchoolId, setLocalSelectedSchoolId] = useState("");
  const [existingConnections, setExistingConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadExistingConnections = useCallback(async (schoolId) => {
    if (!athlete || !schoolId) return;
    setLoading(true);
    try {
      const connections = await SchoolConnection.filter({ 
        athlete_id: athlete.id, 
        school_id: schoolId 
      });
      setExistingConnections(connections);
    } catch (error) {
      console.error("Error loading existing connections:", error);
    }
    setLoading(false);
  }, [athlete]);

  useEffect(() => {
    if (!isOpen) {
      setNewConnection({
        connection_type: "family",
        connection_description: "",
        contact_name: "",
        contact_title: "",
        relationship_strength: "moderate",
        notes: ""
      });
      setLocalSelectedSchoolId(""); 
      setExistingConnections([]);
    } else if (school) {
      setLocalSelectedSchoolId(school.id);
      loadExistingConnections(school.id);
    }
  }, [isOpen, school, loadExistingConnections]);

  const handleSave = async () => {
    const schoolIdToSave = school?.id || localSelectedSchoolId;

    if (!athlete || !schoolIdToSave || !newConnection.connection_description) {
      console.warn("Missing athlete, school ID, or connection description.");
      return;
    }
    setLoading(true);
    try {
      await SchoolConnection.create({
        athlete_id: athlete.id,
        school_id: schoolIdToSave,
        ...newConnection
      });
      
      onConnectionSaved();
      onClose();
    } catch (error) {
      console.error("Error saving connection:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter schools to only show target schools
  const availableSchools = !school ? allSchools.filter(s => 
    targetedSchools.some(ts => ts.school_id === s.id)
  ) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-600" />
            {coachContact ? `Add Personal Connection - ${coachContact.coach_name}` : "Add Personal Connection"}
          </DialogTitle>
          <DialogDescription>
            {school ? (
              <>
                Add a personal connection you have to <strong>{getSchoolName(school.id)}</strong>
                {coachContact && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Coach:</strong> {coachContact.coach_name} - {coachContact.coach_title}
                    </p>
                    {coachContact.coach_email && (
                      <p className="text-sm text-blue-600">
                        <strong>Email:</strong> {coachContact.coach_email}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              "Add a personal connection you have to one of your target schools"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {existingConnections.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-slate-700 mb-3">Your Existing Connections to This School:</h4>
              <div className="space-y-2 mb-4">
                {existingConnections.map((connection) => (
                  <div key={connection.id} className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-sm">{connection.connection_description}</p>
                    {connection.contact_name && (
                      <p className="text-xs text-slate-600">
                        Contact: {connection.contact_name} 
                        {connection.contact_title && ` - ${connection.contact_title}`}
                      </p>
                    )}
                    <Badge variant="outline" className="text-xs mt-1 capitalize">
                      {connection.relationship_strength} {connection.connection_type.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              <h4 className="font-medium text-sm text-slate-700 mb-3">Add Another Connection:</h4>
            </div>
          )}

          {!school && (
            <div>
              <Label htmlFor="schoolSelect">Target School *</Label>
              <Select value={localSelectedSchoolId} onValueChange={setLocalSelectedSchoolId} disabled={availableSchools.length === 0}>
                <SelectTrigger id="schoolSelect">
                  <SelectValue placeholder="Select a target school" />
                </SelectTrigger>
                <SelectContent>
                  {availableSchools.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableSchools.length === 0 && (
                <p className="text-sm text-slate-500 mt-2">
                  No target schools available. Add schools to your target list first.
                </p>
              )}
            </div>
          )}
          <div>
            <Label>Connection Type</Label>
            <Select value={newConnection.connection_type} onValueChange={(value) => setNewConnection({...newConnection, connection_type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Family Member</SelectItem>
                <SelectItem value="friend">Family Friend</SelectItem>
                <SelectItem value="coach_relationship">Coach Relationship</SelectItem>
                <SelectItem value="alumni">Alumni Connection</SelectItem>
                <SelectItem value="current_student">Current Student</SelectItem>
                <SelectItem value="staff">Staff Member</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Connection Description *</Label>
            <Textarea
              value={newConnection.connection_description}
              onChange={(e) => setNewConnection({...newConnection, connection_description: e.target.value})}
              placeholder="e.g., My uncle played football there in the 90s, or My high school coach knows their recruiting coordinator"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Name</Label>
              <Input
                value={newConnection.contact_name}
                onChange={(e) => setNewConnection({...newConnection, contact_name: e.target.value})}
                placeholder="Name of your contact"
              />
            </div>
            <div>
              <Label>Contact Title/Role</Label>
              <Input
                value={newConnection.contact_title}
                onChange={(e) => setNewConnection({...newConnection, contact_title: e.target.value})}
                placeholder="e.g., Assistant Head Coach, Alumni Director"
              />
            </div>
          </div>
          <div>
            <Label>Relationship Strength</Label>
            <Select value={newConnection.relationship_strength} onValueChange={(value) => setNewConnection({...newConnection, relationship_strength: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strong">Strong - Very close relationship</SelectItem>
                <SelectItem value="moderate">Moderate - Good relationship</SelectItem>
                <SelectItem value="weak">Weak - Limited relationship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Additional Notes</Label>
            <Textarea
              value={newConnection.notes}
              onChange={(e) => setNewConnection({...newConnection, notes: e.target.value})}
              placeholder="Any additional details that might be helpful for recruiting..."
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!newConnection.connection_description || (!school && !localSelectedSchoolId) || loading || (!school && availableSchools.length === 0)}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const colorClasses = [
    "border-l-blue-500", "border-l-green-500", "border-l-red-500", 
    "border-l-purple-500", "border-l-orange-500", "border-l-yellow-500", 
    "border-l-indigo-500", "border-l-pink-500", "border-l-sky-500", "border-l-emerald-500"
];

const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const getSchoolColorClass = (schoolName) => {
  if (!schoolName) return colorClasses[0];
  const hash = hashCode(schoolName);
  return colorClasses[hash % colorClasses.length];
};

export default function Tracking() {
  const [coachContacts, setCoachContacts] = useState([]);
  const [schools, setSchools] = useState([]);
  const [connections, setConnections] = useState([]);
  const [targetedSchools, setTargetedSchools] = useState([]); // New state for targeted schools
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);

  // New states from the outline's loadData
  const [currentUser, setCurrentUser] = useState(null);
  const [outreaches, setOutreaches] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [error, setError] = useState(null);

  const [selectedCoachContact, setSelectedCoachContact] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAIFollowUpModalOpen, setIsAIFollowUpModalOpen] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [editedContact, setEditedContact] = useState({}); // Replaced individual states with an object
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const user = await User.me();
      setCurrentUser(user); // Add this
      const athleteData = await Athlete.filter({ created_by: user.email });
      const currentAthlete = athleteData[0] || null;
      setAthlete(currentAthlete);

      if (currentAthlete) {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Load existing Tracking-specific data (CoachContact, SchoolConnection, TargetedSchool)
        const [coachContactData, connectionData, targetedData] = await Promise.all([
            CoachContact.filter({ athlete_id: currentAthlete.id }, "-date_contacted"),
            SchoolConnection.filter({ athlete_id: currentAthlete.id }),
            TargetedSchool.filter({ athlete_id: currentAthlete.id })
        ]);
        setCoachContacts(coachContactData);
        setConnections(connectionData);
        setTargetedSchools(targetedData);

        // Load Schools (full list, not sliced, for getSchoolName and ConnectionModal)
        try {
            await delay(100);
            const schoolList = await School.list();
            setSchools(schoolList);
        } catch (schoolError) {
            console.warn("Could not load all school data:", schoolError);
            setSchools([]);
        }

        // Add new data loading for Outreach and Coach, as per outline
        try {
            await delay(300);
            const outreachData = await Outreach.list('-created_date', 20);
            setOutreaches(outreachData);
        } catch (outreachError) {
            console.warn("Could not load outreach data:", outreachError);
            setOutreaches([]);
        }

        try {
            await delay(300);
            const coachData = await Coach.list();
            setCoaches(coachData.slice(0, 30));
        } catch (coachError) {
            console.warn("Could not load coach data:", coachError);
            setCoaches([]);
        }
      } else {
        // If no athlete, clear all data for consistency
        setCoachContacts([]);
        setSchools([]);
        setConnections([]);
        setTargetedSchools([]);
        setOutreaches([]);
        setCoaches([]);
      }
    } catch (err) {
      console.error("Error loading Tracking data:", err);
      setError("Unable to load tracking data. Please refresh the page or try again later.");
    }
    setLoading(false);
  };

  const getSchoolName = (schoolId) => {
    const school = schools.find(s => s.id === schoolId);
    if (!school) return "N/A";
    
    // Convert "University of Virginia" to "Virginia Cavaliers (University of Virginia)"
    const schoolNameMappings = {
      "University of Virginia": "Virginia Cavaliers (University of Virginia)",
      "University of North Carolina at Chapel Hill": "North Carolina Tar Heels (University of North Carolina at Chapel Hill)",
      "University of North Carolina at Charlotte": "Charlotte 49ers (University of North Carolina at Charlotte)",
      "Duke University": "Duke Blue Devils (Duke University)",
      "Wake Forest University": "Wake Forest Demon Deacons (Wake Forest University)",
      "Virginia Tech": "Virginia Tech Hokies (Virginia Tech)",
      "North Carolina State University": "NC State Wolfpack (North Carolina State University)",
      "University of Miami": "Miami Hurricanes (University of Miami)",
      "Florida State University": "Florida State Seminoles (Florida State University)",
      "Clemson University": "Clemson Tigers (Clemson University)",
      "University of Georgia": "Georgia Bulldogs (University of Georgia)",
      "University of Alabama": "Alabama Crimson Tide (University of Alabama)",
      "Auburn University": "Auburn Tigers (Auburn University)",
      "Louisiana State University": "LSU Tigers (Louisiana State University)",
      "University of Florida": "Florida Gators (University of Florida)",
      "University of Tennessee": "Tennessee Volunteers (University of Tennessee)",
      "University of Kentucky": "Kentucky Wildcats (University of Kentucky)",
      "University of South Carolina": "South Carolina Gamecocks (University of South Carolina)",
      "Vanderbilt University": "Vanderbilt Commodores (Vanderbilt University)",
      "University of Missouri": "Missouri Tigers (University of Missouri)",
      "University of Arkansas": "Arkansas Razorbacks (University of Arkansas)",
      "Mississippi State University": "Mississippi State Bulldogs (Mississippi State University)",
      "University of Mississippi": "Ole Miss Rebels (University of Mississippi)",
      "Texas A&M University": "Texas A&M Aggies (Texas A&M University)",
      "University of Texas at Austin": "Texas Longhorns (University of Texas at Austin)",
      "University of Oklahoma": "Oklahoma Sooners (University of Oklahoma)"
    };
    
    return schoolNameMappings[school.name] || school.name;
  };

  const getSchool = (schoolId) => schools.find(s => s.id === schoolId);

  const handleEditClick = (coachContact) => {
    setSelectedCoachContact(coachContact);
    // Initialize editedContact with all relevant fields from the coach contact
    setEditedContact({
      coach_name: coachContact.coach_name,
      coach_title: coachContact.coach_title,
      coach_email: coachContact.coach_email || "", // Ensure email is not undefined
      response_status: coachContact.response_status,
      follow_up_notes: coachContact.follow_up_notes || "",
      next_follow_up: coachContact.next_follow_up || ""
    });
    setIsEditModalOpen(true);
  };

  const handleAIFollowUpClick = (coachContact) => {
    setSelectedCoachContact(coachContact);
    setIsAIFollowUpModalOpen(true);
  };

  const handleDeleteClick = (coachContact) => {
    setContactToDelete(coachContact);
    setIsDeleteModalOpen(true);
  };

  const handleConnectionClick = (coachContact) => {
    setSelectedCoachContact(coachContact);
    setIsConnectionModalOpen(true);
  };

  const handleAddStandaloneConnection = () => {
    setSelectedCoachContact(null); // Clear selectedCoachContact for standalone use
    setIsConnectionModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    try {
      await CoachContact.delete(contactToDelete.id);
      setIsDeleteModalOpen(false);
      setContactToDelete(null);
      await loadData();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedCoachContact) return;
    try {
      await CoachContact.update(selectedCoachContact.id, editedContact); // Pass the entire editedContact object
      setIsEditModalOpen(false);
      setSelectedCoachContact(null);
      await loadData();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return "bg-blue-100 text-blue-800 border border-blue-200";
      case 'opened': return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case 'replied': return "bg-green-100 text-green-800 border border-green-200";
      case 'no_response': return "bg-red-100 text-red-800 border border-red-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Filter coach contacts based on search term
  const filteredCoachContacts = coachContacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.coach_name.toLowerCase().includes(searchLower) ||
      contact.coach_title.toLowerCase().includes(searchLower) ||
      getSchoolName(contact.school_id).toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.15a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
        <Button onClick={loadData} className="mt-4">Try Reloading Data</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Header with Title and Add Connection Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Coach Tracking</h1>
              <p className="text-slate-600">Monitor your communication with coaches and manage connections</p>
            </div>
          </div>
          <Button 
            onClick={handleAddStandaloneConnection}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Personal Connection
          </Button>
        </div>

        {/* Coach Communications Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Coach Communications
              </CardTitle>
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search coaches, schools, or positions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading coach contacts...</div>
            ) : filteredCoachContacts.length > 0 ? (
              <div className="space-y-4">
                {filteredCoachContacts.map(coachContact => {
                  const schoolName = getSchoolName(coachContact.school_id);
                  const colorClass = getSchoolColorClass(schoolName);
                  return (
                    <Card key={coachContact.id} className={`border-l-4 ${colorClass} hover:shadow-md transition-shadow`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg text-slate-900">{coachContact.coach_name}</h3>
                              <Badge className={getStatusColor(coachContact.response_status)}>
                                {coachContact.response_status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                              <div>
                                  <p><strong>School:</strong> {schoolName}</p>
                                  <p><strong>Title:</strong> {coachContact.coach_title}</p>
                                  <p><strong>Email:</strong> {coachContact.coach_email || "Not provided"}</p>
                              </div>
                              <div>
                                  <p><strong>Date Contacted:</strong> {coachContact.date_contacted ? format(new Date(coachContact.date_contacted), "MMM d, yyyy") : "Not contacted"}</p>
                                  <p><strong>Next Follow-up:</strong> {coachContact.next_follow_up ? format(new Date(coachContact.next_follow_up), "MMM d, yyyy") : "None scheduled"}</p>
                              </div>
                            </div>

                            {coachContact.follow_up_notes && (
                              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-700"><strong>Notes:</strong> {coachContact.follow_up_notes}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditClick(coachContact)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Update Contact
                            </Button>
                            
                            {(coachContact.response_status === 'sent' || coachContact.response_status === 'opened') && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAIFollowUpClick(coachContact)}
                                className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Bot className="w-4 h-4" />
                                AI Follow-up
                              </Button>
                            )}

                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteClick(coachContact)}
                              className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No matches found</h3>
                <p className="text-slate-500">
                  Try adjusting your search terms or clear the search to see all contacts
                </p>
                <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Coach Contacts Yet</h3>
                <p className="text-slate-500 mb-6">
                  Add coaches from the Outreach Center to start tracking your communications
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Connections Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Personal Connections to Schools
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {connections.length > 0 ? (
              <div className="space-y-4">
                {connections.map(connection => (
                  <Card key={connection.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">{getSchoolName(connection.school_id)}</h3>
                          <p className="text-slate-600 mt-1">{connection.connection_description}</p>
                          {connection.contact_name && (
                            <p className="text-sm text-slate-500 mt-2">
                              <strong>Contact:</strong> {connection.contact_name} 
                              {connection.contact_title && ` - ${connection.contact_title}`}
                            </p>
                          )}
                          {connection.notes && (
                            <p className="text-sm text-slate-500 mt-1">
                              <strong>Notes:</strong> {connection.notes}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {connection.relationship_strength} {connection.connection_type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Network className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="lg font-semibold text-slate-700 mb-2">No Personal Connections Yet</h3>
                <p className="text-slate-500 mb-6">
                  Add personal connections you have to schools to leverage in your recruiting process
                </p>
                <Button onClick={handleAddStandaloneConnection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Connection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Edit Modal */}
        {selectedCoachContact && (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-600" />
                  Update Coach Contact
                </DialogTitle>
                <DialogDescription>
                  Update contact information and communication status
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Coach Name</Label>
                  <Input
                    value={editedContact.coach_name}
                    onChange={(e) => setEditedContact({...editedContact, coach_name: e.target.value})}
                    placeholder="Coach's full name"
                  />
                </div>
                <div>
                  <Label>Coach Title</Label>
                  <Input
                    value={editedContact.coach_title}
                    onChange={(e) => setEditedContact({...editedContact, coach_title: e.target.value})}
                    placeholder="e.g., Running Backs Coach"
                  />
                </div>
                <div>
                  <Label>Coach Email</Label>
                  <Input
                    type="email"
                    value={editedContact.coach_email}
                    onChange={(e) => setEditedContact({...editedContact, coach_email: e.target.value})}
                    placeholder="coach@school.edu"
                  />
                </div>
                <div>
                  <Label>Response Status</Label>
                  <Select value={editedContact.response_status} onValueChange={(value) => setEditedContact({...editedContact, response_status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_contacted">Not Contacted</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="opened">Opened</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="no_response">No Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Follow-Up Notes</Label>
                  <Textarea
                    value={editedContact.follow_up_notes}
                    onChange={(e) => setEditedContact({...editedContact, follow_up_notes: e.target.value})}
                    placeholder="Log details about your conversation..."
                    rows={5}
                  />
                </div>
                <div>
                  <Label>Next Follow-Up Date</Label>
                  <Input
                    type="date"
                    value={editedContact.next_follow_up}
                    onChange={(e) => setEditedContact({...editedContact, next_follow_up: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* AI Follow-Up Modal */}
        {selectedCoachContact && (
          <AIFollowUpModal 
            isOpen={isAIFollowUpModalOpen}
            onClose={() => setIsAIFollowUpModalOpen(false)}
            coachContact={selectedCoachContact}
            athlete={athlete}
            onFollowUpGenerated={loadData}
          />
        )}

        {/* Updated Connection Modal */}
        <ConnectionModal 
          isOpen={isConnectionModalOpen}
          onClose={() => setIsConnectionModalOpen(false)}
          coachContact={selectedCoachContact}
          school={selectedCoachContact ? getSchool(selectedCoachContact.school_id) : null}
          athlete={athlete}
          onConnectionSaved={loadData}
          allSchools={schools}
          targetedSchools={targetedSchools} // Pass targetedSchools prop
          getSchoolName={getSchoolName}
        />

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete the contact record for <strong>{contactToDelete?.coach_name}</strong>. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
