"use client";

import React from "react";
import { PrivacySettings } from "@/src/features/profile/components/privacy-settings";

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-black-900 tracking-tight">Account Settings</h1>
        <p className="text-black-500 font-medium">Manage your security preferences and application data.</p>
      </div>
      
      <PrivacySettings />
    </div>
  );
}
