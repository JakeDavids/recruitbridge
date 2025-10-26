
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { User } from "@/api/entities";
import { Athlete } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  User as UserIcon,
  Target,
  Send,
  Users,
  Calendar,
  ClipboardList,
  MessageSquare,
  LogOut,
  ChevronUp,
  Settings as SettingsIcon,
  Users2,
  TrendingUp,
  GraduationCap,
  BookOpen
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// ✅ Fixed: include "/" instead of "/Landing"
const PUBLIC_PATHS = new Set([
  "/",          // root landing page
  "/login",
  "/signup",
  "/pricing"
]);

const bottomNavigationItems = [
  {
    title: "Email Guide",
    url: createPageUrl("EmailGuide"),
    icon: MessageSquare,
  },
  {
    title: "Scholarships & NIL",
    url: createPageUrl("ScholarshipsNIL"),
    icon: GraduationCap,
  },
  {
    title: "My Recruiting Journey",
    url: createPageUrl("MyRecruitingJourney"),
    icon: BookOpen,
  }
];

export default function Layout({ children }) {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [athlete, setAthlete] = React.useState(null);

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        // Load athlete data if user is authenticated
        if (currentUser) {
          const athleteData = await Athlete.filter({ created_by: currentUser.email });
          if (athleteData.length > 0) {
            setAthlete(athleteData[0]);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error("Error logging out:", error);
      window.location.href = "/";
    }
  };

  const getPlanName = (plan) => {
    if (!plan) return 'Free Plan';
    return `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`;
  };

  const getPlanStyling = (plan) => {
    switch (plan) {
      case 'unlimited':
        return {
          badgeClass: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25",
          nameClass: "text-slate-900 font-bold",
          containerClass: "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200",
          icon: "👑"
        };
      case 'core':
        return {
          badgeClass: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0",
          nameClass: "text-slate-900 font-semibold",
          containerClass: "bg-blue-50 border border-blue-200",
          icon: "⚡"
        };
      case 'starter':
        return {
          badgeClass: "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0",
          nameClass: "text-slate-900 font-medium",
          containerClass: "bg-green-50 border border-green-200",
          icon: "🌟"
        };
      default:
        return {
          badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
          nameClass: "text-slate-900",
          containerClass: "bg-white",
          icon: "📋"
        };
    }
  };

  const planStyling = getPlanStyling(user?.plan);

  const navigationItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: LayoutDashboard,
    },
    {
      title: "Target Schools",
      url: createPageUrl("Schools"),
      icon: Target,
    },
    {
      title: "Coach Contacts",
      url: createPageUrl("CoachContacts"),
      icon: Users,
    },
    {
      title: "Outreach Center",
      url: createPageUrl("OutreachCompose"),
      icon: Send,
    },
    {
      title: "Response Center",
      url: createPageUrl("ResponseCenter"),
      icon: MessageSquare,
    },
    {
      title: "Coach Tracking",
      url: createPageUrl("Tracking"),
      icon: Users,
    },
    {
      title: "Coach Analytics",
      url: createPageUrl("CoachAnalytics"),
      icon: TrendingUp,
    },
    {
      title: "Action Plan",
      url: createPageUrl("Timeline"),
      icon: Calendar,
    },
    {
      title: "Questionnaires",
      url: createPageUrl("Questionnaires"),
      icon: ClipboardList,
    },
    {
      title: "Profile",
      url: createPageUrl("Profile"),
      icon: UserIcon,
    },
    {
      title: "1-on-1 Counseling",
      url: createPageUrl("RecruitingCounseling"),
      icon: Users2,
    },
    {
      title: "Feedback",
      url: createPageUrl("Feedback"),
      icon: MessageSquare,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  const path = location.pathname;

  // ✅ Public routes (no sidebar, no auth required)
  if (PUBLIC_PATHS.has(path)) {
    return <>{children}</>;
  }

  // 🚫 Protected routes - redirect to root if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authenticated routes with sidebar
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6875a318a0b2d879d617363b/202797ade_recruitbrigdelogo.png"
                alt="RecruitBridge Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-slate-800 tracking-tighter">RecruitBridge</span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl ${
                          location.pathname === item.url
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Resources
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {bottomNavigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl ${
                          location.pathname === item.url
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="space-y-3">
              {(!user?.plan || user?.plan === 'free') && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-3 text-white text-center">
                  <p className="text-xs font-medium mb-2">🔥 Limited Time</p>
                  <p className="text-sm font-bold mb-2">Upgrade to Unlimited</p>
                  <Link to={createPageUrl("Upgrade")}>
                    <Button size="sm" variant="secondary" className="w-full text-xs">
                      Get 17% Off Today
                    </Button>
                  </Link>
                </div>
              )}

              {user?.plan && user?.plan !== 'free' && (
                <div className={`rounded-lg p-3 text-center ${planStyling.containerClass}`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">{planStyling.icon}</span>
                    <Badge className={planStyling.badgeClass}>
                      {getPlanName(user.plan)}
                    </Badge>
                  </div>
                  {user.plan === 'unlimited' && (
                    <p className="text-xs text-purple-700 font-medium">All features unlocked!</p>
                  )}
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full p-0 h-auto">
                    <div className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                        {user?.profile_picture_url ? (
                          <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-slate-500 font-semibold text-sm">
                            {athlete?.first_name ? athlete.first_name[0].toUpperCase() : 'A'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-sm truncate ${planStyling.nameClass}`}>
                          {athlete ? `${athlete.first_name} ${athlete.last_name}` : 'Athlete'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {getPlanName(user?.plan)}
                        </p>
                      </div>
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Profile")} className="flex items-center gap-2 cursor-pointer">
                      <UserIcon className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Settings")} className="flex items-center gap-2 cursor-pointer">
                      <SettingsIcon className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6875a318a0b2d879d617363b/202797ade_recruitbrigdelogo.png"
                    alt="RecruitBridge"
                    className="h-8 w-auto"
                  />
                  <span className="font-semibold text-slate-700">RecruitBridge</span>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
