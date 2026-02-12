import { listProfiles } from "@/lib/dynamodb";
import ClientProfilesPage from "../components/pages/profiles";
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';

export default async function ProfilesPage() {
  const session = await getServerSession();
  const owner = session?.user?.email || undefined;
  const profiles = await listProfiles(owner);

  return <ClientProfilesPage profiles={profiles} />;
}
