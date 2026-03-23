import { BaseAPI } from "@/src/connection/base-api";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  agreeToPrivacy: boolean;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

export const contactUsAPI = {
  submitContact: async (
    data: ContactFormData,
  ): Promise<ContactFormResponse> => {
    const api = new BaseAPI();
    await api.post("/generic/get-in-touch", {
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: data.email,
      phoneNumber: data.phone,
      country: "UNKNOWN",
      message: data.message,
    });
    return {
      success: true,
      message: "Your message has been received. We'll be in touch shortly!",
    };
  },
};

