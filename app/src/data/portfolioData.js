export const portfolioData = {
  identity: {
    name: "Uday Saha",
    monogram: "US",
    role: "Creative technologist / Computer Science & AI",
    location: "Delhi NCR, India",
    email: "us8.dev@gmail.com",
    school: "Newton School of Technology, Rishihood University",
    program: "B.Tech / Computer Science & Artificial Intelligence",
    years: "2026—2030",
    jeeMainPercentile: 98.93,
  },
  profiles: {
    leetcode: {
      handle: "Imuday08__",
      url: "https://leetcode.com/u/Imuday08__/",
      source: "LeetCode public GraphQL profile",
      verifiedAt: "2026-11-07",
      stats: {
        solved: 139,
        easy: 45,
        medium: 65,
        hard: 29,
        currentStreak: 43,
        activeDaysThisYear: 103,
        globalRank: 1284422,
      },
    },
    codeforces: {
      handle: "Imuday08_",
      url: "https://codeforces.com/profile/Imuday08_",
      apiUrl: "https://codeforces.com/api",
      source: "Codeforces public API",
      verifiedAt: "2026-11-07",
      stats: {
        rating: 1016,
        maxRating: 1025,
        rank: "newbie",
        maxRank: "newbie",
        ratedContests: 8,
      },
    },
    github: {
      handle: "imuday8",
      url: "https://github.com/imuday8",
      apiUrl: "https://api.github.com/users/imuday8",
      source: "GitHub public REST API",
      verifiedAt: "2026-11-07",
      stats: { publicRepos: 7, followers: 1 },
      featured: [
        {
          name: "Portfolio",
          description:
            "An editorial portfolio with a procedural WebGL sculpture.",
          url: "https://github.com/imuday8/Portfolio",
          language: "JavaScript",
        },
        {
          name: "Hexamind",
          description: "The public Team Hexamind prototype repository.",
          url: "https://github.com/imuday8/Hexamind",
          language: "HTML",
        },
      ],
    },
  },
  socials: [
    { name: "GitHub", url: "https://github.com/imuday8", profile: "github" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/imuday08/" },
    {
      name: "Codeforces",
      url: "https://codeforces.com/profile/Imuday08_",
      profile: "codeforces",
    },
    {
      name: "LeetCode",
      url: "https://leetcode.com/u/Imuday08__/",
      profile: "leetcode",
    },
  ],
  projects: {
    pyreach: {
      name: "PyReach",
      team: "Team CodeSins",
      url: "https://github.com/thesilentghost07/pyreach",
      contribution:
        "Frontend & platform — dashboard, CLI reporter, synthetic fixtures, sample projects and GitHub Actions CI.",
    },
    medmatch: {
      name: "MedMatch AI",
      team: "Team Hexamind",
      url: "https://hexamind-ai-neon.vercel.app/",
      contribution:
        "Lead Full Stack Engineer — product flows and the web prototype.",
    },
  },
  skills: {
    Build: {
      eyebrow: "MAKE IT USEFUL",
      copy: "Interfaces and small tools that turn a clear idea into something people can try.",
      items: ["React", "JavaScript", "HTML", "CSS", "Responsive UI", "Node.js"],
    },
    Reason: {
      eyebrow: "FOLLOW THE LOGIC",
      copy: "Problem solving is practice in making each step explainable.",
      items: [
        "C",
        "C++",
        "Python",
        "Data structures",
        "Algorithms",
        "Static analysis",
      ],
    },
    Explore: {
      eyebrow: "STAY CURIOUS",
      copy: "Tools and techniques I’m learning while projects ask new questions.",
      items: [
        "Three.js",
        "React Three Fiber",
        "FastAPI",
        "Redux",
        "GitHub Actions",
        "Express.js",
      ],
    },
  },
};
