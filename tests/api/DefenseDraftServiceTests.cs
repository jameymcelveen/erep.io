using api.Interfaces;
using api.Models;
using api.Options;
using api.Services;
using Microsoft.Extensions.DependencyInjection;

namespace api.Tests;

public class DefenseDraftServiceTests
{
    private static IDefenseDraftService CreateSut(string apiKey = "")
    {
        var services = new ServiceCollection();
        services.AddOptions();
        services.Configure<DefenseDraftOptions>(o =>
        {
            o.OpenAiApiKey = apiKey;
            o.OpenAiModel = "gpt-4o-mini";
        });
        services.AddHttpClient();
        services.AddTransient<IDefenseDraftService, DefenseDraftService>();
        return services.BuildServiceProvider().GetRequiredService<IDefenseDraftService>();
    }

    [Theory]
    [InlineData("Professional")]
    [InlineData("professional")]
    [InlineData("Empathetic")]
    [InlineData("FIRM")]
    public async Task GenerateDraft_ReturnsNonEmptyDraft_ForValidTones(string tone)
    {
        var sut = CreateSut("");
        var request = new DefenseDraftRequestDto(
            tone,
            "Delivery took 2 hours. Pizza was cold.",
            "AngryBob");

        var result = await sut.GenerateDraftAsync(request);

        Assert.False(string.IsNullOrWhiteSpace(result.Draft));
        Assert.Contains("AngryBob", result.Draft);
        Assert.True(
            result.Tone is "Professional" or "Empathetic" or "Firm",
            $"Unexpected normalized tone: {result.Tone}");
    }

    [Fact]
    public async Task GenerateDraft_Throws_ForInvalidTone()
    {
        var sut = CreateSut("");
        var request = new DefenseDraftRequestDto(
            "Casual",
            "Some review text.",
            null);

        await Assert.ThrowsAsync<ArgumentException>(() => sut.GenerateDraftAsync(request));
    }

    [Fact]
    public async Task GenerateDraft_NormalizesToneNames()
    {
        var sut = CreateSut("");
        var request = new DefenseDraftRequestDto(
            "empathetic",
            "Bad experience.",
            "Pat");

        var result = await sut.GenerateDraftAsync(request);

        Assert.Equal("Empathetic", result.Tone);
    }
}
