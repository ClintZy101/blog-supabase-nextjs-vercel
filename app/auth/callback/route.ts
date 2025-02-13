import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const origin = "https://nextjs-with-supabase-six-rosy.vercel.app"; // Replace with your deployed app URL
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (error) {
    return NextResponse.redirect(`${origin}/sign-in?error=${error}&error_description=${errorDescription}`);
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code); // Exchanges the code for a session
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // Redirect to the sign-in page after successful sign-up
  return NextResponse.redirect(`${origin}/sign-in`);
}
