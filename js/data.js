/**
 * Obsidian Monolith — Verified Engineering Ledger & Data Model
 * 100% Real, authentic parameters for Uday Saha.
 */

export const portfolioData = {
  personalInfo: {
    name: "Uday Saha",
    title: "Frontend Developer & Computer Science Student",
    degree: "B.Tech in Computer Science & Artificial Intelligence",
    institution: "Newton School of Technology / Rishihood University, Delhi NCR",
    email: "us8.dev@gmail.com",
    tagline: "Building for the web. Training my problem-solving skills. Exploring AI.",
    supportingSentence: "Building thoughtful interfaces. Solving real problems.",
    academicHighlight: "98.93%ile in JEE Main",
    availability: "Available for Frontend & Software Engineering Roles",
    location: "Delhi NCR, India",
    socials: {
      github: "https://github.com/imuday8",
      linkedin: "https://www.linkedin.com/in/imuday08/",
      leetcode: "https://leetcode.com/u/Imuday08__/",
      codeforces: "https://codeforces.com/profile/Imuday08_"
    }
  },

  /**
   * Competitive Programming & Academic Telemetry Metrics (with raw numbers for counters)
   */
  metrics: {
    jeeMain: {
      value: 98.93,
      decimals: 2,
      suffix: "%ile",
      label: "JEE Main Percentile",
      note: "Top 1.07% nationwide standing among over 1.2M candidates"
    },
    codeforcesCurrent: {
      value: 1016,
      decimals: 0,
      suffix: "",
      label: "Current Rating",
      handle: "Imuday08_",
      tier: "Contestant",
      url: "https://codeforces.com/profile/Imuday08_"
    },
    codeforcesMax: {
      value: 1045,
      decimals: 0,
      suffix: "",
      label: "Max Rating Peak",
      handle: "Imuday08_",
      url: "https://codeforces.com/profile/Imuday08_"
    },
    leetcodeSubmissions: {
      value: 450,
      decimals: 0,
      suffix: "+",
      label: "Total Submissions",
      note: "Strictly total submissions evaluated (not solved count)",
      handle: "Imuday08__",
      url: "https://leetcode.com/u/Imuday08__/"
    },
    leetcodeStreak: {
      value: 102,
      decimals: 0,
      suffix: " Days",
      label: "Active Streak",
      note: "Continuous daily problem-solving practice",
      handle: "Imuday08__",
      url: "https://leetcode.com/u/Imuday08__/"
    }
  },

  /**
   * Competitive Programming Detailed Profiles
   */
  cpProfiles: {
    codeforces: {
      platform: "Codeforces",
      domain: "Competitive Programming",
      handle: "Imuday08_",
      profileUrl: "https://codeforces.com/profile/Imuday08_",
      currentRating: 1016,
      maxRating: 1045,
      tierLabel: "Contestant",
      peakLabel: "Max Rating Peak"
    },
    leetcode: {
      platform: "LeetCode",
      domain: "Consistency & Submissions",
      handle: "Imuday08__",
      profileUrl: "https://leetcode.com/u/Imuday08__/",
      totalSubmissions: 450,
      totalSubmissionsSuffix: "+",
      totalSubmissionsLabel: "Total Submissions",
      streak: 102,
      streakSuffix: " Days",
      streakLabel: "Active Streak"
    }
  },

  /**
   * Featured Case Study: MedMatch AI
   */
  caseStudy: {
    index: "PROJECT 01",
    team: "Team Hexamind",
    status: "Prototype / In Progress",
    domain: "Healthcare Technology · Full-Stack Web · AI-Assisted Decision Support",
    title: "MedMatch AI — Smart Emergency Hospital Bed & ICU Router",
    problemStatement: "During acute medical emergencies, patient transfers are often delayed by outdated hospital availability data, fragmented communication, and lack of specialized resource visibility.",
    scopeStatement: "MedMatch AI is an emergency hospital discovery concept designed with Team Hexamind to help users evaluate facilities based on real-time emergency needs, medical specialties, travel distance, and interface workflows for bed, ICU, and ventilator capacity.",
    capabilities: [
      "Emergency hospital discovery interface designed for high-stress clarity.",
      "ICU, bed, and ventilator resource allocation concepts.",
      "Distance-based ranking and triage routing workflows.",
      "End-to-end SOS emergency booking prototype flow."
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "Node.js"],
    liveUrl: "https://hexamind-ai-neon.vercel.app/"
  },

  /**
   * Skills Matrix (Categorized, No Fake Percentages)
   */
  capabilitiesMatrix: [
    {
      index: "01",
      category: "Languages",
      skills: ["C", "C++", "Python", "JavaScript", "HTML5", "CSS3"]
    },
    {
      index: "02",
      category: "Frontend & UI",
      skills: ["React", "Redux", "Responsive CSS", "Flexbox", "Grid"]
    },
    {
      index: "03",
      category: "Tools & Workflow",
      skills: ["Git", "GitHub", "VS Code"]
    },
    {
      index: "04",
      category: "Currently Exploring",
      skills: ["Node.js", "Express.js", "Advanced Data Structures"]
    }
  ],

  /**
   * Academic Pedigree & Credentials
   */
  academicCredentials: {
    degree: "B.Tech in Computer Science & Artificial Intelligence",
    institution: "Newton School of Technology / Rishihood University, Delhi NCR",
    period: "2026 – 2030",
    batch: "Batch of 2026 – 2030",
    examination: "JEE Main",
    percentile: "98.93 percentile",
    percentileValue: 98.93,
    percentileDetail: "Top 1.07% nationwide standing among over 1.2 million engineering candidates in India's premier national entrance examination."
  }
};

if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}
