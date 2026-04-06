using api.Interfaces;
using api.Models;

namespace api.Services;

public class StatusService() : IStatusService
{
    public StatusResponseDto GetStatus() => new("Shields Up");
}
