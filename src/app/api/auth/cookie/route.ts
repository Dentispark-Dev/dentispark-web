import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * API route to securely set HttpOnly cookies from the server side.
 * This prevents XSS attacks from stealing the access token.
 */
export async function POST(request: Request) {
  try {
    const { accessToken, expiresAt, userData } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const expiresDate = new Date(expiresAt);

    // Set the accessToken as HttpOnly and Secure
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresDate,
      path: "/",
      domain: ".dentispark.com",
    });

    // We can also set the userData as a JS-accessible cookie for the UI
    if (userData) {
        cookieStore.set("userData", JSON.stringify(userData), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: expiresDate,
            path: "/",
            domain: ".dentispark.com",
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting secure cookie:", error);
    return NextResponse.json(
      { error: "Failed to set secure cookie" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    
    // Clear the secure cookies
    cookieStore.delete({ name: "accessToken", path: "/", domain: ".dentispark.com" });
    cookieStore.delete({ name: "userData", path: "/", domain: ".dentispark.com" });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear cookies" },
      { status: 500 }
    );
  }
}
