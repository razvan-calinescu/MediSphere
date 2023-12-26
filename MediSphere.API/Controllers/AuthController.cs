using MediSphere.BLL.Services;
using Microsoft.AspNetCore.Mvc;

namespace MediSphere.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login(string username, string password)
        {
            var token = _authService.Authenticate(username, password);
            if (token == null)
                return Unauthorized();

            return Ok(new { Token = token });
        }
    }
}
