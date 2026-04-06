using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using api.Interfaces;
using api.Models;
using api.Options;
using Microsoft.Extensions.Options;

namespace api.Services;

public class DefenseDraftService(
    IOptions<DefenseDraftOptions> options,
    IHttpClientFactory httpClientFactory) : IDefenseDraftService
{
    private static readonly string[] ValidTones = ["Professional", "Empathetic", "Firm"];

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    public async Task<DefenseDraftResponseDto> GenerateDraftAsync(
        DefenseDraftRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var normalizedTone = NormalizeTone(request.Tone);
        var opts = options.Value;

        if (!string.IsNullOrWhiteSpace(opts.OpenAiApiKey))
        {
            try
            {
                var openAiDraft = await RequestOpenAiDraftAsync(
                    opts,
                    normalizedTone,
                    request,
                    cancellationToken).ConfigureAwait(false);
                if (!string.IsNullOrWhiteSpace(openAiDraft))
                {
                    return new DefenseDraftResponseDto(openAiDraft.Trim(), normalizedTone);
                }
            }
            catch (HttpRequestException)
            {
                /* fall back to templates */
            }
            catch (TaskCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                /* timeout — fall back */
            }
            catch (JsonException)
            {
                /* bad payload — fall back */
            }
        }

        var draft = BuildTemplateDraft(normalizedTone, request);
        return new DefenseDraftResponseDto(draft, normalizedTone);
    }

    private static string NormalizeTone(string toneInput)
    {
        var normalized = toneInput.Trim();
        var tone = ValidTones.FirstOrDefault(
            t => string.Equals(t, normalized, StringComparison.OrdinalIgnoreCase))
            ?? throw new ArgumentException($"Tone must be one of: {string.Join(", ", ValidTones)}");
        return tone;
    }

    private static string BuildTemplateDraft(string tone, DefenseDraftRequestDto request)
    {
        var name = string.IsNullOrWhiteSpace(request.ReviewerName) ? "there" : request.ReviewerName.Trim();

        return tone switch
        {
            "Professional" =>
                $"Hi {name},\n\nThank you for sharing your experience. We are sorry the delivery and food quality did not meet the standard you should expect from us. We take feedback seriously and are reviewing what went wrong with our timing and team interactions on your order. Please contact us at your earliest convenience so we can make this right.\n\nWith appreciation,\nJoe's Pizza – Main St.",
            "Empathetic" =>
                $"Hi {name},\n\nWe're truly sorry you went through this — waiting two hours for cold food and feeling dismissed by our staff is not okay. You deserved so much better. We'd love the chance to apologize directly and replace your meal on us. Please reply here or call the store and ask for a manager; we're here to help.\n\nWarmly,\nJoe's Pizza",
            "Firm" =>
                $"Hi {name},\n\nWe hold ourselves to clear standards: on-time delivery, hot food, and respectful service. Your order missed all three, and we own that failure. We've flagged this with our dispatch and shift leads. If you'd like a refund or remake, message us within 48 hours and reference this review — we'll take care of it promptly.\n\nJoe's Pizza – Main St.",
            _ => throw new InvalidOperationException("Unexpected tone."),
        };
    }

    private async Task<string?> RequestOpenAiDraftAsync(
        DefenseDraftOptions opts,
        string normalizedTone,
        DefenseDraftRequestDto request,
        CancellationToken cancellationToken)
    {
        var name = string.IsNullOrWhiteSpace(request.ReviewerName) ? "the reviewer" : request.ReviewerName.Trim();
        var system =
            "You write short public replies for a local restaurant on Google Business Profile. " +
            "Be sincere and professional. Do not use markdown. Do not accuse the reviewer of lying. " +
            "Offer to make things right when appropriate. Output only the reply text.";

        var user =
            $"Desired tone: {normalizedTone}\n" +
            $"Reviewer display name: {name}\n" +
            $"Review text:\n{request.ReviewText.Trim()}\n\n" +
            "Write the reply only, with no preamble or title.";

        var payload = new OpenAiChatRequest(
            opts.OpenAiModel,
            [new OpenAiMessage("system", system), new OpenAiMessage("user", user)],
            Temperature: 0.65,
            MaxTokens: 500);

        using var http = httpClientFactory.CreateClient();
        using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
        {
            Content = new StringContent(
                JsonSerializer.Serialize(payload, JsonOptions),
                Encoding.UTF8,
                "application/json"),
        };
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", opts.OpenAiApiKey);

        using var response = await http.SendAsync(req, cancellationToken).ConfigureAwait(false);
        var body = await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var parsed = JsonSerializer.Deserialize<OpenAiChatResponse>(body, JsonOptions);
        var text = parsed?.Choices?.FirstOrDefault()?.Message?.Content;
        return string.IsNullOrWhiteSpace(text) ? null : text;
    }

    private sealed record OpenAiMessage(string Role, string Content);

    private sealed record OpenAiChatRequest(
        string Model,
        OpenAiMessage[] Messages,
        double Temperature,
        [property: JsonPropertyName("max_tokens")] int MaxTokens);

    private sealed record OpenAiChatResponse(OpenAiChoice[]? Choices);

    private sealed record OpenAiChoice(OpenAiMessage? Message);
}
