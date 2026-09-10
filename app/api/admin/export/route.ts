import { NextResponse } from "next/server";
import { dbGetAdminLeads } from "@/lib/supabase/db";

export async function GET() {
  try {
    const { leads } = await dbGetAdminLeads({ limit: 10000 });

    const headers = [
      "Application No",
      "Full Name",
      "Email",
      "Phone",
      "Programme",
      "City",
      "State",
      "Status",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "GCLID",
      "FBCLID",
      "WhatsApp Notified",
      "Verified At",
      "Created At",
    ];

    const escapeCsv = (str?: string | boolean | null) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = leads.map((l) => [
      escapeCsv(l.application_no || "N/A"),
      escapeCsv(l.full_name),
      escapeCsv(l.email),
      escapeCsv(l.phone),
      escapeCsv(l.programme_name),
      escapeCsv(l.city),
      escapeCsv(l.state),
      escapeCsv(l.status),
      escapeCsv(l.utm_source),
      escapeCsv(l.utm_medium),
      escapeCsv(l.utm_campaign),
      escapeCsv(l.gclid),
      escapeCsv(l.fbclid),
      escapeCsv(l.whatsapp_notified ? "Yes" : "No"),
      escapeCsv(l.verified_at || ""),
      escapeCsv(l.created_at),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="pssou_leads_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("CSV Export error:", err);
    return NextResponse.json({ success: false, error: "CSV Export failed" }, { status: 500 });
  }
}
