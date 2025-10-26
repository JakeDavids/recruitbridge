import React from 'react';
import { Users, Mail, Target, TrendingUp, BarChart3, Clock, CheckCircle, Facebook, Twitter, Instagram } from 'lucide-react';

export default function RecruitBridgeLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-blue-600">RecruitBridge</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600">How It Works</a>
            <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
            <a href="#story" className="text-gray-700 hover:text-blue-600">Our Story</a>
            <a href="https://app.recruitbridge.net/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Your Hard Work Into<br />
            <span className="text-yellow-400">College Opportunities</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 mb-12 max-w-4xl mx-auto">
            Built by an athlete who had to fight for every opportunity — so you don't have to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://app.recruitbridge.net/signup" className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 shadow-xl">
              Start Free
            </a>
            <a href="#plans" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600">
              See Plans
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            How It Works — Get Recruited in Four Simple Steps
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Your streamlined path to college recruiting success
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Build Your Profile</h3>
              <p className="text-gray-600">
                Add your stats, achievements, and highlight videos. RecruitBridge optimizes your profile for coach visibility.
              </p>
            </div>
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Send Smart Outreach</h3>
              <p className="text-gray-600">
                AI writes and sends personalized emails to college coaches based on your goals and position.
              </p>
            </div>
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Pick Target Schools</h3>
              <p className="text-gray-600">
                Choose schools you want to contact, view all their info in one place, and stay organized.
              </p>
            </div>
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Track Results</h3>
              <p className="text-gray-600">
                See who opened, replied, and showed interest — so you know where to focus next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section id="story" className="py-20 px-6 bg-yellow-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Jake Davids — Founder Story
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-12"></div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-yellow-500 mb-8">
            <div className="aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
              </div>
              <p className="text-gray-600 font-semibold">Video Coming Soon</p>
            </div>
            <button className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-400">
              Get Notified When Available
            </button>
          </div>

          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 italic">
              Watch my 60-second story to learn how RecruitBridge started.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg space-y-4 text-gray-700 leading-relaxed">
            <p>
              "I come from a small family of immigrants — no one in my house was talking about four-star rankings or scholarships. I started football during COVID and fell in love with the process of getting stronger and smarter."
            </p>
            <p>
              "By junior year, I was grinding through recruiting emails alone, tracking coach responses in messy spreadsheets. I eventually earned my shot at Charlotte, but I realized how much time I'd wasted figuring things out the hard way."
            </p>
            <p>
              "RecruitBridge was built to change that. Every athlete deserves a fair shot to be seen — without needing connections or insider knowledge."
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-br from-blue-700 via-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            Powerful Features for Athletes
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4"></div>
          <p className="text-xl text-blue-100 text-center mb-16">
            Everything you need to get recruited, powered by artificial intelligence
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Emails</h3>
              <p className="text-gray-600">
                Generate personalized emails to college coaches highlighting your unique strengths.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Coach Response Tracking</h3>
              <p className="text-gray-600">
                See who replied, their interest level, and when to follow up.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Recruiting Analytics</h3>
              <p className="text-gray-600">
                Track open rates, replies, and program interest levels.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Recruiting Questionnaires</h3>
              <p className="text-gray-600">
                <span className="font-semibold">Save 3+ hours per application.</span> Auto-fill school forms straight from your RecruitBridge profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Trusted by Athletes
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Join thousands of athletes who have successfully connected with college programs
          </p>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-xl font-semibold mb-1">Athletes Registered</div>
              <div className="text-gray-500">Growing every day</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-yellow-600 mb-2">3,500+</div>
              <div className="text-xl font-semibold mb-1">Coaches Contacted</div>
              <div className="text-gray-500">Across all divisions</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">87%</div>
              <div className="text-xl font-semibold mb-1">Response Rate</div>
              <div className="text-gray-500">Above industry average</div>
            </div>
          </div>

          <div className="flex gap-8 justify-center mb-12 text-gray-400">
            <span className="font-semibold">UNIV</span>
            <span className="font-semibold">STATE</span>
            <span className="font-semibold">TECH</span>
            <span className="font-semibold">COLLEGE</span>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <p className="text-xl text-gray-700 italic mb-6 text-center">
              "RecruitBridge helped me connect with 15 college programs in just two weeks. The process was simple, organized, and actually fun."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                JP
              </div>
              <div>
                <div className="font-bold text-lg">Jordan P.</div>
                <div className="text-gray-600">Class of 2024</div>
                <div className="text-blue-600 text-sm">⚡ Now at State University</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Building Your Future in College Sports
          </h2>
          <p className="text-xl text-blue-50 mb-8">
            Join RecruitBridge today and let AI help you connect with the right coaches — faster and smarter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="https://app.recruitbridge.net/signup" className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 shadow-xl">
              Join Free Today
            </a>
            <a href="#plans" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600">
              See Plans →
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Setup in minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-yellow-400 font-bold text-lg mb-4">Built for Athletes by Athletes</div>
            <div className="flex justify-center gap-6 mb-6">
              <a href="#" className="hover:text-yellow-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-blue-900 font-bold">R</span>
                </div>
                <span className="font-bold text-lg">RecruitBridge</span>
              </div>
              <p className="text-blue-200 text-sm">
                Connecting student athletes with college opportunities through AI-powered recruiting.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3">Product</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><a href="#features" className="hover:text-yellow-400">Features</a></li>
                <li><a href="#plans" className="hover:text-yellow-400">Pricing</a></li>
                <li><a href="#" className="hover:text-yellow-400">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">Support</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-yellow-400">Help Center</a></li>
                <li><a href="#" className="hover:text-yellow-400">Contact</a></li>
                <li><a href="#" className="hover:text-yellow-400">Terms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">Company</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><a href="#story" className="hover:text-yellow-400">About</a></li>
                <li><a href="#" className="hover:text-yellow-400">Privacy</a></li>
                <li><a href="#" className="hover:text-yellow-400">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-6 text-center text-blue-300 text-sm">
            © 2025 RecruitBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}