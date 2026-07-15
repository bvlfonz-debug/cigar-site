// Shared StickScore logic — used by both scripts/seed.mjs (initial bulk seed)
// and scripts/db-tools.mjs (incremental nightly updates), so the two never
// drift out of sync on the aggregation rules.

// A few outlets share one editorial team/ratings database under two names
// (e.g. Cigar Insider is Cigar Aficionado's own ratings newsletter) —
// canonicalized so they count as one independent source, not two.
export const CANONICAL_SOURCE = {
  'Cigar Insider (Cigar Aficionado)': 'Cigar Aficionado',
  'Cigar Insider': 'Cigar Aficionado',
};

export function canon(name) {
  return CANONICAL_SOURCE[name] ?? name;
}

export function normalizeTo100(score, scoreScale) {
  return (score / scoreScale) * 100;
}

export function bucketAverage(reviews, referenceDate) {
  if (reviews.length === 0) return null;
  let weightedSum = 0;
  let totalWeight = 0;
  for (const r of reviews) {
    const normalized = normalizeTo100(r.score, r.score_scale);
    const ageYears = (referenceDate - new Date(r.review_date)) / (1000 * 60 * 60 * 24 * 365.25);
    const weight = ageYears <= 5 ? 2 : 1;
    weightedSum += normalized * weight;
    totalWeight += weight;
  }
  return weightedSum / totalWeight;
}

// StickScore weighting per CLAUDE.md: critic scores 70% / retailer averages 30%,
// recent (<=5yr) reviews count double, minimum 3 independent sources to publish.
// Same function powers AccScore for accessories (CLAUDE.md: "same aggregation
// rules as StickScore") — the second bucket is "anything not critic" so it
// covers cigars' 'retailer' and accessories' 'community' source_type alike.
export function computeStickScore(allReviews, referenceDate) {
  const distinctSources = new Set(allReviews.map((r) => canon(r.source_name)));
  if (distinctSources.size < 3) return null;

  const critic = allReviews.filter((r) => (r.source_type ?? 'critic') === 'critic');
  const nonCritic = allReviews.filter((r) => (r.source_type ?? 'critic') !== 'critic');
  const criticAvg = bucketAverage(critic, referenceDate);
  const nonCriticAvg = bucketAverage(nonCritic, referenceDate);
  if (criticAvg != null && nonCriticAvg != null) return criticAvg * 0.7 + nonCriticAvg * 0.3;
  return criticAvg ?? nonCriticAvg ?? null;
}

// Alias — same function, used under the AccScore name in accessory contexts.
export const computeAccScore = computeStickScore;

// Alias — same function, reserved for the future LoungeScore (Lounge
// Directory Phase C). Not wired to any live data flow yet; callers must map
// lounge_external_rating's `rating_date` column to `review_date` on the
// objects passed in, since this function reads that exact key name.
export const computeLoungeScore = computeStickScore;

export function distinctSourceCount(allReviews) {
  return new Set(allReviews.map((r) => canon(r.source_name))).size;
}
