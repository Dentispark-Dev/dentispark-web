// Common API response interfaces
export interface BaseApiResponse<T = unknown> {
  responseCode: string;
  responseMessage: string;
  errors: string[];
  responseData: T;
}

// Generic API Response type for all endpoints
export interface ApiResponse<T = unknown> {
  responseCode: string;
  responseMessage: string;
  errors: string[];
  responseData: T;
}

// Legacy interface for backwards compatibility
export interface LegacyApiResponse {
  success: boolean;
  message?: string;
}

export type PaginatedResponse<T> = BaseApiResponse<{
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}>;

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
  status?: number;
}

// Authentication related types
export interface LoginRequest {
  emailAddress: string;
  password: string;
}

export type LoginResponse = BaseApiResponse<{
  platformAdmin: User;
  accessToken: string;
  tokenType: string;
  tokenIssuedAt: string;
  tokenExpiredAt: string;
}>;

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  passwordConfirmation: string;
  termsAccepted: boolean;
}

export type RegisterResponse = BaseApiResponse<{
  user: User;
  verification_required: boolean;
}>;

export interface ForgotPasswordRequest {
  emailAddress: string;
}

export interface VerifyResetCodeRequest {
  emailAddress: string;
  code: string;
}

export interface CompletePasswordResetRequest {
  emailAddress: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  adminEmailAddress: string;
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
  emailAddress: string;
}

export interface ResendVerificationRequest {
  emailAddress: string;
}

// User related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  emailAddress: string;
  emailVerifiedAt?: string;
  phoneNumber?: string;
  linkedinUrl?: string;
  biography?: string;
  profileImage?: string;
  role: "student" | "mentor" | "admin";
  status: "active" | "inactive" | "suspended";
  academicProfile?: AcademicProfile;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicProfile {
  yearOfStudy: string;
  gcseResult: string;
  casperScore: string;
  aLevelGrades: Array<{
    subject: string;
    grade: string;
  }>;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  linkedin_url?: string;
  biography?: string;
  profile_image?: File | string;
}

export interface UpdateAcademicProfileRequest {
  year_of_study?: string;
  gcse_result?: string;
  ucat_score?: string;
  biology_grade?: string;
  chemistry_grade?: string;
  other_subject?: string;
  other_subject_grade?: string;
  target_universities?: string[];
  career_interests?: string[];
}

