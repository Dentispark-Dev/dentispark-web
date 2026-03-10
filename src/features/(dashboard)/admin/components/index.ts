import dynamic from "next/dynamic";

// Tables (Immediate or near-immediate need, but can be lazy loaded for tab performance)
export { StudentTable } from "./student-table";
export { MentorTable } from "./mentor-table";
export { UniversityTable } from "./university-table";
export { CourseTable } from "./course-table";
export { ResourceTable } from "./resource-table";
export { AdminTable } from "./admin-table";
export { RoleTable } from "./role-table";
export { AuditLogTable } from "./audit-log-table";
export { ModeratorTable } from "./moderator-table";

// Heavy components / Modals (Lazy loaded)
export const AdminDashboardAnalytics = dynamic(() => import("./admin-analytics").then(mod => mod.AdminDashboardAnalytics));
export const InviteAdminModal = dynamic(() => import("./invite-admin-modal").then(mod => mod.InviteAdminModal));
export const CreateRoleModal = dynamic(() => import("./create-role-modal").then(mod => mod.CreateRoleModal));
export const InviteStudentModal = dynamic(() => import("./invite-student-modal").then(mod => mod.InviteStudentModal));
export const InviteMentorModal = dynamic(() => import("./invite-mentor-modal").then(mod => mod.InviteMentorModal));
export const CreateUniversityModal = dynamic(() => import("./create-university-modal").then(mod => mod.CreateUniversityModal));
export const StudentProfileView = dynamic(() => import("./student-profile-view").then(mod => mod.StudentProfileView));
export const MentorProfileView = dynamic(() => import("./mentor-profile-view").then(mod => mod.MentorProfileView));
export const UniversityEditView = dynamic(() => import("./university-edit-view").then(mod => mod.UniversityEditView));

