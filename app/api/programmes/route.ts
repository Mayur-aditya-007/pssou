import { NextResponse } from "next/server";
import { dbGetProgrammes } from "@/lib/supabase/db";

export async function GET() {
  try {
    const programmes = await dbGetProgrammes();
    return NextResponse.json({ success: true, data: programmes });
  } catch (err) {
    console.error("Error fetching programmes:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch programmes" },
      { status: 500 }
    );
  }
}
