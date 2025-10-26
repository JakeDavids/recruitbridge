import { useState, useCallback } from 'react';
import { User } from '@/api/entities';

const PUBLIC_TOKEN = "78by89nu298sum98ms209ims09m76sb87";

// Check if EmailIdentity exists using your working sendEmail function
async function checkEmailIdentity(userId, username) {
  try {
    // Test if EmailIdentity exists by trying to create one with existing email
    const response = await fetch("/functions/sendEmail", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-rb-public": PUBLIC_TOKEN,
        "x-user-id": userId
      },
      body: JSON.stringify({
        to: "test@example.com",
        subject: "Identity Check",
        message: "Checking if identity exists",
        from: `${username}@recruitbridge.net`
      })
    });
    
    const result = await response.json();
    
    // If it succeeds and has fromIdentity, EmailIdentity exists
    if (result.success && result.fromIdentity) {
      return {
        exists: true,
        identity: {
          address: `${username}@recruitbridge.net`,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          username: username,
          domain: "recruitbridge.net",
          replyTo: `${username}@recruitbridge.net`,
          verified: true
        }
      };
    }
    
    return { exists: false, identity: null };
  } catch (err) {
    return { exists: false, identity: null };
  }
}

export function useRecruitBridgeIdentity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [identity, setIdentity] = useState(null);

  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await User.me();
      
      // Check EmailIdentity first - try common username patterns
      const possibleUsernames = [
        user.email?.split('@')[0],
        user.name?.toLowerCase().replace(/\s+/g, ''),
        'user' + user.id?.slice(-4)
      ].filter(Boolean);
      
      for (const username of possibleUsernames) {
        const emailCheck = await checkEmailIdentity(user.id, username);
        if (emailCheck.exists) {
          setIdentity(emailCheck.identity);
          return;
        }
      }
      
      // No EmailIdentity found
      setIdentity(null);
      
    } catch (err) {
      console.error('Error getting identity:', err);
      setError(err.message);
      setIdentity(null);
    }
    setLoading(false);
  }, []);

  const checkUsername = useCallback(async (username) => {
    try {
      // Simple username validation
      const isValid = /^[a-z0-9._-]{3,64}$/.test(username);
      const isAvailable = true; // For now, assume available
      
      return {
        ok: true,
        available: isValid && isAvailable,
        username: username
      };
    } catch (err) {
      console.error('Error checking username:', err);
      return { ok: false, error: err.message };
    }
  }, []);

  const createIdentity = useCallback(async (username, displayName) => {
    try {
      // Use your working sendEmail function to create EmailIdentity
      const user = await User.me();
      const response = await fetch("/functions/sendEmail", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-rb-public": PUBLIC_TOKEN,
          "x-user-id": user?.id || ""
        },
        body: JSON.stringify({
          to: "system@recruitbridge.net",
          subject: "Email Identity Created",
          message: `Creating email identity for ${displayName}`,
          from: `${username}@recruitbridge.net`
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await getMe(); // Refresh identity after creation
        return { ok: true, identity: result };
      } else {
        return { ok: false, error: result.error };
      }
    } catch (err) {
      console.error('Error creating identity:', err);
      return { ok: false, error: err.message };
    }
  }, [getMe]);

  return {
    loading,
    error,
    identity,
    getMe,
    checkUsername,
    createIdentity
  };
}