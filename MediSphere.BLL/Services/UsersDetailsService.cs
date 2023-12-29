using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.BLL.Services
{
    public class UsersDetailsService
    {
        private readonly IUserDetailsRepository _userDetailsRepository;
        private readonly IConfiguration _configuration;

        public UsersDetailsService(IUserDetailsRepository userDetailsRepository, IConfiguration configuration)
        {
            _userDetailsRepository = userDetailsRepository;
            _configuration = configuration;
        }

        public async Task<UsersDetails> GetUserDetailsByEmailAsync(string email)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsByEmailAsync(email);
            if (userDetails == null)
            {
                return null;
            }

            return userDetails;
        }

        public async Task<UsersDetails> GetUserDetailsByCNPAsync(string cnp)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsByCNPAsync(cnp);
            if (userDetails == null)
            {
                return null;
            }

            return userDetails;
        }

        public async Task<bool> DeleteAsync(string Cnp)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsByCNPAsync(Cnp);

            if (userDetails == null)
                return false;

            await _userDetailsRepository.DeleteUserDetailsAsync(Cnp);

            return true;


        }

        public async Task<bool> AddUserDetailsAsync(string Cnp, string Email, string Gender, string Phone, string Birthdate, string BloodType, string Address)
        {
            if (await _userDetailsRepository.GetUserDetailsByCNPAsync(Cnp) != null)
            {
                return false;
            }

            DateTime bdate = DateTime.ParseExact(Birthdate, "dd.M.yyyy", null);

            var userDetails = new UsersDetails
            {
                cnp = Cnp,
                email = Email,
                gender = Gender,
                phone = Phone,
                birthdate = bdate,
                bloodType = BloodType,
                address = Address
    
            };

            await _userDetailsRepository.CreateUserDetailsAsync(userDetails);
            return true;
        }

        public async Task<bool> UpdateUserDetailsAsync(string Cnp, string Email, string Gender, string Phone, string Birthdate, string BloodType, string Address)
        {
            var userDetails = await _userDetailsRepository.GetUserDetailsByCNPAsync(Cnp);

            if (userDetails == null)
            {
                return false;
            }


            if (!string.IsNullOrEmpty(Gender))
                userDetails.gender = Gender;
            if (!string.IsNullOrEmpty(Phone))
                userDetails.phone = Phone;
            //     if (!string.IsNullOrEmpty(Birthdate))
            DateTime bdate = DateTime.ParseExact(Birthdate, "dd.M.yyyy", null);
            userDetails.birthdate = bdate;
            if (!string.IsNullOrEmpty(BloodType))
                userDetails.bloodType = BloodType;
            if (!string.IsNullOrEmpty(Address))
                userDetails.address = Address;


            await _userDetailsRepository.UpdateUserDetailsAsync(userDetails);

            return true;
        }
    }
}
