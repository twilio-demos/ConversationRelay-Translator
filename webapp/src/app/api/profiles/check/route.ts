import { Validator } from "@/lib/validator";
import { NextRequest, NextResponse } from "next/server";

// GET /api/profiles/check?phoneNumber=xxx - Check if phone number is already used
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = searchParams.get("phoneNumber");
    const handle = searchParams.get("handle");

    if (!phoneNumber && !handle) {
      return NextResponse.json(
        { error: "Check requires a field" },
        { status: 400 }
      );
    }

    const [phoneNumberUsed, handleUsed] = await Promise.all([
      Validator.checkPhoneNumberUsed(phoneNumber),
      Validator.checkFlexWorkerUsed(handle),
    ]);

    return NextResponse.json({ phoneNumberUsed, handleUsed });
  } catch (error) {
    console.error("Error checking phone number:", error);
    return NextResponse.json(
      { error: "Failed to check phone number" },
      { status: 500 }
    );
  }
}
