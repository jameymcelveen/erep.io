namespace api.Options;

public class DefenseDraftOptions
{
    public const string SectionName = "DefenseDraft";

    /// <summary>OpenAI API key. Falls back to environment variable OPENAI_API_KEY when empty.</summary>
    public string OpenAiApiKey { get; set; } = "";

    public string OpenAiModel { get; set; } = "gpt-4o-mini";
}
