import { MenuItem } from "./types";
import React from "react";

// --- Icon Definitions ---

const Icons = {
  aiHub: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4.5V12h8.5" /><path d="M18 11a7 7 0 1 0-14 0c0 2.5 2 5 2 7H4" /><path d="M10 22h4" /><path d="M15 5a2 2 0 1 0-4 0a2 2 0 0 0 4 0Z" />
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12AC75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4.5V12h8.5" /><path d="M18 11a7 7 0 1 0-14 0c0 2.5 2 5 2 7H4" /><path d="M10 22h4" /><path d="M15 5a2 2 0 1 0-4 0a2 2 0 0 0 4 0Z" />
      </svg>
    ),
  },
  overview: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 18V15" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.0693 2.81985L3.13929 8.36985C2.35929 8.98985 1.85929 10.2998 2.02929 11.2798L3.35929 19.2398C3.59929 20.6598 4.95929 21.8098 6.39929 21.8098H17.5993C19.0293 21.8098 20.3993 20.6498 20.6393 19.2398L21.9693 11.2798C22.1293 10.2998 21.6293 8.98985 20.8593 8.36985L13.9293 2.82985C12.8593 1.96985 11.1293 1.96985 10.0693 2.81985Z" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.8319 6.01002L13.2819 0.770018C12.0019 -0.249982 10.0019 -0.259982 8.73192 0.760018L2.18192 6.01002C1.24192 6.76002 0.671916 8.26002 0.871916 9.44002L2.13192 16.98C2.42192 18.67 3.99192 20 5.70192 20H16.3019C17.9919 20 19.5919 18.64 19.8819 16.97L21.1419 9.43002C21.3219 8.26002 20.7519 6.76002 19.8319 6.01002ZM11.7519 16C11.7519 16.41 11.4119 16.75 11.0019 16.75C10.5919 16.75 10.2519 16.41 10.2519 16V13C10.2519 12.59 10.5919 12.25 11.0019 12.25C11.4119 12.25 11.7519 12.59 11.7519 13V16Z" fill="#12AC75" />
      </svg>
    ),
  },
  schedule: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V5" stroke="#868686" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 2V5" stroke="#868686" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5 9.08984H20.5" stroke="#868686" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#868686" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25C15.59 1.25 15.25 1.59 15.25 2V3.5H8.74999V2C8.74999 1.59 8.40999 1.25 7.99999 1.25C7.58999 1.25 7.24999 1.59 7.24999 2V3.56C4.54999 3.81 3.23999 5.42 3.03999 7.81C3.01999 8.1 3.25999 8.34 3.53999 8.34H20.46C20.75 8.34 20.99 8.09 20.96 7.81C20.76 5.42 19.45 3.81 16.75 3.56Z" fill="#12AC75" />
        <path d="M20 9.83984H4C3.45 9.83984 3 10.2898 3 10.8398V16.9998C3 19.9998 4.5 21.9998 8 21.9998H16C19.5 21.9998 21 19.9998 21 16.9998V10.8398C21 10.2898 20.55 9.83984 20 9.83984Z" fill="#12AC75" />
      </svg>
    ),
  },
  studentMatching: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.16 10.87C9.06 10.86 8.94 10.86 8.83 10.87C6.45 10.79 4.56 8.84 4.56 6.44C4.56 3.99 6.54 2 9 2C11.45 2 13.44 3.99 13.44 6.44C13.43 8.84 11.54 10.79 9.16 10.87Z" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.16 14.56C1.74 16.18 1.74 18.82 4.16 20.43C6.91 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.92 12.73 4.16 14.56Z" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.34 20C19.06 19.85 19.74 19.56 20.3 19.13C21.86 17.96 21.86 16.03 20.3 14.86C19.75 14.44 19.08 14.16 18.37 14" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="#12AC75" />
        <path d="M14.08 14.15C11.29 12.29 6.74 12.29 3.93 14.15C2.66 15 1.96 16.15 1.96 17.38C1.96 18.61 2.66 19.75 3.92 20.59C5.32 21.53 7.16 22 9 22C10.84 22 12.68 21.53 14.08 20.59C15.34 19.74 16.04 18.60 16.04 17.36C16.03 16.13 15.34 14.99 14.08 14.15Z" fill="#12AC75" />
        <path d="M19.99 7.34C20.15 9.28 18.77 10.98 16.86 11.21C15.67 11.28 14.78 10.97 14.11 10.4C15.14 9.48 15.73 8.1 15.61 6.6C15.54 5.79 15.26 5.05 14.84 4.42C15.22 4.23 15.66 4.11 16.11 4.07C18.07 3.90 19.82 5.36 19.99 7.34Z" fill="#12AC75" />
        <path d="M21.99 16.59C21.91 17.56 21.29 18.40 20.25 18.97C19.25 19.52 17.99 19.78 16.74 19.75C17.46 19.10 17.88 18.29 17.96 17.43C18.06 16.19 17.47 15 16.29 14.05C15.62 13.52 14.84 13.10 13.99 12.79C16.20 12.15 18.98 12.58 20.69 13.96C21.61 14.70 22.08 15.63 21.99 16.59Z" fill="#12AC75" />
      </svg>
    ),
  },
  messages: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12AC75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
  },
  university: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12AC75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
  },
  resources: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12AC75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  quality: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12AC75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  profile: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12AC75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  scholarship: {
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" /><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" /><path d="M12 12V7" /><path d="M12 12v5" /><path d="M9 12h6" />
      </svg>
    ),
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12AC75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" /><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" /><path d="M12 12V7" /><path d="M12 12v5" /><path d="M9 12h6" />
      </svg>
    ),
  },
};

