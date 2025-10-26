import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trophy, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl mx-auto text-center shadow-2xl">
        <CardContent className="p-8 md:p-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Welcome to RecruitBridge!
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            You're all set up. Let's start your journey to getting recruited. The next step is to build your list of target schools.
          </p>
          <Link to={createPageUrl("Schools")}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-lg px-8 py-6">
              Find Target Schools
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}