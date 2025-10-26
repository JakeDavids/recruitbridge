import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Target, Send, Users, Upload, Zap } from "lucide-react";

export default function QuickActions({ athlete }) {
  const actions = [
    {
      title: "Find Schools",
      description: "Discover target schools",
      icon: Target,
      url: createPageUrl("Schools"),
      color: "from-blue-500 to-blue-600",
      enabled: !!athlete
    },
    {
      title: "Send Messages",
      description: "Create outreach emails",
      icon: Send,
      url: createPageUrl("Outreach"),
      color: "from-green-500 to-green-600",
      enabled: !!athlete
    },
    {
      title: "Manage Coaches",
      description: "Track communications",
      icon: Users,
      url: createPageUrl("Tracking"),
      color: "from-purple-500 to-purple-600",
      enabled: true
    },
    {
      title: "Upload Files",
      description: "Add highlights & transcripts",
      icon: Upload,
      url: createPageUrl("Upload"),
      color: "from-orange-500 to-orange-600",
      enabled: true
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Link 
              key={action.title} 
              to={action.url}
              className={action.enabled ? "" : "pointer-events-none"}
            >
              <Button
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-3 w-full ${
                  action.enabled 
                    ? "hover:shadow-lg transition-shadow border-slate-200 hover:border-slate-300" 
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!action.enabled}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
        {!athlete && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <span className="font-medium">Complete your profile</span> to unlock all features
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}