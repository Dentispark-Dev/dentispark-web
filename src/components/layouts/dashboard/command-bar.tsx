"use client";

import * as React from "react";
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  Action,
} from "kbar";
import { useRouter } from "next/navigation";
import {
  Home,
  User,
  BookOpen,
  MessageSquare,
  Settings,
  Search,
  LayoutDashboard,
  BrainCircuit,
  PieChart,
  FileText,
  Sparkles,
  Layers,
  CreditCard,
  Rocket,
  Brain,
} from "lucide-react";

export function CommandBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const actions: Action[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      shortcut: ["d"],
      keywords: "home dashboard overview",
      perform: () => router.push("/overview"),
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "ai-hub",
      name: "AI Application Hub",
      shortcut: ["a"],
      keywords: "ai tools hub",
      perform: () => router.push("/ai-hub"),
      icon: <BrainCircuit className="w-5 h-5 text-primary-600" />,
    },
    {
      id: "ps-reviewer",
      name: "AI Personal Statement Reviewer",
      shortcut: ["r"],
      keywords: "ai personal statement reviewer ps feedback",
      perform: () => router.push("/ai-hub/personal-statement"),
      icon: <FileText className="w-5 h-5 text-primary-600" />,
    },
    {
      id: "mentor-matching",
      name: "Smart Mentor Matching",
      shortcut: ["q"],
      keywords: "mentor match finding academy guide",
      perform: () => router.push("/ai-hub/mentor-matching"),
      icon: <Sparkles className="w-5 h-5 text-primary-600" />,
    },
    {
      id: "interview-prep",
      name: "Mock Interview Prep",
      shortcut: ["i"],
      keywords: "interview prep mock bot mmi panel",
      perform: () => router.push("/ai-hub/interview-prep"),
      icon: <BrainCircuit className="w-5 h-5 text-primary-600" />,
    },
    {
      id: "transcript-parser",
      name: "Academic Transcript Parser",
      shortcut: ["t"],
      keywords: "transcript parser document cv extraction achievements",
      perform: () => router.push("/ai-hub/transcript-parser"),
      icon: <Layers className="w-5 h-5 text-primary-600" />,
    },
    {
      id: "pricing",
      name: "Upgrade to Premium",
      shortcut: ["p", "u"],
      keywords: "pricing upgrade premium subs subscription stripe pay checkout",
      perform: () => router.push("/pricing"),
      icon: <CreditCard className="w-5 h-5 text-primary-600" />,
    },
    {
      id: "profile",
      name: "My Profile",
      shortcut: ["p"],
      keywords: "profile settings account",
      perform: () => router.push("/profile"),
      icon: <User className="w-5 h-5" />,
    },
    {
      id: "universities",
      name: "University Hub",
      shortcut: ["u"],
      keywords: "search universities dental schools",
      perform: () => router.push("/university-hub"),
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "messages",
      name: "Messages",
      shortcut: ["m"],
      keywords: "chat mentor communication",
      perform: () => router.push("/messages"),
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
        id: "analytics",
        name: "Engagement Analytics",
        shortcut: ["e"],
        keywords: "stats progress data",
        perform: () => router.push("/admin/analytics"),
        icon: <PieChart className="w-5 h-5" />,
      },
    {
      id: "growth",
      name: "Growth & Rewards",
      shortcut: ["g", "r"],
      keywords: "referral friends growth credits share success wins",
      perform: () => router.push("/growth"),
      icon: <Rocket className="w-5 h-5 text-primary-600" />,
    },
    {
      id: "ai-intelligence",
      name: "AI Intelligence Hub",
      shortcut: ["a", "i"],
      keywords: "ai sentiment analytics interview reports data brain hub",
      perform: () => router.push("/ai-intelligence"),
      icon: <Brain className="w-5 h-5 text-primary-600" />,
    },
    {
      id: "settings",
      name: "Settings",
      shortcut: ["s"],
      keywords: "config preferences",
      perform: () => router.push("/profile/settings"),
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="bg-black/40 backdrop-blur-sm z-[99999]">
          <KBarAnimator className="w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 glass-card">
            <div className="flex items-center px-4 py-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <KBarSearch className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-lg" />
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-sans ml-2">ESC</kbd>
            </div>
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
            {item}
          </div>
        ) : (
          <div
            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
              active ? "bg-primary-50 border-l-4 border-primary-600 pl-3" : "bg-transparent pl-4"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`${active ? "text-primary-600" : "text-gray-500"}`}>
                {item.icon}
              </div>
              <span className={`text-sm font-medium ${active ? "text-primary-900" : "text-gray-700"}`}>
                {item.name}
              </span>
            </div>
            {item.shortcut?.length ? (
              <div className="flex gap-1">
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-400 font-sans"
                  >
                    {sc.toUpperCase()}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  );
}
