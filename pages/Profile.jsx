
import React, { useState, useEffect, useRef } from "react";
import { Athlete } from "@/api/entities";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User as UserIcon, Trophy, GraduationCap, Target, Save, Upload, Link as LinkIcon, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Progress } from "@/components/ui/progress";

const sports = [
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "baseball", label: "Baseball" }
];

const divisions = [
  { value: "JUCO", label: "JUCO" },
  { value: "D3", label: "Division III" },
  { value: "D2", label: "Division II" },
  { value: "FCS", label: "FCS" },
  { value: "FBS", label: "FBS" }
];

const regions = [
  "Northeast", "Southeast", "Midwest", "Southwest", "West", "Northwest", "South"
];

export default function Profile() {
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    height: "",
    weight: "",
    position: "",
    sport: "football", // Updated to default to football
    graduation_year: new Date().getFullYear() + 1,
    gpa: "",
    sat_score: "",
    act_score: "",
    forty_time: "",
    bench_press: "",
    squat: "",
    vertical_jump: "", // New field
    broad_jump: "",    // New field
    pro_agility: "",   // New field
    stats: {},
    highlights_url: "",
    highlights_url_2: "", // New field for secondary highlight video
    highlights_url_3: "", // New field for tertiary highlight video
    transcript_url: "",
    bio: "",
    preferred_regions: [],
    target_levels: [],
    academic_achievements: "",
    athletic_achievements: "",
    community_service: "",
    coach_references: ""
  });
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingAthlete, setExistingAthlete] = useState(null);

  const profileFields = [
    'first_name', 'last_name', 'email', 'phone', 'date_of_birth',
    'height', 'weight', 'position', 'graduation_year', 'gpa',
    'sat_score', 'act_score', 'forty_time', 'bench_press', 'squat',
    'vertical_jump', 'broad_jump', 'pro_agility',
    'highlights_url', 'highlights_url_2', 'highlights_url_3', // Added new highlight URLs for completion calculation
    'bio', 'coach_references',
    'preferred_regions', 'target_levels',
    'academic_achievements', 'athletic_achievements', 'community_service',
    // profile_picture_url is on the User object, not Athlete, so not included here
  ];

  const calculateProfileCompletion = () => {
    if (!athlete) return 0;
    let filledCount = 0;
    const totalFields = profileFields.length;

    profileFields.forEach(field => {
      const value = athlete[field];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filledCount++;
        }
      } else if (value !== null && value !== undefined && value !== '') {
        filledCount++;
      }
    });

    if (totalFields === 0) return 0; // Avoid division by zero
    return Math.round((filledCount / totalFields) * 100);
  };
  
  const profileCompletion = calculateProfileCompletion();

  useEffect(() => {
    loadAthlete();
  }, []);

  const loadAthlete = async () => {
    try {
      const currentUser = await User.me();

      // 👉 TEMP: print your user ID to the browser console.
      // REMOVE this line after you've copied the ID.
      console.log("Your User ID:", currentUser.id);

      setUser(currentUser);

      const athletes = await Athlete.filter({ created_by: currentUser.email });
      if (athletes.length > 0) {
        setAthlete(athletes[0]);
        setExistingAthlete(athletes[0]);
      } else {
        // If no existing athlete profile, initialize email with current user's email
        setAthlete(prev => ({
          ...prev,
          email: currentUser.email
        }));
      }
    } catch (error) {
      console.error("Error loading athlete:", error);
    }
    setLoading(false);
  };

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
        const { file_url } = await UploadFile({ file });
        await User.updateMyUserData({ profile_picture_url: file_url });
        const updatedUser = await User.me();
        setUser(updatedUser);
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload picture. Please try again.");
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Ensure sport is set to football, as per new design
      const payload = { ...athlete, sport: "football" };

      // List of fields that are numbers and might be empty
      const numericFields = [
        'weight', 'graduation_year', 'gpa', 'sat_score', 
        'act_score', 'forty_time', 'bench_press', 'squat',
        'vertical_jump', 'pro_agility'
      ];

      // Convert empty strings in numeric fields to null to prevent validation errors
      numericFields.forEach(field => {
        if (payload[field] === '') {
          payload[field] = null;
        }
      });

      if (existingAthlete) {
        await Athlete.update(existingAthlete.id, payload);
        // Auto-redirect to Dashboard for existing users
        navigate(createPageUrl("Dashboard"));
      } else {
        await Athlete.create(payload);
        // Auto-redirect to the Welcome page for first-time users
        navigate(createPageUrl("Welcome"));
      }
    } catch (error) {
      console.error("Error saving athlete:", error);
      alert("There was an error saving your profile. Please try again.");
    }
    setSaving(false);
  };

  const handleRegionChange = (region, checked) => {
    if (checked) {
      setAthlete(prev => ({
        ...prev,
        preferred_regions: [...prev.preferred_regions, region]
      }));
    } else {
      setAthlete(prev => ({
        ...prev,
        preferred_regions: prev.preferred_regions.filter(r => r !== region)
      }));
    }
  };

  const handleLevelChange = (level, checked) => {
    if (checked) {
      setAthlete(prev => ({
        ...prev,
        target_levels: [...prev.target_levels, level]
      }));
    } else {
      setAthlete(prev => ({
        ...prev,
        target_levels: prev.target_levels.filter(l => l !== level)
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8 pb-24">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Athlete Profile</h1>
            <p className="text-slate-600">Complete your profile to start connecting with coaches</p>
          </div>
        </div>

        <Card>
            <CardContent className="pt-6">
                <Label className="text-base font-medium">Profile Completion</Label>
                <div className="flex items-center gap-4 mt-2">
                    <Progress value={profileCompletion} className="h-2 flex-1 [&>div]:bg-green-600" />
                    <span className="font-semibold text-blue-600">{profileCompletion}%</span>
                </div>
                 <p className="text-xs text-slate-500 mt-2">A complete profile is 80% more likely to get a coach's attention. Keep it updated!</p>
            </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Profile Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  {user?.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-16 h-16 text-slate-400" />
                  )}
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePictureUpload} style={{ display: 'none' }} accept="image/*" />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={athlete.first_name}
                    onChange={(e) => setAthlete({...athlete, first_name: e.target.value})}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={athlete.last_name}
                    onChange={(e) => setAthlete({...athlete, last_name: e.target.value})}
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={athlete.email}
                  onChange={(e) => setAthlete({...athlete, email: e.target.value})}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={athlete.phone}
                    onChange={(e) => setAthlete({...athlete, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={athlete.date_of_birth}
                    onChange={(e) => setAthlete({...athlete, date_of_birth: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Personal Bio</Label>
                <Textarea
                  id="bio"
                  value={athlete.bio}
                  onChange={(e) => setAthlete({...athlete, bio: e.target.value})}
                  placeholder="Tell coaches about yourself, your goals, and what makes you unique..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information - Enhanced */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="graduation_year">Graduation Year</Label>
                  <Input
                    id="graduation_year"
                    type="number"
                    value={athlete.graduation_year}
                    onChange={(e) => setAthlete({...athlete, graduation_year: parseInt(e.target.value)})}
                    placeholder="2025"
                  />
                </div>
                <div>
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    value={athlete.gpa}
                    onChange={(e) => setAthlete({...athlete, gpa: parseFloat(e.target.value)})}
                    placeholder="3.75"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sat_score">SAT Score</Label>
                  <Input
                    id="sat_score"
                    type="number"
                    value={athlete.sat_score}
                    onChange={(e) => setAthlete({...athlete, sat_score: parseInt(e.target.value)})}
                    placeholder="1200"
                  />
                </div>
                <div>
                  <Label htmlFor="act_score">ACT Score</Label>
                  <Input
                    id="act_score"
                    type="number"
                    value={athlete.act_score}
                    onChange={(e) => setAthlete({...athlete, act_score: parseInt(e.target.value)})}
                    placeholder="26"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="academic_achievements">Academic Achievements & Awards</Label>
                <Textarea
                  id="academic_achievements"
                  value={athlete.academic_achievements}
                  onChange={(e) => setAthlete({...athlete, academic_achievements: e.target.value})}
                  placeholder="e.g., Valedictorian, National Honor Society, 4.0 GPA, Dean's List..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Athletic Information - Enhanced */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Athletic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sport</Label>
                  <Input
                    value="Football"
                    disabled
                    className="bg-slate-100"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={athlete.position}
                    onChange={(e) => setAthlete({...athlete, position: e.target.value})}
                    placeholder="e.g., Quarterback, Point Guard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={athlete.height}
                    onChange={(e) => setAthlete({...athlete, height: e.target.value})}
                    placeholder="e.g., 6'2"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={athlete.weight}
                    onChange={(e) => setAthlete({...athlete, weight: parseInt(e.target.value)})}
                    placeholder="185"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="forty_time">40-Yard Dash (s)</Label>
                  <Input
                    id="forty_time"
                    type="number"
                    step="0.01"
                    value={athlete.forty_time}
                    onChange={(e) => setAthlete({...athlete, forty_time: parseFloat(e.target.value)})}
                    placeholder="4.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bench_press">Bench Press (lbs)</Label>
                  <Input
                    id="bench_press"
                    type="number"
                    value={athlete.bench_press}
                    onChange={(e) => setAthlete({...athlete, bench_press: parseInt(e.target.value)})}
                    placeholder="225"
                  />
                </div>
                <div>
                  <Label htmlFor="squat">Squat (lbs)</Label>
                  <Input
                    id="squat"
                    type="number"
                    value={athlete.squat}
                    onChange={(e) => setAthlete({...athlete, squat: parseInt(e.target.value)})}
                    placeholder="315"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vertical_jump">Vertical Jump (in)</Label>
                  <Input
                    id="vertical_jump"
                    type="number"
                    step="0.1"
                    value={athlete.vertical_jump}
                    onChange={(e) => setAthlete({...athlete, vertical_jump: parseFloat(e.target.value)})}
                    placeholder="36"
                  />
                </div>
                <div>
                  <Label htmlFor="broad_jump">Broad Jump</Label>
                  <Input
                    id="broad_jump"
                    value={athlete.broad_jump}
                    onChange={(e) => setAthlete({...athlete, broad_jump: e.target.value})}
                    placeholder="e.g., 9' 5&quot;"
                  />
                </div>
                <div>
                  <Label htmlFor="pro_agility">Pro Agility (s)</Label>
                  <Input
                    id="pro_agility"
                    type="number"
                    step="0.01"
                    value={athlete.pro_agility}
                    onChange={(e) => setAthlete({...athlete, pro_agility: parseFloat(e.target.value)})}
                    placeholder="4.2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="athletic_achievements">Athletic Achievements & Awards</Label>
                <Textarea
                  id="athletic_achievements"
                  value={athlete.athletic_achievements}
                  onChange={(e) => setAthlete({...athlete, athletic_achievements: e.target.value})}
                  placeholder="e.g., Team Captain, All-Conference Selection, State Qualifier, MVP Award..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Community Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Community Service & Leadership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="community_service">Community Service Activities</Label>
                <Textarea
                  id="community_service"
                  value={athlete.community_service}
                  onChange={(e) => setAthlete({...athlete, community_service: e.target.value})}
                  placeholder="e.g., 100+ volunteer hours, Mission trip participant, Leadership roles in clubs..."
                  rows={4}
                />
                <p className="text-xs text-slate-500 mt-1">Include volunteer work, fundraising, and leadership roles</p>
              </div>
            </CardContent>
          </Card>

          {/* Coach References */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Coach References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="coach_references">High School Coach Information</Label>
                <Textarea
                  id="coach_references"
                  value={athlete.coach_references}
                  onChange={(e) => setAthlete({...athlete, coach_references: e.target.value})}
                  placeholder="Coach Name - coach.email@school.com - (555) 555-5555"
                  rows={4}
                />
                <p className="text-xs text-slate-500 mt-1">Include coach names, emails, and phone numbers</p>
              </div>
            </CardContent>
          </Card>

          {/* Recruiting Preferences */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recruiting Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Target Division Levels</Label>
                <div className="grid grid-cols-2 gap-3">
                  {divisions.map(division => (
                    <div key={division.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={division.value}
                        checked={athlete.target_levels.includes(division.value)}
                        onCheckedChange={(checked) => handleLevelChange(division.value, checked)}
                      />
                      <Label htmlFor={division.value} className="text-sm">
                        {division.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Preferred Regions</Label>
                <div className="grid grid-cols-2 gap-3">
                  {regions.map(region => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={region}
                        checked={athlete.preferred_regions.includes(region)}
                        onCheckedChange={(checked) => handleRegionChange(region, checked)}
                      />
                      <Label htmlFor={region} className="text-sm">
                        {region}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Center - Integrated into Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Media & Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="highlights_url">Primary Highlight Video URL</Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <Input
                  id="highlights_url"
                  value={athlete.highlights_url}
                  onChange={(e) => setAthlete({...athlete, highlights_url: e.target.value})}
                  placeholder="https://youtube.com/watch?v=... or HUDL link"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Your best plays - will be automatically included in outreach emails</p>
            </div>

            <div>
              <Label htmlFor="highlights_url_2">Secondary Highlight Video URL (Optional)</Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <Input
                  id="highlights_url_2"
                  value={athlete.highlights_url_2}
                  onChange={(e) => setAthlete({...athlete, highlights_url_2: e.target.value})}
                  placeholder="Additional highlight reel link"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="highlights_url_3">Tertiary Highlight Video URL (Optional)</Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <Input
                  id="highlights_url_3"
                  value={athlete.highlights_url_3}
                  onChange={(e) => setAthlete({...athlete, highlights_url_3: e.target.value})}
                  placeholder="Additional highlight reel link"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="transcript_url">Academic Transcript URL</Label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <Input
                  id="transcript_url"
                  value={athlete.transcript_url}
                  onChange={(e) => setAthlete({...athlete, transcript_url: e.target.value})}
                  placeholder="Google Drive link to your transcript"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Upload your official academic records</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> Your primary highlight video will be automatically included in all outreach emails to coaches!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
        {/* Floating Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200 flex justify-center z-10">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg px-12"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
    </div>
  );
}