// Application related types
export interface Application {
  id: string;
  user_id: string;
  university_id: string;
  course_id: string;
  status:
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlisted";
  submitted_at?: string;
  university: University;
  course: Course;
  documents: ApplicationDocument[];
  created_at: string;
  updated_at: string;
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type:
  | "personal_statement"
  | "cv"
  | "transcript"
  | "reference_letter"
  | "other";
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface CreateApplicationRequest {
  university_id: string;
  course_id: string;
}

export interface UploadDocumentRequest {
  application_id: string;
  document_type: string;
  file: File;
}

// University and Course related types
export interface University {
  id: string;
  name: string;
  code: string;
  location: string;
  website_url?: string;
  logo_url?: string;
  description?: string;
  ranking?: number;
  courses: Course[];
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  university_id: string;
  name: string;
  code: string;
  degree_type: "undergraduate" | "postgraduate" | "doctorate";
  duration_years: number;
  entry_requirements: string;
  description?: string;
  fees_domestic?: number;
  fees_international?: number;
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

// Mentorship related types
export interface Mentor {
  id: string;
  user_id: string;
  specialization: string[];
  experience_years: number;
  education_background: string;
  current_position?: string;
  availability_status: "available" | "busy" | "unavailable";
  rating: number;
  total_mentees: number;
  user: User;
  created_at: string;
  updated_at: string;
}

export interface MentorshipRequest {
  id: string;
  mentee_id: string;
  mentor_id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  message: string;
  response_message?: string;
  created_at: string;
  updated_at: string;
  mentee: User;
  mentor: Mentor;
}

export interface CreateMentorshipRequestRequest {
  mentor_id: string;
  message: string;
}

// Community and Resources related types
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "video" | "article" | "template" | "webinar";
  category: string;
  tags: string[];
  file_url?: string;
  external_url?: string;
  thumbnail_url?: string;
  author_id?: string;
  is_premium: boolean;
  view_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  author: User;
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  author: User;
  is_liked?: boolean;
  replies?: Comment[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

export interface CreateCommentRequest {
  post_id: string;
  content: string;
  parent_id?: string;
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  type:
  | "application_update"
  | "mentorship_request"
  | "community_activity"
  | "system_announcement";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface UniversityFilters extends SearchFilters {
  location?: string;
  ranking_min?: number;
  ranking_max?: number;
}

export interface CourseFilters extends SearchFilters {
  university_id?: string;
  degree_type?: string;
  duration_years?: number;
  fees_max?: number;
}

export interface MentorFilters extends SearchFilters {
  specialization?: string[];
  experience_min?: number;
  rating_min?: number;
  availability_status?: string;
}

// File upload types
export interface FileUploadResponse extends BaseApiResponse {
  data: {
    file_path: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    url: string;
  };
}

export interface UploadProgressCallback {
  (progress: number): void;
}

// Student Management Types
export interface StudentQuery {
  searchKey?: string;
  platformMemberCategory?: string;
  platformMemberProfileStatus?: string;
  page?: number;
  perPage?: number;
}

export interface StudentMetricResponse {
  totalSummary: MemberMetric;
  bdsStudent: MemberMetric;
  nursingStudent: MemberMetric;
  hygieneTherapyStudent: MemberMetric;
}

export interface MemberMetric {
  category?: string;
  description: string;
  currentTotalCount: number;
  percentageChange: number;
  days: number;
}

export interface StudentRecord {
  sid: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  activationStatus: string;
  activationStatusDesc: string;
  dentalSchoolGateway: string;
  dateStamped: string;
}

export interface StudentDetail extends StudentRecord {
  phoneNumber: string;
  academicHistory?: Record<string, unknown>[];
  currentAcademicYear?: number;
  gcseResult?: string;
  ucatScore?: number;
  casperScore?: number;
  goals?: string;
  whyDentistry?: string;
}

export interface UpdateStatusPayload {
  status: string;
  reason?: string;
}

// Mentor Management Types
export interface MentorQuery {
  searchKey?: string;
  platformMemberCategory?: string;
  platformMemberProfileStatus?: string;
  verified?: boolean;
  page?: number;
  perPage?: number;
}

export interface MentorMetricResponse {
  totalSummary: MemberMetric;
  verifiedMentors: MemberMetric;
  pendingVerification: MemberMetric;
}

export interface MentorRecord {
  hid: string;
  mentorName: string;
  activationStatus: string;
  activationStatusDesc: string;
  verified: boolean;
  dentalSchoolGateway: string;
  dateStamped: string;
  action: string;
}

export interface MentorDetail {
  hid: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  activationStatus: string;
  activationStatusDesc: string;
  verified: boolean;
  dentalSchoolGateway: string;
  dateStamped: string;
  yearsInDentistry: number;
  dentalSchoolExperience: string;
  areaOfSpecialization: string;
  whyMentor: string;
  interviewDate: string;
  averageRating: number;
  totalReviews: number;
}

export interface VerifyMentorPayload {
  verify: boolean;
}
// Admin Content Management Types
export interface AdminUniversityQuery {
  searchKey?: string;
  dentalSchoolPathway?: string;
  page?: number;
  perPage?: number;
}

export interface AdminUniversityRecord {
  hid: string;
  name: string;
  location: string;
  ranking?: number;
  dentalSchoolPathway: string;
  createdAt: string;
}

export interface AdminUniversityDetail extends AdminUniversityRecord {
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface CreateUniversityPayload {
  name: string;
  description?: string;
  location?: string;
  logoUrl?: string;
  websiteUrl?: string;
  ranking?: number;
  dentalSchoolPathway?: string;
}

export interface AdminCourseQuery {
  searchKey?: string;
  universityId?: number;
  degreeType?: string;
  page?: number;
  perPage?: number;
}

export interface AdminCourseRecord {
  hid: string;
  courseName: string;
  degreeType: string;
  durationYears: number;
  universityName: string;
  createdAt: string;
}

export interface AdminCourseDetail extends AdminCourseRecord {
  universityHid: string;
  entryRequirements?: string;
  description?: string;
  feesDomestic?: number;
  feesInternational?: number;
  applicationDeadline?: string;
}

export interface CreateCoursePayload {
  universityHid: string;
  courseName: string;
  degreeType?: string;
  durationYears?: number;
  entryRequirements?: string;
  description?: string;
  feesDomestic?: number;
  feesInternational?: number;
  applicationDeadline?: string;
}

export interface AdminResourceQuery {
  searchKey?: string;
  dentalSchoolPathWay?: string;
  page?: number;
  perPage?: number;
}

export interface AdminResourceRecord {
  hid: string;
  title: string;
  dentalSchoolPathWay: string;
  authorName: string;
  academicYear: string;
  createdAt: string;
}

export interface AdminResourceDetail extends AdminResourceRecord {
  body: string;
  images?: string;
  imageCaption?: string;
}

export interface CreateResourcePayload {
  title: string;
  body: string;
  images?: string;
  imageCaption?: string;
  dentalSchoolPathWay?: string;
  authorName?: string;
  academicYear?: string;
}

// Admin Dashboard & Analytics Types
export interface MemberMetricResponseData {
  description: string;
  currentTotalCount: number;
  percentageChange: number;
  days: number;
}

export interface DashboardSummary {
  totalSummary: MemberMetricResponseData;
  studentSummary: MemberMetricResponseData;
  mentorSummary: MemberMetricResponseData;
  revenueSummary: MemberMetricResponseData;
}

export interface GrowthAnalytics {
  date: string;
  studentCount: number;
  mentorCount: number;
}

export interface GlobalActivity {
  userId: string;
  fullName: string;
  status: string;
  statusDesc: string;
  memberType: string;
  memberTypeDesc: string;
  action: string;
  timeAndDate: string;
}

// Admin Management Types
export interface AdminQuery {
  searchKey?: string;
  status?: string;
  activationStatus?: string;
  page?: number;
  perPage?: number;
}

export interface AdminRecord {
  username: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: string;
  activationStatus: string;
  rolesAndPermissions: PlatformRolePermissionMapping[];
}

// Role & Permission Management Types
export interface PlatformPermissionData {
  guid: string;
  name: string;
  description: string;
}

export interface PlatformRoleData {
  guid: string;
  name: string;
  description: string;
  users?: number;
}

export interface PlatformRolePermissionMapping extends PlatformRoleData {
  permissions: PlatformPermissionData[];
}

// Audit Log Types
export interface AuditQuery {
  action?: string;
  actor?: string;
  searchKey?: string;
  page?: number;
  perPage?: number;
}

export interface AuditData {
  guid: string;
  actor: string;
  action: string;
  actionMessage: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  actionDateTime: string;
}
