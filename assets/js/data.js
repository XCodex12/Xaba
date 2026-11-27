'use strict';

/*
  Single source of truth for the portfolio.
  The Projects page and the chatbot both read from here,
  so to add a project or a module you only edit THIS file.
*/
window.SITE = {
  name: "Siyanda Xaba",
  email: "siyandaxaba1@gmail.com",
  phone: "066 442 8931",
  location: "Durban, KwaZulu-Natal, South Africa",
  github: "https://github.com/XCodex12",
  linkedin: "https://www.linkedin.com/in/siyanda-xaba-13a211273",
  cv: "./assets/CV/Siyanda-Xaba-CV.pdf",

  skillGroups: [
    { title: "Languages", items: ["C#", "Java", "JavaScript", "Python", "SQL", "HTML", "CSS"] },
    { title: "Frameworks & APIs", items: ["React", "Node.js", "Express.js", ".NET MAUI", "REST APIs", "Leaflet", "Groq API", "SerpAPI"] },
    { title: "Data & Cloud", items: ["SQL Server", "PostgreSQL (Neon)", "Firebase", "Supabase", "Microsoft Azure", "Netlify"] },
    { title: "Tools", items: ["Git & GitHub", "VS Code", "Visual Studio", "Android Studio", "PyCharm", "Cisco Packet Tracer", "Linux"] },
    { title: "Computing & Data", items: ["Data Structures", "Machine Learning", "Business Intelligence", "Software Development & Management", "Research Skills"] },
    { title: "IT & Professional", items: ["IT Support", "Troubleshooting", "Networking", "Cybersecurity basics", "Excel", "Access", "PowerPoint"] }
  ],

  projects: [
    { name: "X - Report", cat: "Full-Stack", status: "Live", icon: "map-outline",
      desc: "Community problem-reporting platform with an interactive map.",
      tech: ["React", "Supabase", "Leaflet", "Netlify"], link: "https://x-report.netlify.app", cta: "Open live site" },
    { name: "EduBudget AI", cat: "Full-Stack", status: "Team project", icon: "wallet-outline",
      desc: "Student budgeting app (ZAR) with an AI shopping assistant. Built with a team through GitHub pull requests.",
      tech: ["Node.js", "Express", "PostgreSQL", "Groq", "SerpAPI"], link: "https://github.com/ADUBUDGET/Edubudte-AII", cta: "View on GitHub" },
    { name: "UbuntuGRID", cat: "Mobile", status: "In development", icon: "people-outline",
      desc: "South African civic-tech app that matches skills, services and opportunities across communities.",
      tech: ["C#", ".NET MAUI", "Firebase"], link: "https://github.com/XCodex12", cta: "View GitHub" },
    { name: "E-Commerce Website", cat: "Full-Stack", status: "Live", img: "Mr.jpg", icon: "cart-outline",
      desc: "Online store deployed to the web, backed by a SQL database.",
      tech: ["C#", "JavaScript", "SQL", "CSS"], link: "https://xcodex12.github.io/Mr-X/", cta: "Open live site" },
    { name: "Pizza App", cat: "Mobile", status: "Android", img: "Project3.jpg", icon: "pizza-outline",
      desc: "Android app for ordering, payment and collection.",
      tech: ["Java", "Android Studio", "SQL"], link: "https://github.com/Siyanda16-gif/Pizza-App.git", cta: "View on GitHub" },
    { name: "Gen-V App", cat: "Web", status: "Live", img: "Gen-V.jpg", icon: "flash-outline",
      desc: "Web app with a Firebase back end.",
      tech: ["HTML", "CSS", "JavaScript", "Firebase"], link: "https://xcodex12.github.io/GenV/", cta: "Open live site" },
    { name: "Tracker App", cat: "Web", status: "Live", img: "tracker.jpg", icon: "locate-outline",
      desc: "Secure tracking web app using Firebase.",
      tech: ["HTML", "CSS", "JavaScript", "Firebase"], link: "https://xcodex12.github.io/secure-tracker/", cta: "Open live site" },
    { name: "ChessBoard Game", cat: "Web", status: "Live", img: "Chess.jpg", icon: "game-controller-outline",
      desc: "Playable chess game in the browser.",
      tech: ["HTML", "CSS", "JavaScript"], link: "https://xcodex12.github.io/Chess/", cta: "Play now" },
    { name: "TechBase App", cat: "Web", status: "Live", icon: "hardware-chip-outline",
      desc: "Technology showcase website.",
      tech: ["HTML", "CSS", "JavaScript"], link: "https://xcodex12.github.io/TechBase/", cta: "Open live site" },
    { name: "Mechanics Shop App", cat: "Full-Stack", status: "Source", icon: "construct-outline",
      desc: "Shop management app for a mechanics business.",
      tech: ["C#", "JavaScript", "HTML", "CSS"], link: "https://github.com/Siyanda16-gif/FutureInfinity", cta: "View on GitHub" },
    { name: "Gym Company Website", cat: "Full-Stack", status: "Source", icon: "barbell-outline",
      desc: "Website for a gym company.",
      tech: ["C#", "JavaScript", "HTML", "CSS"], link: "https://github.com/Siyanda16-gif/Gym-Company-website", cta: "View on GitHub" },
    { name: "Earlier Portfolio", cat: "Web", status: "Live", img: "Syanda.jpg", icon: "briefcase-outline",
      desc: "An earlier version of my developer portfolio.",
      tech: ["HTML", "CSS", "JavaScript"], link: "https://siyanda16-gif.github.io/Xaba/", cta: "Open live site" }
  ],

  qualifications: [
    { id: "adict", name: "Advanced Diploma in Information and Communications Technology (ADICT1)", short: "Advanced Diploma in ICT",
      nqf: 7, period: "February to November 2026", institution: "Durban University of Technology (DUT)" },
    { id: "diict", name: "Diploma in Information and Communication Technology in Application Development (DIIAD1)", short: "Diploma in ICT (Application Development)",
      nqf: 6, period: "2023 to 2025", institution: "Durban University of Technology (DUT)", graduated: "19 May 2026" }
  ],

  // distinction: true = passed with distinction
  modules: {
    "Advanced Diploma in ICT (2026)": [
      { n: "Applied Mathematics for Computing A", s: "Semester 1" },
      { n: "Data Structures", s: "Semester 1" },
      { n: "Platform Based Development", s: "Semester 1" },
      { n: "Research Skills", s: "Semester 1", d: true },
      { n: "Machine Learning", s: "Semester 2" },
      { n: "Applied Mathematics for Computing B", s: "Semester 2" },
      { n: "Software Development and Management", s: "Semester 2" },
      { n: "Business Intelligence", s: "Semester 2" }
    ],
    "Diploma in ICT: Year 3 (2025)": [
      { n: "Applications Development IIIA", s: "Semester 1" },
      { n: "Applications Development Project IIIA", s: "Semester 1" },
      { n: "Human Computer Interaction", s: "Semester 1" },
      { n: "Information Systems IIIA", s: "Semester 1" },
      { n: "Theory of ICT Professional Practice III", s: "Semester 1" },
      { n: "Applications Development IIIB", s: "Semester 2" },
      { n: "Applications Development Project IIIB", s: "Semester 2" },
      { n: "Entrepreneurial Spirit", s: "Semester 2", d: true },
      { n: "Information Systems IIIB", s: "Semester 2" }
    ],
    "Diploma in ICT: Year 2 (2024)": [
      { n: "Applications Development IIA", s: "Semester 1", d: true },
      { n: "Business Fundamentals II", s: "Semester 1" },
      { n: "IT Project Management", s: "Semester 1" },
      { n: "Information Management IIA", s: "Semester 1" },
      { n: "Information Systems IIA", s: "Semester 1" },
      { n: "Mobile Computing IIA", s: "Semester 1" },
      { n: "Applications Development IIB", s: "Semester 2" },
      { n: "Applications Development Project II", s: "Semester 2" },
      { n: "Community Engagement Project", s: "Semester 2" },
      { n: "Information Management IIB", s: "Semester 2" },
      { n: "Information Systems IIB", s: "Semester 2" },
      { n: "Mobile Computing IIB", s: "Semester 2" }
    ],
    "Diploma in ICT: Year 1 (2023)": [
      { n: "Applications Development IA", s: "Semester 1", d: true },
      { n: "Business Fundamentals I", s: "Semester 1" },
      { n: "Fundamentals of Computer Security", s: "Semester 1" },
      { n: "Information Systems I", s: "Semester 1" },
      { n: "ICT Literacy and Skills", s: "Semester 1", d: true },
      { n: "Operating Systems", s: "Semester 1" },
      { n: "Applications Development IB", s: "Semester 2", d: true },
      { n: "Applications Development Project I", s: "Semester 2" },
      { n: "Communication Networks I", s: "Semester 2", d: true },
      { n: "Cornerstone 101", s: "Semester 2", d: true },
      { n: "Me, My World, My Universe", s: "Semester 2" }
    ]
  },

  certificates: [
    "Cisco: Certified Packet Tracer User (March 2023)",
    "Cisco: NDG Linux Unhatched (March 2023)",
    "Cisco: Cybersecurity (March 2023)",
    "Cisco: Mobile Digital Literacy (March 2023)"
  ],

  experience: [
    { role: "Invigilator", org: "Rosebank College (Durban)", when: "September 2026 to present",
      what: "Supervises exam sessions, verifies student IDs and attendance and enforces exam rules." },
    { role: "IT Support", org: "Chatsworth Teachers' Centre", when: "February to August 2026",
      what: "Troubleshooting and technical support for computers, software and network issues." },
    { role: "Technician & Tutor", org: "Sidelile High School", when: "2021 to 2022",
      what: "Maintained school IT equipment and tutored learners." }
  ]
};
