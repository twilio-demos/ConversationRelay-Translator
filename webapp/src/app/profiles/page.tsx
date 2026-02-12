import { listProfiles } from "@/lib/dynamodb";
import { getServerSession } from "next-auth/next";
import ClientProfilesPage from "../components/pages/profiles";

export const dynamic = "force-dynamic";

export default async function ProfilesPage() {
  const session = await getServerSession();
  const owner =
    process.env.NEXT_PUBLIC_EMAIL || session?.user?.email || undefined;
  const profiles = await listProfiles(owner);

  return <ClientProfilesPage profiles={profiles} />;
}
