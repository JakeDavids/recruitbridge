
import React, { useState, useEffect } from "react";
import { Athlete, Outreach, School, Coach } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Target,
  Send,
  Eye,
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  Award,
  ArrowRight,
  Plus,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import StatsCard from "../components/dashboard/StatsCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";
import RecruitingCounseling from "../components/dashboard/RecruitingCounseling";

export default function Dashboard() {
  const [athlete, setAthlete] = useState(null);
  const [outreaches, setOutreaches] = useState([]);
  const [schools, setSchools] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const user = await User.me();
      setCurrentUser(user); // Set the current user in state

      // Load athlete data first
      const athleteData = await Athlete.filter({ created_by: user.email });
      const currentAthlete = athleteData[0] || null;
      setAthlete(currentAthlete);

      // Only load additional data if we have an athlete profile
      if (currentAthlete) {
        // Add delays between API calls to avoid rate limiting
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        try {
          // Load outreach data with a delay
          await delay(300);
          const outreachData = await Outreach.list('-created_date', 20);
          setOutreaches(outreachData);
        } catch (outreachError) {
          console.warn("Could not load outreach data:", outreachError);
          setOutreaches([]);
        }

        try {
          // Load school data with a delay
          await delay(300);
          const schoolData = await School.list();
          setSchools(schoolData.slice(0, 50)); // Limit to reduce load
        } catch (schoolError) {
          console.warn("Could not load school data:", schoolError);
          setSchools([]);
        }

        try {
          // Load coach data with a delay
          await delay(300);
          const coachData = await Coach.list();
          setCoaches(coachData.slice(0, 30)); // Limit to reduce load
        } catch (coachError) {
          console.warn("Could not load coach data:", coachError);
          setCoaches([]);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Unable to load dashboard data. Please refresh the page or try again later.");
    }
    setLoading(false);
  };

  const getStats = () => {
    const sentMessages = outreaches.filter(o => o.status === 'sent').length;
    const openedMessages = outreaches.filter(o => o.status === 'opened').length;
    const repliedMessages = outreaches.filter(o => o.status === 'replied').length;
    const openRate = sentMessages > 0 ? Math.round(((openedMessages + repliedMessages) / sentMessages) * 100) : 0;
    const conversionRate = (openedMessages + repliedMessages) > 0 ? Math.round((repliedMessages / (openedMessages + repliedMessages)) * 100) : 0;

    return {
      totalSent: sentMessages,
      totalOpened: openedMessages,
      totalReplied: repliedMessages,
      openRate,
      conversionRate,
      targetSchools: schools.length,
      activeConversations: repliedMessages
    };
  };

  const stats = getStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-l-4 border-l-red-500 bg-red-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">Dashboard Loading Error</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
                <Button
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    loadDashboardData();
                  }}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={containerVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back{athlete ? `, ${athlete.first_name}` : ''}! 🏆
            </h1>
            <p className="text-slate-600 mt-2">
              Track your recruiting progress and manage coach communications
            </p>
          </div>
          {!athlete && (
            <Link to={createPageUrl("Profile")}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Complete Profile
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Profile Completion Alert */}
        {!athlete && (
          <motion.div variants={containerVariants}>
            <Card className="border-l-4 border-l-amber-500 bg-amber-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900">Complete Your Profile</h3>
                    <p className="text-amber-700 text-sm mt-1">
                      Set up your athletic profile to start reaching out to coaches
                    </p>
                  </div>
                  <Link to={createPageUrl("Profile")}>
                    <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Messages Sent"
            value={stats.totalSent}
            icon={Send}
            color="blue"
            trend={stats.totalSent > 0 ? `${stats.openRate}% open rate` : null}
          />
          <StatsCard
            title="Messages Opened"
            value={stats.totalOpened}
            icon={Eye}
            color="green"
            trend={stats.totalOpened > 0 ? "Great engagement!" : null}
          />
          <StatsCard
            title="Coach Replies"
            value={stats.totalReplied}
            icon={MessageSquare}
            color="purple"
            trend={stats.totalReplied > 0 ? "Active conversations" : null}
          />
          <StatsCard
            title="Target Schools"
            value={stats.targetSchools}
            icon={Target}
            color="orange"
            trend="Keep expanding your list"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={containerVariants}>
            <QuickActions athlete={athlete} />
        </motion.div>

        {/* 1-on-1 Recruiting Counseling - Prominent placement */}
        <motion.div variants={containerVariants}>
          <RecruitingCounseling user={currentUser} />
        </motion.div>

        {/* Main Content Grid */}
        <motion.div variants={containerVariants} className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity outreaches={outreaches} coaches={coaches} schools={schools} />
          </div>

          <div className="space-y-6">
            {/* Open Rate Progress */}
            {stats.totalSent > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Open Rate</span>
                      <span className="font-semibold">{stats.openRate}%</span>
                    </div>
                    <Progress value={stats.openRate} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1">Percentage of sent messages that were opened or replied to.</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Engagement Rate</span>
                      <span className="font-semibold">
                        {stats.conversionRate}%
                      </span>
                    </div>
                    <Progress
                      value={stats.conversionRate}
                      className="h-2"
                    />
                    <p className="text-xs text-slate-500 mt-1">Percentage of opened/replied messages that received a reply.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Next Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {outreaches
                    .filter(o => o.next_follow_up)
                    .slice(0, 3)
                    .map((outreach, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div>
                          <p className="font-medium text-sm">Follow up with coach</p>
                          <p className="text-xs text-slate-500">
                            Due: {new Date(outreach.next_follow_up).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {outreach.priority}
                        </Badge>
                      </div>
                    ))}
                  {outreaches.filter(o => o.next_follow_up).length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">
                      No follow-ups scheduled
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
