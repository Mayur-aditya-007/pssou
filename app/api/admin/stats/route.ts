import { NextResponse } from "next/server";
import { dbGetAdminStats } from "@/lib/supabase/db";

export async function GET() {
  try {
    const stats = await dbGetAdminStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (err) {
    console.error("Admin stats API error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
