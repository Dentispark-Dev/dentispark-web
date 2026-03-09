import { apiClient } from "./api-client";
import {
    PaginatedResponse,
    ApiResponse,
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
    AddRolePermissionsPayload
} from "./api-types";

/**
 * Admin API Service - Handles all administrative endpoints
 */
export const adminService = {
    // --- Student Management ---

    getStudentMetrics: async (days: number = 30): Promise<ApiResponse<StudentMetricResponse>> => {
        return apiClient.get<ApiResponse<StudentMetricResponse>>(`/admin/students/metrics?days=${days}`);
    },

    getStudentRecords: async (query: StudentQuery): Promise<PaginatedResponse<StudentRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.platformMemberCategory) params.append("platformMemberCategory", query.platformMemberCategory);
        if (query.platformMemberProfileStatus) params.append("platformMemberProfileStatus", query.platformMemberProfileStatus);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<StudentRecord>>(`/admin/students/records?${params.toString()}`);
    },

    getStudentDetail: async (studentId: string): Promise<ApiResponse<StudentDetail>> => {
        return apiClient.get<ApiResponse<StudentDetail>>(`/admin/students/${studentId}/detail`);
    },

    updateStudentStatus: async (studentId: string, payload: UpdateStatusPayload): Promise<ApiResponse<string>> => {
        return apiClient.patch<ApiResponse<string>>(`/admin/students/${studentId}/status`, payload);
    },

    // --- Mentor Management ---

    getMentorMetrics: async (days: number = 30): Promise<ApiResponse<MentorMetricResponse>> => {
        return apiClient.get<ApiResponse<MentorMetricResponse>>(`/admin/mentors/metrics?days=${days}`);
    },

    getMentorRecords: async (query: MentorQuery): Promise<PaginatedResponse<MentorRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.platformMemberCategory) params.append("platformMemberCategory", query.platformMemberCategory);
        if (query.platformMemberProfileStatus) params.append("platformMemberProfileStatus", query.platformMemberProfileStatus);
        if (query.verified !== undefined) params.append("verified", query.verified.toString());

        return apiClient.get<PaginatedResponse<MentorRecord>>(`/admin/mentors/records?${params.toString()}`);
    },

    getMentorDetail: async (mentorId: string): Promise<ApiResponse<MentorDetail>> => {
        return apiClient.get<ApiResponse<MentorDetail>>(`/admin/mentors/${mentorId}/detail`);
    },

    updateMentorStatus: async (mentorId: string, payload: UpdateStatusPayload): Promise<ApiResponse<string>> => {
        return apiClient.patch<ApiResponse<string>>(`/admin/mentors/${mentorId}/status`, payload);
    },

    verifyMentor: async (mentorId: string, payload: VerifyMentorPayload): Promise<ApiResponse<string>> => {
        return apiClient.post<ApiResponse<string>>(`/admin/mentors/${mentorId}/verify`, payload);
    },

    // --- Content Management: Universities ---

    getUniversityRecords: async (query: AdminUniversityQuery): Promise<PaginatedResponse<AdminUniversityRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.dentalSchoolPathway) params.append("dentalSchoolPathway", query.dentalSchoolPathway);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<AdminUniversityRecord>>(`/admin/content/universities?${params.toString()}`);
    },

    getUniversityDetail: async (universityId: string): Promise<ApiResponse<AdminUniversityDetail>> => {
        return apiClient.get<ApiResponse<AdminUniversityDetail>>(`/admin/content/universities/${universityId}`);
    },

    createUniversity: async (payload: CreateUniversityPayload): Promise<ApiResponse<string>> => {
        return apiClient.post<ApiResponse<string>>("/admin/content/universities", payload);
    },

    updateUniversity: async (universityId: string, payload: CreateUniversityPayload): Promise<ApiResponse<string>> => {
        return apiClient.put<ApiResponse<string>>(`/admin/content/universities/${universityId}`, payload);
    },

    deleteUniversity: async (universityId: string): Promise<ApiResponse<string>> => {
        return apiClient.delete<ApiResponse<string>>(`/admin/content/universities/${universityId}`);
    },

    // --- Content Management: Courses ---

    getCourseRecords: async (query: AdminCourseQuery): Promise<PaginatedResponse<AdminCourseRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.universityId) params.append("universityId", query.universityId.toString());
        if (query.degreeType) params.append("degreeType", query.degreeType);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<AdminCourseRecord>>(`/admin/content/courses?${params.toString()}`);
    },

    getCourseDetail: async (courseId: string): Promise<ApiResponse<AdminCourseDetail>> => {
        return apiClient.get<ApiResponse<AdminCourseDetail>>(`/admin/content/courses/${courseId}`);
    },

    createCourse: async (payload: CreateCoursePayload): Promise<ApiResponse<string>> => {
        return apiClient.post<ApiResponse<string>>("/admin/content/courses", payload);
    },

    updateCourse: async (courseId: string, payload: CreateCoursePayload): Promise<ApiResponse<string>> => {
        return apiClient.put<ApiResponse<string>>(`/admin/content/courses/${courseId}`, payload);
    },

    deleteCourse: async (courseId: string): Promise<ApiResponse<string>> => {
        return apiClient.delete<ApiResponse<string>>(`/admin/content/courses/${courseId}`);
    },

    // --- Dashboard & Analytics ---

    getDashboardSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
        return apiClient.get<ApiResponse<DashboardSummary>>("/admin/dashboard/summary");
    },

    getGrowthAnalytics: async (days: number = 30): Promise<ApiResponse<GrowthAnalytics[]>> => {
        return apiClient.get<ApiResponse<GrowthAnalytics[]>>(`/admin/dashboard/growth-analytics?days=${days}`);
    },

    getGlobalActivity: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<GlobalActivity>> => {
        return apiClient.get<PaginatedResponse<GlobalActivity>>(`/admin/dashboard/global-activity?pageNumber=${page}&pageSize=${size}`);
    },

    // --- Content Management: Resources ---

    getResourceRecords: async (query: AdminResourceQuery): Promise<PaginatedResponse<AdminResourceRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.dentalSchoolPathWay) params.append("dentalSchoolPathWay", query.dentalSchoolPathWay);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<AdminResourceRecord>>(`/admin/content/resources?${params.toString()}`);
    },

    getResourceDetail: async (resourceId: string): Promise<ApiResponse<AdminResourceDetail>> => {
        return apiClient.get<ApiResponse<AdminResourceDetail>>(`/admin/content/resources/${resourceId}`);
    },

    createResource: async (payload: CreateResourcePayload): Promise<ApiResponse<string>> => {
        return apiClient.post<ApiResponse<string>>("/admin/content/resources", payload);
    },

    updateResource: async (resourceId: string, payload: CreateResourcePayload): Promise<ApiResponse<string>> => {
        return apiClient.put<ApiResponse<string>>(`/admin/content/resources/${resourceId}`, payload);
    },

    deleteResource: async (resourceId: string): Promise<ApiResponse<string>> => {
        return apiClient.delete<ApiResponse<string>>(`/admin/content/resources/${resourceId}`);
    },

    // --- Admin & Role Management ---

    getAdminRecords: async (query: AdminQuery): Promise<PaginatedResponse<AdminRecord>> => {
        const params = new URLSearchParams();
        if (query.searchKey) params.append("searchKey", query.searchKey);
        if (query.status) params.append("status", query.status);
        if (query.activationStatus) params.append("activationStatus", query.activationStatus);
        if (query.page !== undefined) params.append("pageNumber", query.page.toString());
        if (query.perPage !== undefined) params.append("pageSize", query.perPage.toString());

        return apiClient.get<PaginatedResponse<AdminRecord>>(`/admin/mgt/records?${params.toString()}`);
    },

    inviteAdmin: async (payload: AdminInvitationPayload): Promise<ApiResponse<string>> => {
        return apiClient.post<ApiResponse<string>>("/admin/mgt/invite", payload);
    },

    updateAdmin: async (payload: UpdateAdminPayload): Promise<ApiResponse<AdminRecord>> => {
        return apiClient.patch<ApiResponse<AdminRecord>>("/admin/mgt/update", payload);
    },

    deactivateAdmin: async (emailAddress: string, reason?: string): Promise<ApiResponse<string>> => {
        return apiClient.patch<ApiResponse<string>>("/admin/mgt/deactivate", { emailAddress, deactivationReason: reason });
    },

    getPlatformRoles: async (): Promise<ApiResponse<PlatformRoleData[]>> => {
        return apiClient.get<ApiResponse<PlatformRoleData[]>>("/auth/mgt/platform-role");
    },

    getPlatformPermissions: async (): Promise<ApiResponse<PlatformPermissionData[]>> => {
        return apiClient.get<ApiResponse<PlatformPermissionData[]>>("/auth/mgt/platform-permissions");
    },

    getRolePermissions: async (roleGuid: string): Promise<ApiResponse<PlatformRolePermissionMapping>> => {
        return apiClient.get<ApiResponse<PlatformRolePermissionMapping>>(`/auth/mgt/platform-role-permissions?roleGuid=${roleGuid}`);
    },

    createRole: async (payload: CreateRolePayload): Promise<ApiResponse<string>> => {
        return apiClient.post<ApiResponse<string>>("/auth/mgt/platform-role", payload);
    },

    addRolePermissions: async (payload: AddRolePermissionsPayload): Promise<ApiResponse<string>> => {
        return apiClient.put<ApiResponse<string>>("/auth/mgt/platform-role-permissions", payload);
    },

    createRoleWithPermissions: async (payload: CreateRolePayload): Promise<ApiResponse<string>> => {
        return apiClient.post<ApiResponse<string>>("/auth/mgt/platform-role-permissions", payload);
    }
};
