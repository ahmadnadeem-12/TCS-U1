// Programs Service - localStorage based
import { v4 as uuid } from "uuid";

const LS_KEY = "tcs_programs";

const DEFAULT_PROGRAMS = [
    {
        id: "prog-1",
        title: "Web Development Bootcamp",
        type: "bootcamp",
        description: "Intensive 6-week bootcamp covering HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and get job-ready skills.",
        icon: "💻",
        duration: "6 Weeks",
        participants: 50,
        status: "upcoming",
        startDate: "2025-01-15",
        instructor: "Dr. Ahmed Khan",
        tags: ["Web", "Frontend", "Backend"]
    },
    {
        id: "prog-2",
        title: "AI & Machine Learning Workshop",
        type: "workshop",
        description: "Learn the fundamentals of AI and ML with hands-on Python exercises. Covers supervised learning, neural networks, and real applications.",
        icon: "🤖",
        duration: "3 Days",
        participants: 40,
        status: "open",
        startDate: "2025-01-20",
        instructor: "Prof. Sarah Ali",
        tags: ["AI", "ML", "Python"]
    },
    {
        id: "prog-3",
        title: "Competitive Programming Contest",
        type: "competition",
        description: "Test your algorithmic skills in our annual coding competition. Win prizes and recognition!",
        icon: "🏆",
        duration: "8 Hours",
        participants: 100,
        status: "open",
        startDate: "2025-02-01",
        instructor: "ACM Chapter",
        tags: ["Algorithms", "DSA", "Contest"]
    },
    {
        id: "prog-4",
        title: "Industry Expert Talk Series",
        type: "talk",
        description: "Monthly sessions with industry professionals sharing insights on tech careers, trends, and best practices.",
        icon: "🎤",
        duration: "2 Hours",
        participants: 200,
        status: "ongoing",
        startDate: "2025-01-10",
        instructor: "Various Speakers",
        tags: ["Career", "Industry", "Networking"]
    }
];

export function listPrograms() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return DEFAULT_PROGRAMS;
}

export function getProgram(id) {
    return listPrograms().find(p => p.id === id) || null;
}

export function createProgram(data) {
    const list = listPrograms();
    const newItem = {
        id: uuid(),
        title: data.title || "",
        type: data.type || "workshop",
        description: data.description || "",
        icon: data.icon || "📚",
        duration: data.duration || "",
        participants: data.participants || 0,
        status: data.status || "upcoming",
        startDate: data.startDate || "",
        instructor: data.instructor || "",
        tags: data.tags || []
    };
    list.push(newItem);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("tcs:ls"));
    return newItem;
}

export function updateProgram(id, data) {
    const list = listPrograms();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        localStorage.setItem(LS_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("tcs:ls"));
    }
    return list[idx];
}

export function deleteProgram(id) {
    const list = listPrograms().filter(p => p.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("tcs:ls"));
}

export function resetPrograms() {
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_PROGRAMS));
    window.dispatchEvent(new Event("tcs:ls"));
    return DEFAULT_PROGRAMS;
}