// --- Main Menu Items ---

export const menuItems: MenuItem[] = [
  {
    id: "journey-group",
    label: "My Journey",
    href: "#",
    allowedMemberTypes: ["STUDENT"],
    icon: Icons.overview,
    children: [
      { id: "overview", label: "Overview", href: "/overview", allowedMemberTypes: ["STUDENT"], icon: Icons.overview },
      { id: "applications", label: "My Applications", href: "/applications", allowedMemberTypes: ["STUDENT"], icon: Icons.overview },
      // University Hub hidden for standard users as it's purely mock data for now
    ],
  },
  {
    id: "mentor-group",
    label: "Mentor Center",
    href: "#",
    allowedMemberTypes: ["ACADEMIC_MENTOR"],
    icon: Icons.overview,
    children: [
      { id: "overview-mentor", label: "Overview", href: "/mentor/overview", allowedMemberTypes: ["ACADEMIC_MENTOR"], icon: Icons.overview },
      { id: "schedule", label: "Schedule", href: "/mentor/schedule", allowedMemberTypes: ["ACADEMIC_MENTOR"], icon: Icons.schedule },
    ],
  },
  {
    id: "professional-group",
    label: "Professional Tools",
    href: "#",
    allowedMemberTypes: ["ACADEMIC_MENTOR"],
    icon: Icons.studentMatching,
    children: [
      { id: "student-matching", label: "Student Matching", href: "/mentor/student-matching", allowedMemberTypes: ["ACADEMIC_MENTOR"], icon: Icons.studentMatching },
      { id: "mentor-services", label: "My Services", href: "/mentor/services", allowedMemberTypes: ["ACADEMIC_MENTOR"], icon: Icons.resources },
      { id: "bookings", label: "Bookings", href: "/mentor/bookings", allowedMemberTypes: ["ACADEMIC_MENTOR"], icon: Icons.schedule },
      { id: "resources-mentor", label: "Resources", href: "/mentor/resources", allowedMemberTypes: ["ACADEMIC_MENTOR"], icon: Icons.resources },
      { id: "quality-control", label: "Quality Control", href: "/mentor/quality-control", allowedMemberTypes: ["ACADEMIC_MENTOR"], icon: Icons.quality },
    ],
  },
  {
    id: "networking-group",
    label: "Networking",
    href: "#",
    allowedMemberTypes: ["STUDENT", "ACADEMIC_MENTOR"],
    icon: Icons.messages,
    children: [
      { id: "mentorship", label: "Mentorship", href: "/mentorship", allowedMemberTypes: ["STUDENT"], icon: Icons.studentMatching },
      { id: "community-hub", label: "Community Hub", href: "/community-hub", allowedMemberTypes: ["STUDENT", "ACADEMIC_MENTOR"], icon: Icons.messages },
      { id: "messages", label: "Messages", href: "/messages", allowedMemberTypes: ["STUDENT", "ACADEMIC_MENTOR"], icon: Icons.messages },
    ],
  },
  {
    id: "account-group",
    label: "Account",
    href: "#",
    allowedMemberTypes: ["STUDENT", "ACADEMIC_MENTOR"],
    icon: Icons.profile,
    children: [
      { id: "profile", label: "Profile", href: "/profile", allowedMemberTypes: ["STUDENT"], icon: Icons.profile },
      { id: "student-purchases", label: "My Purchases", href: "/dashboard/purchases", allowedMemberTypes: ["STUDENT"], icon: Icons.schedule },
      { id: "profile-settings", label: "Profile Settings", href: "/mentor/profile-settings", allowedMemberTypes: ["ACADEMIC_MENTOR"], icon: Icons.profile },
    ],
  },
];

