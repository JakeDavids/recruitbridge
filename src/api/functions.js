import { base44 } from './base44Client';

// Payment functions
export const checkout = base44.functions.checkout;
export const stripeWebhook = base44.functions.stripeWebhook;

// Email functions
export const sendEmail = base44.functions.sendEmail;
export const inboundEmail = base44.functions.inboundEmail;
export const sendEmailGmail = base44.functions.sendEmailGmail;
export const sendOutboundEmail = base44.functions.sendOutboundEmail;

// Identity functions (converted from identity/* to identityFunctionName)
export const identityCheckUsername = base44.functions['identity/checkUsername'];
export const identitySaveIdentity = base44.functions['identity/saveIdentity'];
export const identityValidate = base44.functions['identity/validate'];
export const identityCreate = base44.functions['identity/create'];
export const identityMe = base44.functions['identity/me'];
export const identityCheck = base44.functions['identity/check'];
export const identityProbe = base44.functions['identity/_probe'];
export const identitySendEmail = base44.functions['identity/sendEmail'];
export const identityPublic = base44.functions['identity/public'];
export const identitySmokeTest = base44.functions.identitySmokeTest;
export const identityMonitor = base44.functions.identityMonitor;
export const identityTempStorage = base44.functions['identity/temp-storage'];

// Gmail functions
export const gmailGoogle = base44.functions['gmail/_google'];
export const gmailAuthStart = base44.functions['gmail/auth/start'];
export const gmailAuthCallback = base44.functions['gmail/auth/callback'];
export const gmailSyncReplies = base44.functions['gmail/syncReplies'];

// Inbox functions
export const inboxSend = base44.functions['inbox/send'];
export const inboxInbound = base44.functions['inbox/inbound'];
export const inboxEvents = base44.functions['inbox/events'];
export const inboxTestInbound = base44.functions['inbox/testInbound'];
export const inboxList = base44.functions['inbox/list'];
export const inboxReply = base44.functions['inbox/reply'];
export const inboxReceive = base44.functions['inbox/receive'];
export const inboxListMessages = base44.functions['inbox/listMessages'];
export const inboxGetMessage = base44.functions['inbox/getMessage'];
export const inboxMarkMessageRead = base44.functions['inbox/markMessageRead'];
export const inboxDeleteMessage = base44.functions['inbox/deleteMessage'];

// School/questionnaire functions
export const updateSchoolQuestionnaires = base44.functions.updateSchoolQuestionnaires;

// Utility functions
export const ping = base44.functions.ping;
export const fixMyMailbox = base44.functions.fixMyMailbox;
export const cleanupMailboxes = base44.functions.cleanupMailboxes;

// Email/mail functions
export const emailSend = base44.functions['email/send'];
export const mailSend = base44.functions['mail/send'];

// API functions
export const apiSendEmail = base44.functions['api/sendEmail'];
export const apiInboxInbound = base44.functions['api/inbox/inbound'];
export const apiThreadsList = base44.functions['api/threads/list'];
export const apiThreadsGet = base44.functions['api/threads/get'];
export const apiThreadsMarkRead = base44.functions['api/threads/markRead'];
export const apiDiagAnthropic = base44.functions['api/diag/anthropic'];
export const apiClaudeChat = base44.functions['api/claude/chat'];

// Claude AI functions
export const claudeAssistant = base44.functions.claudeAssistant;

// Test/debug functions
export const testMailgun = base44.functions['test/mailgun'];
export const authTest = base44.functions['auth-test'];
export const debugUser = base44.functions['debug/user'];
export const debugLookup = base44.functions['debug/lookup'];
export const debugIdentities = base44.functions['debug/identities'];
export const debugAllIdentities = base44.functions['debug/all-identities'];
export const debugMinimalCreate = base44.functions['debug/minimal-create'];
export const debugEntities = base44.functions['debug/entities'];
export const debugPersistence = base44.functions['debug/persistence'];
