namespace api.Models;

public record DefenseDraftRequestDto(
    string Tone,
    string ReviewText,
    string? ReviewerName = null
);
