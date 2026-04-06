using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatusController(IStatusService statusService) : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(statusService.GetStatus());
}
