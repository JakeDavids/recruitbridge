
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"; // Keep Label for the new Billing section
import IdentitySetupFixed from "../components/identity/IdentitySetupFixed";
import {
  Settings as SettingsIcon,
  User as UserIcon,
  CreditCard,
  ArrowRight,
  Mail,
  LogOut,
  Download,
  Trash2,
  Shield,
  AlertTriangle
} from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.href = "/";
  };

  const handleDownloadData = () => {
    alert("Data export feature coming soon! You'll be able to download all your recruiting data in JSON format.");
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone and all your recruiting data will be permanently lost.");
    if (confirmed) {
      alert("Account deletion feature coming soon! Please contact support if you need to delete your account.");
    }
  };

  const handleManageBilling = () => {
    // Navigate to BillingPortal page
    window.location.href = createPageUrl("BillingPortal");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">Manage your account, plan, and profile information.</p>
          </div>
        </div>

        {/* Profile Settings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your personal and athletic information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to={createPageUrl("Profile")}>
              <Button variant="outline" className="w-full justify-between">
                Manage Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Email Identity */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Email Identity
            </CardTitle>
            <CardDescription>Manage your sending email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <IdentitySetupFixed />
          </CardContent>
        </Card>

        {/* Billing & Subscription Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>Manage your plan and payment details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-plan" className="text-base font-medium">Current Plan</Label>
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold capitalize text-slate-900">{user?.plan || 'Free'} Plan</span>
                <Link to={createPageUrl("Upgrade")}>
                  <Button variant="outline" size="sm">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <Button 
                variant="outline" 
                onClick={handleManageBilling}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Billing Management
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your data and account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={handleDownloadData}
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download My Data
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs text-slate-600">
                Your recruiting data is encrypted and secure. We follow industry best practices to protect your information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-600">
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-100"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
            <p className="text-xs text-red-600">
              Account deletion will permanently remove all your recruiting data, outreach history, and profile information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
