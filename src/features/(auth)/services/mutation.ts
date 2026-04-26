import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ApiResponse } from "@/src/connection/api-types";
import { authApi } from "./api";
import { authCookies } from "@/src/lib/cookies";
import { useAuth } from "@/src/providers/auth-provider";
import type {
  OAuth2SignupRequest,
  SignupRequest,
  LoginRequest,
  LoginResponseData,
  ProfileSetupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendCodeRequest,
} from "../type";

export const useSignup = () => {
  const router = useRouter();

  return useMutation<ApiResponse<string>, Error, SignupRequest>({
    mutationKey: ["auth", "signup"],
    mutationFn: authApi.SIGNUP,
    onSuccess: (data) => {
      if (data.responseCode === "00") {
        toast.success(
          "Account created successfully! Please check your email to verify your account.",
        );
        router.push("/login");
      } else {
        toast.error(data.responseMessage || "Signup failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
  });
};

export const useOAuth2Signup = () => {
  const router = useRouter();

  return useMutation<ApiResponse<string>, Error, OAuth2SignupRequest>({
    mutationKey: ["auth", "oauth2-signup"],
    mutationFn: authApi.OAUTH2_SIGNUP,
    onSuccess: (data) => {
      if (data.responseCode === "00") {
        toast.success("Account created successfully! Welcome to Dentispark!");
        router.push("/profile-setup");
      } else {
        toast.error(
          data.responseMessage || "OAuth signup failed. Please try again.",
        );
      }
    },
    onError: (error) => {
      console.error("OAuth2 signup error:", error);
    },
  });
};

// Unified Login Hook
export const useUnifiedLogin = () => {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation<ApiResponse<LoginResponseData>, Error, LoginRequest>({
    mutationKey: ["auth", "login"],
    mutationFn: async (data: LoginRequest) => {
      // Normalize email to fix Item 9: Case-sensitive login
      const normalizedData = {
        ...data,
        emailAddress: data.emailAddress.toLowerCase().trim()
      };

      try {
        // Try Admin login first
        const response = await authApi.ADMIN_LOGIN(normalizedData);

        // If successful, return immediately
        if (response.responseCode === "00") {
          return response;
        }

        // If admin record not found (03) or unauthorized (97), try regular member login
        if (response.responseCode === "03" || response.responseCode === "97") {
          return await authApi.LOGIN(normalizedData);
        }

        // Otherwise return the admin failure response (which onSuccess will handle)
        return response;
      } catch (_error: unknown) {
        // If there was a network/structural error in the admin call, fallback to student login as a last resort
        return await authApi.LOGIN(normalizedData);
      }
    },
    onSuccess: async (data) => {
      if (data.responseCode === "00") {
        const { auth, ...userRest } = data.responseData;

        // Securely set the accessToken as HttpOnly via the server API
        await authCookies.setAccessToken(auth.accessToken, auth.tokenExpiredAt);
        
        // Strip the token from userData before saving to client-side cookies
        const safeUserData = {
            ...userRest,
            auth: {
                tokenExpiredAt: auth.tokenExpiredAt
                // accessToken is NOT included here
            }
        };

        authCookies.setUserData(safeUserData);
        login(data.responseData); // Note: internal state can still have the token

        const memberType = data.responseData.memberType;
        if (memberType === "PLATFORM_ADMIN" || memberType === "PLATFORM_SYSTEM") {
          toast.success("Admin login successful!");
          router.push("/admin");
        } else {
          toast.success("Login successful! Welcome back to Dentispark!");
          router.push("/overview");
        }
      } else {
        toast.error(
          data.responseMessage ||
          "Login failed. Please check your credentials and try again.",
        );
      }
    },
    onError: (error: unknown) => {
      console.error("Login error:", error);
      const err = error as { message?: string };
      toast.error(
        err?.message ||
        "An error occurred during login. Please try again."
      );
    },
  });
};

export const useProfileSetup = () => {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation<ApiResponse<string>, Error, ProfileSetupRequest>({
    mutationKey: ["auth", "profile-setup"],
    mutationFn: authApi.PROFILE_SETUP,
    onSuccess: async (data) => {
      if (data.responseCode === "00") {
        const currentUserData = authCookies.getUserData() as LoginResponseData;
        if (currentUserData) {
          const updatedUserData: LoginResponseData = {
            ...currentUserData,
            profileStatus: "COMPLETED",
          };

          authCookies.setUserData(updatedUserData);
          
          // Re-sync secure cookies if needed
          if (updatedUserData.auth?.accessToken) {
            await authCookies.setAccessToken(
                updatedUserData.auth.accessToken, 
                updatedUserData.auth.tokenExpiredAt,
                updatedUserData
            );
          }

          login(updatedUserData);
        }

        toast.success(
          data.responseMessage || "Profile setup completed successfully!",
        );
        router.push("/overview");
      } else {
        toast.error(
          data.responseMessage || "Profile setup failed. Please try again.",
        );
      }
    },
    onError: (error) => {
      console.error("Profile setup error:", error);
      toast.error("An error occurred during profile setup. Please try again.");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<ApiResponse<string>, Error, ForgotPasswordRequest>({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: authApi.FORGOT_PASSWORD,
    onSuccess: (data) => {
      if (data.responseCode === "00") {
        toast.success(
          data.responseMessage ||
          "Password reset instructions have been sent to your email.",
        );
      } else {
        toast.error(
          data.responseMessage ||
          "Failed to send reset instructions. Please try again.",
        );
      }
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again.");
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation<ApiResponse<string>, Error, ResetPasswordRequest>({
    mutationKey: ["auth", "reset-password"],
    mutationFn: authApi.RESET_PASSWORD,
    onSuccess: (data) => {
      if (data.responseCode === "00") {
        toast.success(
          data.responseMessage ||
          "Password reset successfully! You can now log in with your new password.",
        );
        router.push("/login");
      } else {
        toast.error(
          data.responseMessage || "Failed to reset password. Please try again.",
        );
      }
    },
    onError: (error) => {
      console.error("Reset password error:", error);
      toast.error(
        "An error occurred while resetting your password. Please try again.",
      );
    },
  });
};

export const useVerifyEmail = () => {
  const router = useRouter();

  return useMutation<ApiResponse<string>, Error, VerifyEmailRequest>({
    mutationKey: ["auth", "verify-email"],
    mutationFn: authApi.VERIFY_EMAIL,
    onSuccess: (data) => {
      if (data.responseCode === "00") {
        toast.success(
          data.responseMessage ||
          "Email verified successfully! You can now log in to your account.",
        );
        router.push("/login");
      } else {
        toast.error(
          data.responseMessage ||
          "Failed to verify email. Please check your code and try again.",
        );
      }
    },
    onError: (error) => {
      console.error("Verify email error:", error);
      toast.error(
        "An error occurred while verifying your email. Please try again.",
      );
    },
  });
};

export const useResendCode = () => {
  return useMutation<ApiResponse<string>, Error, ResendCodeRequest>({
    mutationKey: ["auth", "resend-code"],
    mutationFn: authApi.RESEND_CODE,
    onSuccess: (data) => {
      if (data.responseCode === "00") {
        toast.success(
          data.responseMessage ||
          "Verification code has been resent to your email.",
        );
      } else {
        toast.error(
          data.responseMessage ||
          "Failed to resend verification code. Please try again.",
        );
      }
    },
    onError: (error) => {
      console.error("Resend code error:", error);
      toast.error("An error occurred. Please try again.");
    },
  });
};
