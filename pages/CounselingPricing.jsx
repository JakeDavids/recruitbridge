
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users2, 
  CheckCircle, 
  Award,
  Star,
  Calendar
} from "lucide-react";

export default function CounselingPricing() {
  const [selectedPackage, setSelectedPackage] = useState("comprehensive");

  const packages = [
    {
      id: "starter",
      name: "Starter Session",
      price: 69,
      duration: "45 Minutes",
      subtitle: "Perfect for getting started",
      features: [
        "45-minute video consultation",
        "Recruiting timeline review",
        "School targeting strategy",
        "Email template tips",
        "Follow-up resource email"
      ],
      popular: false
    },
    {
      id: "comprehensive",
      name: "Comprehensive Package",
      price: 199,
      duration: "1 Hour + Follow-Up",
      subtitle: "Complete recruiting strategy",
      features: [
        "1-hour consultation",
        "Personalized recruiting plan",
        "School list optimization",
        "Custom email templates",
        "Profile & highlights review",
        "30-day follow-up session",
        "Direct coach introductions (when applicable)" // Updated this line
      ],
      popular: true
    },
    {
      id: "premium",
      name: "Premium Mentorship",
      price: 399,
      duration: "3 Months",
      subtitle: "Ongoing mentorship",
      features: [
        "3 monthly 1-hour sessions",
        "Unlimited email support",
        "Recruiting plan updates",
        "Scholarship & financial aid guidance",
        "Interview prep + college visit planning",
        "Coach relationship management"
      ],
      popular: false
    }
  ];

  const handleBookSession = (packageId) => {
    // This Calendly link currently points to a 30-min slot.
    // In a real application, you might want to dynamically adjust this based on packageId or use a more generic booking page.
    window.open('https://calendly.com/jake-avery-davids/30min', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            1-on-1 Recruiting Counseling
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            RecruitBridge tools give you everything you need to manage your recruiting. For families who want additional personalized guidance, we also offer private counseling sessions with recruiting experts.
          </p>

          {/* D1 Credentials */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 max-w-2xl mx-auto mt-6">
            <div className="flex items-center justify-center gap-4 text-white">
              <Award className="w-10 h-10" />
              <div className="text-left">
                <p className="font-bold text-lg">Guaranteed Session with D1 Player</p>
                <p className="text-sm opacity-90">Former D1 athlete with real recruiting & transfer portal experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative transition-all hover:shadow-xl ${
                pkg.popular ? 'border-2 border-blue-500 scale-105' : 'border border-slate-200'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 inline mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                <div className="text-4xl font-bold text-blue-600 my-4">
                  ${pkg.price}
                </div>
                <p className="text-sm text-slate-500">{pkg.duration}</p>
                <p className="text-sm text-slate-600 mt-2">{pkg.subtitle}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleBookSession(pkg.id)}
                  className={`w-full ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      : 'bg-slate-600 hover:bg-slate-700'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Optional Note */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-blue-800">
              <strong>Note:</strong> Counseling is optional. Most athletes succeed using RecruitBridge alone — these sessions are for families who want extra, personalized guidance.
            </p>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Questions About Counseling?
            </h3>
            <p className="text-slate-600 mb-4">
              Reach out to learn more about how our recruiting experts can help
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:realrecruitbridge@gmail.com">
                Contact Us
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
