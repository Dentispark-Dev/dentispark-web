import { apiServiceFactory } from "./api-service-factory";
import {
    PaginatedResponse,
    StudentMetricResponse,
    StudentRecord,
    StudentDetail,
    UpdateStatusPayload,
    MentorMetricResponse,
    MentorRecord,
    MentorDetail,
    VerifyMentorPayload,
    AdminUniversityRecord,
    AdminUniversityDetail,
    CreateUniversityPayload,
    AdminCourseRecord,
    AdminCourseDetail,
    CreateCoursePayload,
    AdminResourceRecord,
    AdminResourceDetail,
    CreateResourcePayload,
    StudentQuery,
    MentorQuery,
    AdminUniversityQuery,
    AdminCourseQuery,
    AdminResourceQuery,
    DashboardSummary,
    GrowthAnalytics,
    GlobalActivity,
    AdminQuery,
    AdminRecord,
    AdminInvitationPayload,
    UpdateAdminPayload,
    PlatformRoleData,
    PlatformPermissionData,
    PlatformRolePermissionMapping,
    CreateRolePayload,
    AddRolePermissionsPayload,
    StudentInvitationPayload,
    MentorInvitationPayload,
    AuditQuery,
    AuditData,
    TrafficSummary,
    LoginSession
} from "./api-types";

/**
 * Admin API Service - Handles all administrative endpoints
 */
