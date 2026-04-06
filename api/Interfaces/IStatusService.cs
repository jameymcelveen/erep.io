using api.Models;

namespace api.Interfaces;

public interface IStatusService
{
    StatusResponseDto GetStatus();
}
