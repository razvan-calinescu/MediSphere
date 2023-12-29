using MediSphere.BLL.Services;
using Microsoft.AspNetCore.Mvc;

namespace MediSphere.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserDetailsController : ControllerBase
    {
        private readonly UsersDetailsService _userDetailsService;

        public UserDetailsController(UsersDetailsService userDetailsService)
        {
            _userDetailsService = userDetailsService;
        }

        [HttpGet("UserDetails/email")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var userDetails = await _userDetailsService.GetUserDetailsByEmailAsync(email);
            if (userDetails == null)
            {
                return BadRequest("Invalid email.");
            }

            return Ok(userDetails);
        }

        [HttpGet("UserDetails/cnp")]
        public async Task<IActionResult> GetUserByCNP(string cnp)
        {
            Console.WriteLine("Here");
            var userDetails = await _userDetailsService.GetUserDetailsByCNPAsync(cnp);
            if (userDetails == null)
            {
                return BadRequest("Invalid cnp.");
            }

            return Ok(userDetails);
        }

        [HttpPost("addUserDetails")]
        public async Task<IActionResult> Register(string cnp, string email, string gender, string phone, string birthdate, string bloodType, string address)
        {
            bool userDetailsExists = await _userDetailsService.AddUserDetailsAsync(cnp, email, gender, phone, birthdate, bloodType, address);

            if (!userDetailsExists)
            {
                return BadRequest("User Details already exist.");
            }

            return Ok("User Details registered successfully.");
        }

        [HttpPut("editUserDetails")]
        public async Task<IActionResult> EditUserDetails(string cnp, string email, string gender, string phone, string birthdate, string bloodType, string address)
        {
            bool userDetailsExists = await _userDetailsService.UpdateUserDetailsAsync(cnp, email, gender, phone, birthdate, bloodType, address);

            if (userDetailsExists == true)
            {
                return Ok("User Details updated successfully.");
            }

            return BadRequest("User not existent.");

        }


        [HttpDelete("deleteUserDetails/{cnp}")]
        public async Task<IActionResult> DeleteUser(string cnp)
        {
            bool userDetailsExist = await _userDetailsService.DeleteAsync(cnp);

            if (userDetailsExist == true)
            {
                return Ok("User Details deleted successfully.");
            }

            return BadRequest("User Details not existent.");

        }
    }
}
