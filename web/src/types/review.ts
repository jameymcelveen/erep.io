export type ReviewReplyStatus = 'reply_sent' | 'needs_response'

export interface FeedReview {
  id: string
  starCount: number
  reviewerName: string
  relativeTime: string
  body: string
  replyStatus: ReviewReplyStatus
  critical?: boolean
}
