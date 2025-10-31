import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "./components/ProtectedRoute";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import AppMain from "./pages/App";
import EventDetail from "./pages/EventDetail";
import ChatDetail from "./pages/ChatDetail";
import ChatSearch from "./pages/ChatSearch";
import GroupInfo from "./pages/GroupInfo";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CourseSelection from "./pages/CourseSelection";
import Meeting from "./pages/Meeting";
import OrganizationDetail from "./pages/OrganizationDetail";
import OrganizationChat from "./pages/OrganizationChat";
import MemberProfile from "./pages/MemberProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppMain />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/:id"
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute>
                  <ChatDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat-search"
              element={
                <ProtectedRoute>
                  <ChatSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group-info/:id"
              element={
                <ProtectedRoute>
                  <GroupInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course-selection"
              element={
                <ProtectedRoute>
                  <CourseSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meeting"
              element={
                <ProtectedRoute>
                  <Meeting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organization-chat/:id"
              element={
                <ProtectedRoute>
                  <OrganizationChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organization/:id"
              element={
                <ProtectedRoute>
                  <OrganizationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/:id"
              element={
                <ProtectedRoute>
                  <MemberProfile />
                </ProtectedRoute>
              }
            />

            {/* 404 - Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;