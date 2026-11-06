import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Activity, Code2, Star } from "lucide-react";
import { siCodeforces, siGithub, siLeetcode } from "simple-icons";
import { portfolioData } from "../data/portfolioData.js";

const CACHE_KEY = "uday-public-profile-stats-v1";
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
    const cached = readCache();
    if (cached?.stats) {
      setStats((current) => ({ ...current, ...cached.stats }));
      return undefined;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4200);
    const tasks = [
      fetchJson(portfolioData.profiles.github.apiUrl, controller.signal).then(
        (data) => ({
          github: {
            publicRepos: data.public_repos,
            followers: data.followers,
            updatedAt: new Date().toISOString(),
            mode: "live",
          },
        }),
      ),
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
        const next = { ...initial, ...fresh };
        setStats(next);
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
      {stat.mode === "live" ? "LIVE API" : "PUBLIC SNAPSHOT"} ·{" "}
      {dateLabel(stat.updatedAt)}
    </span>
  );
}

function LeetCodeCard({ stat }) {
  const profile = portfolioData.profiles.leetcode;
  const solvedTotal = stat.solved;
  const easyWidth = `${(stat.easy / solvedTotal) * 100}%`;
  const mediumWidth = `${(stat.medium / solvedTotal) * 100}%`;
  const hardWidth = `${(stat.hard / solvedTotal) * 100}%`;
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
        <span className="cf-rank">{stat.rank}</span>
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
      <UpdateStamp stat={stat} />
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
        <span className="mono-label">CHAPTER 02 / DEVELOPER AT A GLANCE</span>
        <span className="section-count mono-label">02 — 07</span>
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
