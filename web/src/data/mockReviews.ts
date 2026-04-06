import type { FeedReview } from '@/types/review'

/** Seed data until Google Business / backend feed exists */
export const mockFeedReviews: FeedReview[] = [
  {
    id: 'rev-1',
    starCount: 5,
    reviewerName: 'Sarah M.',
    relativeTime: '3 days ago',
    body: 'The pepperoni pizza was amazing! Will be back.',
    replyStatus: 'reply_sent',
  },
  {
    id: 'rev-2',
    starCount: 1,
    reviewerName: 'AngryBob',
    relativeTime: '1 day ago',
    body: 'Delivery took 2 hours. Pizza was cold. Rude staff.',
    replyStatus: 'needs_response',
    critical: true,
  },
]

export const countNeedsResponse = (reviews: FeedReview[]): number =>
  reviews.filter((r) => r.replyStatus === 'needs_response').length
