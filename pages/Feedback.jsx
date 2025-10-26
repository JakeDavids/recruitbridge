
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Heart,
  Lightbulb
} from "lucide-react";

const feedbackCategories = [
  { value: "feature_request", label: "Feature Request", icon: Lightbulb },
  { value: "bug_report", label: "Bug Report", icon: AlertCircle },
  { value: "general_feedback", label: "General Feedback", icon: MessageSquare },
  { value: "testimonial", label: "Success Story", icon: Star },
  { value: "improvement", label: "Improvement Suggestion", icon: Heart }
];

const existingFeedback = [
  {
    id: 1,
    category: "feature_request",
    subject: "Add video call scheduling with coaches",
    feedback: "It would be great to have a feature that lets us schedule video calls directly with coaches through the platform.",
    user: "Marcus J.",
    date: "2025-01-10",
    status: "under_review"
  },
  {
    id: 2, 
    category: "testimonial",
    subject: "Got my first D1 offer!",
    feedback: "RecruitBridge helped me organize my outreach perfectly. I got my first D1 offer from a coach I contacted through the platform. The AI message generation was a game changer!",
    user: "Sarah M.",
    date: "2025-01-08",
    status: "published"
  },
  {
    id: 3,
    category: "improvement",
    subject: "Better mobile experience",
    feedback: "The mobile app works well but could use some UI improvements for easier coach contact management on the go.",
    user: "Alex R.",
    date: "2025-01-05", 
    status: "in_progress"
  }
];

export default function Feedback() {
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !subject || !feedback) return;

    setLoading(true);
    
    // Simulate submission (in real app, this would save to database or send email)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setCategory("");
      setSubject("");
      setFeedback("");
      
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "under_review": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800"; 
      case "published": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "under_review": return "Under Review";
      case "in_progress": return "In Progress";
      case "published": return "Published";
      default: return "New";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Feedback & Suggestions</h1>
            <p className="text-slate-600">Help us improve RecruitBridge with your ideas and experiences</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submit Feedback */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  Submit Feedback
                </CardTitle>
                <CardDescription>
                  Share your thoughts, report bugs, request features, or tell us your success story
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Thank you! Your feedback has been submitted.</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackCategories.map(cat => {
                          const Icon = cat.icon;
                          return (
                            <SelectItem key={cat.value} value={cat.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {cat.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief summary of your feedback..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="feedback">Your Feedback</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us more about your suggestion, bug report, or experience..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={!category || !subject || !feedback || loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {loading ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Community Feedback */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Community Feedback
                </CardTitle>
                <CardDescription>See what other athletes are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingFeedback.map(item => {
                    const categoryData = feedbackCategories.find(c => c.value === item.category);
                    const Icon = categoryData?.icon || MessageSquare;
                    
                    return (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{item.subject}</span>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.feedback}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{item.user}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• <strong>Feature Requests:</strong> Describe how it would help your recruiting</p>
                <p>• <strong>Bug Reports:</strong> Include steps to reproduce the issue</p>
                <p>• <strong>Success Stories:</strong> Share your wins to inspire others!</p>
                <p>• <strong>General Feedback:</strong> Any thoughts on improving the platform</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
