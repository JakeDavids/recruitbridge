import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadFile } from "@/api/integrations";
import { ArrowRight, Quote, Image as ImageIcon, Video, BookOpen, User } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MyRecruitingJourney() {
  const [media, setMedia] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await UploadFile({ file });
    setMedia((prev) => [{ url: file_url, type: file.type.startsWith("video") ? "video" : "image" }, ...prev]);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900">From late start to college football</h1>
            <p className="text-slate-600 mt-2">I built RecruitBridge to make the process simpler, faster, and way less confusing for the next athlete.</p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Badge variant="secondary">4.4 GPA</Badge>
              <Badge variant="secondary">All-American</Badge>
              <Badge variant="secondary">2-star recruit</Badge>
              <Badge variant="secondary">UNC Charlotte RB</Badge>
            </div>
            <div className="mt-5">
              <Link to={createPageUrl("Profile")}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  Get started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop"
            alt="Training"
            className="w-full md:w-80 h-48 object-cover rounded-xl shadow"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* My recruiting story */}
        <Card>
          <CardHeader>
            <CardTitle>My path was not linear</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>I come from a small family of immigrants. No one in my house was ever talking about four-star rankings or scholarship offers at the dinner table, much less even playing football at the next level. I grew up trying all kinds of sports — basketball, baseball, soccer — but nothing really stuck until I found football my freshman year of high school.</p>
            <p>This was during COVID, and I fell in love with the process of building my body to become stronger, faster, and smarter. I started the recruiting process somewhat late, in the middle of my junior year, and had to learn everything the hard way by myself. As a freshman I barely weighed 115 pounds. By senior year I was over 180 at about 6.5 percent body fat. That took waking up before school for years on end, training on my own, and a lot of faith.</p>
            <p>On top of football I kept a 4.4 GPA, worked a job, helped raise my younger brother and sister, and served as a three-time captain at a school of more than 4,000 students. My senior year alone I sent thousands of emails to coaches, tracked replies in messy spreadsheets, and tried to follow up at the right times. It was stressful and easy to miss things.</p>
            <p>I ended up at Charlotte almost by chance, after meeting an assistant coach at an event where I handed out handwritten letters to every coach explaining why I’d be a good fit. I got lucky — that year they were taking more walk-ons than usual — and that was all I needed.</p>
            <p>I walked away grateful, but also very aware of how much time I wasted fighting the process instead of focusing on getting better.</p>
          </CardContent>
        </Card>

        {/* Problems */}
        <Card>
          <CardHeader>
            <CardTitle>The problem I ran into</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-700">
            <ul className="list-disc ml-5 space-y-2">
              <li>Finding the right coach contacts and keeping them organized was a grind.</li>
              <li>Writing first messages that actually got replies took forever.</li>
              <li>Following up at the right time was guesswork.</li>
              <li>Tracking opens, replies, and clicks was scattered across apps.</li>
              <li>Video, measurables, and updates lived in too many places.</li>
            </ul>
            <blockquote className="mt-4 border-l-4 border-slate-300 pl-4 text-slate-600 flex items-start gap-2">
              <Quote className="w-4 h-4 mt-1 text-slate-400" />
              <span>If you’re good enough to play somewhere, your job is to make it easy for the right coach to find you and reply.</span>
            </blockquote>
          </CardContent>
        </Card>

        {/* How RB helps */}
        <Card>
          <CardHeader>
            <CardTitle>What I wish I had in high school</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 text-slate-700">
            <div>
              <h4 className="font-semibold">Smart outreach center</h4>
              <p className="text-sm">Pre-loaded coach lists by school and division, one place to send, track, and follow up.</p>
              <h4 className="font-semibold mt-4">First-message templates</h4>
              <p className="text-sm">Proven openers that sound like you, not spam.</p>
              <h4 className="font-semibold mt-4">Auto follow-ups</h4>
              <p className="text-sm">Nudges based on opens and reply timing so no lead goes cold.</p>
            </div>
            <div>
              <h4 className="font-semibold">Inbox that shows coach intent</h4>
              <p className="text-sm">Tags and summaries so I know who is warm, who needs a call, and who is a pass.</p>
              <h4 className="font-semibold mt-4">Profile that stays updated</h4>
              <p className="text-sm">Film, stats, schedule, and new PRs in one link coaches can open on their phone.</p>
              <h4 className="font-semibold mt-4">Simple analytics</h4>
              <p className="text-sm">See what time of day and which conferences respond fastest.</p>
            </div>
            <p className="md:col-span-2 text-slate-700 font-medium mt-2">All the stuff I tried to duct-tape together in spreadsheets, built the right way.</p>
          </CardContent>
        </Card>

        {/* Values */}
        <Card>
          <CardHeader>
            <CardTitle>Results and values</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6 text-slate-700">
            <div>
              <h4 className="font-semibold">Ownership</h4>
              <p className="text-sm">I am responsible for my effort and my follow-ups.</p>
            </div>
            <div>
              <h4 className="font-semibold">Clarity</h4>
              <p className="text-sm">Simple beats fancy. Coaches want the facts fast.</p>
            </div>
            <div>
              <h4 className="font-semibold">Consistency</h4>
              <p className="text-sm">Small actions every week win recruiting.</p>
            </div>
            <p className="md:col-span-3 text-slate-700">
              This is not a shortcut. It’s a cleaner path. If you put in the work, RecruitBridge makes sure your work shows up where it matters.
              Believe in yourself consistently and you can go further than you think.
            </p>
          </CardContent>
        </Card>

        {/* CTA + Social proof + Media upload */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to run a real process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Link to={createPageUrl("RecruitingCounseling")}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  1-on-1 Counseling <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="mailto:support@recruitbridge.net">
                <Button variant="outline">Email support@recruitbridge.net</Button>
              </a>
            </div>
            <div className="text-slate-600 text-sm">
              Icons of conferences you’ve contacted and quotes from teammates/coaches can go here.
            </div>
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-700">Media</span>
                  <span className="text-slate-500 text-sm">(upload photos/videos)</span>
                </div>
                <label className="cursor-pointer">
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
                  <span className="px-3 py-1.5 rounded-md border text-sm hover:bg-slate-50">Upload</span>
                </label>
              </div>
              {media.length === 0 ? (
                <p className="text-slate-500 text-sm mt-3">No media yet.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  {media.map((m, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden bg-slate-100">
                      {m.type === "video" ? (
                        <video src={m.url} controls className="w-full h-40 object-cover" />
                      ) : (
                        <img src={m.url} alt="upload" className="w-full h-40 object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <div>
              <p className="font-medium">Do I need offers to start?</p>
              <p className="text-sm">No. Start with honest film and verified measurables. Consistent outreach beats hype.</p>
            </div>
            <div>
              <p className="font-medium">How often should I follow up?</p>
              <p className="text-sm">Every 7–10 days unless a coach gives a specific timeline.</p>
            </div>
            <div>
              <p className="font-medium">What if I don’t have great film yet?</p>
              <p className="text-sm">Share what you have and include your next game schedule so coaches can plan to watch live.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}