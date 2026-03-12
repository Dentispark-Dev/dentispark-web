"use client";

import { Badge } from "@/src/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { Mail, Calendar, Users, Eye } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const mockHistory = [
    {
        id: "1",
        subject: "Welcome to DentiSpark!",
        recipients: ["Students"],
        recipientCount: 154,
        date: "2024-03-10",
        status: "SENT",
    },
    {
        id: "2",
        subject: "New Mentorship Features Available",
        recipients: ["Students", "Mentors"],
        recipientCount: 210,
        date: "2024-03-05",
        status: "SENT",
    },
    {
        id: "3",
        subject: "Upcoming Webinar: Ace your UCAT",
        recipients: ["Premium Students"],
        recipientCount: 45,
        date: "2024-03-01",
        status: "SENT",
    },
    {
        id: "4",
        subject: "System Maintenance Notice",
        recipients: ["Students", "Mentors"],
        recipientCount: 210,
        date: "2024-02-25",
        status: "SENT",
    },
];

export function NewsletterHistory() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary-500" />
                    Sent Newsletters
                </h3>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-semibold px-6 py-4">Subject</TableHead>
                            <TableHead className="font-semibold px-6 py-4">Recipients</TableHead>
                            <TableHead className="font-semibold px-6 py-4">Sent Date</TableHead>
                            <TableHead className="font-semibold px-6 py-4">Status</TableHead>
                            <TableHead className="font-semibold px-6 py-4 text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockHistory.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center">
                                            <Mail className="h-4 w-4 text-primary-600" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{item.subject}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-1 flex-wrap">
                                            {item.recipients.map((r) => (
                                                <Badge key={r} variant="secondary" className="bg-blue-50 text-blue-600 border-none text-[10px] px-2 py-0">
                                                    {r}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {item.recipientCount} people
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(item.date).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none capitalize">
                                        {item.status.toLowerCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-gray-500 hover:text-primary-600">
                                        <Eye className="h-3.5 w-3.5" />
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
