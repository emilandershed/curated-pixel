/**
 * SAMPLE CONTENT ONLY.
 *
 * These are placeholder reviews. They render with a visible "sample" label and
 * carry no "verified purchase" badge, because presenting invented reviews as
 * genuine is both a trust problem and unlawful under EU unfair-commercial-
 * practices rules.
 *
 * To ship without reviews, empty this array — the whole section disappears.
 */
export type Review = {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
};

export const reviewsAreSampleContent = true;

export const reviews: Review[] = [];
