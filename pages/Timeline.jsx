
import React, { useState, useEffect } from "react";
import { Outreach, Coach, School, Athlete, User } from "@/api/entities";
import { 
  Calendar, ListTodo, Clock, Send, Eye, MessageSquare,
  CheckCircle2, ArrowRight, AlertTriangle, Square, CheckSquare
} from "lucide-react";
import { format, isPast, isToday, differenceInDays } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Full checklist data based on the provided outline
const checklists = {
    freshman: {
      title: "Freshman Year (Class of " + "GRAD_YEAR_PLACEHOLDER" + ")", // GRAD_YEAR_PLACEHOLDER replaced by actual year
      tasks: [
        { id: "f1", text: "Focus on academics - maintain a strong GPA (3.0+)" },
        { id: "f2", text: "Excel on the field and work on fundamentals" },
        { id: "f3", text: "Build a strong relationship with your high school coaches" },
        { id: "f4", text: "Start researching colleges that fit you academically and athletically" },
        { id: "f5", text: "Create a preliminary highlight video from your games" },
      ]
    },
    sophomore: {
      title: "Sophomore Year (Class of " + "GRAD_YEAR_PLACEHOLDER" + ")",
      tasks: [
        { id: "so1", text: "Continue excelling academically - aim for 3.5+ GPA" },
        { id: "so2", text: "Take the PSAT/Pre-ACT to prepare for standardized tests" },
        { id: "so3", text: "Compile a list of 50-100 potential schools (Reach, Target, Safety)" },
        { id: "so4", text: "Attend prospect camps and showcases for exposure" },
        { id: "so5", text: "Create your recruiting profile & update highlight reel" },
        { id: "so6", text: "Follow college coaches and programs on social media" },
      ]
    },
    junior: {
      title: "Junior Year (Class of " + "GRAD_YEAR_PLACEHOLDER" + ")",
      tasks: [
        { id: "ju1", text: "Register with the NCAA Eligibility Center" },
        { id: "ju2", text: "Take the SAT/ACT (plan for multiple attempts)" },
        { id: "ju3", text: "Narrow your school list to 20-30 target schools" },
        { id: "ju4", text: "Send personalized outreach emails to coaches on your list" },
        { id: "ju5", text: "Plan and take unofficial visits to top schools" },
        { id: "ju6", text: "Update highlight reel after each game with your best plays" },
        { id: "ju7", text: "Ask your high school coach to contact coaches on your behalf" },
      ]
    },
    senior: {
      title: "Senior Year (Class of " + "GRAD_YEAR_PLACEHOLDER" + ")",
      tasks: [
        { id: "se1", text: "Follow up with coaches who have shown interest" },
        { id: "se2", text: "Complete college applications (by Nov 1st for early action)" },
        { id: "se3", text: "Complete the FAFSA (opens October 1st)" },
        { id: "se4", text: "Schedule and take your 5 official visits" },
        { id: "se5", text: "Verbally commit to a school when you are ready" },
        { id: "se6", text: "Sign your National Letter of Intent (NLI) on signing day" },
        { id: "se7", text: "Submit final transcripts and continue to train" },
      ]
    },
    postGrad: {
      title: "Post-Grad/Transfer (Class of " + "GRAD_YEAR_PLACEHOLDER" + ")",
      tasks: [
        { id: "pg1", text: "Enter the NCAA Transfer Portal if applicable" },
        { id: "pg2", text: "Update your recruiting profile and highlight reel with college stats" },
        { id: "pg3", text: "Network and reach out to coaches at target schools" },
        { id: "pg4", text: "Ensure all academic requirements for transfer are met" },
        { id: "pg5", text: "Stay academically eligible and maintain good standing" },
      ]
    }
  };

// Helper to get recruiting checklist based on graduation year
const getChecklistForGradYear = (gradYear) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0 = January, 11 = December
  
  // Determine grade level using the logic from the outline
  let grade;
  if (currentMonth >= 7) { // August or later (school year starts)
    grade = 12 - (gradYear - currentYear);
  } else { // Before August
    grade = 11 - (gradYear - currentYear);
  }

  // Map the calculated grade to the appropriate checklist, replacing placeholder
  let checklist = null;
  if (grade <= 9) { // Freshman is typically 9th grade
    checklist = checklists.freshman;
  } else if (grade === 10) { // Sophomore is 10th grade
    checklist = checklists.sophomore;
  } else if (grade === 11) { // Junior is 11th grade
    checklist = checklists.junior;
  } else if (grade === 12) { // Senior is 12th grade
    checklist = checklists.senior;
  } else { // If grade is outside 9-12 or less than 9 (e.g. already graduated or non-HS), consider post-grad
    checklist = checklists.postGrad;
  }

  if (checklist) {
    return {
      ...checklist,
      title: checklist.title.replace("GRAD_YEAR_PLACEHOLDER", gradYear)
    };
  }
  return null;
};

const iconMap = {
  sent: <Send className="w-4 h-4 text-blue-600" />,
  opened: <Eye className="w-4 h-4 text-yellow-600" />,
  replied: <MessageSquare className="w-4 h-4 text-green-600" />,
};

