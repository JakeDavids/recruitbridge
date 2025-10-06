import React, { useState, useEffect } from "react";
import { Outreach, Coach, School, Athlete } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Eye,
  MessageSquare,
  Send,
  Target,
  Clock,
  CheckCircle2,
  Award
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function CoachAnalytics() {
  const [outreaches, setOutreaches] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [schools, setSchools] = useState([]);
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const user = await User.me();
      const athleteData = await Athlete.filter({ created_by: user.email });
      const currentAthlete = athleteData[0] || null;
      setAthlete(currentAthlete);

      if (currentAthlete) {
        const [outreachData, coachData, schoolData] = await Promise.all([
          Outreach.filter({ athlete_id: currentAthlete.id }),
          Coach.list(),
          School.list()
        ]);

        setOutreaches(outreachData);
        setCoaches(coachData);
        setSchools(schoolData);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
    setLoading(false);
  };

  const getCoachName = (id) => coaches.find(c => c.id === id)?.name || "Unknown Coach";
  const getSchoolName = (id) => schools.find(s => s.id === id)?.name || "Unknown School";

  // Calculate overall stats
  const totalSent = outreaches.filter(o => o.status === 'sent' || o.status === 'opened' || o.status === 'replied').length;
  const totalOpened = outreaches.filter(o => o.status === 'opened' || o.status === 'replied').length;
  const totalReplied = outreaches.filter(o => o.status === 'replied').length;
  
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  const replyRate = totalOpened > 0 ? Math.round((totalReplied / totalOpened) * 100) : 0;

  // Find most engaged coaches (coaches who have replied)
  const engagedCoaches = outreaches
    .filter(o => o.status === 'replied')
    .map(o => ({
      ...o,
      coachName: getCoachName(o.coach_id),
      schoolName: getSchoolName(o.school_id),
      responseTime: o.sent_date && o.reply_date ? 
        differenceInDays(new Date(o.reply_date), new Date(o.sent_date)) : null
    }))
    .sort((a, b) => new Date(b.reply_date) - new Date(a.reply_date));

  // Emails that got opened but no reply yet
  const openedNoReply = outreaches
    .filter(o => o.status === 'opened')
    .map(o => ({
      ...o,
      coachName: getCoachName(o.coach_id),
      schoolName: getSchoolName(o.school_id),
      daysSinceOpened: o.opened_date ? differenceInDays(new Date(), new Date(o.opened_date)) : 0
    }))
    .sort((a, b) => a.daysSinceOpened - b.daysSinceOpened);

  // Suggested follow-ups (opened 3-7 days ago)
  const suggestedFollowUps = openedNoReply.filter(o => 
    o.daysSinceOpened >= 3 && o.daysSinceOpened <= 7
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
            <p className="text-slate-600">Create your athlete profile to start tracking coach responses.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Coach Response Analytics</h1>
            <p className="text-slate-600">Data-driven insights on your outreach performance</p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Messages Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Send className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-3xl font-bold">{totalSent}</div>
                  <p className="text-xs text-slate-500">Total outreach</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Open Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-3xl font-bold">{openRate}%</div>
                  <p className="text-xs text-slate-500">{totalOpened} opened</p>
                </div>
              </div>
              <Progress value={openRate} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Reply Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-3xl font-bold">{replyRate}%</div>
                  <p className="text-xs text-slate-500">{totalReplied} replied</p>
                </div>
              </div>
              <Progress value={replyRate} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Engagement Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-3xl font-bold">{Math.round((openRate + replyRate) / 2)}%</div>
                  <p className="text-xs text-slate-500">Combined metric</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Most Engaged Coaches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Most Engaged Coaches
              </CardTitle>
              <CardDescription>
                Coaches who have responded to your emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              {engagedCoaches.length > 0 ? (
                <div className="space-y-4">
                  {engagedCoaches.slice(0, 5).map((outreach, index) => (
                    <div key={outreach.id} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{outreach.coachName}</p>
                        <p className="text-sm text-slate-600">{outreach.schoolName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Replied {format(new Date(outreach.reply_date), "MMM d")}
                          </Badge>
                          {outreach.responseTime !== null && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              {outreach.responseTime} day{outreach.responseTime !== 1 ? 's' : ''} response time
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No coach replies yet</p>
                  <p className="text-sm">Keep sending quality outreach!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suggested Follow-Ups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Suggested Follow-Ups
              </CardTitle>
              <CardDescription>
                Emails opened 3-7 days ago - perfect timing for follow-up
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suggestedFollowUps.length > 0 ? (
                <div className="space-y-4">
                  {suggestedFollowUps.slice(0, 5).map((outreach) => (
                    <div key={outreach.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900">{outreach.coachName}</p>
                          <p className="text-sm text-slate-600">{outreach.schoolName}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            Opened {outreach.daysSinceOpened} days ago
                          </Badge>
                        </div>
                        <Badge className="bg-orange-500 text-white">
                          Follow up now
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-3">
                        <strong>Why now?</strong> Studies show 3-7 days after opening is the best time to follow up - shows persistence without being pushy.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No follow-ups needed right now</p>
                  <p className="text-sm">Great job staying on top of your outreach!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Opened Emails */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-600" />
              Emails Opened (No Reply Yet)
            </CardTitle>
            <CardDescription>
              Track which coaches have seen your message
            </CardDescription>
          </CardHeader>
          <CardContent>
            {openedNoReply.length > 0 ? (
              <div className="space-y-3">
                {openedNoReply.map((outreach) => (
                  <div key={outreach.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{outreach.coachName}</p>
                      <p className="text-sm text-slate-600">{outreach.schoolName}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        Opened {outreach.daysSinceOpened} days ago
                      </Badge>
                      {outreach.daysSinceOpened >= 3 && outreach.daysSinceOpened <= 7 && (
                        <Badge className="ml-2 bg-orange-500 text-white text-xs">
                          Follow up recommended
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Eye className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No opened emails without replies</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}