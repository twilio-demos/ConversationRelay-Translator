import { listProfiles, listSessions } from "@/lib/dynamodb";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profiles = await listProfiles();
  const sessions = await listSessions();

  const previewProfiles = profiles.slice(0, 3);
  const previewSessions = sessions
    .sort((a, b) => (b.expireAt || 0) - (a.expireAt || 0))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          ConversationRelay Translator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage translation profiles and view call sessions
        </p>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            User Profiles
          </h2>
          <div className="flex gap-3">
            <Link
              href="/profiles/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              + New Profile
            </Link>
            <Link
              href="/profiles"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              View All
            </Link>
          </div>
        </div>

        {previewProfiles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {previewProfiles.map((profile: any) => (
              <Link
                key={profile.phoneNumber}
                href={`/profiles/${encodeURIComponent(profile.phoneNumber)}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                  {profile.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {profile.phoneNumber}
                </p>
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Caller: {profile.sourceLanguageFriendly}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Callee: {profile.calleeLanguageFriendly}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Recent Call Sessions
          </h2>
          <Link
            href="/sessions"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            View All
          </Link>
        </div>

        {previewSessions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300">
              No call sessions found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {previewSessions.map((session: any) => (
              <div
                key={session.connectionId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {session.name || "Unknown Caller"}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          session.callStatus === "connected"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        }`}>
                        {session.callStatus || "unknown"}
                      </span>
                      {session.whichParty && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {session.whichParty}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Connection ID
                        </p>
                        <p className="font-mono text-xs text-gray-900 dark:text-gray-100 truncate">
                          {session.connectionId}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Callee Number
                        </p>
                        <p className="text-xs text-gray-900 dark:text-gray-100">
                          {session.calleeNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/conversations/${
                      session.parentConnectionId || session.connectionId
                    }`}
                    className="ml-4 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
