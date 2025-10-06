import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";

export default function UpgradeRedirect({ 
  feature = "this feature",
  description = "Upgrade to unlock advanced recruiting tools and get more coach responses."
}) {
  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardContent className="pt-6 text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Unlock {feature}
        </h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          {description}
        </p>
        <Link to={createPageUrl("Upgrade")}>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-3">
            <Sparkles className="w-5 h-5 mr-2" />
            Upgrade Now
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}