import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DevSetup() {
  const envExample = `# .env.example
MAILGUN_DOMAIN=mg.staging.recruitbridge.net
MAILGUN_API_KEY=YOUR_MAILGUN_API_KEY
MAILGUN_WEBHOOK_SIGNING_KEY=YOUR_MAILGUN_SIGNING_KEY
FRONTEND_URL=https://staging.recruitbridge.net
BACKEND_URL=https://api.staging.recruitbridge.net
INBOUND_EMAIL_ROUTE_URL=https://api.staging.recruitbridge.net/api/mailgun/inbound`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Developer Setup</h1>
            <p className="text-slate-600">Environment variables template and Base44 staging configuration</p>
          </div>
        </div>

        <Alert>
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            Repo-root files like .env.example and .gitignore can’t be written from this interface. Use this page to copy the template and add variables in Base44.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Staging .env example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{envExample}
            </pre>
            <p className="mt-4 text-slate-700">
              Add these variables in Base44: Dashboard → Settings → Environment Variables → Staging.
            </p>
            <ul className="list-disc ml-5 mt-2 text-slate-700 space-y-1">
              <li><Badge variant="secondary">MAILGUN_DOMAIN</Badge> = mg.staging.recruitbridge.net</li>
              <li><Badge variant="secondary">MAILGUN_API_KEY</Badge> = your Mailgun private API key for the staging domain</li>
              <li><Badge variant="secondary">MAILGUN_WEBHOOK_SIGNING_KEY</Badge> = signing key from Mailgun webhook settings</li>
              <li><Badge variant="secondary">FRONTEND_URL</Badge> = https://staging.recruitbridge.net</li>
              <li><Badge variant="secondary">BACKEND_URL</Badge> = your staging API base URL</li>
              <li><Badge variant="secondary">INBOUND_EMAIL_ROUTE_URL</Badge> = https://api.staging.recruitbridge.net/api/mailgun/inbound</li>
            </ul>
            <p className="mt-4 text-slate-700">
              After saving, redeploy Staging in Base44 so functions pick up the new values.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}