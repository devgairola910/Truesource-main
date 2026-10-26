export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-explainable-alerts",
    title: "Why Explainable Alerts Reduce Reviewer Fatigue",
    summary:
      "A practical look at how confidence breakdowns and source context help analysts make faster, more consistent decisions without sacrificing quality.",
    date: "April 10, 2026",
    readTime: "6 min read",
    category: "Reviewer Operations",
    author: "TrueSource Product Team",
    content: [
      "Alert fatigue is rarely caused by high volume alone. It usually appears when reviewers repeatedly face unclear incidents and must guess the reason behind each score. Explainable alerts solve this by surfacing the strongest signals, confidence contributions, and source context in one view.",
      "When analysts can see which factors drove a flag, they make decisions faster and with less cognitive load. A reviewer no longer needs to manually inspect every clue from scratch; instead, they validate a transparent evidence path. This consistency improves both throughput and decision quality.",
      "Teams should structure evidence panels around practical questions: what matched, how strongly it matched, where the candidate was discovered, and what action is recommended. The goal is not to show more data. The goal is to show the right data in the right order.",
      "Over time, explainability also improves model tuning. Review outcomes become easier to audit, false positives are simpler to categorize, and threshold changes can be justified using operational evidence rather than intuition.",
    ],
  },
  {
    slug: "staged-detection-pipelines",
    title: "Designing Staged Detection Pipelines for Cost Control",
    summary:
      "How to balance recall and spend by combining low-cost prefilters with selective deep similarity matching in cloud-native workflows.",
    date: "March 28, 2026",
    readTime: "8 min read",
    category: "Architecture",
    author: "TrueSource Engineering",
    content: [
      "A common mistake in media integrity systems is applying expensive analysis to every discovered candidate. This quickly inflates cloud costs and often slows response time. A staged detection strategy fixes this by filtering candidates in phases.",
      "Stage one should prioritize cheap and broad checks, such as domain heuristics, lightweight hashing, or metadata screens. Stage two can then run vector similarity and shot-level analysis only on shortlisted candidates. This creates better cost-to-value alignment.",
      "The key is threshold governance. If prefilters are too strict, true incidents are missed. If they are too loose, deep analysis volume spikes. Teams should tune thresholds using seeded benchmarks and regularly compare precision, recall, and processing latency.",
      "Staged retrieval is not only a performance tactic. It is also an operational discipline that keeps detection systems scalable as source coverage expands.",
    ],
  },
  {
    slug: "handling-cropped-and-reencoded-media",
    title: "Handling Cropped and Re-Encoded Media in Real-World Feeds",
    summary:
      "Common transformation patterns and the signal combinations that maintain reliability when adversarial edits degrade single-method checks.",
    date: "March 16, 2026",
    readTime: "7 min read",
    category: "Matching Quality",
    author: "Applied ML Team",
    content: [
      "Most unauthorized reuse is not a clean copy. Assets are compressed, cropped, overlaid with text, or embedded inside compilations. This breaks naive exact matching and can undermine confidence if systems rely on one method alone.",
      "Perceptual methods perform well under compression and slight visual edits, while embedding-based checks add resilience to semantic variation. For video, shot-level segmentation is critical because many infringements reuse only short excerpts rather than full files.",
      "Operationally, teams should track transform-specific precision metrics. Knowing performance by transformation type reveals where additional signals or threshold tuning are needed. It also prevents overgeneralized accuracy claims.",
      "Robustness is achieved by layered agreement: independent signals that each remain partially reliable under different edits.",
    ],
  },
  {
    slug: "whitelist-governance-without-losing-visibility",
    title: "Building Whitelist Governance Without Losing Visibility",
    summary:
      "A framework for authorized domain suppression that cuts alert noise while preserving oversight and measurable accountability.",
    date: "February 24, 2026",
    readTime: "5 min read",
    category: "Governance",
    author: "Operations Strategy",
    content: [
      "Whitelisting is essential for reducing queue noise, but unmanaged suppression can hide meaningful incidents. Strong governance requires clear ownership, expiration policy, and auditability for each whitelisted domain.",
      "Every whitelist entry should include why it was authorized, who approved it, and when it should be reviewed. Temporary approvals are often safer than permanent exemptions, especially in dynamic partner ecosystems.",
      "Teams should also monitor suppression accuracy as a KPI. If authorized domains begin generating legitimate concerns, governance logic must adapt. The objective is precision improvement without creating blind spots.",
      "When implemented well, whitelist governance protects reviewer capacity while retaining operational transparency.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
