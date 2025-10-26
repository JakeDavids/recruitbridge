import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';

// Import all page components
import Dashboard from './Dashboard';
import Schools from './Schools';
import CoachContacts from './CoachContacts';
import OutreachCompose from './OutreachCompose';
import ResponseCenter from './ResponseCenter';
import Tracking from './Tracking';
import CoachAnalytics from './CoachAnalytics';
import Timeline from './Timeline';
import Questionnaires from './Questionnaires';
import Profile from './Profile';
import RecruitingCounseling from './RecruitingCounseling';
import Feedback from './Feedback';
import EmailGuide from './EmailGuide';
import ScholarshipsNIL from './ScholarshipsNIL';
import MyRecruitingJourney from './MyRecruitingJourney';
import Settings from './Settings';
import Upgrade from './Upgrade';
import BillingPortal from './BillingPortal';
import Welcome from './Welcome';
import Outreach from './Outreach';
import Inbox from './Inbox';
import Admin from './Admin';
import AdminMailboxManager from './AdminMailboxManager';
import AdminSchoolDataManager from './AdminSchoolDataManager';
import TestEmail from './TestEmail';
import TestCoachContacts from './TestCoachContacts';
import DevSetup from './DevSetup';
import ProductionCutover from './ProductionCutover';
import TwitterGuide from './TwitterGuide';
import CounselingPricing from './CounselingPricing';

/**
 * Main application router
 * All routes now require authentication - unauthenticated users are redirected by Layout
 */
export default function Pages() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main authenticated routes wrapped in Layout */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/schools" element={<Layout><Schools /></Layout>} />
        <Route path="/coachcontacts" element={<Layout><CoachContacts /></Layout>} />
        <Route path="/outreachcompose" element={<Layout><OutreachCompose /></Layout>} />
        <Route path="/responsecenter" element={<Layout><ResponseCenter /></Layout>} />
        <Route path="/tracking" element={<Layout><Tracking /></Layout>} />
        <Route path="/coachanalytics" element={<Layout><CoachAnalytics /></Layout>} />
        <Route path="/timeline" element={<Layout><Timeline /></Layout>} />
        <Route path="/questionnaires" element={<Layout><Questionnaires /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/recruitingcounseling" element={<Layout><RecruitingCounseling /></Layout>} />
        <Route path="/feedback" element={<Layout><Feedback /></Layout>} />
        <Route path="/emailguide" element={<Layout><EmailGuide /></Layout>} />
        <Route path="/scholarshipsnil" element={<Layout><ScholarshipsNIL /></Layout>} />
        <Route path="/myrecruitingjourney" element={<Layout><MyRecruitingJourney /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/upgrade" element={<Layout><Upgrade /></Layout>} />
        <Route path="/billingportal" element={<Layout><BillingPortal /></Layout>} />
        <Route path="/welcome" element={<Layout><Welcome /></Layout>} />
        <Route path="/outreach" element={<Layout><Outreach /></Layout>} />
        <Route path="/inbox" element={<Layout><Inbox /></Layout>} />
        <Route path="/counselingpricing" element={<Layout><CounselingPricing /></Layout>} />
        <Route path="/twitterguide" element={<Layout><TwitterGuide /></Layout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
        <Route path="/adminmailboxmanager" element={<Layout><AdminMailboxManager /></Layout>} />
        <Route path="/adminschooldatamanager" element={<Layout><AdminSchoolDataManager /></Layout>} />

        {/* Development/testing routes */}
        <Route path="/testemail" element={<Layout><TestEmail /></Layout>} />
        <Route path="/testcoachcontacts" element={<Layout><TestCoachContacts /></Layout>} />
        <Route path="/devsetup" element={<Layout><DevSetup /></Layout>} />
        <Route path="/productioncutover" element={<Layout><ProductionCutover /></Layout>} />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
