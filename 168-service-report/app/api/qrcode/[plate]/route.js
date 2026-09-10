import QRCode from "qrcode";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const plate = decodeURIComponent(params.plate);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const targetUrl = `${baseUrl}/vehicle/${encodeURIComponent(plate)}`;

  const buffer = await QRCode.toBuffer(targetUrl, {
    width: 512,
    margin: 2,
    color: { dark: "#14181C", light: "#FFFFFF" },
  });

  const { searchParams } = new URL(request.url);
  const headers = { "Content-Type": "image/png" };
  if (searchParams.get("download")) {
    headers["Content-Disposition"] = `attachment; filename="QRCode-${plate}.png"`;
  }

  return new NextResponse(buffer, { headers });
}
