import React, { useState, useEffect } from "react";
import { FeatureFlag } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ErrorBoundary from "../components/ErrorBoundary";

function SafeEnvDebug() {
  const envFlag = (typeof process !== "undefined" && process?.env)
    ? process.env.NEXT_PUBLIC_USE_RB_FUNCS
    : undefined;
  return (
    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16 }}>
      <div>Env NEXT_PUBLIC_USE_RB_FUNCS: {String(envFlag)}</div>
      <div>Time: {new Date().toISOString()}</div>
    </div>
  );
}

function AdminContent() {
  const [user, setUser] = useState(null);
  const [featureFlags, setFeatureFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.role !== 'admin') {
        return;
      }

      const flags = await FeatureFlag.list();
      
      // Ensure the identity flag exists
      const identityFlag = flags.find(f => f.flag_name === 'NEXT_PUBLIC_USE_RB_FUNCS');
      if (!identityFlag) {
        await FeatureFlag.create({
          flag_name: 'NEXT_PUBLIC_USE_RB_FUNCS',
          enabled: false,
          description: 'Use new /functions/identity/public instead of legacy /api/identity/*',
          last_modified_by: currentUser.email
        });
        // Reload flags
        const updatedFlags = await FeatureFlag.list();
        setFeatureFlags(updatedFlags);
      } else {
        setFeatureFlags(flags);
      }
      
    } catch (error) {
      console.error("Error loading admin data:", error);
      // Don't throw - just set loading to false so we show something
    }
    setLoading(false);
  };

  const toggleFlag = async (flagId, currentValue) => {
    setSaving(true);
    try {
      await FeatureFlag.update(flagId, {
        enabled: !currentValue,
        last_modified_by: user.email
      });
      await loadData();
    } catch (error) {
      console.error("Error updating flag:", error);
      alert("Failed to update feature flag");
    }
    setSaving(false);
  };

  const getEnvironmentValue = () => {
    // Try to read from environment, fallback to database
    const envFlag = (typeof process !== "undefined" && process?.env) 
      ? process.env.NEXT_PUBLIC_USE_RB_FUNCS 
      : undefined;
    
    if (envFlag !== undefined) {
      return envFlag === 'true';
    }
    
    const identityFlag = featureFlags.find(f => f.flag_name === 'NEXT_PUBLIC_USE_RB_FUNCS');
    return identityFlag?.enabled || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Admin access required. Please contact support if you need administrative privileges.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const identityFlag = featureFlags.find(f => f.flag_name === 'NEXT_PUBLIC_USE_RB_FUNCS');
  const currentValue = getEnvironmentValue();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-slate-600">Feature flag management and system controls</p>
          </div>
        </div>

        <SafeEnvDebug />

        {/* Identity Feature Flag */}
        <Card className="border-2 border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Identity System Toggle</span>
              <Badge variant={currentValue ? "default" : "secondary"}>
                {currentValue ? "NEW FUNCTIONS" : "LEGACY API"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">NEXT_PUBLIC_USE_RB_FUNCS</h3>
                  <p className="text-sm text-slate-600">
                    Current value: <code className="bg-slate-100 px-1 rounded">{currentValue.toString()}</code>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={identityFlag?.enabled || false}
                    onCheckedChange={() => toggleFlag(identityFlag?.id, identityFlag?.enabled)}
                    disabled={saving}
                  />
                  {saving && <Clock className="w-4 h-4 animate-spin" />}
                </div>
              </div>
              
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Toggle OFF</Badge>
                  <span>Uses legacy /api/identity/* endpoints</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Toggle ON</Badge>
                  <span>Uses new /functions/identity/public endpoint</span>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>One-click rollback:</strong> Toggle this flag to instantly switch between identity systems. 
                Environment variables take precedence over database settings.
              </AlertDescription>
            </Alert>

            {identityFlag?.last_modified_by && (
              <p className="text-xs text-slate-500">
                Last modified by: {identityFlag.last_modified_by}
              </p>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-800">Identity Functions</p>
                <p className="text-sm text-green-600">Operational</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Settings className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-blue-800">Feature Flags</p>
                <p className="text-sm text-blue-600">{featureFlags.length} configured</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <AlertTriangle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-purple-800">Monitoring</p>
                <p className="text-sm text-purple-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh' }}>
        <div style={{ padding: 20, textAlign: 'center', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <h1 style={{ margin: 0, color: '#1e293b' }}>Admin Panel Loading...</h1>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
            If this persists, check the console for errors.
          </p>
        </div>
        <AdminContent />
      </div>
    </ErrorBoundary>
  );
}