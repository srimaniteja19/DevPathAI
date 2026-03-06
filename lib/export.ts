import type { Course } from "./types";

export function exportCourseAsMarkdown(course: Course): void {
  const c = course.course;
  let md = `# ${c.title}\n\n`;
  md += `${c.goal}\n\n`;
  md += `- **Difficulty:** ${c.difficulty}\n`;
  md += `- **Weeks:** ${c.totalWeeks}\n`;
  if (c.prerequisite.length) md += `- **Prerequisites:** ${c.prerequisite.join(", ")}\n`;
  md += `\n## Learning pace\n`;
  md += `| Pace | Hours/day | Completion |\n|------|-----------|------------|\n`;
  md += `| Casual | ${c.learningPace.hoursPerDay.casual} | ${c.learningPace.estimatedCompletion.casual} |\n`;
  md += `| Focused | ${c.learningPace.hoursPerDay.focused} | ${c.learningPace.estimatedCompletion.focused} |\n`;
  md += `| Intensive | ${c.learningPace.hoursPerDay.intensive} | ${c.learningPace.estimatedCompletion.intensive} |\n`;
  md += `\n## Phases\n\n`;
  c.phases.forEach((p) => {
    md += `### Phase ${p.phase}: ${p.title} (${p.weeks})\n\n`;
    md += `${p.objective}\n\n`;
    md += `#### Topics\n`;
    p.topics.forEach((t) => {
      md += `- **${t.name}** (${t.estimatedHours}h)\n`;
      t.subtopics.forEach((s) => (md += `  - ${s}\n`));
    });
    md += `\n#### Project: ${p.project.title}\n\n`;
    md += `${p.project.description}\n\n`;
    md += `**Tech:** ${p.project.techStack.join(", ")} | **Difficulty:** ${p.project.difficulty}\n\n`;
    md += `#### Resources\n`;
    p.resources.forEach((r) => {
      md += `- [${r.title}](${r.url}) (${r.type}${r.isFree ? ", free" : ""})\n`;
    });
    md += `\n#### Checkpoints\n`;
    p.checkpoints.forEach((x) => (md += `- [ ] ${x}\n`));
    md += `\n`;
  });
  md += `## Final project\n\n**${c.finalProject.title}**\n\n${c.finalProject.description}\n\n`;
  md += `Tech: ${c.finalProject.techStack.join(", ")}\n\n`;
  c.finalProject.features.forEach((f) => (md += `- ${f}\n`));
  md += `\n## Tips\n\n`;
  c.tips.forEach((t) => (md += `- ${t}\n`));

  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${c.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCourseAsJson(course: Course): void {
  const blob = new Blob([JSON.stringify(course, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${course.course.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function copyCourseToClipboard(course: Course): Promise<void> {
  const md: string[] = [];
  const c = course.course;
  md.push(`# ${c.title}\n\n${c.goal}\n`);
  md.push(`Difficulty: ${c.difficulty} | ${c.totalWeeks} weeks\n`);
  c.phases.forEach((p) => {
    md.push(`\n## Phase ${p.phase}: ${p.title} (${p.weeks})\n${p.objective}\n`);
    p.topics.forEach((t) => {
      md.push(`- ${t.name} (${t.estimatedHours}h): ${t.subtopics.join("; ")}\n`);
    });
    md.push(`Project: ${p.project.title}\n`);
    p.checkpoints.forEach((x) => md.push(`- [ ] ${x}\n`));
  });
  await navigator.clipboard.writeText(md.join(""));
}
