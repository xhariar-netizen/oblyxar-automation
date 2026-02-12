import type { Idea, ParsedIdeas, ParsedNarration, Scene } from "./types";

export function parseIdeas(raw: string): ParsedIdeas {
  const blockMatch = raw.match(/---BEGIN_IDEAS---([\s\S]*?)---END_IDEAS---/);

  if (!blockMatch || !blockMatch[1]) {
    throw new Error("Ideas block not found.");
  }

  const block = blockMatch[1];

  // Split ideas safely
  const ideaChunks = block
    .split("END_IDEA")
    .map((c) => c.trim())
    .filter(Boolean);

  const ideas: Idea[] = ideaChunks.map((chunk) => {
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
    current.combinedScore > prev.combinedScore ? current : prev,
  );

  return { ideas, selected };
}

function extractField(text: string, label: string): string {
  const regex = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`);
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1].trim();
  } else {
    throw new Error(`Field ${label} not found.`);
  }
}

export function parseNarration(raw: string): ParsedNarration {
  const blockMatch = raw.match(
    /---BEGIN_NARRATION---([\s\S]*?)---END_NARRATION---/,
  );

  if (!blockMatch || !blockMatch[1]) {
    throw new Error("Narration block not found.");
  }

  const block = blockMatch[1].trim();

  const title = extractSingleValue(block, "TITLE");
  const totalScenes = Number(extractSingleValue(block, "TOTAL_SCENES").replace(/[^0-9]/g, ""));
  const estimatedTotalDuration = Number(
    extractSingleValue(block, "ESTIMATED_TOTAL_DURATION_SEC"),
  );

  if (isNaN(totalScenes) || isNaN(estimatedTotalDuration)) {
    throw new Error("Invalid numeric header fields.");
  }

  const sceneChunks = block.split(/SCENE\s+\d+/g).slice(1); // first split is header

  const scenes: Scene[] = sceneChunks.map((chunk, i) => {
    const duration = Number(extractSingleValue(chunk, "DURATION_SEC"));
    const text = extractTextBlock(chunk);

    if (isNaN(duration)) {
      throw new Error(`Invalid duration in scene ${i + 1}`);
    }

    if (duration < 5 || duration > 12) {
      throw new Error(`Scene ${i + 1} duration out of range`);
    }

    if (!text || text.length < 10) {
      throw new Error(`Scene ${i + 1} text too short`);
    }

    return {
      index: i + 1,
      durationSec: duration,
      text,
    };
  });

  if (scenes.length !== totalScenes) {
    throw new Error("Scene count mismatch with declared TOTAL_SCENES.");
  }

  // Optional: Validate total duration roughly matches
  const computedDuration = scenes.reduce((sum, s) => sum + s.durationSec, 0);

  if (Math.abs(computedDuration - estimatedTotalDuration) > 10) {
    console.warn("Estimated duration mismatch (non-fatal).");
  }

  return {
    title,
    totalScenes,
    estimatedTotalDuration,
    scenes,
  };
}

function extractSingleValue(text: string, label: string): string {
  const regex = new RegExp(`${label}:\\s*(.+)`);
  const match = text.match(regex);

  if (!match || !match[1]) {
    throw new Error(`Missing field: ${label}`);
  }

  return match[1].trim();
}

function extractTextBlock(chunk: string): string {
  const match = chunk.match(/TEXT:\s*([\s\S]*?)END_SCENE/);

  if (!match|| !match[1]) {
    throw new Error("TEXT block missing.");
  }

  return match[1].trim();
}
