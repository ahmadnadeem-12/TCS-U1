// Home Page Content Service - localStorage based

const LS_KEY = "tcs_home_content";

const DEFAULT_HOME = {
    heroTitle: {
        line1: "THE",
        line2: "COMPUTING",
        line3: "SOCIETY"
    },
    heroBadge: "Official Society • Dept. of Computer Science • UAF",
    heroDescription: "Connecting students, faculty, and industry through workshops, competitions, talks, hackathons, and social nights. Building the next generation of tech leaders at UAF.",
    stats: [
        { number: "25+", label: "Events / Year" },
        { number: "600+", label: "Active Members" },
        { number: "10+", label: "Faculty Mentors" }
    ],
    notices: [
        {
            id: "n1",
            title: "Latest Announcement",
            meta: "Midterm schedule uploaded • PDF",
            icon: "📢",
            gradient: "linear-gradient(135deg, #dc2743, #c234a5)"
        },
        {
            id: "n2",
            title: "Upcoming Event",
            meta: "Tech & Entrepreneurship Summit 4.0",
            icon: "🎤",
            gradient: "linear-gradient(135deg, #9b59b6, #00d9ff)"
        },
        {
            id: "n3",
            title: "Tickets Open",
            meta: "Generate QR ticket in seconds",
            icon: "🎟️",
            gradient: "linear-gradient(135deg, #00d9ff, #00ff88)"
        },
    ],
    features: [
        { id: "f1", icon: "🚀", title: "Workshops", desc: "Hands-on learning sessions" },
        { id: "f2", icon: "🏆", title: "Competitions", desc: "Showcase your skills" },
        { id: "f3", icon: "💡", title: "Hackathons", desc: "48-hour innovation sprints" },
        { id: "f4", icon: "🎯", title: "Bootcamps", desc: "Intensive skill training" },
    ],
    quickLinks: [
        { id: "q1", label: "Meet the Cabinet", path: "/cabinet", icon: "👥" },
        { id: "q2", label: "Our Faculty", path: "/faculty", icon: "👨‍🏫" },
        { id: "q3", label: "Gallery", path: "/gallery", icon: "📸" },
        { id: "q4", label: "Admin Portal", path: "/admin/login", icon: "🔐" },
    ]
};

export function getHomeContent() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return DEFAULT_HOME;
}

export function saveHomeContent(data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("tcs:ls"));
}

export function resetHomeContent() {
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_HOME));
    window.dispatchEvent(new Event("tcs:ls"));
    return DEFAULT_HOME;
}
