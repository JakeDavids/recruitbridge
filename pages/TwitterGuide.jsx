
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageSquare, 
  X, // Changed from Twitter
  ArrowRight, 
  Copy, 
  Send, 
  CheckSquare,
  Smartphone,
  Monitor,
  Edit3,
  ExternalLink
} from "lucide-react";

export default function XGuide() { // Renamed from TwitterGuide
  const steps = [
    {
      number: 1,
      title: "Open X on Another Device", // Changed from Twitter
      icon: <Smartphone className="w-6 h-6" />,
      description: "Open the X app on your phone, tablet, or another browser tab", // Changed from Twitter/X
      details: [
        "Use your mobile device for the best DM experience",
        "Or open X.com in a new browser tab/window", // Changed from Twitter.com
        "Make sure you're logged into your X account" // Changed from Twitter
      ]
    },
    {
      number: 2,
      title: "Generate Your Message",
      icon: <Edit3 className="w-6 h-6" />,
      description: "Use RecruitBridge to create your personalized DM",
      details: [
        "Go to the Outreach Center and select X (Twitter) tab", // Changed from Twitter/X
        "Choose the coach you want to contact",  
        "Click 'Generate DM' to create your message",
        "Review the AI-generated content"
      ],
      action: {
        text: "Go to Outreach Center",
        url: createPageUrl("Outreach")
      }
    },
    {
      number: 3,
      title: "Personalize & Edit",
      icon: <Edit3 className="w-6 h-6" />,
      description: "Make any personal changes to the generated message",
      details: [
        "Add personal touches that reflect your personality",
        "Mention specific things about their program",
        "Keep it concise and to the point", // Changed from "Keep it under 280 characters for Twitter"
        "Ensure it sounds authentic to your voice"
      ]
    },
    {
      number: 4,
      title: "Copy the Message",
      icon: <Copy className="w-6 h-6" />,
      description: "Copy your finalized message to your clipboard",
      details: [
        "Click the 'Copy Text' button in RecruitBridge",
        "The message is now saved to your clipboard",
        "Switch to your X app or tab" // Changed from Twitter
      ]
    },
    {
      number: 5,
      title: "Find the Coach on X", // Changed from Twitter
      icon: <X className="w-6 h-6" />, // Changed from Twitter icon
      description: "Search for and locate the coach's X profile", // Changed from Twitter
      details: [
        "Use the search function on X", // Changed from Twitter
        "Search for the coach's name and school",
        "Look for verified accounts or official team accounts",
        "Check their bio to confirm it's the right person"
      ]
    },
    {
      number: 6,
      title: "Send the Direct Message",
      icon: <Send className="w-6 h-6" />,
      description: "Paste and send your message via X DM", // Changed from Twitter DM
      details: [
        "Click the 'Message' button on their profile",
        "Paste your copied message into the DM box",
        "Review one more time before sending",
        "Click 'Send' to deliver your message"
      ]
    },
    {
      number: 7,
      title: "Log in RecruitBridge",
      icon: <CheckSquare className="w-6 h-6" />,
      description: "Mark the message as sent in your tracking system",
      details: [
        "Return to RecruitBridge Outreach Center",
        "Click 'Mark as Sent' for that coach",
        "This helps you track your outreach efforts",
        "Set a reminder for follow-up if needed"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg"> {/* Changed background to black */}
              <X className="w-8 h-8 text-white" /> {/* Changed icon to X */}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            X (Twitter) DM Guide {/* Changed title */}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Step-by-step instructions for sending recruiting messages to coaches via X Direct Messages {/* Changed text */}
          </p>
        </div>

        {/* Why X DMs Section */}
        <Card className="mb-8 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300"> {/* Changed colors to gray theme */}
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">✅ Why X DMs Work</h3> {/* Changed text color, "Twitter" to "X" */}
                <ul className="space-y-2 text-sm text-gray-800"> {/* Changed text color */}
                  <li>• Coaches check X frequently</li> {/* Changed "Twitter" to "X" */}
                  <li>• More casual, personal connection</li>
                  <li>• Stand out from crowded email inboxes</li>
                  <li>• Shows you follow their program</li>
                  <li>• Quick and direct communication</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">💡 Pro Tips</h3> {/* Changed text color */}
                <ul className="space-y-2 text-sm text-gray-800"> {/* Changed text color */}
                  <li>• Keep messages concise</li> {/* Changed from "under 280 characters" */}
                  <li>• Include your highlight video link</li>
                  <li>• Be respectful and professional</li>
                  <li>• Follow their account first (optional)</li>
                  <li>• Send during business hours</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step-by-Step Guide */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <Card key={step.number} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg"> {/* Changed background to black */}
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                    <p className="text-slate-600 mt-1">{step.description}</p>
                  </div>
                  <div className="text-gray-700"> {/* Changed icon color */}
                    {step.icon}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div> {/* Changed bullet color to black */}
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                {step.action && (
                  <div className="mt-4 pt-4 border-t">
                    <Link to={step.action.url}>
                      <Button className="bg-black hover:bg-gray-800"> {/* Changed button colors to black/gray */}
                        {step.action.text}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sample Message Template */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">📝 Sample DM Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-green-300">
              <p className="text-slate-800 font-mono text-sm leading-relaxed">
                "Hi Coach [Name]! I'm [Your Name], [Position] from [High School], Class of [Year]. 
                Really impressed with [School]'s [specific program detail]. 
                [Key stat/achievement]. Would love to learn more about your program! 
                Highlights: [link] Thanks!"
              </p>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-green-700">
              <Badge variant="outline" className="border-green-400 text-green-700">
                Character Count: ~200-250
              </Badge>
              <Badge variant="outline" className="border-green-400 text-green-700">
                Professional & Personal
              </Badge>
              <Badge variant="outline" className="border-green-400 text-green-700">
                Includes Key Info
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link to={createPageUrl("Outreach")}>
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 px-8 py-3">
              <MessageSquare className="w-5 h-5 mr-3" />
              Start Creating DMs Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <p className="text-xs text-amber-800 text-center">
              <strong>Important:</strong> Always be respectful and professional when contacting coaches. 
              Follow NCAA recruiting rules and guidelines. Some coaches may prefer email communication, 
              so be prepared to use multiple outreach methods.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