function ChecklistSection({ checklist, completedTasks, onTaskToggle }) {
  if (!checklist) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle>Recruiting Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-amber-400"/>
            <p className="text-sm">Add your graduation year in your profile to see your personalized checklist.</p>
            <Link to={createPageUrl("Profile")}>
              <Button variant="outline" size="sm" className="mt-4">
                Go to Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Recruiting Checklist</CardTitle>
        <CardDescription>{checklist.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {checklist.tasks.map(task => (
            <li key={task.id} className="flex items-start gap-3">
              <Checkbox
                id={`task-${task.id}`}
                checked={completedTasks.has(task.id)}
                onCheckedChange={() => onTaskToggle(task.id)}
                className="mt-0.5"
              />
              <Label 
                htmlFor={`task-${task.id}`} 
                className={`text-slate-700 text-sm ${completedTasks.has(task.id) ? 'line-through text-slate-500' : ''}`}
              >
                {task.text}
              </Label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}


export default function Timeline() {
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  useEffect(() => {
    loadTimelineData();
  }, []);

  const loadTimelineData = async () => {
    try {
      const user = await User.me();
      const athleteData = await Athlete.filter({created_by: user.email});
      if(!athleteData || athleteData.length === 0) {
        setLoading(false);
        return;
      }
      const currentAthlete = athleteData[0];
      setAthlete(currentAthlete);

      // Load completed tasks from localStorage
      const storedTasks = localStorage.getItem(`completed_tasks_${currentAthlete.id}`);
      if (storedTasks) {
        setCompletedTasks(new Set(JSON.parse(storedTasks)));
      }

      const [outreachData, coachData, schoolData] = await Promise.all([
        Outreach.filter({ athlete_id: currentAthlete.id }, "-created_date"),
        Coach.list(),
        School.list()
      ]);

      const getCoachName = (id) => coachData.find(c => c.id === id)?.name || "N/A";
      const getSchoolName = (id) => schoolData.find(s => s.id === id)?.name || "N/A";

      const followUps = outreachData
        .filter(o => o.next_follow_up && !isPast(new Date(o.next_follow_up)))
        .map(o => ({
          ...o,
          coachName: getCoachName(o.coach_id),
          schoolName: getSchoolName(o.school_id),
        }))
        .sort((a, b) => new Date(a.next_follow_up) - new Date(b.next_follow_up));
      
      setUpcomingTasks(followUps);

      const log = outreachData
        .slice(0, 15)
        .map(o => ({
          id: o.id,
          date: o.sent_date || o.created_date,
          status: o.status,
          title: `Message ${o.status} to ${getCoachName(o.coach_id)}`,
          description: `at ${getSchoolName(o.school_id)}.`,
      }));

      setActivityLog(log);

    } catch (error) {
      console.error("Error loading timeline:", error);
    }
    setLoading(false);
  };
  
  const handleTaskToggle = (taskId) => {
    const newCompletedTasks = new Set(completedTasks);
    if (newCompletedTasks.has(taskId)) {
      newCompletedTasks.delete(taskId);
    } else {
      newCompletedTasks.add(taskId);
    }
    setCompletedTasks(newCompletedTasks);
    if (athlete) {
      localStorage.setItem(`completed_tasks_${athlete.id}`, JSON.stringify([...newCompletedTasks]));
    }
  };

  const FollowUpBadge = ({ date }) => {
    const dueDate = new Date(date);
    const daysUntil = differenceInDays(dueDate, new Date());
  
    if (isToday(dueDate)) {
      return <Badge className="bg-red-500 text-white">Due Today</Badge>;
    }
    if (isPast(dueDate)) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (daysUntil <= 7) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{`Due in ${daysUntil + 1} days`}</Badge>;
    }
    return <Badge variant="outline">{format(dueDate, "MMM d")}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const checklistData = athlete?.graduation_year 
    ? getChecklistForGradYear(athlete.graduation_year) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Recruiting Action Plan</h1>
                <p className="text-slate-600">Stay on top of your tasks and track your progress.</p>
            </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-blue-600" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>Your next follow-ups with coaches.</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingTasks.slice(0,5).map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-800">Follow up with {task.coachName}</p>
                          <p className="text-sm text-slate-600">{task.schoolName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FollowUpBadge date={task.next_follow_up} />
                          <Link to={createPageUrl("Tracking")}>
                            <Button variant="ghost" size="sm">View <ArrowRight className="w-4 h-4 ml-1" /></Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400"/>
                    <p>No upcoming tasks scheduled.</p>
                    <p className="text-sm">Nice work staying on top of your outreach!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>A log of your most recent outreach events.</CardDescription>
              </CardHeader>
              <CardContent>
                {activityLog.length > 0 ? (
                  <div className="space-y-4">
                    {activityLog.map(event => (
                      <div key={event.id} className="flex items-start gap-4">
                        <div className="mt-1">{iconMap[event.status]}</div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{event.title}</p>
                          <p className="text-sm text-slate-500">{format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                   <div className="text-center py-8 text-slate-500">
                    <Send className="w-12 h-12 mx-auto mb-3 text-slate-300"/>
                    <p>No activity yet.</p>
                    <p className="text-sm">Your sent messages will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recruiting Checklist */}
          <div className="lg:col-span-1">
            <ChecklistSection 
              checklist={checklistData} 
              completedTasks={completedTasks}
              onTaskToggle={handleTaskToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
