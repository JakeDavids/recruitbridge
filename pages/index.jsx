import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Users, Mail, Target, TrendingUp, BarChart3, Clock, CheckCircle, Facebook, Twitter, Instagram, UserPlus, Search, ChevronDown, Play } from 'lucide-react';

export default function RecruitBridgeLanding() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // ============================================
  // STEP 1: CHECK IF USER IS ALREADY LOGGED IN
  // ============================================
  // When page loads, we check if the user is authenticated
  // If YES → redirect them to Dashboard (they don't need to see the landing page)
  // If NO → show the landing page with "Get Started" buttons
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me(); // Try to get current logged-in user
        if (user) {
          // User is already logged in, send them to the app
          navigate(createPageUrl("Dashboard"), { replace: true });
        }
      } catch (error) {
        // User is NOT logged in, that's fine - show landing page
      } finally {
        setChecking(false); // Done checking, stop showing loading spinner
      }
    };
    
    checkAuth();
  }, [navigate]);

  // ============================================
  // STEP 2: HANDLE SCROLL EFFECTS
  // ============================================
  // This adds a shadow to the header when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ============================================
  // STEP 3: ANIMATE STATS ON SCROLL
  // ============================================
  // When user scrolls to the stats section, trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ============================================
  // STEP 4: HANDLE "GET STARTED" BUTTON CLICKS
  // ============================================
  // THIS IS THE KEY FUNCTION!
  // When user clicks "Get Started", "Start Free", or "Join Free Today"
  // We call User.login() which triggers Base44's Google OAuth flow
  const handleGetStarted = async () => {
    try {
      await User.login(); // ✅ Opens Google sign-in popup
      // After successful login, Base44 automatically redirects to /Dashboard
    } catch (error) {
      console.error("Login error:", error);
      // If something goes wrong, log it for debugging
    }
  };

  // ============================================
  // STEP 5: HANDLE "SEE PLANS" BUTTON CLICKS
  // ============================================
  // When user wants to see pricing, redirect to Upgrade page
  const handleSeePlans = () => {
    window.location.href = "https://recruitbridge.net/Upgrade";
  };

  // ============================================
  // STEP 6: SMOOTH SCROLL TO SECTIONS
  // ============================================
  // For navigation links like "How It Works", "Features", etc.
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // ============================================
  // SHOW LOADING SPINNER WHILE CHECKING AUTH
  // ============================================
  // While we're checking if user is logged in, show a loading screen
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // ============================================
  // RENDER THE LANDING PAGE
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-xl lg:text-2xl font-bold text-blue-600">
                RecruitBridge
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-blue-600 transition-colors relative group px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-blue-600 transition-colors relative group px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('story')}
                className="text-gray-600 hover:text-blue-600 transition-colors relative group px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Our Story
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all group-hover:w-full"></span>
              </button>
              {/* ✅ FIXED: Button calls handleGetStarted instead of linking to /signup */}
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #0046AD 0%, #3B82F6 40%, #E5E7EB 100%)'}}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-12"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            <span className="text-white block">Turn Your Hard Work Into</span>
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent relative">
              College Opportunities
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/5 h-1 bg-yellow-400 rounded-full"></span>
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            Built by an athlete who had to fight for every opportunity — so you don't have to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* ✅ FIXED: Button calls handleGetStarted */}
            <button
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-2xl hover:shadow-yellow-500/50 hover:scale-105 transform"
            >
              <span className="flex items-center gap-2">
                Start Free
                <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            {/* ✅ FIXED: Button calls handleSeePlans */}
            <button
              onClick={handleSeePlans}
              className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
            >
              See Plans
            </button>
          </div>
          
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="mt-16 mx-auto block focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2"
            aria-label="Scroll to how it works section"
          >
            <ChevronDown className="w-8 h-8 text-white/70 animate-bounce" />
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your streamlined path to college recruiting success — in four simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Search,
                number: "01",
                title: "Build Your Profile",
                description: "Add your stats, achievements, and highlight videos. RecruitBridge optimizes your profile for coach visibility."
              },
              {
                icon: Mail,
                number: "02",
                title: "Send Smart Outreach",
                description: "AI writes and sends personalized emails to college coaches based on your goals and position."
              },
              {
                icon: Target,
                number: "03",
                title: "Pick Target Schools",
                description: "Choose schools you want to contact, view all their info in one place, and stay organized."
              },
              {
                icon: TrendingUp,
                number: "04",
                title: "Track Results",
                description: "See who opened, replied, and showed interest — so you know exactly who to follow up with."
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 h-full border-2 border-transparent hover:border-blue-400 transition-all hover:shadow-xl">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-5xl font-black text-blue-100">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              The Numbers Speak for Themselves
            </h2>
            <p className="text-xl text-white/80">
              Real results from athletes who used RecruitBridge
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "87%", label: "Of recruited athletes used professional tools", icon: Users },
              { value: "3x", label: "More responses with AI-generated messages", icon: TrendingUp },
              { value: "65%", label: "Of scholarships awarded by January", icon: Clock }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all"
                >
                  <Icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-6xl font-black text-white mb-2">
                    {statsVisible ? stat.value : "0"}
                  </div>
                  <p className="text-white/80 text-lg">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Get Recruited
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tools designed specifically for student-athletes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: "AI Email Generation",
                description: "Get personalized, professional emails written for each coach — no more writer's block."
              },
              {
                icon: Target,
                title: "School Research",
                description: "Find target schools that match your academic and athletic goals with detailed profiles."
              },
              {
                icon: Users,
                title: "Coach Database",
                description: "Access verified contact info for thousands of college coaches across all divisions."
              },
              {
                icon: BarChart3,
                title: "Response Tracking",
                description: "See who opened, clicked, and replied to your emails in real-time."
              },
              {
                icon: Clock,
                title: "Follow-Up Reminders",
                description: "Never miss a follow-up with automated reminders and suggested timing."
              },
              {
                icon: CheckCircle,
                title: "Recruiting Calendar",
                description: "Stay on top of deadlines, camps, and important recruiting dates."
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-blue-200 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Built by an Athlete, For Athletes
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 border-2 border-blue-100">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                I know what it's like to feel overlooked. As a high school athlete, I sent hundreds of emails to college coaches, hoping just one would give me a chance. Most never responded. Some opened my emails but moved on. A few replied, but only after I followed up multiple times.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                The recruiting process felt like a full-time job on top of school, practice, and games. I didn't have an agency or expensive recruiting service to help me. I had to figure it all out myself.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Eventually, I got recruited. But I also saw countless talented teammates who didn't — not because they weren't good enough, but because they didn't know how to market themselves.
              </p>
              <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                That's why I built RecruitBridge. So no athlete has to wonder "What if?" — because they'll have every tool they need to get noticed, stay organized, and land their opportunity.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">JD</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">Jake Davids</p>
                <p className="text-gray-600">Founder, RecruitBridge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-y-12"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Recruited?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join hundreds of athletes who are using RecruitBridge to land college opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* ✅ FIXED: Button calls handleGetStarted */}
            <button
              onClick={handleGetStarted}
              className="group bg-yellow-500 text-gray-900 px-12 py-5 rounded-xl font-bold text-xl hover:bg-yellow-400 transition-all shadow-2xl hover:shadow-yellow-500/50 hover:scale-105 transform"
            >
              <span className="flex items-center gap-3">
                Join Free Today
                <UserPlus className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            {/* ✅ FIXED: Button calls handleSeePlans */}
            <button
              onClick={handleSeePlans}
              className="bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-white/20 transition-all border-2 border-white/30"
            >
              See Plans
            </button>
          </div>
          <p className="mt-8 text-white/70 text-sm">
            No credit card required • Start in 60 seconds • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <span className="text-xl font-bold">RecruitBridge</span>
              </div>
              <p className="text-gray-400">
                Empowering student-athletes to reach their college recruiting goals.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={handleSeePlans} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('story')} className="hover:text-white transition-colors">Our Story</button></li>
                <li><a href="mailto:support@recruitbridge.net" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} RecruitBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}