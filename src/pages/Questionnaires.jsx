
import React, { useState, useEffect } from "react";
import { QuestionnaireSubmission, TargetedSchool, School, Athlete } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExternalLink, Search, Info } from "lucide-react";
import { addDays } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Questionnaires() {
  const [targetedSchools, setTargetedSchools] = useState([]);
  const [schools, setSchools] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const user = await User.me();
      const athleteData = await Athlete.filter({ created_by: user.email });
      const currentAthlete = athleteData[0];

      if (currentAthlete) {
        const [targetedData, schoolData, submissionData] = await Promise.all([
          TargetedSchool.filter({ athlete_id: currentAthlete.id }),
          School.list(),
          QuestionnaireSubmission.filter({ athlete_id: currentAthlete.id })
        ]);

        setTargetedSchools(targetedData);
        setSchools(schoolData);
        setSubmissions(submissionData);
        setAthlete(currentAthlete);
      }
    } catch (error) {
      console.error("Error loading questionnaire data:", error);
    }
    setLoading(false);
  };

  const getSchoolById = (schoolId) => schools.find(school => school.id === schoolId);
  const isCompleted = (schoolId) => submissions.some(sub => sub.school_id === schoolId);

  const handleMarkCompleted = async (schoolId, checked) => {
    if (!athlete) return;

    try {
      const existingSubmission = submissions.find(sub => sub.school_id === schoolId);
      
      if (checked && !existingSubmission) {
        // Create new submission
        await QuestionnaireSubmission.create({
          athlete_id: athlete.id,
          school_id: schoolId,
          completed_date: new Date().toISOString().split('T')[0],
          next_reminder_date: addDays(new Date(), 14).toISOString().split('T')[0],
          completion_count: 1
        });
      } else if (!checked && existingSubmission) {
        // Delete submission
        await QuestionnaireSubmission.delete(existingSubmission.id);
      }

      await loadData(); // Refresh data
    } catch (error) {
      console.error("Error updating questionnaire completion:", error);
    }
  };

  const filteredTargetedSchools = targetedSchools.filter(ts => {
    const school = getSchoolById(ts.school_id);
    return school?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <div>
                <h1 className="text-3xl font-bold text-slate-900">School Questionnaires</h1>
                <p className="text-slate-600">Complete recruiting questionnaires for your target schools</p>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search your target schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base"
              />
            </div>

            {filteredTargetedSchools.length === 0 ? (
              <div className="text-center py-12">
                <ExternalLink className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Target Schools Found</h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm 
                    ? "No schools match your search." 
                    : "Add schools to your target list to see them here."}
                </p>
              </div>
            ) : (
                <Accordion type="multiple" className="w-full space-y-3">
                {filteredTargetedSchools.map((ts) => {
                  const school = getSchoolById(ts.school_id);
                  if (!school) return null;
                  const completed = isCompleted(school.id);

                  return (
                    <AccordionItem value={school.id} key={school.id} className="bg-white border rounded-lg shadow-sm">
                      <AccordionTrigger className="p-4 hover:no-underline">
                        <div className="flex justify-between items-center w-full">
                            <span className="font-medium text-slate-900">{school.name}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 pt-0">
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-slate-700">Recruiting Questionnaire:</p>
                                {school.questionnaire_url ? (
                                    <Button asChild variant="outline" size="sm">
                                        <a href={school.questionnaire_url} target="_blank" rel="noopener noreferrer">
                                            Go to Questionnaire <ExternalLink className="w-3 h-3 ml-2" />
                                        </a>
                                    </Button>
                                ) : (
                                    <span className="text-sm text-slate-500">Not available</span>
                                )}
                            </div>
                             <div className="flex justify-between items-center">
                                <p className="font-semibold text-slate-700">Football Page:</p>
                                {school.coaching_staff_url ? (
                                    <Button asChild variant="outline" size="sm">
                                        <a href={school.coaching_staff_url} target="_blank" rel="noopener noreferrer">
                                            View Football Page <ExternalLink className="w-3 h-3 ml-2" />
                                        </a>
                                    </Button>
                                ) : (
                                    <span className="text-sm text-slate-500">Not available</span>
                                )}
                            </div>
                             <div className="flex items-center gap-3 pt-4 border-t mt-4">
                                <Label htmlFor={`completed-${school.id}`} className="flex items-center gap-2 cursor-pointer font-medium">
                                    <Checkbox
                                        id={`completed-${school.id}`}
                                        checked={completed}
                                        onCheckedChange={(checked) => handleMarkCompleted(school.id, checked)}
                                    />
                                    Mark as Completed
                                </Label>
                            </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
                <CardHeader>
                    <CardTitle>How to Fill Out Questionnaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-700">
                    <p>Recruiting questionnaires are your first formal introduction to a coaching staff. Make a great impression by being prepared.</p>
                    <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Be Accurate:</strong> Double-check all your information, especially contact details, stats, and academic scores.</li>
                        <li><strong>Be Thorough:</strong> Fill out every field possible. It shows you're serious and detail-oriented.</li>
                        <li><strong>Be Professional:</strong> Use a professional email address and avoid slang in your answers.</li>
                        <li><strong>Have Links Ready:</strong> You'll need links to your highlight video (HUDL/YouTube) and sometimes your academic transcript.</li>
                    </ul>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                           <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                           <p className="text-xs text-blue-800">
                               <strong>Pro Tip:</strong> After submitting a questionnaire, send a follow-up email to the recruiting coordinator or your position coach to introduce yourself.
                           </p>
                        </div>
                    </div>
                     <Button variant="outline" asChild className="w-full">
                        <Link to={createPageUrl("Profile")}>
                            Copy Info from Your Profile <ExternalLink className="w-3 h-3 ml-2"/>
                        </Link>
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
