import { NextRequest, NextResponse } from "next/server";
import { getProfile, putProfile, deleteProfile } from "@/lib/dynamodb";
import { UserProfile } from "@/types/profile";

// GET /api/profiles/[phoneNumber] - Get a specific profile
export async function GET(
  request: NextRequest,
  { params }: { params: { phoneNumber: string } }
) {
  try {
    const phoneNumber = decodeURIComponent(params.phoneNumber);
    const profile = await getProfile(phoneNumber);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error getting profile:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}

// PUT /api/profiles/[phoneNumber] - Update a profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { phoneNumber: string } }
) {
  try {
    const phoneNumber = decodeURIComponent(params.phoneNumber);
    const profile: UserProfile = await request.json();

    // Ensure phone number matches
    if (profile.phoneNumber !== phoneNumber) {
      return NextResponse.json(
        { error: "Phone number mismatch" },
        { status: 400 }
      );
    }

    await putProfile(profile);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// DELETE /api/profiles/[phoneNumber] - Delete a profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: { phoneNumber: string } }
) {
  try {
    const phoneNumber = decodeURIComponent(params.phoneNumber);
    await deleteProfile(phoneNumber);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
