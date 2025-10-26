import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Mail, 
  Target, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp,
  Clock,
  MessageSquare
} from "lucide-react";

export default function EmailGuide() {
  const strategies = [
    {
      type: "Customized Emails",
      icon: <Target className="w-6 h-6" />,
      responseRate: "65-85%",
      timeRequired: "5-10 min per email",
      color: "from-green-500 to-emerald-500",
      pros: [
        "Highest response rates",
        "Shows genuine interest",
        "Builds personal connection",
        "Mentions specific program details"
      ],
      cons: [
        "Time-intensive",
        "Requires research per school"
      ],
      bestFor: "Top target schools, position coaches, dream schools"
    },
    {
      type: "Template-Based",
      icon: <MessageSquare className="w-6 h-6" />,
      responseRate: "35-50%",
      timeRequired: "2-3 min per email",
      color: "from-blue-500 to-sky-500",
      pros: [
        "Moderate personalization",
        "Efficient for multiple schools",
        "Good balance of time/results"
      ],
      cons: [
        "Less personal than custom",
        "May seem generic to some coaches"
      ],
      bestFor: "Secondary targets, similar programs, conference-wide outreach"
    },
    {
      type: "Bulk/General",
      icon: <Users className="w-6 h-6" />,
      responseRate: "15-25%",
      timeRequired: "30 sec per email",
      color: "from-orange-500 to-red-500",
      pros: [
        "Fastest approach",
        "Good for casting wide net",
        "Efficient for many schools"
      ],
      cons: [
        "Lowest response rates",
        "Can seem impersonal",
        "Less likely to build relationships"
      ],
      bestFor: "Safety schools, initial broad outreach, follow-ups"
    }
  ];

  const emailElements = [
    {
      element: "Subject Line",
      importance: "Critical",
      tips: [
        "Include position, name, and graduation year",
        "Example: 'QB | John Smith | Class of 2025'",
        "Keep under 50 characters",
        "Be specific and professional"
      ]
    },
    {
      element: "Opening",
      importance: "High",
      tips: [
        "Address coach by name and title",
        "Mention specific interest in their program",
        "Reference recent team success or news",
        "Be respectful and enthusiastic"
      ]
    },
    {
      element: "Body - Athletic Stats",
      importance: "Critical",
      tips: [
        "Key stats for your position",
        "40-time, height, weight",
        "Recent achievements/awards",
        "Team accomplishments"
      ]
    },
    {
      element: "Body - Academic Info",
      importance: "High",
      tips: [
        "GPA and test scores",
        "Academic honors",
        "Intended major",
        "Leadership activities"
      ]
    },
    {
      element: "Video/Links",
      importance: "Critical",
      tips: [
        "Include highlight video link",
        "Make sure links work",
        "Keep videos under 5 minutes",
        "Update highlights regularly"
      ]
    },
    {
      element: "Closing",
      importance: "Medium",
      tips: [
        "Express genuine interest",
        "Offer additional information",
        "Include contact information",
        "Professional signature"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Email Strategy Guide
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Master the art of coach outreach with proven strategies that get results
          </p>
        </div>

        {/* Strategy Comparison */}
        <div className="grid md:grid-cols-3 gap-6">
          {strategies.map((strategy, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${strategy.color} text-white`}>
                <CardTitle className="flex items-center gap-3">
                  {strategy.icon}
                  <div>
                    <h3 className="text-lg font-bold">{strategy.type}</h3>
                    <p className="text-sm opacity-90">Response Rate: {strategy.responseRate}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{strategy.timeRequired}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">✅ Pros:</h4>
                    <ul className="text-sm space-y-1">
                      {strategy.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">❌ Cons:</h4>
                    <ul className="text-sm space-y-1">
                      {strategy.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-slate-700">Best For:</p>
                    <p className="text-sm text-slate-600">{strategy.bestFor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Email Elements Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Essential Email Elements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {emailElements.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">{item.element}</h3>
                    <Badge variant={item.importance === 'Critical' ? 'destructive' : item.importance === 'High' ? 'default' : 'secondary'}>
                      {item.importance}
                    </Badge>
                  </div>
                  <ul className="space-y-1">
                    {item.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Steps */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Ready to Start Your Outreach?
              </h3>
              <p className="text-blue-700 mb-6">
                Use RecruitBridge's AI-powered tools to create compelling emails that get coach responses
              </p>
              <div className="flex justify-center gap-4">
                <Link to={createPageUrl("Outreach")}>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Zap className="w-5 h-5 mr-2" />
                    Start Creating Emails
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Profile")}>
                  <Button variant="outline">
                    Complete Profile First
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">🏆 Pro Tips from Successful Recruits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-amber-900 mb-3">Timing Matters</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Send emails Tuesday-Thursday, 10 AM - 2 PM</li>
                  <li>• Avoid Mondays and Fridays</li>
                  <li>• Follow up every 2-3 weeks</li>
                  <li>• Send updates after big games</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-3">Stand Out</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Mention specific games you watched</li>
                  <li>• Reference recent team achievements</li>
                  <li>• Show knowledge of their system</li>
                  <li>• Include measurable improvements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}