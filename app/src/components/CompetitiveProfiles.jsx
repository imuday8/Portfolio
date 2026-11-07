import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Activity, Code2, Star } from "lucide-react";
import { siCodeforces, siGithub, siLeetcode } from "simple-icons";
import { portfolioData } from "../data/portfolioData.js";

const CACHE_KEY = "uday-public-profile-stats-v3";
const MAX_CACHE_AGE = 6 * 60 * 60 * 1000;
const verifiedAt = `${portfolioData.profiles.leetcode.verifiedAt}T00:00:00.000Z`;
const dateLabel = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
const number = (value) => new Intl.NumberFormat("en-IN").format(value);

function AnimatedNumber({ value, format = number }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || !("IntersectionObserver" in window)) {
      node.textContent = format(value);
      return undefined;
    }
    let frame = 0;
    let startedAt = 0;
    let played = false;
    const duration = 720;
    const draw = (now) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = format(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        frame = requestAnimationFrame(draw);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, format]);
  return (
    <span ref={ref} aria-label={format(value)}>
      0
    </span>
  );
}

function BrandMark({ icon, label }) {
  return (
    <span className="profile-brand" aria-hidden="true" title={`${label} logo`}>
      <svg viewBox="0 0 24 24" focusable="false">
        <path d={icon.path} />
      </svg>
    </span>
  );
}

function readCache() {
  try {
    const value = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (value?.savedAt && Date.now() - value.savedAt < MAX_CACHE_AGE)
      return value;
  } catch {}
  return null;
}

async function fetchJson(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok)
    throw new Error(`Profile endpoint returned ${response.status}`);
  return response.json();
}

function usePublicStats() {
  const initial = {
    leetcode: {
      ...portfolioData.profiles.leetcode.stats,
      updatedAt: verifiedAt,
      mode: "snapshot",
    },
    codeforces: {
      ...portfolioData.profiles.codeforces.stats,
      updatedAt: verifiedAt,
      mode: "snapshot",
    },
    github: {
      ...portfolioData.profiles.github.stats,
      updatedAt: verifiedAt,
      mode: "snapshot",
    },
  };
  const [stats, setStats] = useState(initial);

  useEffect(() => {
    const updateFromRepositories = (event) => {
      const { publicRepos, updatedAt, mode } = event.detail || {};
      if (!Number.isFinite(publicRepos)) return;
      setStats((current) => ({
        ...current,
        github: {
          ...current.github,
          publicRepos,
          updatedAt: updatedAt || current.github.updatedAt,
          mode: mode === "live" ? "mixed" : mode || "snapshot",
        },
      }));
    };
    window.addEventListener(
      "portfolio:github-repositories",
      updateFromRepositories,
    );
    return () =>
      window.removeEventListener(
        "portfolio:github-repositories",
        updateFromRepositories,
      );
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached?.stats) {
      setStats((current) => ({ ...current, ...cached.stats }));
      return undefined;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4200);
    const tasks = [
      Promise.all([
        fetchJson(
          `${portfolioData.profiles.codeforces.apiUrl}/user.info?handles=${encodeURIComponent(portfolioData.profiles.codeforces.handle)}`,
          controller.signal,
        ),
        fetchJson(
          `${portfolioData.profiles.codeforces.apiUrl}/user.rating?handle=${encodeURIComponent(portfolioData.profiles.codeforces.handle)}`,
          controller.signal,
        ),
      ]).then(([userData, ratingData]) => {
        const user = userData.result?.[0];
        if (!user || userData.status !== "OK" || ratingData.status !== "OK")
          throw new Error("Codeforces profile unavailable");
        return {
          codeforces: {
            rating: user.rating,
            maxRating: user.maxRating,
            rank: user.rank,
            maxRank: user.maxRank,
            ratedContests: ratingData.result.length,
            contestHistory: ratingData.result.map((contest) => ({
              contestId: contest.contestId,
              contestName: contest.contestName,
              rank: contest.rank,
              oldRating: contest.oldRating,
              newRating: contest.newRating,
              date: contest.ratingUpdateTimeSeconds,
            })),
            updatedAt: new Date().toISOString(),
            mode: "live",
          },
        };
      }),
    ];
    Promise.allSettled(tasks)
      .then((results) => {
        if (controller.signal.aborted) return;
        const fresh = results
          .filter((result) => result.status === "fulfilled")
          .reduce((acc, result) => ({ ...acc, ...result.value }), {});
        if (!Object.keys(fresh).length) return;
        setStats((current) => ({ ...current, ...fresh }));
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ savedAt: Date.now(), stats: fresh }),
          );
        } catch {}
      })
      .catch(() => {});
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return stats;
}

