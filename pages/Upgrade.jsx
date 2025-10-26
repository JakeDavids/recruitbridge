
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Star,
  Zap,
  Target,
  MessageSquare,
  TrendingUp,
  Clock,
  Trophy,
  Sparkles,
  ExternalLink,
  Loader2,
  Lock, // Added Lock icon
  Gift // Added Gift icon
} from "lucide-react";

// Assuming a checkout utility function exists, e.g., in a lib/api file.
// If this function is part of a different module or globally available, this import might need adjustment.
// For this example, we assume it's an async function that takes an object and returns an object with a 'data' property.
// If this `checkout` function is not provided, this line might need to be adjusted or the function implemented.
async function checkout(payload) {
  const resp = await fetch("/functions/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await resp.json();
  return { data }; // Mimic the structure of { data } from a hypothetical API client
}


export default function Upgrade() {
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const testimonials = [
    {
      quote: "RecruitBridge helped me get noticed by SEC coaches. The AI message feature made my outreach so much more professional and effective.",
      name: "Marcus Johnson",
      initials: "MJ"
    },
    {
      quote: "I went from zero D1 offers to multiple Power 5 scholarships. The target school feature helped me focus on programs that were actually recruiting my position.",
      name: "Derek Williams",
      initials: "DW"
    },
    {
      quote: "The coach tracking system was incredible. I never lost track of which coaches I contacted and when to follow up. It kept me organized throughout the entire process.",
      name: "Antonio Rodriguez",
      initials: "AR"
    },
    {
      quote: "RecruitBridge's outreach center helped me manage conversations with 20+ college coaches at once. The response tracking made sure I never missed an opportunity.",
      name: "Jamal Washington",
      initials: "JW"
    }
  ];

  useEffect(() => {
    // Get current user for checkout
    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Could not load user:", error);
      }
    };
    loadUser();
  }, []);

  // Cycle through testimonials every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Shared checkout helper
  async function startCheckout(planKey, userId, email) {
    const { data } = await checkout({ plan: planKey, userId, email });
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert(data?.error || "Could not start checkout");
      setIsRedirecting(null); // Reset redirecting state on error
    }
  }

  const handleUpgrade = async (planKey) => {
    setIsRedirecting(planKey);

    try {
      await startCheckout(planKey, currentUser?.id, currentUser?.email);
    } catch (error) {
      console.error("Error with upgrade:", error);
      alert("There was an error processing your upgrade. Please try again.");
      setIsRedirecting(null);
    }
  };

  const plans = [
    {
      name: "Starter",
      key: "starter",
      price: billingCycle === "monthly" ? "$19" : "$199",
      period: billingCycle === "monthly" ? "month" : "year",
      originalPrice: billingCycle === "yearly" ? "$228" : null,
      description: "Basic recruiting essentials",
      features: [
        { name: "7 target schools", included: true },
        { name: "25 outreach messages/month", included: true },
        { name: "Basic coach tracking", included: true },
        { name: "Progress analytics", included: false },
        { name: "AI message generation", included: false },
        { name: "Response Center", included: false },
        { name: "Recruiting calendar", included: false },
        { name: "Outreach Identity & Profile", included: false, locked: true }, // New consolidated feature
        { name: "Coach Contact Info (incl. Phone)", included: false, locked: true }, // New feature
        { name: "1-on-1 Counseling", included: false, locked: true }
      ],
      cta: "Start Basic",
      popular: false,
      color: "slate"
    },
    {
      name: "Core",
      key: "core",
      price: billingCycle === "monthly" ? "$29" : "$299",
      period: billingCycle === "monthly" ? "month" : "year",
      originalPrice: billingCycle === "yearly" ? "$348" : null,
      description: "For the dedicated athlete",
      features: [
        { name: "15 target schools", included: true },
        { name: "75 outreach messages/month", included: true },
        { name: "Advanced coach tracking", included: true },
        { name: "Progress analytics", included: true },
        { name: "AI message generation (15/mo)", included: true },
        { name: "Response Center", included: false },
        { name: "Recruiting calendar", included: false },
        { name: "Outreach Identity & Profile", included: true }, // New consolidated feature
        { name: "Coach Contact Info (incl. Phone)", included: false, locked: true }, // New feature
        { name: "1-on-1 Counseling", included: false, locked: true }
      ],
      cta: "Choose Core",
      popular: false,
      color: "blue"
    },
    {
      name: "Unlimited",
      key: "unlimited",
      price: billingCycle === "monthly" ? "$45" : "$449",
      period: billingCycle === "monthly" ? "month" : "year",
      originalPrice: billingCycle === "yearly" ? "$540" : null,
      description: "For athletes serious about getting recruited",
      features: [
        { name: "Unlimited target schools", included: true },
        { name: "Unlimited outreach messages", included: true },
        { name: "Advanced coach tracking", included: true },
        { name: "Full progress analytics", included: true },
        { name: "Unlimited AI message generation", included: true },
        { name: "Response Center & AI Replies", included: true },
        { name: "Recruiting calendar + checklists", included: true },
        { name: "Outreach Identity & Profile", included: true }, // New consolidated feature
        { name: "Coach Contact Info (incl. Phone)", included: true }, // New feature
        // Different benefits for monthly vs yearly
        ...(billingCycle === "yearly" ? [
          { name: "1 FREE 1-on-1 Session ($69 value)", included: true, highlight: true },
          { name: "50% off your next session", included: true, highlight: true }
        ] : [
          { name: "50% off 1-on-1 Counseling Session", included: true, highlight: true }
        ])
      ],
      cta: "Upgrade Now",
      popular: true,
      color: "gradient",
      badge: billingCycle === "yearly" ? "Best Value" : null
    }
  ];

  const currentTestimonialData = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your trial just ended — but your recruiting journey doesn't have to.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Don't let this opportunity slip away. Athletes who upgrade see <strong>3x more responses</strong> from coaches and get recruited faster.
          </p>
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-red-800 font-medium">
              ⏰ Without upgrading, your tools are now locked and message generation is paused.
            </p>
          </div>
        </div>

        {/* Cycling Testimonial */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12 max-w-4xl mx-auto border-l-4 border-green-500">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-lg italic text-gray-700 mb-3">
                "{currentTestimonialData.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {currentTestimonialData.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{currentTestimonialData.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8 relative">
          <div className="bg-white rounded-full p-1 shadow-lg border relative">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Yearly
            </button>
          </div>
          {billingCycle === "yearly" && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-12 text-center">
              <Badge className="bg-green-500 text-white px-3 py-1">
                Save up to $93
              </Badge>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${
                plan.popular
                  ? 'border-2 border-orange-500 shadow-2xl scale-105 z-10'
                  : 'border border-gray-200 shadow-lg hover:shadow-xl transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 font-bold">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  {plan.badge || "MOST POPULAR"}
                </div>
              )}

              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    Was {plan.originalPrice}/{plan.period}
                  </div>
                )}
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-center gap-3 ${
                      feature.locked ? 'opacity-50' : ''
                    }`}>
                      {feature.included ? (
                        feature.locked ? (
                          <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : feature.highlight ? (
                          <Gift className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        ) : (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        feature.highlight ? 'font-semibold text-purple-700' :
                        feature.included && !feature.locked ? "text-gray-700" : "text-gray-400"
                      }`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.key)}
                  disabled={isRedirecting === plan.key}
                  className={`w-full py-3 font-bold text-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg'
                      : plan.color === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {isRedirecting === plan.key ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {plan.cta}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Urgency Section */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl text-white p-8 text-center mb-12">
          <Clock className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Don't Let This Recruiting Season Pass You By</h3>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Every day you wait is another day your competitors are getting ahead. College rosters fill up fast,
            and coaches move on to other prospects. The athletes who get recruited are the ones who act quickly and consistently.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">87%</div>
              <div className="text-sm opacity-90">of recruited athletes used professional tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold">3x</div>
              <div className="text-sm opacity-90">more responses with AI-generated messages</div>
            </div>
            <div>
              <div className="text-3xl font-bold">65%</div>
              <div className="text-sm opacity-90">of scholarships are awarded by January</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <Button
            onClick={() => handleUpgrade('unlimited')}
            size="lg"
            disabled={isRedirecting === 'unlimited'}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-4 text-xl font-bold shadow-2xl"
          >
            {isRedirecting === 'unlimited' ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Trophy className="w-6 h-6 mr-3" />
                Upgrade Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          <p className="text-gray-500 mt-4 text-sm">
            30-day money-back guarantee • Cancel anytime • Instant access
          </p>
        </div>

        {/* Success/Cancel Messages */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('status') === 'success' && (
          <div className="mt-8 max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-green-900 mb-2">🎉 Payment Successful!</h3>
            <p className="text-green-800">Your account has been upgraded. Welcome to RecruitBridge Premium!</p>
          </div>
        )}

        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('status') === 'cancel' && (
          <div className="mt-8 max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-amber-900 mb-2">Payment Cancelled</h3>
            <p className="text-amber-800">No worries! You can upgrade anytime when you're ready.</p>
          </div>
        )}
      </div>
    </div>
  );
}
