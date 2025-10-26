import React, { useState, useEffect } from "react";
import { useRecruitBridgeIdentity } from "../hooks/useRecruitBridgeIdentity";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle, Lock, Mail, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function IdentitySetup({ onClose }) {
  const { loading, error, identity, getMe, checkUsername, createIdentity } = useRecruitBridgeIdentity();
  
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState(""); 
  const [validationMessage, setValidationMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user and existing identity on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        await getMe();
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };
    loadData();
  }, [getMe]);

  const handleUsernameChange = async (value) => {
    const cleanValue = value.trim().toLowerCase();
    setUsername(cleanValue);
    setStatus("");
    setValidationMessage("");

    if (cleanValue.length < 3) {
      return;
    }
    
    setChecking(true);
    
    try {
      const result = await checkUsername(cleanValue);
      if (result.ok) {
        setStatus(result.available ? "available" : "taken");
        setValidationMessage(result.available ? "Available!" : "Sorry, that username is taken.");
      } else {
        setStatus("error");
        setValidationMessage(result.error || "Failed to check availability");
      }
    } catch (err) {
      console.error("Username check error:", err);
      setStatus("error");
      setValidationMessage("Error checking availability");
    }
    
    setChecking(false);
  };

  const handleCreate = async () => {
    if (!username || status !== "available" || !currentUser?.id) return;
    
    setCreating(true);
    
    try {
      const result = await createIdentity(username, displayName || username);
      
      if (result.ok) {
        // Success - close modal after delay
        setTimeout(() => {
          setCreating(false);
          if (onClose) onClose();
        }, 1000);
      } else {
        throw new Error(result.error || "Failed to create email identity");
      }
      
    } catch (err) {
      console.error("Create identity error:", err);
      setStatus("error");
      setValidationMessage(err.message || "Failed to create email identity");
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
                {identity.displayName || identity.username} &lt;{identity.address}&gt;
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
                <li>✅ Your username is locked for security (cannot be changed)</li>
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
                      status === "available"
                        ? "border-green-500 focus-visible:ring-green-500" 
                        : status === "taken" || status === "invalid" || status === "error"
                        ? "border-red-500 focus-visible:ring-red-500" 
                        : ""
                    }`}
                    placeholder="jakedavids"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                  />
                  <span className="text-sm text-slate-600 whitespace-nowrap">@recruitbridge.net</span>
                </div>
                <div className={`text-xs mt-1.5 flex items-center gap-1.5 ${
                  status === "available"
                    ? "text-green-600" 
                    : status === "taken" || status === "invalid" || status === "error"
                    ? "text-red-600" 
                    : "text-slate-500"
                }`}>
                  {checking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === "available" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : status === "taken" || status === "invalid" || status === "error" ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : null}
                  {checking ? "Checking availability…" : validationMessage || "Choose a username (3-64 characters, a-z, 0-9, ., -)"}
                </div>
              </div>

              <div className="rounded-lg border px-4 py-3 bg-slate-50">
                <Label className="text-xs text-slate-500">Email Preview</Label>
                <div className="font-medium text-slate-900">
                  {displayName || "Your Name"} &lt;{username || "username"}@recruitbridge.net&gt;
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Coaches will see this professional address. Replies will be tracked automatically.
                </p>
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

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Important:</strong> Once created, your username cannot be changed. Choose carefully!
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}