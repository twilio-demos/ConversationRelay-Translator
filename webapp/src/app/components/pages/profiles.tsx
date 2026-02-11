import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ClientProfilesPageProps = {
  profiles: any[];
};

export default async function ClientProfilesPage({
  profiles,
}: ClientProfilesPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Profiles</h1>
        <Button asChild>
          <Link href="/profiles/new">+ New Profile</Link>
        </Button>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No profiles found. Create your first profile to get started.
            </p>
            <Button asChild>
              <Link href="/profiles/new">Create Profile</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile: any) => (
            <Link
              key={profile.phoneNumber}
              href={`/profiles/${encodeURIComponent(profile.phoneNumber)}`}
              className="block transition-shadow hover:shadow-lg">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription>{profile.phoneNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Caller Language</p>
                      <p className="font-medium">
                        {profile.sourceLanguageFriendly}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Callee Language</p>
                      <p className="font-medium">
                        {profile.calleeLanguageFriendly}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
