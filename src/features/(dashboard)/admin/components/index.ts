import dynamic from "next/dynamic";

// All admin components are exported as dynamic with ssr: false to prevent 
// server-side rendering conflicts (like useSearchParams in static routes)
// and to optimize the bundle size for the dashboard.

// Tables
export const StudentTable = dynamic(() => import("./student-table").then(mod => mod.StudentTable), { ssr: false });
export const MentorTable = dynamic(() => import("./mentor-table").then(mod => mod.MentorTable), { ssr: false });
export const UniversityTable = dynamic(() => import("./university-table").then(mod => mod.UniversityTable), { ssr: false });
export const CourseTable = dynamic(() => import("./course-table").then(mod => mod.CourseTable), { ssr: false });
export const ResourceTable = dynamic(() => import("./resource-table").then(mod => mod.ResourceTable), { ssr: false });
export const AdminTable = dynamic(() => import("./admin-table").then(mod => mod.AdminTable), { ssr: false });
export const RoleTable = dynamic(() => import("./role-table").then(mod => mod.RoleTable), { ssr: false });
export const AuditLogTable = dynamic(() => import("./audit-log-table").then(mod => mod.AuditLogTable), { ssr: false });
export const ModeratorTable = dynamic(() => import("./moderator-table").then(mod => mod.ModeratorTable), { ssr: false });

// Heavy components / Modals
export const AdminDashboardAnalytics = dynamic(() => import("./admin-analytics").then(mod => mod.AdminDashboardAnalytics), { ssr: false });
export const InviteAdminModal = dynamic(() => import("./invite-admin-modal").then(mod => mod.InviteAdminModal), { ssr: false });
export const CreateRoleModal = dynamic(() => import("./create-role-modal").then(mod => mod.CreateRoleModal), { ssr: false });
export const InviteStudentModal = dynamic(() => import("./invite-student-modal").then(mod => mod.InviteStudentModal), { ssr: false });
export const InviteMentorModal = dynamic(() => import("./invite-mentor-modal").then(mod => mod.InviteMentorModal), { ssr: false });
export const CreateUniversityModal = dynamic(() => import("./create-university-modal").then(mod => mod.CreateUniversityModal), { ssr: false });
export const StudentProfileView = dynamic(() => import("./student-profile-view").then(mod => mod.StudentProfileView), { ssr: false });
export const MentorProfileView = dynamic(() => import("./mentor-profile-view").then(mod => mod.MentorProfileView), { ssr: false });
export const UniversityEditView = dynamic(() => import("./university-edit-view").then(mod => mod.UniversityEditView), { ssr: false });
