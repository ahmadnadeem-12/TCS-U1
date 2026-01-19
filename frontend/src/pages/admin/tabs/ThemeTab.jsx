
import React, { useEffect } from "react";

export default function ThemeTab({
    draftTheme,
    setDraftTheme,
    hasUnsaved,
    setHasUnsaved,
    themeCtx
}) {
    // Organized groups with better names
    const groups = {
        "🎨 Background Colors": ["Background Dark", "Background Darker", "Background Purple", "Background Card"],
        "✨ Accent Colors": ["Accent Red", "Accent Pink", "Accent Purple", "Accent Cyan", "Accent Gold"],
        "📝 Text Colors": ["Text Primary", "Text Secondary", "Text Muted", "Text Dim"],
        "🔲 Border Colors": ["Border Soft", "Border Glow"],
        "🏷️ Title Colors (THE COMPUTING SOCIETY)": ["Title THE", "Title COMPUTING", "Title SOCIETY"],
        "🪟 Glass Effect": ["Glass Background", "Glass Border"],
        "📌 Sidebar": ["Sidebar Background", "Sidebar Border", "Sidebar Text"],
        "🎨 TCS Logo Gradient": ["TCS Logo Start", "TCS Logo Middle", "TCS Logo End"],
        "💬 Modal/Dialog": ["Modal Background", "Modal Border", "Modal Header"],
        "🔗 Links & Buttons": ["Link Color", "Button Primary", "Button Hover"]
    };

    // LIVE PREVIEW - Apply changes immediately when draftTheme changes
    useEffect(() => {
        if (themeCtx?.applyLive) {
            themeCtx.applyLive(draftTheme);
        }
    }, [draftTheme]);

    const handleColorChange = (key, value) => {
        setDraftTheme(t => ({ ...t, [key]: value }));
        setHasUnsaved(true);
    };

    const handleSaveTheme = () => {
        const password = prompt("Enter admin password to save theme:");
        if (password === "tcsadmin") {
            themeCtx.setTheme(draftTheme);
            setHasUnsaved(false);
            alert("✅ Theme saved successfully!");
        } else {
            alert("❌ Incorrect password!");
        }
    };

    const handleReset = () => {
        themeCtx.reset();
        setDraftTheme(themeCtx.theme);
        setHasUnsaved(false);
    };

    const handleCancel = () => {
        setDraftTheme(themeCtx.theme);
        themeCtx.applyLive(themeCtx.theme);
        setHasUnsaved(false);
    };

    // Convert any color format to hex for color picker
    const toHex = (color) => {
        if (!color) return "#ffffff";
        if (color.startsWith("#")) return color.slice(0, 7);
        if (color.startsWith("rgba") || color.startsWith("rgb")) {
            const match = color.match(/\d+/g);
            if (match && match.length >= 3) {
                const r = parseInt(match[0]).toString(16).padStart(2, '0');
                const g = parseInt(match[1]).toString(16).padStart(2, '0');
                const b = parseInt(match[2]).toString(16).padStart(2, '0');
                return `#${r}${g}${b}`;
            }
        }
        return "#ffffff";
    };

    return (
        <div>
            {/* Info Banner */}
            <div style={{
                background: "linear-gradient(135deg, rgba(220, 39, 67, 0.15), rgba(194, 52, 165, 0.15))",
                border: "1px solid rgba(220, 39, 67, 0.3)",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem"
            }}>
                <div style={{ fontWeight: 700, marginBottom: ".3rem", color: "#ff8fa3" }}>
                    🎨 Live Theme Editor
                </div>
                <div style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
                    Changes apply instantly! Click "Save Theme" when you're happy with the look.
                </div>
            </div>

            {Object.entries(groups).map(([groupName, keys]) => (
                <div key={groupName} className="card" style={{ marginBottom: "1rem" }}>
                    <div style={{ fontWeight: 800, marginBottom: ".75rem", fontSize: ".95rem" }}>
                        {groupName}
                    </div>
                    <div style={{ display: "grid", gap: ".75rem" }}>
                        {keys.map(k => draftTheme[k] !== undefined && (
                            <div key={k} style={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                                padding: ".5rem .75rem",
                                borderRadius: "10px",
                                background: "rgba(0,0,0,0.2)",
                                border: "1px solid rgba(255,255,255,0.05)"
                            }}>
                                {/* Color Name */}
                                <div style={{
                                    flex: 1,
                                    color: "var(--text-secondary)",
                                    fontSize: ".85rem",
                                    fontWeight: 500
                                }}>
                                    {k}
                                </div>

                                {/* Color Picker */}
                                <label style={{
                                    position: "relative",
                                    display: "inline-block",
                                    cursor: "pointer"
                                }}>
                                    <input
                                        type="color"
                                        value={toHex(draftTheme[k])}
                                        onChange={e => handleColorChange(k, e.target.value)}
                                        aria-label={`Pick color for ${k}`}
                                        style={{
                                            position: "absolute",
                                            opacity: 0,
                                            width: "100%",
                                            height: "100%",
                                            cursor: "pointer"
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 50,
                                            height: 32,
                                            borderRadius: 8,
                                            background: draftTheme[k] || "#ffffff",
                                            border: "2px solid rgba(255,255,255,0.25)",
                                            boxShadow: `0 2px 10px ${toHex(draftTheme[k])}50`,
                                            cursor: "pointer",
                                            transition: "all 0.2s ease"
                                        }}
                                        title="Click to change color"
                                    />
                                </label>

                                {/* Current Value Display */}
                                <div style={{
                                    fontSize: ".75rem",
                                    color: "var(--text-muted)",
                                    fontFamily: "monospace",
                                    minWidth: "80px",
                                    textAlign: "right"
                                }}>
                                    {toHex(draftTheme[k])}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Action Buttons */}
            <div style={{
                display: "flex",
                gap: ".75rem",
                flexWrap: "wrap",
                marginTop: "1.5rem",
                padding: "1rem",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.05)"
            }}>
                <button
                    className={`btn ${hasUnsaved ? "btnPrimary" : "btnGhost"}`}
                    onClick={handleSaveTheme}
                    disabled={!hasUnsaved}
                    style={{ flex: 1 }}
                >
                    💾 Save Theme
                </button>
                <button
                    className="btn btnGhost"
                    disabled={!hasUnsaved}
                    onClick={handleCancel}
                >
                    ✕ Cancel
                </button>
                <button
                    className="btn btnGhost"
                    onClick={handleReset}
                >
                    🔄 Reset to Defaults
                </button>
            </div>

            {/* Unsaved Changes Indicator */}
            {hasUnsaved && (
                <div style={{
                    marginTop: "1rem",
                    padding: ".75rem 1rem",
                    background: "rgba(255, 193, 7, 0.15)",
                    border: "1px solid rgba(255, 193, 7, 0.4)",
                    borderRadius: "10px",
                    color: "#ffd54f",
                    fontSize: ".85rem",
                    textAlign: "center"
                }}>
                    ⚠️ You have unsaved changes. Click "Save Theme" to keep them.
                </div>
            )}
        </div>
    );
}
