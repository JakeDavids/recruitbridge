import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users2, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RecruitingCounseling({ user }) {
  const isUnlimited = user?.plan === 'unlimited';
  const isYearlyUnlimited = isUnlimited;
  
  const hasFreeSession = isYearlyUnlimited && !user?.counselingFreeSessionUsed;
  const hasDiscountSession = isUnlimited && (
    (isYearlyUnlimited && user?.counselingFreeSessionUsed && !user?.counselingDiscountSessionUsed) ||
    (!isYearlyUnlimited && !user?.counselingDiscountSessionUsed)
  );

  const getCurrentPrice = () => {
    if (hasFreeSession) return "FREE";
    if (hasDiscountSession) return "$64.50";
    return "$79";
  };

  const getOriginalPrice = () => {
    if (hasFreeSession || hasDiscountSession) return "$129";
    return "$129";
  };

  const currentPrice = getCurrentPrice();
  const originalPrice = getOriginalPrice();

  return (
    <Card className={`border ${
      isUnlimited 
        ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50' 
        : 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Icon and Title */}
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isUnlimited ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}>
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900">1-on-1 Recruiting Counseling</h3>
                {hasFreeSession && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">FREE</Badge>
                )}
                {hasDiscountSession && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">50% OFF</Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                <Award className="w-3 h-3 inline mr-1" />
                Guaranteed D1 player • Transfer portal expert
              </p>
            </div>
          </div>

          {/* Right side - Price and CTA */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 line-through text-sm">{originalPrice}</span>
                <span className="text-2xl font-bold text-slate-900">{currentPrice}</span>
              </div>
              <p className="text-xs text-slate-500">per session</p>
            </div>
            <Link to={createPageUrl("RecruitingCounseling")}>
              <Button 
                size="sm"
                className={`${
                  isUnlimited 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                View Details
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom benefits - single line */}
        {!isUnlimited && (
          <div className="mt-3 pt-3 border-t border-slate-200 text-center">
            <p className="text-xs text-blue-700">
              💎 <Link to={createPageUrl("Upgrade")} className="underline font-medium">Upgrade to Unlimited Yearly</Link> for 1 FREE + 50% off next session (save $128)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}