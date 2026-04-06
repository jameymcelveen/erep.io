import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { countNeedsResponse, mockFeedReviews } from '@/data/mockReviews'
import type { FeedReview } from '@/types/review'

interface MockReviewContextValue {
  reviews: FeedReview[]
  pendingResponseCount: number
  locationLabel: string
  setReviews: (next: FeedReview[] | ((prev: FeedReview[]) => FeedReview[])) => void
}

const MockReviewContext = createContext<MockReviewContextValue | null>(null)

export const MockReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<FeedReview[]>(mockFeedReviews)

  const pendingResponseCount = useMemo(() => countNeedsResponse(reviews), [reviews])

  const stableSetReviews = useCallback(
    (next: FeedReview[] | ((prev: FeedReview[]) => FeedReview[])) => {
      setReviews(next)
    },
    []
  )

  const value = useMemo(
    (): MockReviewContextValue => ({
      reviews,
      pendingResponseCount,
      locationLabel: "Joe's Pizza – Main St.",
      setReviews: stableSetReviews,
    }),
    [reviews, pendingResponseCount, stableSetReviews]
  )

  return (
    <MockReviewContext.Provider value={value}>
      {children}
    </MockReviewContext.Provider>
  )
}

export const useMockReviewFeed = (): MockReviewContextValue => {
  const ctx = useContext(MockReviewContext)
  if (!ctx) {
    throw new Error('useMockReviewFeed must be used within MockReviewProvider')
  }
  return ctx
}
