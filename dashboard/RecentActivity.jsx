
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Send, Eye, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ outreaches, coaches, schools }) {
  const getCoachName = (coachId) => {
    const coach = coaches.find(c => c.id === coachId);
    return coach ? coach.name : "Unknown Coach";
  };

  const getSchoolName = (schoolId) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : "Unknown School";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Send className="w-4 h-4 text-blue-500" />;
      case 'opened':
        return <Eye className="w-4 h-4 text-green-500" />;
      case 'replied':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return "bg-blue-100 text-blue-800";
      case 'opened':
        return "bg-green-100 text-green-800";
      case 'replied':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const recentOutreaches = outreaches.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentOutreaches.length > 0 ? (
          <div className="space-y-4">
            {recentOutreaches.map((outreach) => (
              <div key={outreach.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:shadow-sm hover:bg-white transition-all duration-200">
                <div className="flex items-center gap-4">
                  {getStatusIcon(outreach.status)}
                  <div>
                    <p className="font-medium text-slate-900">
                      {getCoachName(outreach.coach_id)}
                    </p>
                    <p className="text-sm text-slate-600">
                      {getSchoolName(outreach.school_id)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {outreach.sent_date ? format(new Date(outreach.sent_date), "MMM d, yyyy") : format(new Date(outreach.created_date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(outreach.status)}>
                    {outreach.status.replace('_', ' ')}
                  </Badge>
                  {outreach.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs">
                      High Priority
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No activity yet</p>
            <p className="text-sm text-slate-400 mt-1">Start reaching out to coaches to see your activity here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
