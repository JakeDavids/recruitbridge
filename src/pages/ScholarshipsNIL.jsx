import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Landmark, DollarSign, Users } from "lucide-react";

export default function ScholarshipsNIL() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Scholarships and NIL Collectives</h1>
            <p className="text-slate-600">Clear facts on athletic aid, walk-ons, and how NIL works.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scholarship Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <ul className="list-disc ml-5 space-y-2">
              <li><strong>Headcount sports</strong>: scholarships are full rides (can’t be split). FBS football is headcount.</li>
              <li><strong>Equivalency sports</strong>: programs receive a pool of scholarship “equivalents” that can be split among players. FCS, D2, NAIA football use equivalency.</li>
              <li><strong>Stacking</strong>: academic/need-based aid can often be combined with athletic aid (school rules vary).</li>
              <li><strong>Walk-ons (including PWO)</strong>: every level takes walk-ons; “preferred” walk-ons have roster spots but no scholarship.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Landmark className="w-5 h-5" /> Football by Level</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 text-slate-700">
            <div className="space-y-2">
              <p><strong>NCAA D1 FBS</strong> (Headcount)</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Up to 85 full scholarships.</li>
                <li>Walk-ons and PWOs are common; roster sizes vary by school.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p><strong>NCAA D1 FCS</strong> (Equivalency)</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Up to 63 scholarship equivalents; can be split.</li>
                <li>Max 85 counters on aid; walk-ons routinely added.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p><strong>NCAA D2</strong> (Equivalency)</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Up to 36 scholarship equivalents; commonly combined with academic aid.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p><strong>NCAA D3</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>No athletic scholarships; academic/need-based only.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p><strong>NAIA</strong> (Equivalency)</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Up to 24 scholarship equivalents in football; splitting is allowed.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p><strong>JUCO/NJCAA</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Athletic aid is allowed; aid amounts and limits vary by division and school.</li>
                <li>Many programs provide significant packages (tuition/fees, room/board); confirm details with each program.</li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <Badge variant="secondary">Note</Badge>
              <p className="mt-2">Scholarship limits are set by the governing body (NCAA/NAIA/NJCAA), not by conference. Roster management, walk-on numbers, and aid stacking can vary by school. Always verify with a coach or compliance office.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> NIL Collectives: What to Know</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <ul className="list-disc ml-5 space-y-2">
              <li><strong>What they are:</strong> Groups that fund athlete NIL deals (appearances, social posts, camps, content, etc.).</li>
              <li><strong>Budgets vary widely:</strong> 
                <ul className="list-disc ml-5">
                  <li>Power Five (FBS): often multi-million dollar ranges.</li>
                  <li>Group of Five (FBS): typically high six to low seven figures.</li>
                  <li>FCS/D2: generally lower; varies by alumni/support.</li>
                </ul>
              </li>
              <li><strong>Rules matter:</strong> It’s not “pay-for-play” or guaranteed for recruiting. Deals must be for real NIL activity and comply with school/state policies.</li>
              <li><strong>Walk-ons/PWOs at big FBS schools:</strong> Many programs still add them; exact numbers depend on roster needs and resources.</li>
            </ul>
            <p className="text-sm text-slate-500">This is informational only. Policies evolve—always confirm with your school’s compliance office.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-700">
            <ul className="list-disc ml-5 space-y-2">
              <li>Keep grades high—academic aid stacks and expands options.</li>
              <li>Ask about PWOs and roster spots; fit and depth chart matter.</li>
              <li>Clarify total cost of attendance (tuition, housing, meals, fees).</li>
              <li>Verify scholarship/NIL details with a coach or compliance office.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}