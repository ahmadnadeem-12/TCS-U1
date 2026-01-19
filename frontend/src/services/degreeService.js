// Degree Programs Service - localStorage based
import { v4 as uuid } from "uuid";

const LS_KEY = "tcs_degrees";

const DEFAULT_DEGREES = [
    {
        id: "deg-1",
        code: "BS CS",
        name: "Computer Science",
        fullName: "Bachelor of Science in Computer Science",
        duration: "4 Years",
        semesters: 8,
        description: "A comprehensive program covering programming, algorithms, databases, AI, software engineering, and computer systems.",
        icon: "💻",
        courses: ["Programming Fundamentals", "Data Structures", "Algorithms", "Database Systems", "Operating Systems", "Computer Networks", "AI & ML", "Software Engineering"],
        pdfUrl: ""
    },
    {
        id: "deg-2",
        code: "BS SE",
        name: "Software Engineering",
        fullName: "Bachelor of Science in Software Engineering",
        duration: "4 Years",
        semesters: 8,
        description: "Focused on software development lifecycle, project management, quality assurance, and modern development practices.",
        icon: "⚙️",
        courses: ["Software Design", "Requirements Engineering", "Project Management", "Testing & QA", "DevOps", "Agile Methods"],
        pdfUrl: ""
    },
    {
        id: "deg-3",
        code: "BS IT",
        name: "Information Technology",
        fullName: "Bachelor of Science in Information Technology",
        duration: "4 Years",
        semesters: 8,
        description: "Covers IT infrastructure, networking, system administration, cybersecurity, and enterprise solutions.",
        icon: "🌐",
        courses: ["Network Administration", "Cybersecurity", "Cloud Computing", "IT Management", "Web Technologies"],
        pdfUrl: ""
    },
    {
        id: "deg-4",
        code: "BS AI",
        name: "Artificial Intelligence",
        fullName: "Bachelor of Science in Artificial Intelligence",
        duration: "4 Years",
        semesters: 8,
        description: "Specialized in machine learning, deep learning, NLP, computer vision, and intelligent systems development.",
        icon: "🤖",
        courses: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Robotics", "Neural Networks"],
        pdfUrl: ""
    },
    {
        id: "deg-5",
        code: "BS DS",
        name: "Data Science",
        fullName: "Bachelor of Science in Data Science",
        duration: "4 Years",
        semesters: 8,
        description: "Combines statistics, programming, and domain expertise to extract insights from data using modern tools.",
        icon: "📊",
        courses: ["Statistics", "Data Mining", "Big Data", "Data Visualization", "Python for DS", "R Programming"],
        pdfUrl: ""
    },
    {
        id: "deg-6",
        code: "BS BI",
        name: "Business Informatics",
        fullName: "Bachelor of Science in Business Informatics",
        duration: "4 Years",
        semesters: 8,
        description: "Bridges technology and business, covering ERP systems, business analytics, and IT consulting.",
        icon: "📈",
        courses: ["Business Analytics", "ERP Systems", "IT Consulting", "E-Commerce", "Management Information Systems"],
        pdfUrl: ""
    }
];

export function listDegrees() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return DEFAULT_DEGREES;
}

export function getDegree(id) {
    return listDegrees().find(d => d.id === id) || null;
}

export function createDegree(data) {
    const list = listDegrees();
    const newItem = {
        id: uuid(),
        code: data.code || "",
        name: data.name || "",
        fullName: data.fullName || "",
        duration: data.duration || "4 Years",
        semesters: data.semesters || 8,
        description: data.description || "",
        icon: data.icon || "📚",
        courses: data.courses || [],
        pdfUrl: data.pdfUrl || ""
    };
    list.push(newItem);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("tcs:ls"));
    return newItem;
}

export function updateDegree(id, data) {
    const list = listDegrees();
    const idx = list.findIndex(d => d.id === id);
    if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        localStorage.setItem(LS_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("tcs:ls"));
    }
    return list[idx];
}

export function deleteDegree(id) {
    const list = listDegrees().filter(d => d.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("tcs:ls"));
}

export function resetDegrees() {
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_DEGREES));
    window.dispatchEvent(new Event("tcs:ls"));
    return DEFAULT_DEGREES;
}
