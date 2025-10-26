
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Users2,
  Calendar,
  MessageCircle,
  Award,
  CheckCircle,
  Phone,
  Video,
  Mail,
  Clock,
  Target,
  BookOpen,
  TrendingUp,
  CreditCard } from
"lucide-react";
import { checkout } from "@/api/functions";

export default function RecruitingCounseling() {
  const [selectedPackage, setSelectedPackage] = useState("starter");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const packages = [
  {
    id: "starter",
    name: "Starter Session",
    price: 79, // Updated price
    originalPrice: 129,
    stripePlan: "starter",
    duration: "30 Minutes",
    description: "Perfect for getting started with recruiting guidance",
    features: [
    "30-minute video consultation",
    "Recruiting timeline review",
    "School targeting strategy",
    "Email template recommendations",
    "Basic profile optimization tips"],

    popular: false
  },
  {
    id: "comprehensive",
    name: "Comprehensive Package",
    price: 299, // Updated price
    originalPrice: 399,
    stripePlan: "core",
    duration: "1 Hour + 30 Min Follow-up", // Updated duration
    description: "Complete recruiting strategy and ongoing support",
    features: [
    "1-hour initial consultation",
    "Personalized recruiting plan",
    "School list optimization",
    "Custom email templates",
    "Profile & highlights review",
    "30-day follow-up session",
    "Direct coach introductions (when applicable)"],

    popular: true
  },
  {
    id: "premium",
    name: "Premium Mentorship",
    price: 599, // updated from 499
    originalPrice: 799, // updated from 699
    stripePlan: "unlimited",
    duration: "3 Months",
    description: "Ongoing mentorship throughout your recruiting journey",
    features: [
    "Monthly 1-hour sessions (3 total)",
    "Email support between sessions",
    "Recruiting plan updates",
    "Scholarship application guidance",
    "Interview preparation",
    "Coach relationship management",
    "College visit planning",
    "Financial aid guidance"],

    popular: false
  }];


  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const calendlyUrl = "https://calendly.com/jake-avery-davids/30min";
    window.open(calendlyUrl, '_blank');

    setTimeout(() => {
      setIsLoading(false);
      setIsBooked(true);
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    }, 1000);
  };

  const handlePayment = async (packageId) => {
    const selectedPkg = packages.find((p) => p.id === packageId);
    if (!selectedPkg) return;

    setPaymentLoading(true);
    try {
      const response = await checkout({
        plan: selectedPkg.stripePlan
      });

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert("Payment setup failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again or contact support.");
    }
    setPaymentLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* RecruitBridge Logo */}
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6875a318a0b2d879d617363b/202797ade_recruitbrigdelogo.png" // Updated logo source
            alt="RecruitBridge Logo"
            className="h-16 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            1-on-1 Recruiting Counseling
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
            Get personalized guidance from experienced recruiting professionals who have helped hundreds of athletes secure college opportunities.
          </p>
          
          {/* D1 Player Credentials Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 max-w-2xl mx-auto mt-6">
            <div className="flex items-center justify-center gap-4 text-white">
              <Award className="w-10 h-10" />
              <div className="text-left">
                <p className="font-bold text-lg">Guaranteed Session with D1 Player</p>
                <p className="text-sm opacity-90">Former D1 athlete with real recruiting & transfer portal experience</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge className="bg-green-100 text-green-800">
              🔥 Limited Time: Save up to $200
            </Badge>
          </div>
        </div>

        {/* Counseling Packages */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) =>
          <Card
            key={pkg.id}
            className={`relative cursor-pointer transition-all hover:shadow-xl ${
            pkg.popular ? 'border-2 border-blue-500 scale-105' : 'border border-slate-200'} ${
            selectedPackage === pkg.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedPackage(pkg.id)}>

              {pkg.popular &&
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                    ⭐ Most Popular
                  </Badge>
                </div>
            }
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-blue-600">${pkg.price}</span>
                  <span className="text-lg text-slate-400 line-through">${pkg.originalPrice}</span>
                </div>
                <p className="text-sm text-slate-500">{pkg.duration}</p>
                <p className="text-sm text-slate-600 mt-2">{pkg.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {pkg.features.map((feature, idx) =>
                <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                )}
                </ul>
                <Button
                onClick={() => handlePayment(pkg.id)}
                disabled={paymentLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">

                  {paymentLoading ?
                <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </> :

                <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Purchase
                    </>
                }
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Form (now Free Consultation) */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Your Free Consultation
            </CardTitle>
            <p className="text-sm text-slate-600">Book a free 15-minute consultation before purchasing.</p>
          </CardHeader>
          <CardContent>
            {isBooked ?
            <div className="text-center p-6 bg-green-50 text-green-700 rounded-lg">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Consultation Scheduled!</h3>
                <p className="mb-4">Please complete your session booking on Calendly. We look forward to connecting with you!</p>
                <Button
                className="mt-2 bg-green-600 hover:bg-green-700"
                onClick={() => setIsBooked(false)}>

                  Book Another Session
                </Button>
              </div> :

            <form onSubmit={handleContactSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                  placeholder="Full Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  disabled={isLoading || isBooked} />

                  <Input
                  type="email"
                  placeholder="Email Address"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  disabled={isLoading || isBooked} />

                  <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  disabled={isLoading || isBooked} />

                </div>
                <div className="space-y-4">
                  <Textarea
                  placeholder="Tell us about your recruiting goals and any specific questions you have..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  disabled={isLoading || isBooked} />

                  <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700"
                  disabled={isLoading || isBooked}>

                    {isLoading ?
                  <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scheduling...
                      </span> :

                  <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Free Consultation
                      </>
                  }
                  </Button>
                </div>
              </form>
            }
          </CardContent>
        </Card>

        {/* What You'll Get */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>What You'll Get in Every Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Video Consultation</h4>
                <p className="text-sm text-slate-600">One-on-one video call with D1 player who knows the process</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Custom Strategy</h4>
                <p className="text-sm text-slate-600">Personalized recruiting plan tailored to your goals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Transfer Portal Guidance</h4>
                <p className="text-sm text-slate-600">Expert advice on navigating the transfer portal process</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium mb-2">Follow-up Support</h4>
                <p className="text-sm text-slate-600">Continued guidance and check-ins on your progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Our Counseling */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Why Athletes Choose Our Counseling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-3">D1 Experience</h4>
                <p className="text-slate-600">Our counselors are former D1 players who have been through the exact recruiting process you're facing, including the transfer portal.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-3">Proven Results</h4>
                <p className="text-slate-600">We've helped hundreds of student-athletes navigate the recruiting process and secure opportunities at their dream schools.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-3">Personalized Approach</h4>
                <p className="text-slate-600">Every athlete's journey is unique. We create customized strategies based on your specific goals, strengths, and target schools.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact/Email Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Ready to Start Your Recruiting Journey?
              </h3>
              <p className="text-blue-700 mb-6">
                Purchase a session or email us with any questions
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <Button
                  onClick={() => window.open('https://calendly.com/jake-avery-davids/30min', '_blank')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600">

                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Free Consultation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:realrecruitbridge@gmail.com'}>

                  <Mail className="w-5 h-5 mr-2" />
                  Email Questions
                </Button>
              </div>
              <p className="text-sm text-blue-600">
                📧 Questions? Contact us at <strong>realrecruitbridge@gmail.com</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}
