using eRep.Api.Models;

namespace eRep.Api.Interfaces;

public interface IStatusService
{
    StatusResponseDto GetStatus();
}
