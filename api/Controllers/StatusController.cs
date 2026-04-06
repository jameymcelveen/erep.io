using eRep.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace eRep.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatusController(IStatusService statusService) : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(statusService.GetStatus());
}