// --- Admin Menu Items ---

const adminMenuItems: MenuItem[] = [
  {
    id: "admin-dashboard",
    label: "Admin Dashboard",
    href: "/admin",
    allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
    icon: Icons.overview,
  },
  {
    id: "user-management",
    label: "User Management",
    href: "#",
    allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM", "MODERATOR"],
    icon: Icons.studentMatching,
    children: [
      {
        id: "admin-students",
        label: "Students",
        href: "/admin/students",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM", "MODERATOR"],
        icon: Icons.studentMatching,
      },
      {
        id: "admin-mentors",
        label: "Mentors",
        href: "/admin/mentors",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.studentMatching,
      },
      {
        id: "admin-moderators",
        label: "Moderators",
        href: "/admin/moderators",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.profile,
      },
    ],
  },
  {
    id: "content-hubs",
    label: "Content & Hubs",
    href: "#",
    allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM", "MODERATOR"],
    icon: Icons.university,
    children: [
      {
        id: "admin-universities",
        label: "Universities",
        href: "/admin/content/universities",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM", "MODERATOR"],
        icon: Icons.university,
      },
      {
        id: "admin-courses",
        label: "Programs",
        href: "/admin/content/courses",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.overview,
      },
      {
        id: "admin-resources",
        label: "Resources",
        href: "/admin/content/resources",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.resources,
      },
      {
        id: "admin-services",
        label: "Services",
        href: "/admin/content/services",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM", "MODERATOR"],
        icon: Icons.resources,
      },
      {
        id: "admin-scholarships",
        label: "Scholarships",
        href: "/admin/content/scholarships",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM", "MODERATOR"],
        icon: Icons.scholarship,
      },
    ],
  },
  {
    id: "sales-management",
    label: "Sales & Payments",
    href: "#",
    allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
    icon: Icons.resources,
    children: [
      {
        id: "admin-orders",
        label: "Platform Orders",
        href: "/admin/sales/orders",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.schedule,
      },
    ],
  },
  {
    id: "platform-ops",
    label: "Platform Ops",
    href: "#",
    allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
    icon: {
      inactive: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      ),
      active: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#12AC75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      ),
    },
    children: [
      {
        id: "admin-newsletter",
        label: "Newsletter",
        href: "/admin/newsletter",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.messages,
      },
      {
        id: "admin-chat-monitor",
        label: "Chat Monitor",
        href: "/admin/chat-monitor",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.messages,
      },
      {
        id: "admin-advertising",
        label: "Advertising & Ads",
        href: "/admin/marketing",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.resources,
      },
    ],
  },
  {
    id: "system-settings",
    label: "System Settings",
    href: "#",
    allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
    icon: Icons.quality,
    children: [
      {
        id: "admin-users",
        label: "Admins",
        href: "/admin/settings/admins",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.profile,
      },
      {
        id: "admin-roles",
        label: "Roles",
        href: "/admin/settings/roles",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.quality,
      },
      {
        id: "admin-audit",
        label: "Audit Logs",
        href: "/admin/audit-logs",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.quality,
      },
      {
        id: "admin-login-history",
        label: "Login History",
        href: "/admin/login-history",
        allowedMemberTypes: ["PLATFORM_ADMIN", "PLATFORM_SYSTEM"],
        icon: Icons.overview,
      },
    ],
  },
];

menuItems.push(...adminMenuItems);

// Helper function to filter menu items based on user memberType
export function getFilteredMenuItems(
  memberType:
    | "STUDENT"
    | "ACADEMIC_MENTOR"
    | "PLATFORM_ADMIN"
    | "PLATFORM_SYSTEM"
    | "MODERATOR"
    | undefined,
): MenuItem[] {
  if (!memberType) return [];

  return menuItems.filter((item) => {
    // If no allowedMemberTypes specified, show to everyone
    if (!item.allowedMemberTypes) return true;

    // Check if user's memberType is in the allowed list
    return item.allowedMemberTypes.includes(memberType);
  });
}
