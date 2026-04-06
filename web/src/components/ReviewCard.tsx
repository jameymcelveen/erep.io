import { useCallback, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { getApiBaseUrl } from '@/lib/api-base'

export type ResponseTone = 'Professional' | 'Empathetic' | 'Firm'

export interface ReviewCardProps {
  reviewerName: string
  relativeTime: string
  reviewBody: string
  starCount: number
  critical?: boolean
}

interface DefenseDraftResponse {
  draft: string
  tone: string
}

const tones: ResponseTone[] = ['Professional', 'Empathetic', 'Firm']

export const ReviewCard = ({
  reviewerName,
  relativeTime,
  reviewBody,
  starCount,
  critical = false,
}: ReviewCardProps) => {
  const [draft, setDraft] = useState<string>('')
  const [loadingTone, setLoadingTone] = useState<ResponseTone | null>(null)
  const [lastTone, setLastTone] = useState<ResponseTone | null>(null)
  const [error, setError] = useState<string | null>(null)

  const requestDraft = useCallback(
    async (tone: ResponseTone) => {
      setLoadingTone(tone)
      setError(null)
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/DefenseDraft`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tone,
            reviewText: reviewBody,
            reviewerName,
          }),
        })
        const text = await response.text()
        if (!response.ok) {
          throw new Error(text || `HTTP ${response.status}`)
        }
        const data = JSON.parse(text) as DefenseDraftResponse
        setDraft(data.draft)
        setLastTone(tone)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not generate draft')
        setDraft('')
      } finally {
        setLoadingTone(null)
      }
    },
    [reviewBody, reviewerName]
  )

  const starsLabel =
    starCount <= 0
      ? '—'
      : Array.from({ length: Math.min(starCount, 5) }, () => '★').join('')

  return (
    <Card className="w-full max-w-3xl text-left shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-amber-500"
              aria-label={`${starCount} out of 5 stars`}
            >
              {starsLabel}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="font-medium text-foreground">
              by: {reviewerName}
            </span>
            <span className="text-muted-foreground">
              ({relativeTime})
            </span>
          </div>
        </div>
        {critical ? (
          <Badge variant="destructive" className="shrink-0 gap-1">
            <AlertTriangle className="size-3" aria-hidden />
            CRITICAL
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <blockquote className="border-l-2 border-muted-foreground/25 pl-4 text-foreground leading-relaxed">
          &ldquo;{reviewBody}&rdquo;
        </blockquote>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Generate Defense 👇
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Choose response tone"
          >
            {tones.map((tone) => (
              <Button
                key={tone}
                type="button"
                variant={lastTone === tone ? 'default' : 'outline'}
                size="sm"
                disabled={loadingTone !== null}
                aria-pressed={lastTone === tone}
                onClick={() => void requestDraft(tone)}
              >
                {loadingTone === tone ? '…' : tone}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Textarea
            className="min-h-36 font-sans text-sm leading-relaxed"
            placeholder={
              loadingTone
                ? 'Drafting…'
                : 'Pick a tone above to generate a draft response.'
            }
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            readOnly={loadingTone !== null}
            aria-busy={loadingTone !== null}
          />
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/40">
        <Button type="button" variant="secondary" size="sm" disabled={!draft}>
          Edit Draft
        </Button>
        <Button type="button" size="sm" disabled={!draft}>
          Post Response to Google 🚀
        </Button>
      </CardFooter>
    </Card>
  )
}
