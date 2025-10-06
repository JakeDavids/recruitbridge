
import React, { useState, useEffect } from "react";
import { Athlete, School, TargetedSchool, CoachContact } from "@/api/entities";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Users,
  ExternalLink,
  Bot,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  Trash2,
  Plus,
  Edit
} from "lucide-react";

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

const initialCoachState = {
  coach_name: "",
  coach_title: "",
  coach_email: "",
  coach_twitter: "",
  school_id: ""
};

// Main Page Component
export default function TestCoachContacts() {
  const [user, setUser] = useState(null);
  const [athlete, setAthlete] = useState(null);
  const [targetedSchools, setTargetedSchools] = useState([]);
  const [schools, setSchools] = useState([]);
  const [coachContacts, setCoachContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isAddManualOpen, setIsAddManualOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (currentUser?.role !== 'admin') {
        window.location.href = createPageUrl("OutreachCompose");
        return;
      }

      const athleteData = await Athlete.filter({ created_by: currentUser.email });
      const currentAthlete = athleteData[0] || null;
      setAthlete(currentAthlete);

      const [targetedData, schoolData, coachData] = await Promise.all([
        currentAthlete ? TargetedSchool.filter({ athlete_id: currentAthlete.id }) : Promise.resolve([]),
        School.list(),
        currentAthlete ? CoachContact.filter({ athlete_id: currentAthlete.id }) : Promise.resolve([])
      ]);

      setTargetedSchools(targetedData);
      setSchools(schoolData);
      setCoachContacts(coachData);

    } catch (error) {
      console.error("Auth check or data loading failed:", error);
      window.location.href = createPageUrl("OutreachCompose");
    } finally {
      setLoading(false);
    }
  };

  const getSchoolDetails = (schoolId) => schools.find(s => s.id === schoolId);

  const handleOpenEdit = (coach) => {
    setSelectedCoach(coach);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (coach) => {
    setSelectedCoach(coach);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCoach) return;
    await CoachContact.delete(selectedCoach.id);
    await loadData();
    setIsDeleteOpen(false);
    setSelectedCoach(null);
  };

  const schoolsWithCoaches = targetedSchools
    .map(ts => {
        const school = getSchoolDetails(ts.school_id);
        if (!school) return null; // Add this check to prevent errors if school is not found
        return {
            ...school,
            coaches: coachContacts.filter(c => c.school_id === ts.school_id)
        };
    })
    .filter(Boolean) // Filter out any null entries
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">Coach Contact Management (Admin)</h1>
                    <p className="text-slate-600">Add, edit, and manage all coach contacts in the system.</p>
                </div>
            </div>
            {/* Action buttons moved to the right column */}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Coach List */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Coach Database</CardTitle>
                        <CardDescription>All saved coach contacts, grouped by school.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="multiple" className="w-full">
                            {schoolsWithCoaches.map(school => (
                                <AccordionItem value={school.id} key={school.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-lg">{school.name}</span>
                                            <Badge variant="secondary">{school.coaches.length} contacts</Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {school.coaches.length > 0 ? (
                                            <div className="space-y-3">
                                                {school.coaches.map(coach => (
                                                    <Card key={coach.id} className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-semibold">{coach.coach_name}</h4>
                                                                <p className="text-sm text-slate-600">{coach.coach_title}</p>
                                                                {coach.coach_email && <p className="text-xs text-slate-500">📧 {coach.coach_email}</p>}
                                                                {coach.coach_twitter && <p className="text-xs text-slate-500">🐦 {coach.coach_twitter}</p>}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(coach)}>
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(coach)} className="text-red-500 hover:text-red-600">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-slate-500 py-4">No contacts added for this school yet.</p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Add Coaches Panel */}
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Contacts</CardTitle>
                        <CardDescription>Add coaches one by one or in bulk.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-slate-800">Bulk Import with AI</h4>
                            <p className="text-sm text-slate-600 mb-3">Paste from a staff directory to add multiple coaches at once.</p>
                            <Button onClick={() => setIsBulkImportOpen(true)} className="w-full">
                                <Upload className="w-4 h-4 mr-2" /> Bulk Import
                            </Button>
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-slate-800">Add Manually</h4>
                            <p className="text-sm text-slate-600 mb-3">Ideal for adding a single coach.</p>
                            <Button variant="outline" onClick={() => setIsAddManualOpen(true)} className="w-full">
                                <Plus className="w-4 h-4 mr-2" /> Add Coach Manually
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Modals */}
        <AddCoachModal
            isOpen={isAddManualOpen}
            onClose={() => setIsAddManualOpen(false)}
            athlete={athlete}
            schools={schoolsWithCoaches}
            onSave={loadData}
        />
        <BulkImportModal
            isOpen={isBulkImportOpen}
            onClose={() => setIsBulkImportOpen(false)}
            athlete={athlete}
            schools={schoolsWithCoaches}
            onSave={loadData}
        />
        {selectedCoach && (
          <>
            <EditCoachModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                coach={selectedCoach}
                onSave={loadData}
            />
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the contact for <strong>{selectedCoach.coach_name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

// Add/Edit Modal Component
function CoachForm({ coachData, setCoachData, schools, isEdit = false }) {
    return (
        <div className="grid gap-4 py-4">
            {!isEdit && (
                <div>
                    <Label htmlFor="school_id">School</Label>
                    <Select value={coachData.school_id} onValueChange={(value) => setCoachData({...coachData, school_id: value})}>
                        <SelectTrigger><SelectValue placeholder="Select a school..." /></SelectTrigger>
                        <SelectContent>
                            {schools.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div>
                <Label htmlFor="coach_name">Coach Name</Label>
                <Input id="coach_name" value={coachData.coach_name} onChange={(e) => setCoachData({...coachData, coach_name: e.target.value})} />
            </div>
            <div>
                <Label htmlFor="coach_title">Title/Position</Label>
                <Input id="coach_title" value={coachData.coach_title} onChange={(e) => setCoachData({...coachData, coach_title: e.target.value})} />
            </div>
            <div>
                <Label htmlFor="coach_email">Email</Label>
                <Input id="coach_email" type="email" value={coachData.coach_email} onChange={(e) => setCoachData({...coachData, coach_email: e.target.value})} />
            </div>
            <div>
                <Label htmlFor="coach_twitter">Twitter/X Handle</Label>
                <Input id="coach_twitter" value={coachData.coach_twitter} onChange={(e) => setCoachData({...coachData, coach_twitter: e.target.value})} />
            </div>
        </div>
    );
}

// Add Coach Modal
function AddCoachModal({ isOpen, onClose, athlete, schools, onSave }) {
    const [newCoach, setNewCoach] = useState(initialCoachState);

    const handleSave = async () => {
        if (!athlete || !newCoach.school_id || !newCoach.coach_name) {
            alert("School and Coach Name are required.");
            return;
        }
        await CoachContact.create({ ...newCoach, athlete_id: athlete.id });
        setNewCoach(initialCoachState);
        onSave();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Add Coach Manually</DialogTitle></DialogHeader>
                <CoachForm coachData={newCoach} setCoachData={setNewCoach} schools={schools} />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Contact</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Edit Coach Modal
function EditCoachModal({ isOpen, onClose, coach, onSave }) {
    const [editedCoach, setEditedCoach] = useState(coach);

    useEffect(() => {
        setEditedCoach(coach);
    }, [coach]);

    const handleSave = async () => {
        await CoachContact.update(editedCoach.id, editedCoach);
        onSave();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Edit Coach: {coach.coach_name}</DialogTitle></DialogHeader>
                <CoachForm coachData={editedCoach} setCoachData={setEditedCoach} schools={[]} isEdit={true} />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Bulk Import Modal
function BulkImportModal({ isOpen, onClose, athlete, schools, onSave }) {
    const [selectedSchoolId, setSelectedSchoolId] = useState("");
    const [websiteContent, setWebsiteContent] = useState("");
    const [parsing, setParsing] = useState(false);
    const [parsedContacts, setParsedContacts] = useState([]);
    const [saving, setSaving] = useState(false);
    const [editingContact, setEditingContact] = useState(null); // New state for editing

    useEffect(() => {
        if(isOpen && schools.length > 0) {
            setSelectedSchoolId(schools[0].id)
        } else {
            // Reset state on close
            setSelectedSchoolId("");
            setWebsiteContent("");
            setParsedContacts([]);
            setEditingContact(null); // Reset editing state on close
        }
    }, [isOpen, schools]);

    const handleParse = async () => {
        if (!websiteContent.trim() || !selectedSchoolId) return;
        setParsing(true);
        const school = schools.find(s => s.id === selectedSchoolId);
        const prompt = `Extract football coach contact info (name, title, email, twitter) from this content for ${school?.name}:\n\n${websiteContent}`;
        try {
            const result = await InvokeLLM({
                prompt,
                response_json_schema: { type: "object", properties: { coaches: { type: "array", items: { type: "object", properties: { name: { type: "string" }, title: { type: "string" }, email: { type: "string" }, twitter: { type: "string" } }, required: ["name", "title"] } } } }
            });
            // Assign unique temporary IDs to newly parsed contacts
            setParsedContacts(result.coaches.map((c, index) => ({...c, selected: true, id: `temp_${index}_${Date.now()}`})));
        } catch (e) { console.error(e); alert("Failed to parse contacts."); }
        setParsing(false);
    };

    const handleEditContact = (contact) => {
        setEditingContact(contact);
    };

    const handleSaveEdit = (updatedContact) => {
        setParsedContacts(prev => prev.map(c => 
            c.id === updatedContact.id ? updatedContact : c
        ));
        setEditingContact(null); // Close the edit modal
    };

    const handleSave = async () => {
        if (!athlete || !selectedSchoolId) return;
        const toSave = parsedContacts.filter(c => c.selected);
        if (toSave.length === 0) return;
        setSaving(true);
        const records = toSave.map(c => ({
            athlete_id: athlete.id, school_id: selectedSchoolId, coach_name: c.name, coach_title: c.title,
            coach_email: c.email || "", coach_twitter: c.twitter || "", response_status: "not_contacted"
        }));
        await CoachContact.bulkCreate(records);
        setSaving(false);
        onSave();
        onClose();
    };

    const school = schools.find(s => s.id === selectedSchoolId);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bulk Import Coaches</DialogTitle>
                    <DialogDescription>Paste content from a staff directory to automatically extract contacts.</DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold">1. Select School</h4>
                        <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                            <SelectTrigger><SelectValue placeholder="Select a school..." /></SelectTrigger>
                            <SelectContent>
                                {schools.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {school && staffDirectoryLinks[school.name] && (
                            <Button variant="outline" onClick={() => window.open(staffDirectoryLinks[school.name], '_blank')} className="w-full">
                                <ExternalLink className="w-4 h-4 mr-2" /> Open Staff Directory
                            </Button>
                        )}
                        <h4 className="font-semibold pt-4">2. Paste Content</h4>
                        <Textarea value={websiteContent} onChange={e => setWebsiteContent(e.target.value)} rows={10} placeholder="Paste copied website text here..."/>
                        <Button onClick={handleParse} disabled={parsing || !websiteContent.trim()}>
                            {parsing ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Bot className="w-4 h-4 mr-2" />}
                            {parsing ? 'Parsing...' : 'Parse Contacts'}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">3. Review & Save</h4>
                        {parsedContacts.length > 0 ? (
                            <>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {parsedContacts.map((c) => (
                                        <div key={c.id} className={`p-3 border rounded-lg ${c.selected ? 'bg-green-50 border-green-200' : 'bg-slate-50'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={c.selected}
                                                        onChange={(e) => setParsedContacts(prev => prev.map(p => 
                                                            p.id === c.id ? {...p, selected: e.target.checked} : p
                                                        ))}
                                                        className="rounded"
                                                    />
                                                    <div className="flex-1 ml-2"> {/* Added ml-2 for spacing */}
                                                        <p className="font-medium">{c.name}</p>
                                                        <p className="text-sm text-slate-600">{c.title}</p>
                                                        {c.email && <p className="text-xs text-slate-500">📧 {c.email}</p>}
                                                        {c.twitter && <p className="text-xs text-slate-500">🐦 {c.twitter}</p>}
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => handleEditContact(c)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={handleSave} disabled={saving} className="w-full bg-green-600 hover:bg-green-700">
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Upload className="w-4 h-4 mr-2" />}
                                    Save {parsedContacts.filter(c => c.selected).length} Contacts
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500 bg-slate-50 rounded-lg p-8">
                                <p>Parsed contacts will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>

            {/* Edit Contact Modal */}
            {editingContact && (
                <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Contact</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Name</Label>
                                <Input 
                                    value={editingContact.name} 
                                    onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label>Title</Label>
                                <Input 
                                    value={editingContact.title} 
                                    onChange={(e) => setEditingContact({...editingContact, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input 
                                    value={editingContact.email || ''} 
                                    onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label>Twitter/X</Label>
                                <Input 
                                    value={editingContact.twitter || ''} 
                                    onChange={(e) => setEditingContact({...editingContact, twitter: e.target.value})}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingContact(null)}>Cancel</Button>
                            <Button onClick={() => handleSaveEdit(editingContact)}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
}
