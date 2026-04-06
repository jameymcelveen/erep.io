using eRep.Api.Interfaces;
using eRep.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace eRep.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DefenseDraftController(IDefenseDraftService defenseDraftService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<DefenseDraftResponseDto>> Post(
        [FromBody] DefenseDraftRequestDto? body,
        CancellationToken cancellationToken)
    {
        if (body is null || string.IsNullOrWhiteSpace(body.ReviewText))
        {
            return BadRequest("ReviewText is required.");
        }

        try
        {
            var result = await defenseDraftService
                .GenerateDraftAsync(body, cancellationToken)
                .ConfigureAwait(false);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
