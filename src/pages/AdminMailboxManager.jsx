import React, { useState, useEffect } from "react";
import { Mailbox } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mails, Plus } from "lucide-react";
import { updateSchoolQuestionnaires } from "@/api/functions";

export default function AdminMailboxManager() {
  const [mailboxes, setMailboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState({});
  const [updating, setUpdating] = useState(false);

  const loadMailboxes = async () => {
    try {
      const data = await Mailbox.list();
      setMailboxes(data);
    } catch (error) {
      console.error("Failed to load mailboxes:", error);
    }
  };

  const createDefaultMailbox = async () => {
    try {
      await Mailbox.create({
        userId: "NEEDS_USER_ID", // Placeholder that admin needs to update
        type: "APP_ALIAS",
        provider: "mailgun",
        address: "support@recruitbridge.net",
        replyTo: "inbox@recruitbridge.net"
      });
      loadMailboxes(); // Refresh to show the new mailbox
    } catch (error) {
      console.error("Failed to create default mailbox:", error);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const currentUser = await User.me();
        if (currentUser && currentUser.role === 'admin') {
          setUser(currentUser);
          loadMailboxes();
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking user auth:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  const handleUpdate = async (mailboxId) => {
    const newUserId = editingUserId[mailboxId];
    if (!newUserId) {
      alert("Please enter a User ID.");
      return;
    }
    try {
      await Mailbox.update(mailboxId, { userId: newUserId });
      alert("Mailbox updated successfully!");
      loadMailboxes();
    } catch (error) {
      console.error("Failed to update mailbox:", error);
      alert("Error updating mailbox. Check console for details.");
    }
  };

  const handleUpdateQuestionnaires = async () => {
    setUpdating(true);
    try {
      const response = await updateSchoolQuestionnaires({});
      alert(`Success! Updated ${response.data.updatedCount} schools with questionnaire URLs.`);
    } catch (error) {
      console.error("Failed to update questionnaires:", error);
      alert("Error updating questionnaires. Check console for details.");
    }
    setUpdating(false);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-600">Access Denied. This page is for administrators only.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Mails className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Mailbox Manager</h1>
            <p className="text-slate-600">Manage mailbox userId associations and update school data.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>School Questionnaires Update</CardTitle>
            <CardDescription>
              Update recruiting questionnaire URLs for schools in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleUpdateQuestionnaires} 
              disabled={updating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update School Questionnaires
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mailbox Records</CardTitle>
            <CardDescription>
              Update the userId for mailboxes to ensure proper email routing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mailboxes.length > 0 ? (
              mailboxes.map((box) => (
                <div key={box.id} className="p-4 border rounded-lg bg-slate-50 space-y-3">
                  <div>
                    <p className="font-semibold text-lg">{box.address}</p>
                    <p className="text-sm text-slate-600">Reply To: {box.replyTo}</p>
                    <p className="text-sm text-slate-600">Type: {box.type} | Provider: {box.provider}</p>
                    <p className="text-sm text-slate-600">Current User ID: {box.userId || "Not Set"}</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                      <Label htmlFor={`userid-${box.id}`}>New User ID</Label>
                      <Input
                        id={`userid-${box.id}`}
                        placeholder="Enter your User ID from the console (e.g., cm3gbc4620062j2a6bso1u4l1)"
                        value={editingUserId[box.id] || ""}
                        onChange={(e) => setEditingUserId({ ...editingUserId, [box.id]: e.target.value })}
                      />
                    </div>
                    <Button onClick={() => handleUpdate(box.id)}>Update</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">No mailboxes found.</p>
                <Button onClick={createDefaultMailbox} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Default Mailbox
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}