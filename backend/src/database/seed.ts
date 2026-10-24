import type Database from "better-sqlite3";

type JobSeed = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  skills: string[];
  postedAt: string;
};

const JOBS: JobSeed[] = [
  {
    id: "job-01",
    title: "Senior React Native Engineer",
    company: "Northwind Mobility",
    location: "Austin, TX",
    description:
      "Build and ship the consumer mobile app used by field technicians. You will own navigation, offline sync, and performance work across iOS and Android.",
    requirements:
      "5+ years of mobile development, strong TypeScript, experience shipping Expo or React Native apps to production.",
    skills: ["React Native", "TypeScript", "Expo", "REST APIs"],
    postedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "job-02",
    title: "Backend Node.js Engineer",
    company: "Harbor Ledger",
    location: "Chicago, IL",
    description:
      "Design Express services that power payments dashboards. Focus on SQLite/Postgres data models, clear API contracts, and operational reliability.",
    requirements:
      "4+ years of Node.js, comfort with SQL, and experience designing JSON APIs with authentication.",
    skills: ["Node.js", "Express", "SQLite", "TypeScript"],
    postedAt: "2026-10-03T14:30:00.000Z",
  },
  {
    id: "job-03",
    title: "Full-Stack Product Engineer",
    company: "Cedar Path Labs",
    location: "Remote",
    description:
      "Work across a React Native client and a Node API to deliver hiring workflows for mid-market companies.",
    requirements:
      "Ability to ship features end-to-end, from SQLite schema changes to mobile screens.",
    skills: ["React Native", "Node.js", "TypeScript", "SQLite"],
    postedAt: "2026-10-05T11:15:00.000Z",
  },
  {
    id: "job-04",
    title: "Mobile UX Designer",
    company: "Lumen Studio",
    location: "Brooklyn, NY",
    description:
      "Create interaction patterns and visual systems for a jobs marketplace app. Partner closely with engineers on accessible, compact mobile layouts.",
    requirements:
      "Portfolio of shipped mobile products, Figma fluency, and experience with design systems.",
    skills: ["Figma", "Mobile UX", "Design Systems", "Accessibility"],
    postedAt: "2026-10-06T16:00:00.000Z",
  },
  {
    id: "job-05",
    title: "QA Automation Engineer",
    company: "Pinnacle Freight",
    location: "Denver, CO",
    description:
      "Build automated checks for API contracts and critical mobile flows, including login, search, and saved jobs.",
    requirements:
      "Experience with API testing, CI pipelines, and mobile device farms or emulators.",
    skills: ["Playwright", "Jest", "CI/CD", "API Testing"],
    postedAt: "2026-10-08T08:45:00.000Z",
  },
  {
    id: "job-06",
    title: "Data Analyst",
    company: "Maple Street Analytics",
    location: "Boston, MA",
    description:
      "Turn marketplace events into hiring funnels and weekly reports for talent teams.",
    requirements:
      "SQL expertise, comfort with spreadsheets and dashboards, and clear written communication.",
    skills: ["SQL", "Python", "Tableau", "Statistics"],
    postedAt: "2026-10-09T13:20:00.000Z",
  },
  {
    id: "job-07",
    title: "DevOps Engineer",
    company: "Skyline Cloud",
    location: "Seattle, WA",
    description:
      "Own CI, environment config, and deployment for a Node.js API used by a React Native client.",
    requirements:
      "Hands-on experience with GitHub Actions or similar, Docker, and production Node services.",
    skills: ["Docker", "GitHub Actions", "Node.js", "Linux"],
    postedAt: "2026-10-11T10:00:00.000Z",
  },
  {
    id: "job-08",
    title: "Customer Success Manager",
    company: "Brightwell Talent",
    location: "Atlanta, GA",
    description:
      "Help employers get value from the jobs platform: onboarding, saved-candidate workflows, and weekly check-ins.",
    requirements:
      "3+ years in customer success or account management, preferably in SaaS or recruiting tech.",
    skills: ["Customer Success", "SaaS", "Communication", "Onboarding"],
    postedAt: "2026-10-12T15:40:00.000Z",
  },
  {
    id: "job-09",
    title: "iOS Engineer",
    company: "Riverbend Health",
    location: "San Diego, CA",
    description:
      "Support native modules and performance tuning for a healthcare companion app built with React Native.",
    requirements:
      "Swift experience, familiarity with React Native native modules, and App Store release process.",
    skills: ["Swift", "React Native", "iOS", "Xcode"],
    postedAt: "2026-10-14T09:25:00.000Z",
  },
  {
    id: "job-10",
    title: "Android Engineer",
    company: "Orbit Retail",
    location: "Dallas, TX",
    description:
      "Improve Android startup time and push-notification reliability for a store associate app.",
    requirements:
      "Kotlin experience and comfort debugging React Native on Android.",
    skills: ["Kotlin", "Android", "React Native", "Firebase"],
    postedAt: "2026-10-16T12:10:00.000Z",
  },
  {
    id: "job-11",
    title: "Technical Recruiter",
    company: "Summit Hire",
    location: "Remote",
    description:
      "Source engineers for mobile and backend roles and partner with hiring managers on scorecards.",
    requirements:
      "Track record recruiting software engineers, strong sourcing skills, and comfort with ATS tools.",
    skills: ["Recruiting", "Sourcing", "ATS", "Communication"],
    postedAt: "2026-10-18T17:00:00.000Z",
  },
  {
    id: "job-12",
    title: "Product Manager, Marketplace",
    company: "iExchange Labs",
    location: "San Francisco, CA",
    description:
      "Define the jobs search and saved-jobs experience for a two-sided talent marketplace. Prioritize a thin, shippable MVP.",
    requirements:
      "Experience with marketplace products, writing clear specs, and working with mobile engineers.",
    skills: ["Product Management", "Marketplaces", "Roadmapping", "Mobile"],
    postedAt: "2026-10-20T08:00:00.000Z",
  },
];

export function seedJobs(db: Database.Database): void {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO jobs (
      id, title, company, location, description, requirements, skills, postedAt
    ) VALUES (
      @id, @title, @company, @location, @description, @requirements, @skills, @postedAt
    )
  `);

  const insertMany = db.transaction((jobs: JobSeed[]) => {
    for (const job of jobs) {
      insert.run({
        ...job,
        skills: JSON.stringify(job.skills),
      });
    }
  });

  insertMany(JOBS);
}
