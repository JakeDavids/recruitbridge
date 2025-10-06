
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function TestEmail() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        // Redirect non-admins to OutreachCenter
        if (currentUser?.role !== 'admin') {
          window.location.href = createPageUrl("OutreachCompose");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // In case of error (e.g., not logged in), also redirect or handle appropriately
        window.location.href = createPageUrl("OutreachCompose");
        return;
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setStatus(null);
    setStatusMessage("");
    setErrorDetails(null);
    setShowErrorDetails(false);

    const response = await fetch("/functions/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        to: formData.to, 
        subject: formData.subject, 
        text: formData.message 
      })
    });
    
    let data = null;
    try { data = await response.json(); } catch (e) {
      console.error("Failed to parse response JSON", e);
    }
    const ok = response.ok && data?.ok === true;

    if (ok) {
      setStatus("success");
      setStatusMessage("Email sent successfully!");
      reset();
    } else {
      setStatus("error");
      setStatusMessage("Failed to send email");
      const errorPayload = {
        status: response.status,
        ...data
      };
      setErrorDetails(errorPayload);
      console.error("send error", JSON.stringify(errorPayload, null, 2));
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Test Email (Admin)
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="email"
                placeholder="recipient@example.com"
                {...register("to", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={errors.to ? "border-red-500" : ""}
              />
              {errors.to && (
                <p className="text-sm text-red-600">{errors.to.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                {...register("subject", {
                  required: "Subject is required",
                })}
                className={errors.subject ? "border-red-500" : ""}
              />
              {errors.subject && (
                <p className="text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={6}
                placeholder="Type your message here..."
                {...register("message", {
                  required: "Message is required",
                })}
                className={errors.message ? "border-red-500" : ""}
              />
              {errors.message && (
                <p className="text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="pt-4">
            {status && (
              <div className="w-full space-y-2">
                <div
                  className={`flex items-start gap-2 p-3 rounded-lg ${
                    status === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {status === "success" ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{statusMessage}</p>
                  </div>
                </div>

                {/* Error details collapsible */}
                {status === "error" && errorDetails && (
                  <Collapsible open={showErrorDetails} onOpenChange={setShowErrorDetails}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between text-red-600 hover:text-red-700 hover:bg-red-50">
                        Show details
                        {showErrorDetails ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(errorDetails, null, 2)}
                        </pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
