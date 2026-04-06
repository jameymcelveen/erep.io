using eRep.Api.Interfaces;
using eRep.Api.Models;

namespace eRep.Api.Services;

public class StatusService() : IStatusService
{
    public StatusResponseDto GetStatus() => new("Shields Up");
}
