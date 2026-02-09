import Link from "next/link";

export type ClientProfilesPageProps = {
  profiles: any[];
};

export default async function ClientProfilesPage({
  profiles,
}: ClientProfilesPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Profiles
        </h1>
        <Link
          href="/profiles/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          + New Profile
        </Link>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No profiles found. Create your first profile to get started.
          </p>
          <Link
            href="/profiles/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Create Profile
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile: any) => (
            <Link
              key={profile.phoneNumber}
              href={`/profiles/${encodeURIComponent(profile.phoneNumber)}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {profile.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {profile.phoneNumber}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Caller Language
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {profile.sourceLanguageFriendly}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Callee Language
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {profile.calleeLanguageFriendly}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
