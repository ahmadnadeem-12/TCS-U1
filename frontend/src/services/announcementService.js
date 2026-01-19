// Announcements Service - localStorage based
import { v4 as uuid } from "uuid";

const LS_KEY = "tcs_announcements";

const DEFAULT_ANNOUNCEMENTS = [
    {
        id: "ann-1",
        title: "Midterm Exam Schedule Released",
        body: "The midterm examination schedule for Fall 2024 has been released. Please check your student portal for detailed date and time slots. Make sure to prepare accordingly.",
        date: "2024-12-28",
        priority: "important",
        tags: ["Academic", "Exams"],
        link: "",
        linkText: ""
    },
    {
        id: "ann-2",
        title: "Tech & Entrepreneurship Summit 4.0",
        body: "Join us for the biggest tech event of the year! Register now to secure your spot. Limited seats available. The summit will feature industry leaders, workshops, and networking sessions.",
        date: "2024-12-25",
        priority: "urgent",
        tags: ["Event", "Summit"],
        link: "/events",
        linkText: "Register Now"
    },
    {
        id: "ann-3",
        title: "New Library Resources Available",
        body: "The department library has acquired new books and digital resources. Visit the library to explore the latest additions to our collection.",
        date: "2024-12-20",
        priority: "normal",
        tags: ["Library", "Resources"],
        link: "",
        linkText: ""
    }
];

export function listAnnouncements() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return DEFAULT_ANNOUNCEMENTS;
}

export function getAnnouncement(id) {
    return listAnnouncements().find(a => a.id === id) || null;
}

export function createAnnouncement(data) {
    const list = listAnnouncements();
    const newItem = {
        id: uuid(),
        title: data.title || "",
        body: data.body || "",
        date: data.date || new Date().toISOString().split("T")[0],
        priority: data.priority || "normal",
        tags: data.tags || [],
        link: data.link || "",
        linkText: data.linkText || ""
    };
    list.unshift(newItem);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("tcs:ls"));
    return newItem;
}

export function updateAnnouncement(id, data) {
    const list = listAnnouncements();
    const idx = list.findIndex(a => a.id === id);
    if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        localStorage.setItem(LS_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("tcs:ls"));
    }
    return list[idx];
}

export function deleteAnnouncement(id) {
    const list = listAnnouncements().filter(a => a.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("tcs:ls"));
}

export function resetAnnouncements() {
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    window.dispatchEvent(new Event("tcs:ls"));
    return DEFAULT_ANNOUNCEMENTS;
}