function UpdateStamp({ stat }) {
  return (
    <span className="profile-updated">
      {stat.mode === "live"
        ? "LIVE API"
        : stat.mode === "mixed"
          ? "LIVE REPOSITORIES · SNAPSHOT FOLLOWERS"
          : stat.mode === "cached"
            ? "CACHED API DATA"
            : stat.mode === "stale"
              ? "SAVED API DATA · REFRESH UNAVAILABLE"
              : "PUBLIC SNAPSHOT"}{" "}
      · {dateLabel(stat.updatedAt)}
    </span>
  );
}

function GitHubUpdateStamp({ stat }) {
  const label =
    stat.mode === "mixed"
      ? "LIVE REPOSITORIES · PROFILE SNAPSHOT"
      : stat.mode === "cached"
        ? "CACHED REPOSITORY LIST · PROFILE SNAPSHOT"
        : stat.mode === "stale"
          ? "SAVED REPOSITORY LIST · PROFILE SNAPSHOT"
          : "PUBLIC PROFILE SNAPSHOT";
  return (
    <span className="profile-updated">
      {label} · {dateLabel(portfolioData.profiles.github.verifiedAt)}
    </span>
  );
}

function LeetCodeCard({ stat }) {
  const profile = portfolioData.profiles.leetcode;
  const solvedTotal = stat.solved;
  const easyWidth = `${(stat.easy / solvedTotal) * 100}%`;
  const mediumWidth = `${(stat.medium / solvedTotal) * 100}%`;
  const hardWidth = `${(stat.hard / solvedTotal) * 100}%`;
  const streakDots = Array.from({ length: stat.currentStreak }, (_, index) => {
    const progress = index / Math.max(1, stat.currentStreak - 1);
    return {
      x: 10 + progress * 340,
      y: 31 + Math.sin(progress * Math.PI * 2.2) * 10,
    };
  });
  return (
    <a
      className="profile-card profile-card-leetcode"
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open LeetCode profile ${profile.handle}; ${number(solvedTotal)} problems solved, current streak ${stat.currentStreak} days`}
    >
      <div className="profile-card-head">
        <div className="profile-brand-lockup">
          <BrandMark icon={siLeetcode} label="LeetCode" />
          <span>
            <b>LEETCODE</b>
            <small>@{profile.handle}</small>
          </span>
        </div>
        <ArrowUpRight aria-hidden="true" size={17} />
      </div>
      <div className="leetcode-main-stat">
        <strong>
          <AnimatedNumber value={solvedTotal} />
        </strong>
        <span>problems solved</span>
      </div>
      <div
        className="solve-meter"
        role="img"
        aria-label={`${stat.easy} easy, ${stat.medium} medium, ${stat.hard} hard problems solved`}
      >
        <i className="easy-meter" style={{ width: easyWidth }} />
        <i className="medium-meter" style={{ width: mediumWidth }} />
        <i className="hard-meter" style={{ width: hardWidth }} />
      </div>
      <div className="solve-breakdown">
        <span>
          <i className="easy-dot" />
          Easy{" "}
          <b>
            <AnimatedNumber value={stat.easy} />
          </b>
        </span>
        <span>
          <i className="medium-dot" />
          Medium{" "}
          <b>
            <AnimatedNumber value={stat.medium} />
          </b>
        </span>
        <span>
          <i className="hard-dot" />
          Hard{" "}
          <b>
            <AnimatedNumber value={stat.hard} />
          </b>
        </span>
      </div>
      <svg
        className="streak-trail"
        viewBox="0 0 360 48"
        role="img"
        aria-label={`${stat.currentStreak} consecutive days in the current LeetCode streak`}
      >
        <title>Current LeetCode streak milestones</title>
        <path d="M10 31 C75 4 111 45 177 27 S282 8 350 31" />
        {streakDots.map((dot, index) => (
          <circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={index % 7 === 0 ? 2.2 : 1.5}
          />
        ))}
      </svg>
      <div className="profile-card-foot">
        <span>
          <Activity size={13} aria-hidden="true" />
          <b>
            <AnimatedNumber value={stat.currentStreak} />
          </b>{" "}
          day current streak{" "}
          <small>· {stat.activeDaysThisYear} active days in 2026</small>
        </span>
        <span>GLOBAL #{number(stat.globalRank)}</span>
      </div>
      <UpdateStamp stat={stat} />
    </a>
  );
}

function CodeforcesCard({ stat }) {
  const profile = portfolioData.profiles.codeforces;
  const rankColors = {
    newbie: "#9b98a1",
    pupil: "#89c79c",
    specialist: "#68c5a8",
    expert: "#85a9ff",
    "candidate master": "#bd82e8",
    master: "#f2b16d",
    "international master": "#f59d65",
    grandmaster: "#f07783",
  };
  const history = stat.contestHistory || [];
  const ratings = history.map((contest) => contest.newRating);
  const rawMin = ratings.length ? Math.min(...ratings) : 0;
  const rawMax = ratings.length ? Math.max(...ratings) : 0;
  const padding = Math.max(35, (rawMax - rawMin) * 0.14);
  const min = Math.max(0, rawMin - padding);
  const max = Math.max(min + 1, rawMax + padding);
  const points = history.map((contest, index) => ({
    x: 34 + (index / Math.max(1, history.length - 1)) * 282,
    y: 14 + ((max - contest.newRating) / (max - min)) * 72,
    rating: contest.newRating,
    contest,
  }));
  const chartPath = points
    .map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`)
    .join(" ");
  return (
    <a
      className="profile-card profile-card-codeforces"
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open Codeforces profile ${profile.handle}; rating ${stat.rating}, ${stat.ratedContests} rated contests`}
    >
      <div className="profile-card-head">
        <div className="profile-brand-lockup">
          <BrandMark icon={siCodeforces} label="Codeforces" />
          <span>
            <b>CODEFORCES</b>
            <small>@{profile.handle}</small>
          </span>
        </div>
        <ArrowUpRight aria-hidden="true" size={17} />
      </div>
      <div className="rating-stat">
        <strong>
          <AnimatedNumber value={stat.rating} />
        </strong>
        <span
          className="cf-rank"
          style={{ color: rankColors[stat.rank?.toLowerCase()] || "#c6c0ca" }}
        >
          {stat.rank}
        </span>
      </div>
      <div className="rating-track" aria-hidden="true">
        <i
          style={{
            width: `${Math.max(6, Math.min(100, (stat.rating / Math.max(stat.maxRating, 1)) * 100))}%`,
          }}
        />
      </div>
      <div className="profile-stat-pair">
        <span>
          <small>MAX RATING</small>
          <b>
            <AnimatedNumber value={stat.maxRating} />
          </b>
        </span>
        <span>
          <small>RATED CONTESTS</small>
          <b>
            <AnimatedNumber value={stat.ratedContests} />
          </b>
        </span>
        <span>
          <small>MAX RANK</small>
          <b className="rank-small">{stat.maxRank}</b>
        </span>
      </div>
      <div className="rating-history">
        <div className="rating-history-heading">
          <span className="mono-label">RATING / CONTEST HISTORY</span>
          <span className="mono-label">{history.length} CONTESTS</span>
        </div>
        {points.length > 1 ? (
          <svg
            className="rating-chart"
            viewBox="0 0 340 104"
            role="img"
            aria-label={`Codeforces rating from ${history[0].newRating} after the first rated contest to ${history.at(-1).newRating} after the latest, across ${history.length} rated contests`}
          >
            <title>Codeforces contest rating progression</title>
            <defs>
              <linearGradient id="ratingArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8ce2d8" stopOpacity=".7" />
                <stop offset="100%" stopColor="#8ce2d8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="34" y1="14" x2="316" y2="14" />
            <line x1="34" y1="86" x2="316" y2="86" />
            <text x="0" y="17">
              {Math.round(max)}
            </text>
            <text x="0" y="89">
              {Math.round(min)}
            </text>
            <path
              className="rating-chart-area"
              d={`${chartPath} L316,86 L34,86 Z`}
            />
            <path className="rating-chart-line" d={chartPath} />
            {points.map((point, index) => (
              <circle
                key={`${point.contest?.contestId}-${index}`}
                cx={point.x}
                cy={point.y}
                r="2.5"
              >
                <title>{`${point.contest?.contestName || "Rated contest"}: ${point.rating}, place ${point.contest?.rank}`}</title>
              </circle>
            ))}
            <text x="34" y="101">
              EARLIEST
            </text>
            <text x="282" y="101">
              LATEST
            </text>
          </svg>
        ) : (
          <p className="rating-history-empty">
            Contest history is not available from the public API right now.
          </p>
        )}
      </div>
      <GitHubUpdateStamp stat={stat} />
    </a>
  );
}

function GithubCard({ stat }) {
  const profile = portfolioData.profiles.github;
  return (
    <a
      className="profile-card profile-card-github"
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open GitHub profile ${profile.handle}; ${stat.publicRepos} public repositories, ${stat.followers} followers`}
    >
      <div className="profile-card-head">
        <div className="profile-brand-lockup">
          <BrandMark icon={siGithub} label="GitHub" />
          <span>
            <b>GITHUB</b>
            <small>@{profile.handle}</small>
          </span>
        </div>
        <ArrowUpRight aria-hidden="true" size={17} />
      </div>
      <div className="github-stat-row">
        <span>
          <Code2 size={15} aria-hidden="true" />
          <b>
            <AnimatedNumber value={stat.publicRepos} />
          </b>
          <small>public repositories</small>
        </span>
        <span>
          <Star size={15} aria-hidden="true" />
          <b>
            <AnimatedNumber value={stat.followers} />
          </b>
          <small>followers</small>
        </span>
      </div>
      <div className="github-card-note">
        A working record of things built, learned, and shared.
      </div>
      <UpdateStamp stat={stat} />
    </a>
  );
}

