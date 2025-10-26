
import React, { useState, useEffect, useMemo } from "react";
import { School, Athlete, TargetedSchool, User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Target, Search, Star, CheckCircle, MapPin, Trash2, Bot, Sparkles, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Central utility function for formatted school names
const getFormattedSchoolName = (schoolName) => {
  const schoolNameMappings = {
    // SEC Schools
    "University of Alabama": "Alabama Crimson Tide (University of Alabama)",
    "University of Arkansas": "Arkansas Razorbacks (University of Arkansas)",
    "Auburn University": "Auburn Tigers (Auburn University)",
    "University of Florida": "Florida Gators (University of Florida)",
    "University of Georgia": "Georgia Bulldogs (University of Georgia)",
    "University of Kentucky": "Kentucky Wildcats (University of Kentucky)",
    "Louisiana State University": "LSU Tigers (Louisiana State University)",
    "Mississippi State University": "Mississippi State Bulldogs (Mississippi State University)",
    "University of Missouri": "Missouri Tigers (University of Missouri)",
    "University of Oklahoma": "Oklahoma Sooners (University of Oklahoma)",
    "University of Mississippi": "Ole Miss Rebels (University of Mississippi)",
    "University of South Carolina": "South Carolina Gamecocks (University of South Carolina)", // Fixed typo
    "University of Tennessee": "Tennessee Volunteers (University of Tennessee)",
    "University of Texas at Austin": "Texas Longhorns (University of Texas at Austin)",
    "Texas A&M University": "Texas A&M Aggies (Texas A&M University)",
    "Vanderbilt University": "Vanderbilt Commodores (Vanderbilt University)",

    // ACC Schools
    "Boston College": "Boston College Eagles (Boston College)",
    "University of California, Berkeley": "California Golden Bears (University of California, Berkeley)",
    "Clemson University": "Clemson Tigers (Clemson University)",
    "Duke University": "Duke Blue Devils (Duke University)",
    "Florida State University": "Florida State Seminoles (Florida State University)",
    "Georgia Institute of Technology": "Georgia Tech Yellow Jackets (Georgia Institute of Technology)",
    "University of Louisville": "Louisville Cardinals (University of Louisville)",
    "University of Miami": "Miami Hurricanes (University of Miami)",
    "University of North Carolina at Chapel Hill": "North Carolina Tar Heels (University of North Carolina at Chapel Hill)",
    "North Carolina State University": "NC State Wolfpack (North Carolina State University)",
    "University of Pittsburgh": "Pittsburgh Panthers (University of Pittsburgh)",
    "Southern Methodist University": "SMU Mustangs (Southern Methodist University)",
    "Stanford University": "Stanford Cardinal (Stanford University)",
    "Syracuse University": "Syracuse Orange (Syracuse University)",
    "University of Virginia": "Virginia Cavaliers (University of Virginia)",
    "Virginia Tech": "Virginia Tech Hokies (Virginia Tech)",
    "Wake Forest University": "Wake Forest Demon Deacons (Wake Forest University)",

    // Other existing FBS Schools
    "University of North Carolina at Charlotte": "Charlotte 49ers (University of North Carolina at Charlotte)",
    
    // FCS Schools - Ivy League
    "Brown University": "Brown Bears (Brown University)",
    "Columbia University": "Columbia Lions (Columbia University)",
    "Cornell University": "Cornell Big Red (Cornell University)",
    "Dartmouth College": "Dartmouth Big Green (Dartmouth College)",
    "Harvard University": "Harvard Crimson (Harvard University)",
    "University of Pennsylvania": "Penn Quakers (University of Pennsylvania)",
    "Princeton University": "Princeton Tigers (Princeton University)",
    "Yale University": "Yale Bulldogs (Yale University)",
    
    // Patriot League
    "Bucknell University": "Bucknell Bison (Bucknell University)",
    "Colgate University": "Colgate Raiders (Colgate University)",
    "Fordham University": "Fordham Rams (Fordham University)",
    "College of the Holy Cross": "Holy Cross Crusaders (College of the Holy Cross)",
    "Lafayette College": "Lafayette Leopards (Lafayette College)",
    "Lehigh University": "Lehigh Mountain Hawks (Lehigh University)",
    "Georgetown University": "Georgetown Hoyas (Georgetown University)",
    
    // CAA Football
    "University at Albany": "Albany Great Danes (University at Albany)",
    "Bryant University": "Bryant Bulldogs (Bryant University)",
    "Campbell University": "Campbell Fighting Camels (Campbell University)",
    "University of Delaware": "Delaware Blue Hens (University of Delaware)",
    "Delaware State University": "Delaware State Hornets (Delaware State University)",
    "Elon University": "Elon Phoenix (Elon University)",
    "Hampton University": "Hampton Pirates (Hampton University)",
    "University of Maine": "Maine Black Bears (University of Maine)",
    "Monmouth University": "Monmouth Hawks (Monmouth University)",
    "University of New Hampshire": "New Hampshire Wildcats (University of New Hampshire)",
    "North Carolina A&T State University": "North Carolina A&T Aggies (North Carolina A&T State University)",
    "University of Rhode Island": "Rhode Island Rams (University of Rhode Island)",
    "University of Richmond": "Richmond Spiders (University of Richmond)",
    "Stony Brook University": "Stony Brook Seawolves (Stony Brook University)",
    "Towson University": "Towson Tigers (Towson University)",
    "Villanova University": "Villanova Wildcats (Villanova University)",
    "William & Mary": "William & Mary Tribe (William & Mary)",
    
    // NEC
    "Central Connecticut State University": "Central Connecticut Blue Devils (Central Connecticut State University)",
    "Duquesne University": "Duquesne Dukes (Duquesne University)",
    "Long Island University": "LIU Sharks (Long Island University)",
    "Merrimack College": "Merrimack Warriors (Merrimack College)",
    "Robert Morris University": "Robert Morris Colonials (Robert Morris University)",
    "Sacred Heart University": "Sacred Heart Pioneers (Sacred Heart University)",
    "Stonehill College": "Stonehill Skyhawks (Stonehill College)",
    "Wagner College": "Wagner Seahawks (Wagner College)",
    
    // Pioneer Football League
    "Butler University": "Butler Bulldogs (Butler University)",
    "Davidson College": "Davidson Wildcats (Davidson College)",
    "University of Dayton": "Dayton Flyers (University of Dayton)",
    "Drake University": "Drake Bulldogs (Drake University)",
    "Marist College": "Marist Red Foxes (Marist College)",
    "Morehead State University": "Morehead State Eagles (Morehead State University)",
    "Presbyterian College": "Presbyterian Blue Hose (Presbyterian College)",
    "University of San Diego": "San Diego Toreros (University of San Diego)",
    "University of St. Thomas": "St. Thomas Tommies (University of St. Thomas)",
    "Stetson University": "Stetson Hatters (Stetson University)",
    "Valparaiso University": "Valparaiso Beacons (Valparaiso University)",
    
    // MVFC
    "Illinois State University": "Illinois State Redbirds (Illinois State University)",
    "Indiana State University": "Indiana State Sycamores (Indiana State University)",
    "Missouri State University": "Missouri State Bears (Missouri State University)",
    "Murray State University": "Murray State Racers (Murray State University)",
    "University of North Dakota": "North Dakota Fighting Hawks (University of North Dakota)",
    "University of Northern Iowa": "Northern Iowa Panthers (University of Northern Iowa)",
    "Southern Illinois University": "Southern Illinois Salukis (Southern Illinois University)",
    "Western Illinois University": "Western Illinois Leathernecks (Western Illinois University)",
    "Youngstown State University": "Youngstown State Penguins (Youngstown State University)",
    
    // Big Sky
    "Cal Poly": "Cal Poly Mustangs (Cal Poly)",
    "Idaho State University": "Idaho State Bengals (Idaho State University)",
    "University of Idaho": "Idaho Vandals (University of Idaho)",
    "Northern Arizona University": "Northern Arizona Lumberjacks (Northern Arizona University)",
    "University of Northern Colorado": "Northern Colorado Bears (University of Northern Colorado)",
    "Portland State University": "Portland State Vikings (Portland State University)",
    "Sacramento State University": "Sacramento State Hornets (Sacramento State University)",
    "University of California, Davis": "UC Davis Aggies (University of California, Davis)",
    
    // MEAC
    "Howard University": "Howard Bison (Howard University)",
    "Morgan State University": "Morgan State Bears (Morgan State University)",
    "Norfolk State University": "Norfolk State Spartans (Norfolk State University)",
    "North Carolina Central University": "North Carolina Central Eagles (North Carolina Central University)",
    "South Carolina State University": "South Carolina State Bulldogs (South Carolina State University)",
    
    // Southland
    "Houston Christian University": "Houston Christian Huskies (Houston Christian University)",
    "Lamar University": "Lamar Cardinals (Lamar University)",
    "Nicholls State University": "Nicholls Colonels (Nicholls State University)",
    "Northwestern State University": "Northwestern State Demons (Northwestern State University)",
    "Southeastern Louisiana University": "Southeastern Louisiana Lions (Southeastern Louisiana University)",
    "Texas A&M University-Commerce": "Texas A&M-Commerce Lions (Texas A&M University-Commerce)",
    "University of the Incarnate Word": "Incarnate Word Cardinals (University of the Incarnate Word)",
    
    // OVC
    "Eastern Illinois University": "Eastern Illinois Panthers (Eastern Illinois University)",
    "University of Southern Indiana": "Southern Indiana Screaming Eagles (University of Southern Indiana)",
    "Tennessee State University": "Tennessee State Tigers (Tennessee State University)",
    "Tennessee Tech University": "Tennessee Tech Golden Eagles (Tennessee Tech University)",
    "University of Tennessee at Martin": "UT Martin Skyhawks (University of Tennessee at Martin)",
    
    // Big South-OVC
    "Charleston Southern University": "Charleston Southern Buccaneers (Charleston Southern University)",
    "Gardner-Webb University": "Gardner-Webb Runnin' Bulldogs (Gardner-Webb University)",
    
    // SWAC
    "Alabama A&M University": "Alabama A&M Bulldogs (Alabama A&M University)",
    "Alabama State University": "Alabama State Hornets (Alabama State University)",
    "Alcorn State University": "Alcorn State Braves (Alcorn State University)",
    "University of Arkansas–Pine Bluff": "Arkansas–Pine Bluff Golden Lions (University of Arkansas–Pine Bluff)",
    "Bethune-Cookman University": "Bethune-Cookman Wildcats (Bethune-Cookman University)",
    "Florida A&M University": "Florida A&M Rattlers (Florida A&M University)",
    "Grambling State University": "Grambling State Tigers (Grambling State University)",
    "Jackson State University": "Jackson State Tigers (Jackson State University)",
    "Mississippi Valley State University": "Mississippi Valley State Delta Devils (Mississippi Valley State University)",
    "Prairie View A&M University": "Prairie View A&M Panthers (Prairie View A&M University)",
    "Southern University and A&M College": "Southern Jaguars (Southern University and A&M College)",
    "Texas Southern University": "Texas Southern Tigers (Texas Southern University)",
    
    // WAC
    "Abilene Christian University": "Abilene Christian Wildcats (Abilene Christian University)",
    "Stephen F. Austin State University": "Stephen F. Austin Lumberjacks (Stephen F. Austin State University)",
    "Southern Utah University": "Southern Utah Thunderbirds (Southern Utah University)",
    "Utah Tech University": "Utah Tech Trailblazers (Utah Tech University)",
    
    // Independents (FCS)
    "University of Massachusetts Amherst": "UMass Minutemen (University of Massachusetts Amherst)",
    "Kennesaw State University": "Kennesaw State Owls (Kennesaw State University)",

    // D3 Schools
    "Amherst College": "Amherst Mammoths (Amherst College)",
    "Williams College": "Williams Ephs (Williams College)",
    "Middlebury College": "Middlebury Panthers (Middlebury College)",
    "Tufts University": "Tufts Jumbos (Tufts University)",
    "Washington University in St. Louis": "WashU Bears (Washington University in St. Louis)",
    "Carnegie Mellon University": "Carnegie Mellon Tartans (Carnegie Mellon University)",
    "Case Western Reserve University": "Case Western Reserve Spartans (Case Western Reserve University)",
    "University of Chicago": "Chicago Maroons (University of Chicago)",
    "Emory University": "Emory Eagles (Emory University)",
    "New York University": "NYU Violets (New York University)",
    "University of Rochester": "Rochester Yellowjackets (University of Rochester)",
    "University of Wisconsin-Whitewater": "UW-Whitewater Warhawks (University of Wisconsin-Whitewater)",
    "University of Wisconsin-La Crosse": "UW-La Crosse Eagles (University of Wisconsin-La Crosse)",
    "University of Wisconsin-Oshkosh": "UW-Oshkosh Titans (University of Wisconsin-Oshkosh)",
    "Washington and Lee University": "Washington and Lee Generals (Washington and Lee University)",
    "Randolph-Macon College": "Randolph-Macon Yellow Jackets (Randolph-Macon College)",
    "Johns Hopkins University": "Johns Hopkins Blue Jays (Johns Hopkins University)",
    "Franklin & Marshall College": "Franklin & Marshall Diplomats (Franklin & Marshall College)",
    "Muhlenberg College": "Muhlenberg Mules (Muhlenberg College)",
    "Union College (NY)": "Union Dutchmen (Union College (NY))",
    "Rensselaer Polytechnic Institute": "RPI Engineers (Rensselaer Polytechnic Institute)",
    "Trinity College (CT)": "Trinity Bantams (Trinity College (CT))",
    "Wesleyan University": "Wesleyan Cardinals (Wesleyan University)",
    "Chapman University": "Chapman Panthers (Chapman University)",
    "University of Mount Union": "Mount Union Purple Raiders (University of Mount Union)",
    "St. John's University (MN)": "St. John's Johnnies (St. John's University (MN))",
    "Linfield University": "Linfield Wildcats (Linfield University)",
    "Hardin-Simmons University": "Hardin-Simmons Cowboys (Hardin-Simmons University)",
  };
  
  return schoolNameMappings[schoolName] || schoolName;
};

const divisions = ["All", "JUCO", "D3", "D2", "FCS", "FBS"];

// New Component for the Target List
function TargetList({ schools, targetedSchools, onRemove, limitReached }) {
  const myTargets = useMemo(() => {
    const targetedIds = targetedSchools.map(ts => ts.school_id);
    return schools.filter(s => targetedIds.includes(s.id));
  }, [schools, targetedSchools]);

  return (
    <Card className="mb-8 bg-blue-50/50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-blue-800">
          <Star className="w-6 h-6" />
          My Target List
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myTargets.length > 0 ? (
            myTargets.map(school => (
              <div key={school.id} className="p-4 bg-white rounded-lg border flex justify-between items-center">
                <div>
                  <p className="font-semibold">{getFormattedSchoolName(school.name)}</p>
                  <p className="text-sm text-slate-500">{school.division}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemove(school.id)} disabled={limitReached}>
                  <Trash2 className={`w-4 h-4 ${limitReached ? 'text-gray-400' : 'text-red-500'}`} />
                </Button>
              </div>
            ))
        ) : (
            <div className="col-span-full text-center py-6 text-slate-600">
                <p>Your target schools will appear here once you add them.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

function AISuggestions({ athlete, user, onTargetSchool }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const isPro = user?.plan === 'unlimited' || user?.plan === 'core';

    const getSuggestions = async () => {
        if (!athlete || !isPro) return;
        setLoading(true);
        const prompt = `
            Act as an expert college recruiting advisor. Analyze this athlete's profile and perform a web search to check for any existing recruiting buzz on platforms like 247Sports, Rivals, etc.
            
            **Athlete Profile:**
            - Name: ${athlete.first_name} ${athlete.last_name}
            - Sport: ${athlete.sport || 'N/A'}
            - Position: ${athlete.position || 'N/A'}
            - Graduation Year: ${athlete.graduation_year || 'N/A'}
            - Academics: GPA: ${athlete.gpa || 'N/A'}, SAT: ${athlete.sat_score || 'N/A'}
            - Key Metrics: Height: ${athlete.height ? `${athlete.height / 12}'${athlete.height % 12}"` : 'N/A'}, Weight: ${athlete.weight ? `${athlete.weight} lbs` : 'N/A'}, 40-time: ${athlete.forty_time ? `${athlete.forty_time}s` : 'N/A'}
            - Target Levels: ${athlete.target_levels?.join(', ') || 'Any'}
            
            Based on the web search and the athlete's academic and athletic profile, suggest 5 highly suitable schools. Provide a detailed, insightful reason for each recommendation, referencing the athlete's profile and any online data you found.
            
            Return a JSON object with a single key "schools" which is an array of objects. Each object must have "name", "division", and a detailed "reason".
        `;
        try {
            const res = await InvokeLLM({ 
                prompt, 
                add_context_from_internet: true,
                response_json_schema: { type: "object", properties: { schools: { type: "array", items: { type: "object", properties: { name: { type: "string" }, division: { type: "string" }, reason: { type: "string" } }, required: ["name", "division", "reason"] } } } } 
            });
            if (res && res.schools) {
                setSuggestions(res.schools);
            }
        } catch (error) {
            console.error("AI suggestion error:", error);
        }
        setLoading(false);
    }

    return (
        <Card className="mb-8 bg-purple-50/50 border-purple-200 overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-purple-800">
                    <div className="flex items-center gap-3">
                      <Bot className="w-6 h-6" />
                      AI-Powered Recommendations
                    </div>
                    <Badge variant={isPro ? "default" : "secondary"} className={isPro ? "bg-purple-600" : ""}>
                      {user?.plan === 'unlimited' ? "Unlimited Access" : isPro ? "Pro Feature" : "Pro Plan Required"}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!isPro ? (
                     <div className="text-center py-6 bg-purple-100/50 rounded-lg">
                        <Lock className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                        <p className="font-semibold text-purple-800">Unlock Advanced Recruiting Insights</p>
                        <p className="text-sm text-purple-600 mb-4">Upgrade to get AI-powered school suggestions based on your profile and real-time recruiting data.</p>
                        <Link to={createPageUrl("Upgrade")}>
                            <Button>Upgrade Now</Button>
                        </Link>
                    </div>
                ) : suggestions.length === 0 && !loading && (
                    <div className="text-center">
                        <p className="mb-4 text-slate-600">Get a list of schools that match your athletic and academic profile.</p>
                        <Button onClick={getSuggestions}><Sparkles className="w-4 h-4 mr-2" />Generate Suggestions</Button>
                    </div>
                )}
                {loading && <div className="text-center py-4">Analyzing your profile and searching the web...</div>}
                {isPro && suggestions.length > 0 && (
                    <div className="space-y-4">
                        {suggestions.map((school, i) => (
                            <div key={i} className="p-4 bg-white rounded-lg border shadow-sm">
                                <p className="font-semibold">{getFormattedSchoolName(school.name)} <Badge variant="secondary">{school.division}</Badge></p>
                                <p className="text-sm text-slate-600 mt-2 italic">"{school.reason}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [targetedSchools, setTargetedSchools] = useState([]);
  const [athlete, setAthlete] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedConference, setSelectedConference] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      const athleteData = await Athlete.filter({ created_by: currentUser.email });
      const currentAthlete = athleteData[0] || null;
      
      const [allSchoolData, targetedData] = await Promise.all([
        School.list(),
        currentAthlete ? TargetedSchool.filter({ athlete_id: currentAthlete.id }) : Promise.resolve([]),
      ]);
      
      // Filter schools to only include those with an academic ranking
      const schoolData = allSchoolData.filter(s => s.academic_ranking);
      
      setSchools(schoolData);
      setAthlete(currentAthlete);
      setTargetedSchools(targetedData);

      if (currentAthlete?.target_levels?.length > 0) {
        setSelectedDivision(currentAthlete.target_levels[0]);
      }

    } catch (error) {
      console.error("Error loading schools data:", error);
    }
    setLoading(false);
  };

  const states = useMemo(() => {
    const uniqueStates = [...new Set(schools.map(s => s.state))].sort();
    return ["All", ...uniqueStates];
  }, [schools]);

  const conferences = useMemo(() => {
    const uniqueConferences = [...new Set(schools.map(s => s.conference))].sort();
    return ["All", ...uniqueConferences];
  }, [schools]);

  const filteredSchools = useMemo(() => {
    // Deduplicate schools by name before filtering
    const uniqueSchools = schools.filter((school, index, self) =>
        index === self.findIndex((s) => (
            s.name === school.name
        ))
    );
    
    return uniqueSchools.filter(school => {
      const formattedName = getFormattedSchoolName(school.name);
      const searchMatch = formattedName.toLowerCase().includes(searchTerm.toLowerCase());
      const divisionMatch = selectedDivision === "All" || school.division === selectedDivision;
      const stateMatch = selectedState === "All" || school.state === selectedState;
      const conferenceMatch = selectedConference === "All" || school.conference === selectedConference;
      return searchMatch && divisionMatch && stateMatch && conferenceMatch;
    });
  }, [schools, searchTerm, selectedDivision, selectedState, selectedConference]);

  const handleTargetSchool = async (schoolId) => {
    if (!athlete) {
        alert("Please create your athlete profile first to target schools.");
        return;
    }

    const isCurrentlyTargeted = targetedSchools.some(ts => ts.school_id === schoolId);

    try {
        if (isCurrentlyTargeted) {
            // Allow removal for all plans
            const targetToRemove = targetedSchools.find(ts => ts.school_id === schoolId);
            if (targetToRemove) {
                await TargetedSchool.delete(targetToRemove.id);
            }
        } else {
            // Check limits before adding a new school
            const plan = user?.plan || 'free';
            
            if (plan === 'unlimited') {
                // No restrictions for unlimited plan
            } else if (plan === 'core' && targetedSchools.length >= 15) {
                alert("Core plan is limited to 15 target schools. Upgrade to Unlimited for no limits!");
                return;
            } else if (plan === 'starter' && targetedSchools.length >= 7) {
                alert("Starter plan is limited to 7 target schools. Upgrade for more!");
                return;
            } else if (plan === 'free' && targetedSchools.length >= 3) {
                alert("Free plan is limited to 3 target schools. Please upgrade!");
                return;
            }
            
            await TargetedSchool.create({ athlete_id: athlete.id, school_id: schoolId });
        }

        const updatedTargetedData = await TargetedSchool.filter({ athlete_id: athlete.id });
        setTargetedSchools(updatedTargetedData);

    } catch (error) {
        console.error("Error targeting school:", error);
    }
  };

  const conferenceColors = {
    "American Athletic Conference": "bg-blue-100 text-blue-800 border-blue-200",
    "SEC": "bg-red-100 text-red-800 border-red-200",
    "ACC": "bg-purple-100 text-purple-800 border-purple-200", 
    "Big Ten": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Pac-12": "bg-green-100 text-green-800 border-green-200",
    "Sun Belt": "bg-orange-100 text-orange-800 border-orange-200",
    "Missouri Valley": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "GLIAC": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "NESCAC": "bg-rose-100 text-rose-800 border-rose-200",
    "Big Sky": "bg-teal-100 text-teal-800 border-teal-200",
    "CAA": "bg-violet-100 text-violet-800 border-violet-200",
    "Gulf South": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "OAC": "bg-amber-100 text-amber-800 border-amber-200",
    "WIAC": "bg-lime-100 text-lime-800 border-lime-200",
    "MACCC": "bg-pink-100 text-pink-800 border-pink-200",
    "ICCAC": "bg-sky-100 text-sky-800 border-sky-200",
    "Independent": "bg-gray-100 text-gray-800 border-gray-200",
    "default": "bg-slate-100 text-slate-800 border-slate-200"
  };

  const getConferenceLogo = (conference) => {
    const logoMap = {
      "SEC": "⚔️",
      "ACC": "🏟️",
      "American Athletic Conference": "🇺🇸",
      "Big Ten": "🌽",
      "Pac-12": "🌊",
      "Sun Belt": "☀️",
      "Independent": "⭐",
      "NESCAC": "🌲", // Example D3 conference logo
      "WIAC": "🧀",   // Example D3 conference logo
      "ODAC": "🐴",   // Example D3 conference logo
      "UAA": "📚"     // Example D3 conference logo
    };
    return logoMap[conference] || "🏈";
  };

  const tierDefinitions = {
    "Tier 1 – Most Competitive": "Elite academic institutions with extremely high selectivity, rigorous academics, and prestigious reputations (e.g., Ivy League level)",
    "Tier 2 – Highly Competitive": "Very selective schools with high academic standards, strong reputations, and competitive admission processes",
    "Tier 3 – Competitive": "Solid academic programs with moderate selectivity, good reputation, and reasonable admission requirements", 
    "Tier 4 – Less Competitive": "Generally accessible schools with higher acceptance rates but still maintaining academic standards",
    "Tier 5 – Least Competitive": "Open enrollment or minimally selective schools with the most accessible admission requirements",
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 text-xl text-slate-700">Loading schools...</div>;
  }
  
  const plan = user?.plan || 'free';
  
  let limitReachedForTargetList = false;
  if (plan === 'core') {
      limitReachedForTargetList = targetedSchools.length >= 15;
  } else if (plan === 'starter') {
      limitReachedForTargetList = targetedSchools.length >= 7;
  } else if (plan === 'free') {
      limitReachedForTargetList = targetedSchools.length >= 3;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Target Schools</h1>
              <p className="text-slate-600">
                Find and select schools that match your goals
                {plan === 'unlimited' && <span className="ml-2 text-purple-600 font-medium">✨ Unlimited Access</span>}
              </p>
            </div>
          </div>

          {/* My Target List - Always shown at top */}
          <TargetList schools={schools} targetedSchools={targetedSchools} onRemove={handleTargetSchool} limitReached={limitReachedForTargetList} />
          
          {/* AI Suggestions */}
          <AISuggestions athlete={athlete} user={user} onTargetSchool={handleTargetSchool} />
          
          {/* Filters */}
          <Card className="mb-8">
              <CardHeader>
                  <CardTitle>Search Schools</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                          placeholder="Search by school name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                      />
                  </div>
                  <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by division..." />
                      </SelectTrigger>
                      <SelectContent>
                          {divisions.map(div => <SelectItem key={div} value={div}>{div}</SelectItem>)}
                      </SelectContent>
                  </Select>
                  <Select value={selectedConference} onValueChange={setSelectedConference}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by conference..." />
                      </SelectTrigger>
                      <SelectContent>
                          {conferences.map(conf => <SelectItem key={conf} value={conf}>{conf}</SelectItem>)}
                      </SelectContent>
                  </Select>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by state..." />
                      </SelectTrigger>
                      <SelectContent>
                          {states.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </CardContent>
          </Card>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map(school => {
                  const isTargeted = targetedSchools.some(ts => ts.school_id === school.id);
                  let limitReached = false;
                  
                  if (!isTargeted) {
                      if (plan === 'core' && targetedSchools.length >= 15) limitReached = true;
                      else if (plan === 'starter' && targetedSchools.length >= 7) limitReached = true;
                      else if (plan === 'free' && targetedSchools.length >= 3) limitReached = true;
                  }

                  return (
                      <Card key={school.id} className={`flex flex-col hover:shadow-lg transition-shadow overflow-hidden ${limitReached ? 'opacity-60' : ''}`}>
                          <CardHeader>
                              <div className="flex items-start justify-between gap-3">
                                  <div className="text-2xl pt-1 flex-shrink-0">{getConferenceLogo(school.conference)}</div>
                                  <div className="flex-1">
                                      <span className="block font-semibold">{getFormattedSchoolName(school.name)}</span>
                                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                                          <MapPin className="w-4 h-4" />
                                          <span>{school.city}, {school.state}</span>
                                      </div>
                                  </div>
                              </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                              <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                      <Badge variant="secondary">{school.division}</Badge>
                                      <Badge className={conferenceColors[school.conference] || conferenceColors.default}>
                                          {school.conference?.replace("Conference", "").trim()}
                                      </Badge>
                                  </div>
                                  <div>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="mb-2 cursor-help">{school.academic_ranking}</Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs">{tierDefinitions[school.academic_ranking] || "No definition available."}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                      {school.enrollment && (
                                          <p className="text-sm text-slate-600">
                                              📊 {school.enrollment.toLocaleString()} students
                                          </p>
                                      )}
                                  </div>
                              </div>
                          </CardContent>
                          <CardFooter>
                              <Button
                                  onClick={() => handleTargetSchool(school.id)}
                                  variant={isTargeted ? "secondary" : "default"}
                                  className="w-full"
                                  disabled={!athlete || limitReached}
                              >
                                  {limitReached ? <Lock className="w-4 h-4 mr-2" /> : isTargeted ? <CheckCircle className="w-4 h-4 mr-2" /> : 'Add to Target List'}
                              </Button>
                          </CardFooter>
                      </Card>
                  );
              })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
