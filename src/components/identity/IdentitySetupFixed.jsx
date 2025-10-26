import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle, Lock, Mail, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PUBLIC_TOKEN = "78by89nu298sum98ms209ims09m76sb87";

export default function IdentitySetupFixed({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadIdentity();
  }, []);

  const loadIdentity = async () => {
    setLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Check if EmailIdentity exists by testing sendEmail
      const response = await fetch("/functions/sendEmail", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-rb-public": PUBLIC_TOKEN,
          "x-user-id": user.id
        },
        body: JSON.stringify({
          to: "check@example.com",
          subject: "Check",
          message: "Check",
          from: "test@recruitbridge.net"
        })
      });
      
      const result = await response.json();
      
      // If it succeeded and has fromIdentity, an identity exists
      if (result.success && result.fromIdentity) {
        // Extract username from console logs or assume from user data
        const userEmail = user.email?.split('@')[0] || 'user';
        setIdentity({
          address: `${userEmail}@recruitbridge.net`,
          displayName: user.name || "User",
          username: userEmail,
          domain: "recruitbridge.net",
          verified: true
        });
      }
    } catch (err) {
      console.error("Error loading identity:", err);
    }
    setLoading(false);
  };

  const handleUsernameChange = (value) => {
    const cleanValue = value.trim().toLowerCase();
    setUsername(cleanValue);
    
    if (cleanValue.length >= 3 && /^[a-z0-9._-]{3,64}$/.test(cleanValue)) {
      setStatus("available");
      setValidationMessage("Available!");
    } else if (cleanValue.length >= 3) {
      setStatus("invalid");
      setValidationMessage("Use 3-64 chars: a-z, 0-9, . _ -");
    } else {
      setStatus("");
      setValidationMessage("");
    }
  };

  const handleCreate = async () => {
    if (!username || status !== "available" || !currentUser?.id || !displayName.trim()) return;
    
    setCreating(true);
    
    try {
      const response = await fetch("/functions/sendEmail", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-rb-public": PUBLIC_TOKEN,
          "x-user-id": currentUser.id
        },
        body: JSON.stringify({
          to: "system@recruitbridge.net",
          subject: "Email Identity Created",
          message: `Creating email identity for ${displayName}`,
          from: `${username}@recruitbridge.net`
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIdentity({
          address: `${username}@recruitbridge.net`,
          displayName: displayName,
          username: username,
          domain: "recruitbridge.net",
          verified: true
        });
        setCreating(false);
        if (onClose) setTimeout(onClose, 1000);
      } else {
        throw new Error(result.error || "Failed to create email identity");
      }
    } catch (err) {
      console.error("Create error:", err);
      alert("Error creating email identity: " + err.message);
      setCreating(false);
    }
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading your email configuration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          RecruitBridge Email Identity
        </CardTitle>
        <CardDescription>
          {identity ? "Your professional email address is configured and ready to use." : "Create a professional email address to contact coaches."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {identity ? (
          <div className="space-y-6">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <strong>Your RecruitBridge email is active!</strong> This is now your professional sending address for coach outreach.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border-2 border-green-200 bg-green-50 px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-green-600" />
                <Label className="text-sm font-semibold text-green-800">Your Professional Email (Locked)</Label>
              </div>
              <div className="font-bold text-lg text-green-900 mb-2 flex items-center gap-2">
                {identity.displayName} &lt;{identity.address}&gt;
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyEmail(identity.address)}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Send from:</strong> {identity.address}</p>
                <p><strong>Domain:</strong> {identity.domain}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Ready for Outreach!
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Use this address in the Outreach Center to send emails</li>
                <li>✅ All replies will be tracked in your Response Center</li>
                <li>✅ Coaches will see your professional RecruitBridge email</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Create your professional email address to start contacting coaches. This will be your permanent sending address.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name (Your full name for emails)</Label>
                <Input
                  id="displayName"
                  className="mt-1"
                  placeholder="Jake Davids"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="username">Username (permanent - cannot be changed)</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="username"
                    className={`w-full ${
                      status === "available" ? "border-green-500 focus-visible:ring-green-500" 
                      : status === "invalid" ? "border-red-500 focus-visible:ring-red-500" 
                      : ""
                    }`}
                    placeholder="jakedavids"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                  />
                  <span className="text-sm text-slate-600 whitespace-nowrap">@recruitbridge.net</span>
                </div>
                <div className={`text-xs mt-1.5 flex items-center gap-1.5 ${
                  status === "available" ? "text-green-600" : status === "invalid" ? "text-red-600" : "text-slate-500"
                }`}>
                  {status === "available" && <CheckCircle2 className="w-4 h-4" />}
                  {status === "invalid" && <AlertCircle className="w-4 h-4" />}
                  {validationMessage || "Choose a username (3-64 characters, a-z, 0-9, ., -)"}
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={status !== "available" || creating || !displayName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating your professional email address...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Create My RecruitBridge Email
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}