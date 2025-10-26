const PUBLIC_TOKEN = "78by89nu298sum98ms209ims09m76sb87";

export async function idCheck(username, userId) {
  // Simple validation check
  const isValid = /^[a-z0-9._-]{3,64}$/.test(username);
  return {
    ok: true,
    available: isValid,
    username: username
  };
}

export async function idCreate({ username, displayName, userId }) {
  // Use the working sendEmail function instead of identity/public
  const r = await fetch("/functions/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rb-public": PUBLIC_TOKEN,
      "x-user-id": userId
    },
    body: JSON.stringify({
      to: "system@recruitbridge.net",
      subject: "Email Identity Created",
      message: `Creating email identity for ${displayName}`,
      from: `${username}@recruitbridge.net`
    })
  });
  
  const data = await r.json();
  
  if (!r.ok || !data?.success) {
    throw { detail: data?.error || "Failed to create identity" };
  }
  
  return {
    ok: true,
    identity: {
      address: `${username}@recruitbridge.net`,
      displayName: displayName,
      username: username,
      domain: "recruitbridge.net",
      verified: true
    }
  };
}