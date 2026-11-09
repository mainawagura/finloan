using Microsoft.AspNetCore.Mvc;

namespace FinLoan.API.Controllers;

public class HealthController : BaseApiController
{
    [HttpGet]
    public IActionResult Check()
    {
        return Ok(new
        {
            status = "Healthy",
            layer = "FinLoan.API",
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
            timestampUtc = DateTime.UtcNow
        });
    }
}
