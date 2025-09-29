// Development audit tools for M8 quality assurance

import { validateTouchTarget } from "./accessibility";

export interface AuditResult {
  category: string;
  passed: number;
  failed: number;
  total: number;
  issues: string[];
  score: number;
}

// Comprehensive accessibility audit
export function auditAccessibility(): AuditResult {
  const issues: string[] = [];
  let passed = 0;
  let failed = 0;

  // Check touch targets
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])',
  );

  interactiveElements.forEach((el, index) => {
    const element = el as HTMLElement;
    if (validateTouchTarget(element)) {
      passed++;
    } else {
      failed++;
      issues.push(
        `Touch target #${index + 1} is smaller than 44px: ${element.tagName} "${element.textContent?.trim().substring(0, 20)}..."`,
      );
    }
  });

  // Check alt texts for images
  const images = document.querySelectorAll("img");
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute("aria-hidden")) {
      failed++;
      issues.push(
        `Image #${index + 1} missing alt text: ${img.src.substring(0, 50)}...`,
      );
    } else {
      passed++;
    }
  });

  // Check heading hierarchy
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let lastLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1 && lastLevel > 0) {
      failed++;
      issues.push(
        `Heading hierarchy skip at #${index + 1}: ${heading.tagName} after H${lastLevel}`,
      );
    } else {
      passed++;
    }
    lastLevel = level;
  });

  const total = passed + failed;
  const score = total > 0 ? Math.round((passed / total) * 100) : 100;

  return {
    category: "Accessibility",
    passed,
    failed,
    total,
    issues,
    score,
  };
}

// Performance audit
export function auditPerformance(): AuditResult {
  const issues: string[] = [];
  let passed = 0;
  let failed = 0;

  // Check for large images without lazy loading
  const images = document.querySelectorAll('img:not([loading="lazy"])');
  images.forEach((img, index) => {
    const rect = img.getBoundingClientRect();
    if (rect.width > 300 || rect.height > 300) {
      failed++;
      issues.push(
        `Large image #${index + 1} without lazy loading: ${rect.width}x${rect.height}`,
      );
    } else {
      passed++;
    }
  });

  // Check for missing width/height on images
  const allImages = document.querySelectorAll("img");
  allImages.forEach((img, index) => {
    if (!img.width || !img.height) {
      failed++;
      issues.push(
        `Image #${index + 1} missing explicit dimensions (causes layout shift)`,
      );
    } else {
      passed++;
    }
  });

  // Check for excessive DOM size
  const totalElements = document.querySelectorAll("*").length;
  if (totalElements > 1500) {
    failed++;
    issues.push(
      `DOM size too large: ${totalElements} elements (recommend < 1500)`,
    );
  } else {
    passed++;
  }

  // Check for inline styles (should use CSS classes)
  const elementsWithInlineStyles = document.querySelectorAll("[style]");
  if (elementsWithInlineStyles.length > 10) {
    failed++;
    issues.push(
      `Too many inline styles: ${elementsWithInlineStyles.length} elements (recommend < 10)`,
    );
  } else {
    passed++;
  }

  const total = passed + failed;
  const score = total > 0 ? Math.round((passed / total) * 100) : 100;

  return {
    category: "Performance",
    passed,
    failed,
    total,
    issues,
    score,
  };
}

// Mobile optimization audit
export function auditMobile(): AuditResult {
  const issues: string[] = [];
  let passed = 0;
  let failed = 0;

  // Check viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (
    !viewport ||
    !viewport.getAttribute("content")?.includes("width=device-width")
  ) {
    failed++;
    issues.push("Missing or incorrect viewport meta tag");
  } else {
    passed++;
  }

  // Check for horizontal scrolling
  if (document.body.scrollWidth > window.innerWidth) {
    failed++;
    issues.push("Page has horizontal scroll (mobile unfriendly)");
  } else {
    passed++;
  }

  // Check text sizes (should be at least 16px)
  const textElements = document.querySelectorAll("p, span, div, li, label");
  let smallTextCount = 0;
  textElements.forEach((el) => {
    const fontSize = window.getComputedStyle(el).fontSize;
    const sizeInPx = parseInt(fontSize);
    if (sizeInPx < 16 && el.textContent?.trim()) {
      smallTextCount++;
    }
  });

  if (smallTextCount > textElements.length * 0.1) {
    failed++;
    issues.push(
      `Too many elements with small text: ${smallTextCount} elements < 16px`,
    );
  } else {
    passed++;
  }

  // Check for PWA manifest
  const manifest = document.querySelector('link[rel="manifest"]');
  if (!manifest) {
    failed++;
    issues.push("PWA manifest not found");
  } else {
    passed++;
  }

  const total = passed + failed;
  const score = total > 0 ? Math.round((passed / total) * 100) : 100;

  return {
    category: "Mobile",
    passed,
    failed,
    total,
    issues,
    score,
  };
}

// Run complete audit
export function runCompleteAudit(): {
  results: AuditResult[];
  overallScore: number;
  summary: string;
} {
  const results = [auditAccessibility(), auditPerformance(), auditMobile()];

  const overallScore = Math.round(
    results.reduce((sum, result) => sum + result.score, 0) / results.length,
  );

  const totalIssues = results.reduce((sum, result) => sum + result.failed, 0);

  const summary = `🔍 Audit Complete
Overall Score: ${overallScore}%
Total Issues: ${totalIssues}
Categories: ${results.length}

${results.map((r) => `${r.category}: ${r.score}% (${r.failed} issues)`).join("\n")}

${
  overallScore >= 90
    ? "🎉 Excellent! Ready for production."
    : overallScore >= 75
      ? "✅ Good! Minor issues to address."
      : "⚠️ Needs improvement before production."
}`;

  return {
    results,
    overallScore,
    summary,
  };
}

// Development-only audit runner
export function runDevelopmentAudit() {
  if (process.env.NODE_ENV !== "development") return;

  console.log("🔍 Running M8 Quality Audit...");

  const audit = runCompleteAudit();

  console.log(audit.summary);

  audit.results.forEach((result) => {
    if (result.issues.length > 0) {
      console.group(`❌ ${result.category} Issues (${result.issues.length}):`);
      result.issues.forEach((issue) => console.warn(`• ${issue}`));
      console.groupEnd();
    }
  });

  return audit;
}
