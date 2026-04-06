using api.Models;

namespace api.Interfaces;

public interface IDefenseDraftService
{
    Task<DefenseDraftResponseDto> GenerateDraftAsync(
        DefenseDraftRequestDto request,
        CancellationToken cancellationToken = default);
}
