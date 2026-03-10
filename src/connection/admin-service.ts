import { apiClient } from "./api-client";
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
    MentorInvitationPayload
} from "./api-types";

/**
 * Admin API Service - Handles all administrative endpoints
 */
export const adminService = {
    // --- Student Management ---

    getStudentMetrics: async (days: number = 30): Promise<StudentMetricResponse> => {
        return apiClient.get<StudentMetricResponse>(`/students/metrics?days=${days}`);
    },

    getStudentRecords: async (query: StudentQuery): Promise<PaginatedResponse<StudentRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.platformMemberCategory) params.append("platformMemberCategory", query.platformMemberCategory);
        if (query.platformMemberProfileStatus) params.append("platformMemberProfileStatus", query.platformMemberProfileStatus);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<StudentRecord>>(`/students/records?${params.toString()}`);
    },

    getStudentDetail: async (studentId: string): Promise<StudentDetail> => {
        return apiClient.get<StudentDetail>(`/students/${studentId}/detail`);
    },

    updateStudentStatus: async (studentId: string, payload: UpdateStatusPayload): Promise<string> => {
        return apiClient.patch<string>(`/students/${studentId}/status`, payload);
    },

    // --- Mentor Management ---

    getMentorMetrics: async (days: number = 30): Promise<MentorMetricResponse> => {
        return apiClient.get<MentorMetricResponse>(`/mentors/metrics?days=${days}`);
    },

    getMentorRecords: async (query: MentorQuery): Promise<PaginatedResponse<MentorRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.platformMemberCategory) params.append("platformMemberCategory", query.platformMemberCategory);
        if (query.platformMemberProfileStatus) params.append("platformMemberProfileStatus", query.platformMemberProfileStatus);
        if (query.verified !== undefined) params.append("verified", query.verified.toString());

        return apiClient.get<PaginatedResponse<MentorRecord>>(`/mentors/records?${params.toString()}`);
    },

    getMentorDetail: async (mentorId: string): Promise<MentorDetail> => {
        return apiClient.get<MentorDetail>(`/mentors/${mentorId}/detail`);
    },

    updateMentorStatus: async (mentorId: string, payload: UpdateStatusPayload): Promise<string> => {
        return apiClient.patch<string>(`/mentors/${mentorId}/status`, payload);
    },

    verifyMentor: async (mentorId: string, payload: VerifyMentorPayload): Promise<string> => {
        return apiClient.post<string>(`/mentors/${mentorId}/verify`, payload);
    },

    // --- Content Management: Universities ---

    getUniversityRecords: async (query: AdminUniversityQuery): Promise<PaginatedResponse<AdminUniversityRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.dentalSchoolPathway) params.append("dentalSchoolPathway", query.dentalSchoolPathway);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<AdminUniversityRecord>>(`/admin-content/universities/records?${params.toString()}`);
    },

    getUniversityDetail: async (universityId: string): Promise<AdminUniversityDetail> => {
        return apiClient.get<AdminUniversityDetail>(`/admin-content/universities/${universityId}`);
    },

    createUniversity: async (payload: CreateUniversityPayload): Promise<string> => {
        return apiClient.post<string>("/admin-content/universities", payload);
    },

    updateUniversity: async (universityId: string, payload: CreateUniversityPayload): Promise<string> => {
        return apiClient.put<string>(`/admin-content/universities/${universityId}`, payload);
    },

    deleteUniversity: async (universityId: string): Promise<string> => {
        return apiClient.delete<string>(`/admin-content/universities/${universityId}`);
    },

    // --- Content Management: Courses ---

    getCourseRecords: async (query: AdminCourseQuery): Promise<PaginatedResponse<AdminCourseRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.universityId) params.append("universityId", query.universityId.toString());
        if (query.degreeType) params.append("degreeType", query.degreeType);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<AdminCourseRecord>>(`/admin-content/courses/records?${params.toString()}`);
    },

    getCourseDetail: async (courseId: string): Promise<AdminCourseDetail> => {
        return apiClient.get<AdminCourseDetail>(`/admin-content/courses/${courseId}`);
    },

    createCourse: async (payload: CreateCoursePayload): Promise<string> => {
        return apiClient.post<string>("/admin-content/courses", payload);
    },

    updateCourse: async (courseId: string, payload: CreateCoursePayload): Promise<string> => {
        return apiClient.put<string>(`/admin-content/courses/${courseId}`, payload);
    },

    deleteCourse: async (courseId: string): Promise<string> => {
        return apiClient.delete<string>(`/admin-content/courses/${courseId}`);
    },

    // --- Dashboard & Analytics ---

    getDashboardSummary: async (): Promise<DashboardSummary> => {
        return apiClient.get<DashboardSummary>("/dashboard/summary");
    },

    getGrowthAnalytics: async (days: number = 30): Promise<GrowthAnalytics[]> => {
        return apiClient.get<GrowthAnalytics[]>(`/dashboard/growth-analytics?days=${days}`);
    },

    getGlobalActivity: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<GlobalActivity>> => {
        return apiClient.get<PaginatedResponse<GlobalActivity>>(`/dashboard/global-activity?pageNumber=${page}&pageSize=${size}`);
    },

    // --- Content Management: Resources ---

    getResourceRecords: async (query: AdminResourceQuery): Promise<PaginatedResponse<AdminResourceRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.dentalSchoolPathWay) params.append("dentalSchoolPathWay", query.dentalSchoolPathWay);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<AdminResourceRecord>>(`/admin-content/resources/records?${params.toString()}`);
    },

    getResourceDetail: async (resourceId: string): Promise<AdminResourceDetail> => {
        return apiClient.get<AdminResourceDetail>(`/admin-content/resources/${resourceId}`);
    },

    createResource: async (payload: CreateResourcePayload): Promise<string> => {
        return apiClient.post<string>("/admin-content/resources", payload);
    },

    updateResource: async (resourceId: string, payload: CreateResourcePayload): Promise<string> => {
        return apiClient.put<string>(`/admin-content/resources/${resourceId}`, payload);
    },

    deleteResource: async (resourceId: string): Promise<string> => {
        return apiClient.delete<string>(`/admin-content/resources/${resourceId}`);
    },

    // --- Admin & Role Management ---

    getAdminRecords: async (query: AdminQuery): Promise<PaginatedResponse<AdminRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.status) params.append("status", query.status);
        if (query.activationStatus) params.append("activationStatus", query.activationStatus);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<AdminRecord>>(`/admin-mgt/records?${params.toString()}`);
    },

    inviteAdmin: async (payload: AdminInvitationPayload): Promise<string> => {
        return apiClient.post<string>("/admin-mgt/admin/invite", payload);
    },

    updateAdmin: async (payload: UpdateAdminPayload): Promise<AdminRecord> => {
        return apiClient.patch<AdminRecord>("/admin-mgt/update", payload);
    },

    deactivateAdmin: async (emailAddress: string, reason?: string): Promise<string> => {
        return apiClient.patch<string>("/admin-mgt/deactivate", { emailAddress, deactivationReason: reason });
    },

    getPlatformRoles: async (): Promise<PlatformRoleData[]> => {
        return apiClient.get<PlatformRoleData[]>("/auth-mgt/platform-role");
    },

    getPlatformPermissions: async (): Promise<PlatformPermissionData[]> => {
        return apiClient.get<PlatformPermissionData[]>("/auth-mgt/platform-permissions");
    },

    getRolePermissions: async (roleGuid: string): Promise<PlatformRolePermissionMapping> => {
        return apiClient.get<PlatformRolePermissionMapping>(`/auth-mgt/platform-role-permissions?roleGuid=${roleGuid}`);
    },

    createRole: async (payload: CreateRolePayload): Promise<string> => {
        return apiClient.post<string>("/auth-mgt/platform-role", payload);
    },

    addRolePermissions: async (payload: AddRolePermissionsPayload): Promise<string> => {
        return apiClient.put<string>("/auth-mgt/platform-role-permissions", payload);
    },

    createRoleWithPermissions: async (payload: CreateRolePayload): Promise<string> => {
        return apiClient.post<string>("/auth-mgt/platform-role-permissions", payload);
    },

    inviteStudent: async (payload: StudentInvitationPayload): Promise<string> => {
        return apiClient.post<string>("/students/invite", payload);
    },

    inviteMentor: async (payload: MentorInvitationPayload): Promise<string> => {
        return apiClient.post<string>("/mentors/invite", payload);
    }
};
