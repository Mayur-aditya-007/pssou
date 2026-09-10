import { NextRequest, NextResponse } from "next/server";
import { dbGetAdminLeads, dbUpdateLeadStatus } from "@/lib/supabase/db";
import { LeadStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const programmeId = searchParams.get("programmeId") || undefined;
    const campaign = searchParams.get("campaign") || undefined;
    const source = searchParams.get("source") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const result = await dbGetAdminLeads({
      page,
      limit,
      search,
      status,
      programmeId,
      campaign,
      source,
      startDate,
      endDate,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("Admin leads API error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin leads" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, status } = body as { leadId: string; status: LeadStatus };

    if (!leadId || !status) {
      return NextResponse.json(
        { success: false, error: "Lead ID and status are required" },
        { status: 400 }
      );
    }

    const updated = await dbUpdateLeadStatus(leadId, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Lead status updated" });
  } catch (err) {
    console.error("Error updating lead status:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update lead status" },
      { status: 500 }
    );
  }
}
