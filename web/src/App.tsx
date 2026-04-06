import { useEffect, useState } from 'react'
import {
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { ReviewCard } from '@/components/ReviewCard'
import { getApiBaseUrl } from '@/lib/api-base'
import { useMockReviewFeed } from '@/providers/MockReviewProvider'

interface ApiStatus {
  status: string
}

const App = () => {
  const { reviews, pendingResponseCount, locationLabel } = useMockReviewFeed()
  const [apiStatus, setApiStatus] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    void (async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/Status`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          return
        }
        const data: ApiStatus = await response.json()
        setApiStatus(data.status)
      } catch {
        /* optional: API not running */
      }
    })()
    return () => controller.abort()
  }, [])

  return (
    <div className="theme flex min-h-screen bg-muted/40 text-foreground">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-lg">
            <Shield className="size-5 text-primary" aria-hidden />
          </span>
          <div className="leading-tight">
            <div className="font-heading text-sm font-semibold">EchoRep</div>
            <div className="text-xs text-muted-foreground">Defense</div>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 p-2 text-sm">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-normal text-muted-foreground"
            type="button"
          >
            <LayoutDashboard className="size-4 opacity-70" />
            Dashboard
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-start gap-2 font-medium"
            type="button"
          >
            <MessageSquare className="size-4" />
            Reviews
            <Badge variant="secondary" className="ml-auto">
              {pendingResponseCount} New
            </Badge>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-normal text-muted-foreground"
            type="button"
          >
            <Settings className="size-4 opacity-70" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-normal text-muted-foreground"
            type="button"
          >
            <CreditCard className="size-4 opacity-70" />
            Billing
          </Button>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center gap-2 md:hidden">
            <Shield className="size-6 text-primary" />
            <span className="font-heading font-semibold">EchoRep</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden text-sm text-muted-foreground md:inline">
              Loc:
            </span>
            <Button variant="outline" size="sm" type="button">
              {locationLabel} ▾
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {apiStatus ? (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                API: {apiStatus}
              </span>
            ) : null}
            <Button variant="outline" size="sm" type="button">
              User Settings
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 md:p-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-1">
              <h1 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
                YOUR REVIEW DEFENSE FEED
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="h-8 px-2" type="button">
                  Showing: All ▾
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2" type="button">
                  Sort: Newest ▾
                </Button>
              </div>
            </div>

            {reviews.map((review) =>
              review.replyStatus === 'reply_sent' ? (
                <Card key={review.id} className="text-left shadow-sm">
                  <CardHeader className="border-b border-border/80 pb-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span
                        className="text-amber-500"
                        aria-label={`${review.starCount} stars`}
                      >
                        {Array.from({ length: review.starCount }, () => '★').join(
                          ''
                        )}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="font-medium">by: {review.reviewerName}</span>
                      <span className="text-muted-foreground">
                        ({review.relativeTime})
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <p className="leading-relaxed">&ldquo;{review.body}&rdquo;</p>
                    <Badge variant="outline" className="rounded-md">
                      Reply Sent ▾
                    </Badge>
                  </CardContent>
                </Card>
              ) : (
                <ReviewCard
                  key={review.id}
                  reviewerName={review.reviewerName}
                  relativeTime={review.relativeTime}
                  reviewBody={review.body}
                  starCount={review.starCount}
                  critical={review.critical}
                />
              )
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
