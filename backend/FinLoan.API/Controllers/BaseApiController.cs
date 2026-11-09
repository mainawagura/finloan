using Microsoft.AspNetCore.Mvc;

namespace FinLoan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public abstract class BaseApiController : ControllerBase
{
}
