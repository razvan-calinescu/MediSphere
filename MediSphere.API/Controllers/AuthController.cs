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
        public async Task<IActionResult> Login(string email, string password)
        {
         
            var token = await _authService.AuthenticateAsync(email, password);
            if (token == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            return Ok(new { Token = token });
        }

        [HttpGet("User/email")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _authService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("Invalid CNP.");
            }

            return Ok(user);
        }

        [HttpGet("User/cnp")]
        public async Task<IActionResult> GetUserByCNP(string cnp)
        {
            Console.WriteLine("Here");
            var user = await _authService.GetUserByCNPAsync(cnp);
            if (user == null)
            {
                return BadRequest("Invalid email.");
            }

            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(string cnp, string email, string password, string fName, string lName, string role)
        {
            bool userExists = await _authService.RegisterAsync(cnp, email, password, fName, lName, role);

            if (!userExists)
            {
                return BadRequest("User already exists.");
            }

            return Ok("User registered successfully.");
        }

        [HttpPut("editUser")]
        public async Task<IActionResult> EditUser(string cnp, string email, string password, string fName, string lName, string role)
        {
            bool userExists = await _authService.UpdateAsync(cnp, email, password, fName, lName, role);

            if (userExists == true)
            {
                return Ok("User updated successfully.");
            }

            return BadRequest("User not existent.");

        }


        [HttpDelete("deleteUser/{cnp}")]
        public async Task<IActionResult> DeleteUser(string cnp)
        {
            bool userExists = await _authService.DeleteAsync(cnp);

            if (userExists == true)
            {
                return Ok("User deleted successfully.");
            }

            return BadRequest("User not existent.");

        }

    }
}