export default function CompetitiveProfiles() {
  const stats = usePublicStats();
  const leetcode = stats.leetcode;
  const codeforces = stats.codeforces;
  const github = stats.github;
  return (
    <section
      className="profiles section-frame content-section"
      id="profiles"
      aria-labelledby="profiles-title"
    >
      <div className="section-eyebrow" data-reveal>
        <span className="mono-label">04 / CODING PRACTICE</span>
        <span className="section-count mono-label">04 — 08</span>
      </div>
      <div className="section-title-row profile-heading" data-reveal>
        <div>
          <p className="mono-label profile-kicker">
            ALGORITHMS / PROBLEM SOLVING / CONSISTENCY / GROWTH
          </p>
          <h2 className="section-title" id="profiles-title">
            Beyond the <em>code.</em>
          </h2>
        </div>
        <p className="section-deck">
          Real public profiles, real counts. This is the work behind the
          interfaces.
        </p>
      </div>
      <div
        className="glance-strip"
        data-reveal
        aria-label="Developer highlights"
      >
        <span className="glance-label mono-label">DEVELOPER AT A GLANCE</span>
        <span>
          <b>
            <AnimatedNumber value={leetcode.solved} />
          </b>
          <small>LeetCode solved</small>
        </span>
        <span>
          <b>
            <AnimatedNumber value={leetcode.currentStreak} />
          </b>
          <small>day streak</small>
        </span>
        <span>
          <b>
            <AnimatedNumber value={codeforces.rating} />
          </b>
          <small>CF rating</small>
        </span>
        <span>
          <b>
            <AnimatedNumber value={github.publicRepos} />
          </b>
          <small>public repos</small>
        </span>
      </div>
      <div className="profile-grid" data-reveal>
        <LeetCodeCard stat={leetcode} />
        <CodeforcesCard stat={codeforces} />
        <GithubCard stat={github} />
      </div>
      <div className="featured-repositories" data-reveal>
        <span className="mono-label">A FEW OPEN TABS</span>
        <div>
          {portfolioData.profiles.github.featured.map((repo) => (
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              key={repo.name}
            >
              <span>
                <b>{repo.name}</b>
                <small>{repo.description}</small>
              </span>
              <span className="repo-language">
                <i />
                {repo.language}
              </span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <p className="profile-source-note mono-label">
        LEETCODE DATA FROM PUBLIC PROFILE · CODEFORCES AND GITHUB REFRESHED FROM
        PUBLIC APIS · CODECHEF AND GEEKSFORGEEKS OMITTED UNTIL A HANDLE IS
        PROVIDED
      </p>
    </section>
  );
}
