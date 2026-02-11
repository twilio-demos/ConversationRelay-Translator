"use client";

import { useSessions } from "@/hooks/use-sessions";
import { Session } from "@/types/profile";
import Link from "next/link";
import { useState } from "react";

export type ClientSessionsPageProps = {
  serverSessions: Session[];
};

export default function ClientSessionsPage({
  serverSessions,
}: ClientSessionsPageProps) {
  const { sessions } = useSessions(serverSessions);
  const [sortBy, setSortBy] = useState<"recent" | "caller" | "callee">(
    "recent"
  );

  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortBy === "recent") {
      return (b.expireAt || 0) - (a.expireAt || 0);
    }
    if (sortBy === "caller") {
      return (a.name || "").localeCompare(b.name || "");
    }
    if (sortBy === "callee") {
      return (a.calleeNumber || "").localeCompare(b.calleeNumber || "");
    }
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Call Sessions
        </h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "recent" | "caller" | "callee")
            }
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm">
            <option value="recent">Most Recent</option>
            <option value="caller">Caller Name</option>
            <option value="callee">Callee Number</option>
          </select>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            No call sessions found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session) => (
            <SessionCard key={session.connectionId} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
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
              <Link
                href={`/conversations/${
                  session.parentConnectionId || session.connectionId
                }`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer hover:underline">
                View Conversation
              </Link>
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
                <p className="text-gray-600 dark:text-gray-400">Call SID</p>
                <p className="font-mono text-xs text-gray-900 dark:text-gray-100 truncate">
                  {session.callSid || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Caller (Source) Info */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Caller Settings
              </h4>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Language</dt>
                  <dd className="text-gray-900 dark:text-gray-100">
                    {session.sourceLanguageFriendly || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Voice</dt>
                  <dd className="text-gray-900 dark:text-gray-100">
                    {session.sourceVoice || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">
                    Transcription
                  </dt>
                  <dd className="text-gray-900 dark:text-gray-100">
                    {session.sourceTranscriptionProvider || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">
                    TTS Provider
                  </dt>
                  <dd className="text-gray-900 dark:text-gray-100">
                    {session.sourceTtsProvider || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Callee Info */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Callee Settings
              </h4>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Number</dt>
                  <dd className="text-gray-900 dark:text-gray-100">
                    {session.calleeNumber || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Language</dt>
                  <dd className="text-gray-900 dark:text-gray-100">
                    {session.calleeLanguageFriendly || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">Voice</dt>
                  <dd className="text-gray-900 dark:text-gray-100">
                    {session.calleeVoice || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600 dark:text-gray-400">
                    Transcription
                  </dt>
                  <dd className="text-gray-900 dark:text-gray-100">
                    {session.calleeTranscriptionProvider || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
