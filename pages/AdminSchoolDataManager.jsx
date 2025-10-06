import React, { useState, useEffect } from "react";
import { School, User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Upload, 
  Download, 
  Bot, 
  Search, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";

export default function AdminSchoolDataManager() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiSearching, setAiSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.role !== 'admin') {
        alert("Admin access required");
        return;
      }

      const schoolData = await School.list();
      setSchools(schoolData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  // METHOD 1: Manual Data Entry Form
  const handleSaveSchool = async () => {
    if (!selectedSchool) return;
    setSaving(true);
    try {
      await School.update(selectedSchool.id, {
        questionnaire_url: selectedSchool.questionnaire_url || "",
        coaching_staff_url: selectedSchool.coaching_staff_url || ""
      });
      alert("School data saved successfully!");
      await loadData();
    } catch (error) {
      console.error("Error saving school:", error);
      alert("Failed to save school data");
    }
    setSaving(false);
  };

  // METHOD 2: CSV Download Template
  const generateCSVTemplate = () => {
    const headers = "School ID,School Name,Division,Questionnaire URL,Coaching Staff URL\n";
    const rows = schools.map(school => 
      `"${school.id}","${school.name}","${school.division}","${school.questionnaire_url || ''}","${school.coaching_staff_url || ''}"`
    ).join("\n");
    
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'school_data_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  // METHOD 2: CSV Upload Handler
  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCsvFile(file);
    setUploadProgress({ total: 0, processed: 0, errors: [] });

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').slice(1); // Skip header
        setUploadProgress({ total: lines.length, processed: 0, errors: [] });

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Parse CSV line (handling quoted values)
          const match = line.match(/"([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)"/);
          if (!match) continue;

          const [_, schoolId, schoolName, division, questionnaireUrl, coachingStaffUrl] = match;

          try {
            await School.update(schoolId, {
              questionnaire_url: questionnaireUrl,
              coaching_staff_url: coachingStaffUrl
            });
            setUploadProgress(prev => ({ ...prev, processed: prev.processed + 1 }));
          } catch (error) {
            setUploadProgress(prev => ({
              ...prev,
              processed: prev.processed + 1,
              errors: [...prev.errors, `Failed to update ${schoolName}: ${error.message}`]
            }));
          }
        }

        alert("CSV upload complete!");
        await loadData();
      } catch (error) {
        console.error("Error processing CSV:", error);
        alert("Failed to process CSV file");
      }
    };
    reader.readAsText(file);
  };

  // METHOD 3: AI-Powered URL Finder
  const findSchoolURLsWithAI = async (school) => {
    setAiSearching(true);
    try {
      const prompt = `
Search the web and find the following URLs for ${school.name} (${school.division} football):
1. Their official football recruiting questionnaire URL
2. Their football coaching staff directory URL

Return a JSON object with these exact keys:
{
  "questionnaire_url": "the questionnaire URL or empty string if not found",
  "coaching_staff_url": "the coaching staff URL or empty string if not found",
  "notes": "any relevant notes about what you found"
}
      `;

      const result = await InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            questionnaire_url: { type: "string" },
            coaching_staff_url: { type: "string" },
            notes: { type: "string" }
          }
        }
      });

      setSelectedSchool({
        ...school,
        questionnaire_url: result.questionnaire_url,
        coaching_staff_url: result.coaching_staff_url,
        ai_notes: result.notes
      });

      alert("AI search complete! Review the URLs and save if correct.");
    } catch (error) {
      console.error("AI search error:", error);
      alert("AI search failed. Please try manual entry.");
    }
    setAiSearching(false);
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const missingDataCount = schools.filter(s => 
    !s.questionnaire_url || !s.coaching_staff_url
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-center mb-2">Admin Access Required</h2>
            <p className="text-center text-slate-600">
              This page is only accessible to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">School Data Manager</h1>
              <p className="text-slate-600">
                {schools.length} schools total • {missingDataCount} missing data
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="manual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">
              <Save className="w-4 h-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="csv">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV Upload
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Bot className="w-4 h-4 mr-2" />
              AI Finder
            </TabsTrigger>
          </TabsList>

          {/* METHOD 1: Manual Entry */}
          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How Manual Entry Works:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>1.</strong> Search for a school in the list below</p>
                  <p><strong>2.</strong> Click on the school to load it into the form</p>
                  <p><strong>3.</strong> Manually enter or paste the questionnaire URL and coaching staff URL</p>
                  <p><strong>4.</strong> Click "Save School Data" to update the database</p>
                  <p className="text-blue-700 mt-3">
                    <strong>Best for:</strong> Updating a few schools at a time with accurate URLs
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* School List */}
                  <div>
                    <Label>Search Schools ({filteredSchools.length})</Label>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search by school name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                      {filteredSchools.map((school) => (
                        <button
                          key={school.id}
                          onClick={() => setSelectedSchool(school)}
                          className={`w-full text-left p-3 hover:bg-slate-50 border-b ${
                            selectedSchool?.id === school.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="font-medium">{school.name}</div>
                          <div className="text-sm text-slate-500 flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">{school.division}</Badge>
                            {(!school.questionnaire_url || !school.coaching_staff_url) && (
                              <Badge variant="destructive" className="text-xs">Missing Data</Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div>
                    {selectedSchool ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{selectedSchool.name}</h3>
                          <Badge>{selectedSchool.division}</Badge>
                        </div>

                        <div>
                          <Label>Questionnaire URL</Label>
                          <Input
                            value={selectedSchool.questionnaire_url || ""}
                            onChange={(e) => setSelectedSchool({
                              ...selectedSchool,
                              questionnaire_url: e.target.value
                            })}
                            placeholder="https://..."
                          />
                        </div>

                        <div>
                          <Label>Coaching Staff URL</Label>
                          <Input
                            value={selectedSchool.coaching_staff_url || ""}
                            onChange={(e) => setSelectedSchool({
                              ...selectedSchool,
                              coaching_staff_url: e.target.value
                            })}
                            placeholder="https://..."
                          />
                        </div>

                        <Button onClick={handleSaveSchool} disabled={saving} className="w-full">
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save School Data
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        <Database className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Select a school from the list to edit</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* METHOD 2: CSV Upload */}
          <TabsContent value="csv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How CSV Upload Works:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>1.</strong> Download the CSV template with all current school data</p>
                  <p><strong>2.</strong> Open it in Excel, Google Sheets, or any spreadsheet program</p>
                  <p><strong>3.</strong> Fill in the "Questionnaire URL" and "Coaching Staff URL" columns</p>
                  <p><strong>4.</strong> Save the file as CSV and upload it back here</p>
                  <p><strong>5.</strong> The system will automatically update all schools in the database</p>
                  <p className="text-green-700 mt-3">
                    <strong>Best for:</strong> Bulk updating many schools at once (fastest method for large updates)
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Download Template */}
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Step 1: Download Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={generateCSVTemplate} className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV Template
                      </Button>
                      <p className="text-sm text-slate-600 mt-3">
                        This will download a CSV file with all {schools.length} schools and their current data.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Upload Completed CSV */}
                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Step 2: Upload Completed CSV</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label htmlFor="csv-upload">
                        <Button as="span" className="w-full cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Completed CSV
                        </Button>
                      </label>
                      {uploadProgress && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress:</span>
                            <span>{uploadProgress.processed} / {uploadProgress.total}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${(uploadProgress.processed / uploadProgress.total) * 100}%` }}
                            />
                          </div>
                          {uploadProgress.errors.length > 0 && (
                            <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                              {uploadProgress.errors.map((error, i) => (
                                <div key={i}>{error}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* METHOD 3: AI Finder */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How AI URL Finder Works:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>1.</strong> Select a school from the list below</p>
                  <p><strong>2.</strong> Click "Search with AI" - the AI will search the web for the school's recruiting URLs</p>
                  <p><strong>3.</strong> Review the URLs that the AI found (it will show you what it found)</p>
                  <p><strong>4.</strong> If the URLs look correct, click "Save School Data"</p>
                  <p><strong>5.</strong> If incorrect, you can manually edit the URLs before saving</p>
                  <p className="text-purple-700 mt-3">
                    <strong>Best for:</strong> When you need to find URLs quickly but want to verify accuracy (semi-automated)
                  </p>
                  <p className="text-purple-700">
                    <strong>Note:</strong> AI searches can take 10-30 seconds per school
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* School List */}
                  <div>
                    <Label>Select School to Search</Label>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search by school name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                      {filteredSchools.filter(s => !s.questionnaire_url || !s.coaching_staff_url).map((school) => (
                        <button
                          key={school.id}
                          onClick={() => setSelectedSchool(school)}
                          className={`w-full text-left p-3 hover:bg-slate-50 border-b ${
                            selectedSchool?.id === school.id ? 'bg-purple-50' : ''
                          }`}
                        >
                          <div className="font-medium">{school.name}</div>
                          <div className="text-sm text-slate-500">
                            <Badge variant="secondary" className="text-xs">{school.division}</Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Results */}
                  <div>
                    {selectedSchool ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{selectedSchool.name}</h3>
                          <Badge>{selectedSchool.division}</Badge>
                        </div>

                        <Button
                          onClick={() => findSchoolURLsWithAI(selectedSchool)}
                          disabled={aiSearching}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          {aiSearching ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Searching with AI...
                            </>
                          ) : (
                            <>
                              <Bot className="w-4 h-4 mr-2" />
                              Search with AI
                            </>
                          )}
                        </Button>

                        {selectedSchool.ai_notes && (
                          <div className="bg-purple-50 p-3 rounded-lg text-sm">
                            <strong>AI Notes:</strong> {selectedSchool.ai_notes}
                          </div>
                        )}

                        <div>
                          <Label>Questionnaire URL (AI Found)</Label>
                          <Input
                            value={selectedSchool.questionnaire_url || ""}
                            onChange={(e) => setSelectedSchool({
                              ...selectedSchool,
                              questionnaire_url: e.target.value
                            })}
                            placeholder="AI will populate this..."
                          />
                        </div>

                        <div>
                          <Label>Coaching Staff URL (AI Found)</Label>
                          <Input
                            value={selectedSchool.coaching_staff_url || ""}
                            onChange={(e) => setSelectedSchool({
                              ...selectedSchool,
                              coaching_staff_url: e.target.value
                            })}
                            placeholder="AI will populate this..."
                          />
                        </div>

                        <Button
                          onClick={handleSaveSchool}
                          disabled={saving || !selectedSchool.questionnaire_url}
                          className="w-full"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save School Data
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        <Bot className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Select a school to search with AI</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}