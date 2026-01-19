
import { LS_KEYS, DEFAULT_ADMIN } from "./constants";

export function safeJsonParse(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}

export function getLS(key, fallback) {
  return safeJsonParse(localStorage.getItem(key), fallback);
}

export function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeedData() {
  // Users
  const users = getLS(LS_KEYS.USERS, null);
  if (!users) {
    setLS(LS_KEYS.USERS, [DEFAULT_ADMIN]);
  } else {
    // Ensure admin exists
    const hasAdmin = users.some(u => u.role === "admin" && u.email === DEFAULT_ADMIN.email);
    if (!hasAdmin) setLS(LS_KEYS.USERS, [...users, DEFAULT_ADMIN]);
  }

  // Events
  const events = getLS(LS_KEYS.EVENTS, null);
  if (!events) {
    setLS(LS_KEYS.EVENTS, [
      {
        id: "evt-1",
        title: "Tech & Entrepreneurship Summit 4.0",
        date: "2025-10-28",
        time: "18:00",
        venue: "D-Ground (UAF)",
        status: "open",
        featured: true,
        capacity: 300,
        seatsRemaining: 120,
        tags: ["Keynote", "Panel", "Social Night"],
        description:
          "A featured TCS event with talks, networking and a social night. (Frontend demo data)",
      },
      {
        id: "evt-2",
        title: "Programming in Big Data – Seminar",
        date: "2025-10-17",
        time: "11:00",
        venue: "Lecture Theatre, CS Dept.",
        status: "open",
        featured: false,
        capacity: 150,
        seatsRemaining: 70,
        tags: ["Seminar", "Big Data"],
        description: "Seminar on Big Data programming practices. (Frontend demo data)",
      },
    ]);
  }

  // Tickets
  const tickets = getLS(LS_KEYS.TICKETS, null);
  if (!tickets) setLS(LS_KEYS.TICKETS, []);

  // Cabinet
  const cabinet = getLS(LS_KEYS.CABINET, null);
  if (!cabinet) {
    setLS(LS_KEYS.CABINET, [
      {
        id: "cab-1",
        name: "Muhammad Adan",
        role: "President",
        degree: "BS Computer Science",
        agNo: "2022-AG-7993",
        interests: ["Leadership", "Community", "Events"],
        phone: "+92 300 0000000",
        email: "adan@example.com",
        summary: "Leads TCS operations, manages society vision, and coordinates with faculty and industry.",
        avatar: "/src/assets/images/image10.png",
        socials: { linkedin: "", instagram: "", facebook: "" }
      },
      {
        id: "cab-2",
        name: "Mannoor B.",
        role: "Vice President",
        degree: "BS Software Engineering",
        agNo: "2023-AG-12001",
        interests: ["Management", "Design", "Operations"],
        phone: "+92 300 0000000",
        email: "mannoor@example.com",
        summary: "Supports president, supervises teams, and ensures smooth execution of events.",
        avatar: "/src/assets/images/image11.png",
        socials: { linkedin: "", instagram: "", facebook: "" }
      }
    ]);
  }

  // Faculty
  const faculty = getLS(LS_KEYS.FACULTY, null);
  if (!faculty) {
    setLS(LS_KEYS.FACULTY, [
      {
        id: "fac-1",
        name: "Dr. ABC Example",
        departmentRole: "Professor",
        education: "PhD Computer Science",
        experienceYears: 10,
        expertise: ["Machine Learning", "Data Mining", "Research"],
        courses: ["AI", "ML", "Data Science"],
        universities: ["UAF"],
        email: "abc@example.com",
        phone: "+92 300 0000000",
        summary: "Faculty mentor for TCS, provides guidance on research, competitions, and academic direction.",
        avatar: "/src/assets/images/image12.png",
        socials: { linkedin: "", website: "" }
      },
      {
        id: "fac-2",
        name: "Prof. XYZ Example",
        departmentRole: "Chairman",
        education: "PhD (CS)",
        experienceYears: 20,
        expertise: ["Leadership", "Policy", "Academics"],
        courses: ["—"],
        universities: ["UAF", "Other University"],
        email: "xyz@example.com",
        phone: "+92 300 0000000",
        summary: "Senior leadership role; supports departmental initiatives and student societies.",
        avatar: "/src/assets/images/image13.png",
        socials: { linkedin: "", website: "" }
      }
    ]);
  }

}

export function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme).forEach(([k, v]) => {
    root.style.setProperty(k, v);
  });
}

export function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}
