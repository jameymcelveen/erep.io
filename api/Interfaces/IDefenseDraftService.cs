using eRep.Api.Models;

namespace eRep.Api.Interfaces;

public interface IDefenseDraftService
{
    Task<DefenseDraftResponseDto> GenerateDraftAsync(
        DefenseDraftRequestDto request,
        CancellationToken cancellationToken = default);
}
