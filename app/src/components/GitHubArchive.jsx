import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Clock3, GitFork, Search, Star } from "lucide-react";
import { portfolioData } from "../data/portfolioData.js";

const CACHE_KEY = "uday-public-repositories-v1";
const CACHE_MAX_AGE = 6 * 60 * 60 * 1000;
const verifiedDemos = {
  Portfolio: "https://imuday8.github.io/Portfolio/",
  Hexamind: portfolioData.projects.hexamind.url,
};

function readCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (Array.isArray(cache?.repositories)) return cache;
  } catch {}
  return null;
}

function languageLabel(language) {
  return language || "Language not detected";
}

function publishCount(publicRepos, updatedAt, mode) {
  window.dispatchEvent(
    new CustomEvent("portfolio:github-repositories", {
      detail: { publicRepos, updatedAt, mode },
    }),
  );
}

export default function GitHubArchive() {
  const snapshot = portfolioData.profiles.github.publicRepositoriesSnapshot.map(
    (repo) => ({ ...repo, id: repo.name }),
  );
  const snapshotDate = `${portfolioData.profiles.github.repositoriesVerifiedAt}T00:00:00.000Z`;
  const [repositories, setRepositories] = useState(snapshot);
  const [updatedAt, setUpdatedAt] = useState(snapshotDate);
  const [mode, setMode] = useState("snapshot");
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All languages");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const cached = readCache();
    publishCount(snapshot.length, snapshotDate, "snapshot");
    if (cached) {
      setRepositories(cached.repositories);
      setUpdatedAt(cached.savedAt);
      const fresh = Date.now() - cached.savedAt < CACHE_MAX_AGE;
      setMode(fresh ? "cached" : "stale");
      publishCount(
        cached.repositories.length,
        cached.savedAt,
        fresh ? "cached" : "stale",
      );
      if (fresh) return undefined;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 9000);
    fetch(portfolioData.profiles.github.repositoriesApiUrl, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data))
          throw new Error("GitHub returned invalid data");
        const publicRepositories = data
          .filter((repo) => repo && repo.private === false && repo.name)
          .map((repo) => ({
            id: repo.id ?? repo.name,
            name: repo.name,
            description: repo.description || "",
            language: repo.language || "",
            stars: Number(repo.stargazers_count) || 0,
            updatedAt: repo.updated_at,
            url: repo.html_url,
            fork: Boolean(repo.fork),
            archived: Boolean(repo.archived),
          }))
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const savedAt = Date.now();
        setRepositories(publicRepositories);
        setUpdatedAt(savedAt);
        setMode("live");
        publishCount(publicRepositories.length, savedAt, "live");
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ savedAt, repositories: publicRepositories }),
          );
        } catch {}
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setMode(cached ? "stale" : "snapshot-error");
      });
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  const languages = useMemo(
    () =>
      [
        ...new Set(repositories.map((repo) => languageLabel(repo.language))),
      ].sort(),
    [repositories],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return repositories.filter((repo) => {
      const matchesLanguage =
        language === "All languages" ||
        languageLabel(repo.language) === language;
      const matchesQuery =
        !normalized ||
        `${repo.name} ${repo.description} ${repo.language}`
          .toLowerCase()
          .includes(normalized);
      return matchesLanguage && matchesQuery;
    });
  }, [repositories, query, language]);

  const statusLabel =
    mode === "live"
      ? "LIVE FROM GITHUB"
      : mode === "cached"
        ? "CACHED API LIST"
        : mode === "stale"
          ? "SAVED API LIST · REFRESH UNAVAILABLE"
          : mode === "snapshot"
            ? "VERIFIED PUBLIC SNAPSHOT"
            : mode === "snapshot-error"
              ? "VERIFIED SNAPSHOT · API REFRESH UNAVAILABLE"
              : mode === "error"
                ? "GITHUB API UNAVAILABLE"
                : "REFRESHING PUBLIC REPOSITORIES";

  return (
    <section
      className="github-archive section-frame content-section"
      id="github"
      aria-labelledby="github-title"
    >
      <div className="section-eyebrow" data-reveal>
        <span className="mono-label">05 / THE OPEN REPOSITORY</span>
        <span className="section-count mono-label">05 — 08</span>
      </div>
      <div className="section-title-row archive-heading" data-reveal>
        <div>
          <p className="mono-label archive-kicker">
            A LIVE WINDOW INTO THE PUBLIC ACCOUNT
          </p>
          <h2 className="section-title" id="github-title">
            A universe of <em>small starts.</em>
          </h2>
        </div>
        <div className="archive-count" aria-live="polite">
          <strong>{repositories.length.toString().padStart(2, "0")}</strong>
          <span className="mono-label">PUBLIC REPOSITORIES</span>
        </div>
      </div>
      <div className="archive-console" data-reveal>
        <div className="archive-console-top">
          <div className="archive-status">
            <span
              className={`archive-pip archive-pip-${mode}`}
              aria-hidden="true"
            />
            <span className="mono-label" role="status">
              {statusLabel}
            </span>
            {updatedAt && (
              <time
                className="mono-label"
                dateTime={new Date(updatedAt).toISOString()}
              >
                UPDATED{" "}
                {new Intl.DateTimeFormat("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(updatedAt))}
              </time>
            )}
          </div>
          <a
            href={portfolioData.profiles.github.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open GitHub <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="archive-tools">
          <label className="archive-search">
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">Search repositories</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a repository or technology"
            />
          </label>
          <label className="archive-language">
            <span className="mono-label">LANGUAGE</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option>All languages</option>
              {languages.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        {repositories.length > 0 ? (
          <div className="archive-list" aria-live="polite">
            {filtered.map((repo, index) => (
              <article className="archive-repo" key={repo.id}>
                <span className="archive-index mono-label">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="archive-repo-main">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="archive-repo-name"
                  >
                    {repo.name}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                  <p>
                    {repo.description ||
                      "No description supplied for this repository."}
                  </p>
                  {(repo.fork || repo.archived) && (
                    <div className="archive-flags">
                      {repo.fork && (
                        <span>
                          <GitFork size={11} aria-hidden="true" /> Fork
                        </span>
                      )}
                      {repo.archived && <span>Archived</span>}
                    </div>
                  )}
                </div>
                <div className="archive-repo-meta">
                  <span className="archive-language-chip">
                    <i
                      data-language={repo.language || "none"}
                      aria-hidden="true"
                    />
                    {languageLabel(repo.language)}
                  </span>
                  <span className="archive-stars">
                    <Star size={12} aria-hidden="true" /> {repo.stars}
                  </span>
                  <time dateTime={repo.updatedAt} title="Last updated">
                    <Clock3 size={12} aria-hidden="true" />
                    {new Intl.DateTimeFormat("en-IN", {
                      month: "short",
                      year: "numeric",
                    }).format(new Date(repo.updatedAt))}
                  </time>
                </div>
                {verifiedDemos[repo.name] && (
                  <a
                    className="archive-demo"
                    href={verifiedDemos[repo.name]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}
            {!filtered.length && (
              <p className="archive-empty">
                No public repositories match those filters.
              </p>
            )}
          </div>
        ) : mode === "error" ? (
          <div className="archive-empty archive-error">
            <p>
              GitHub’s public API is not responding, and no saved public list is
              available.
            </p>
            <a
              href={portfolioData.profiles.github.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse the public profile{" "}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => {
                setMode("loading");
                setAttempt((value) => value + 1);
              }}
            >
              Try again
            </button>
          </div>
        ) : (
          <p className="archive-empty">Loading the current public list…</p>
        )}
        <p className="archive-footnote mono-label">
          PUBLIC REPOSITORY METADATA ONLY · PRIVATE REPOSITORIES ARE NEVER
          REQUESTED · LANGUAGE AND STAR COUNTS FOLLOW GITHUB
        </p>
      </div>
    </section>
  );
}
