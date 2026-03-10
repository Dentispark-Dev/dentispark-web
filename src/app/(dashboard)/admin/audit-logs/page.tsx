"use client";

import { AuditLogTable } from "@/src/features/(dashboard)/admin/components/audit-log-table";

export default function AdminAuditLogsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
                <p className="text-gray-600 mt-1">Track system activities and security events.</p>
            </div>
            <AuditLogTable />
        </div>
    );
}
