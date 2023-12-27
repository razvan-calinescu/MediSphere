using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.BLL.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<string> AuthenticateAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null || !VerifyPassword(user, password, user.password))
            {
                return null;
            }

            return GenerateJwtToken(user);
        }

        public async Task<bool> DeleteAsync(string Cnp)
        {
            var user = await _userRepository.GetByCNPAsync(Cnp);

            if (user == null)
                return false;

            await _userRepository.DeleteUserAsync(Cnp);

            return true;


        }

        public async Task<bool> UpdateAsync(string Cnp, string Email = null, string Password = null, string FName = null, string LName = null, string Role = null)
        {
            var user = await _userRepository.GetByCNPAsync(Cnp);

            if (user == null)
            {
                return false;
            }


            if (!string.IsNullOrEmpty(Email))
                user.email = Email;
            if (!string.IsNullOrEmpty(FName))
                user.fname = FName;
            if (!string.IsNullOrEmpty(LName))
                user.lname = LName;
            if (!string.IsNullOrEmpty(Role))
                user.role = Role;

            if (!string.IsNullOrEmpty(Password))
                user.password = getHash(user, Password);

            await _userRepository.UpdateUserAsync(user);

            return true;

        }

        public string getHash(User user, string providedPassword)
        {
            var passwordHasher = new PasswordHasher<User>();
            return passwordHasher.HashPassword(user, providedPassword);
        }

        public async Task<bool> RegisterAsync(string Cnp, string Email, string Password, string FName, string LName, string Role)
        {
            if (await _userRepository.GetByCNPAsync(Cnp) != null)
            {
                return false; 
            }

            var user = new User
            {
                cnp = Cnp,
                email = Email,
                fname = FName,
                lname = LName,
                role = Role,
                password = getHash(new User(), Password)
            };

            await _userRepository.CreateUserAsync(user);
            return true;
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.email),
                    new Claim(ClaimTypes.NameIdentifier, user.cnp.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private bool VerifyPassword(User user, string providedPassword, string storedHash)
        {
            var passwordHasher = new PasswordHasher<User>();
            var verificationResult = passwordHasher.VerifyHashedPassword(new User(), storedHash, providedPassword);


            return verificationResult == PasswordVerificationResult.Success;
        
        }

    }
}
