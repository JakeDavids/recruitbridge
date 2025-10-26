import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Rocket, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  TrendingUp,
  Shield
} from "lucide-react";

export default function ProductionCutover() {
  const [step, setStep] = useState(1);
  const [monitoring, setMonitoring] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Pre-cutover Validation",
      description: "Run canary tests against production",
      status: "pending"
    },
    {
      id: 2,
      title: "Canary Deployment (10%)",
      description: "Enable new functions for 10% of traffic",
      status: "pending"
    },
    {
      id: 3,
      title: "Monitor & Validate",
      description: "15-minute monitoring window",
      status: "pending"
    },
    {
      id: 4,
      title: "Full Cutover",
      description: "Enable for 100% of traffic",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Production Cutover</h1>
            <p className="text-slate-600">Identity system migration with zero downtime</p>
          </div>
        </div>

        {/* Cutover Steps */}
        <div className="space-y-6">
          {steps.map((stepItem, index) => (
            <Card key={stepItem.id} className={`${step === stepItem.id ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <Badge variant={step > stepItem.id ? "default" : step === stepItem.id ? "secondary" : "outline"}>
                      Step {stepItem.id}
                    </Badge>
                    {stepItem.title}
                  </span>
                  {step > stepItem.id && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {step === stepItem.id && <Clock className="w-5 h-5 text-blue-600 animate-pulse" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{stepItem.description}</p>
                
                {step === stepItem.id && (
                  <div className="space-y-4">
                    {stepItem.id === 1 && (
                      <div>
                        <h4 className="font-semibold mb-2">Canary Tests</h4>
                        <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
{`# Run against production with canary usernames
curl -X POST "https://recruitbridge.net/functions/identity/public" \\
  -H "Content-Type: application/json" \\
  -d '{"op":"check","username":"rbcanary1"}'

curl -X POST "https://recruitbridge.net/functions/identity/public" \\
  -H "Content-Type: application/json" \\
  -d '{"op":"create","username":"rbcanary1","displayName":"Canary","userId":"canary_user_1"}'`}
                        </pre>
                        <Button className="mt-3" onClick={() => setStep(2)}>
                          Tests Passed - Continue
                        </Button>
                      </div>
                    )}
                    
                    {stepItem.id === 2 && (
                      <div>
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            Enabling for 10% of sessions. Feature flag NEXT_PUBLIC_USE_RB_FUNCS will be set to true for canary users.
                          </AlertDescription>
                        </Alert>
                        <Button className="mt-3" onClick={() => { setStep(3); setMonitoring(true); }}>
                          Enable Canary
                        </Button>
                      </div>
                    )}
                    
                    {stepItem.id === 3 && (
                      <div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4 text-center">
                              <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                              <p className="font-semibold text-green-800">Error Rate</p>
                              <p className="text-2xl font-bold text-green-600">0.1%</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4 text-center">
                              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                              <p className="font-semibold text-blue-800">P95 Latency</p>
                              <p className="text-2xl font-bold text-blue-600">245ms</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-yellow-50 border-yellow-200">
                            <CardContent className="p-4 text-center">
                              <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                              <p className="font-semibold text-yellow-800">409 Rate</p>
                              <p className="text-2xl font-bold text-yellow-600">2.1%</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button onClick={() => setStep(4)} className="bg-green-600">
                            Metrics Look Good - Full Cutover
                          </Button>
                          <Button variant="destructive" onClick={() => setStep(1)}>
                            Rollback - Issues Detected
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {stepItem.id === 4 && (
                      <div>
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Full cutover complete!</strong> All traffic is now using the new identity functions. 
                            Legacy endpoints are now deprecated.
                          </AlertDescription>
                        </Alert>
                        <Button className="mt-3" disabled>
                          Cutover Complete
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Monitoring Dashboard */}
        {monitoring && (
          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Real-time Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Request Rate</span>
                  <Badge>125 req/min</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate</span>
                  <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Latency</span>
                  <Badge className="bg-blue-100 text-blue-800">180ms</Badge>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Alert Thresholds:</strong>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Error rate &gt; 2% for 5 minutes</li>
                      <li>• P95 latency &gt; 800ms for 5 minutes</li> 
                      <li>• 409 rate spike &gt; 3x baseline for 10 minutes</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}