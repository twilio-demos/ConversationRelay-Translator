"use client";

import { ProfileForm } from "@/components/ProfileForm";
import { UserProfile } from "@/types/profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NewProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (profile: UserProfile) => {
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          creator: process.env.NEXT_PUBLIC_EMAIL || session?.user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      router.push("/profiles");
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Create New Profile
      </h1>
      <ProfileForm onSubmit={handleSubmit} />
    </div>
  );
}
