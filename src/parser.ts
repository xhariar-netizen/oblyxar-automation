import type { Idea, ParsedIdeas } from "./types";

export function parseIdeas(raw: string): ParsedIdeas {
    const blockMatch = raw.match(
        /---BEGIN_IDEAS---([\s\S]*?)---END_IDEAS---/
    );

    if (!blockMatch || !blockMatch[1]) {
        throw new Error("Ideas block not found.");
    }

    const block = blockMatch[1];

    // Split ideas safely
    const ideaChunks = block
        .split("END_IDEA")
        .map(c => c.trim())
        .filter(Boolean);

    const ideas: Idea[] = ideaChunks.map(chunk => {
        const title = extractField(chunk, "TITLE");
        const hook = extractField(chunk, "HOOK");
        const conflict = extractField(chunk, "CORE_PHYSICS_CONFLICT");
        const why = extractField(chunk, "WHY_IT_WORKS");
        const visual = extractField(chunk, "VISUAL_POTENTIAL_SCORE");
        const viral = extractField(chunk, "VIRAL_POTENTIAL_SCORE");

        const visualScore = Number(visual);
        const viralScore = Number(viral);

        const combinedScore = visualScore + viralScore;

        return {
            title,
            hook,
            corePhysicsConflict: conflict,
            whyItWorks: why,
            visualScore,
            viralScore,
            combinedScore,
        };
    });

    if (ideas.length === 0) {
        throw new Error("No ideas parsed.");
    }

    // Auto select highest combined score
    const selected = ideas.reduce((prev, current) =>
        current.combinedScore > prev.combinedScore ? current : prev
    );

    return { ideas, selected };
}

function extractField(text: string, label: string): string {
    const regex = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`);
    const match = text.match(regex);

    if (match && match[1]) {
        return match[1].trim();
    }
    else {
        throw new Error(`Field ${label} not found.`);
    }

}