export const adminService = apiServiceFactory.createCustomService((api) => ({
    // --- Student Management ---
    getStudentMetrics: (days: number = 30) =>
        api.get<StudentMetricResponse>(`/students/metrics?days=${days}`),

    getStudentRecords: (query: StudentQuery) => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.platformMemberCategory) params.append("platformMemberCategory", query.platformMemberCategory);
        if (query.platformMemberProfileStatus) params.append("platformMemberProfileStatus", query.platformMemberProfileStatus);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());
        return api.get<PaginatedResponse<StudentRecord>>(`/students/records?${params.toString()}`);
    },

    getStudentDetail: (studentId: string) =>
        api.get<StudentDetail>(`/students/${encodeURIComponent(studentId)}/detail`),

    updateStudentStatus: (studentId: string, payload: UpdateStatusPayload) =>
        api.patch<string>(`/students/${encodeURIComponent(studentId)}/status`, payload),

    // --- Mentor Management ---
    getMentorMetrics: (days: number = 30) =>
        api.get<MentorMetricResponse>(`/mentors/metrics?days=${days}`),

    getMentorRecords: (query: MentorQuery) => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.platformMemberCategory) params.append("platformMemberCategory", query.platformMemberCategory);
        if (query.platformMemberProfileStatus) params.append("platformMemberProfileStatus", query.platformMemberProfileStatus);
        if (query.verified !== undefined) params.append("verified", query.verified.toString());
        return api.get<PaginatedResponse<MentorRecord>>(`/mentors/records?${params.toString()}`);
    },

    getMentorDetail: (mentorId: string) =>
        api.get<MentorDetail>(`/mentors/${encodeURIComponent(mentorId)}/detail`),

    updateMentorStatus: (mentorId: string, payload: UpdateStatusPayload) =>
        api.patch<string>(`/mentors/${encodeURIComponent(mentorId)}/status`, payload),

    verifyMentor: (mentorId: string, payload: VerifyMentorPayload) =>
        api.post<string>(`/mentors/${encodeURIComponent(mentorId)}/verify`, payload),

    // --- Content Management: Universities ---
    getUniversityRecords: (query: AdminUniversityQuery) => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.dentalSchoolPathway) params.append("dentalSchoolPathway", query.dentalSchoolPathway);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());
        return api.get<PaginatedResponse<AdminUniversityRecord>>(`/admin-content/universities/records?${params.toString()}`);
    },

    getUniversityDetail: (universityId: string) =>
        api.get<AdminUniversityDetail>(`/admin-content/universities/${encodeURIComponent(universityId)}`),

    createUniversity: (payload: CreateUniversityPayload) =>
        api.post<string>("/admin-content/universities", payload),

    updateUniversity: (universityId: string, payload: CreateUniversityPayload) =>
        api.put<string>(`/admin-content/universities/${encodeURIComponent(universityId)}`, payload),

    deleteUniversity: (universityId: string) =>
        api.delete<string>(`/admin-content/universities/${encodeURIComponent(universityId)}`),

    // --- Content Management: Courses ---
    getCourseRecords: (query: AdminCourseQuery) => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.universityId) params.append("universityId", query.universityId.toString());
        if (query.degreeType) params.append("degreeType", query.degreeType);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());
        return api.get<PaginatedResponse<AdminCourseRecord>>(`/admin-content/courses/records?${params.toString()}`);
    },

    getCourseDetail: (courseId: string) =>
        api.get<AdminCourseDetail>(`/admin-content/courses/${encodeURIComponent(courseId)}`),

    createCourse: (payload: CreateCoursePayload) =>
        api.post<string>("/admin-content/courses", payload),

    updateCourse: (courseId: string, payload: CreateCoursePayload) =>
        api.put<string>(`/admin-content/courses/${encodeURIComponent(courseId)}`, payload),

    deleteCourse: (courseId: string) =>
        api.delete<string>(`/admin-content/courses/${encodeURIComponent(courseId)}`),

    // --- Dashboard & Analytics ---
    getDashboardSummary: () => api.get<DashboardSummary>("/dashboard/summary"),

    getGrowthAnalytics: (days: number = 30) =>
        api.get<GrowthAnalytics[]>(`/dashboard/growth?days=${days}`),

    getGlobalActivity: (page: number = 0, size: number = 10) =>
        api.get<PaginatedResponse<GlobalActivity>>(`/dashboard/global-activity?pageNumber=${page}&pageSize=${size}`),

    getTrafficAnalytics: () => api.get<TrafficSummary>("/dashboard/traffic"),

    // --- Content Management: Resources ---
    getResourceRecords: (query: AdminResourceQuery) => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.dentalSchoolPathWay) params.append("dentalSchoolPathWay", query.dentalSchoolPathWay);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());
        return api.get<PaginatedResponse<AdminResourceRecord>>(`/admin-content/resources/records?${params.toString()}`);
    },

    getResourceDetail: (resourceId: string) =>
        api.get<AdminResourceDetail>(`/admin-content/resources/${encodeURIComponent(resourceId)}`),

    createResource: (payload: CreateResourcePayload) =>
        api.post<string>("/admin-content/resources", payload),

    updateResource: (resourceId: string, payload: CreateResourcePayload) =>
        api.put<string>(`/admin-content/resources/${encodeURIComponent(resourceId)}`, payload),

    deleteResource: (resourceId: string) =>
        api.delete<string>(`/admin-content/resources/${encodeURIComponent(resourceId)}`),

    // --- Admin & Role Management ---
    getAdminRecords: (query: AdminQuery) => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.status) params.append("status", query.status);
        if (query.activationStatus) params.append("activationStatus", query.activationStatus);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());
        return api.get<PaginatedResponse<AdminRecord>>(`/admin-mgt/records?${params.toString()}`);
    },

    inviteAdmin: (payload: AdminInvitationPayload) =>
        api.post<string>("/admin-mgt/admin/invite", payload),

    updateAdmin: (payload: UpdateAdminPayload) =>
        api.patch<AdminRecord>("/admin-mgt/update", payload),

    deactivateAdmin: (emailAddress: string, reason?: string) =>
        api.patch<string>("/admin-mgt/deactivate", { emailAddress, deactivationReason: reason }),

    getPlatformRoles: () => api.get<PlatformRoleData[]>("/auth-mgt/platform-role"),

    getPlatformPermissions: () => api.get<PlatformPermissionData[]>("/auth-mgt/platform-permissions"),

    getRolePermissions: (roleGuid: string) =>
        api.get<PlatformRolePermissionMapping>(`/auth-mgt/platform-role-permissions?roleGuid=${roleGuid}`),

    createRole: (payload: CreateRolePayload) =>
        api.post<string>("/auth-mgt/platform-role", payload),

    addRolePermissions: (payload: AddRolePermissionsPayload) =>
        api.put<string>("/auth-mgt/platform-role-permissions", payload),

    createRoleWithPermissions: (payload: CreateRolePayload) =>
        api.post<string>("/auth-mgt/platform-role-permissions", payload),

    inviteStudent: (payload: StudentInvitationPayload) =>
        api.post<string>("/students/invite", payload),

    inviteMentor: (payload: MentorInvitationPayload) =>
        api.post<string>("/mentors/invite", payload),

    // --- Audit Logs ---
    getAuditLogs: (query: AuditQuery) => {
        const params = new URLSearchParams();
        if (query.action) params.append("action", query.action);
        if (query.actor) params.append("actor", query.actor);
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());
        return api.get<PaginatedResponse<AuditData>>(`/audit?${params.toString()}`);
    },

    getLoginHistory: (page: number = 0, size: number = 20) =>
        api.get<PaginatedResponse<LoginSession>>(`/admin-mgt/sessions?pageNumber=${page}&pageSize=${size}`),

    clearLoginHistory: () => api.delete<void>("/admin-mgt/sessions"),

    clearAuditLogs: () => api.delete<void>("/audit")
}));
