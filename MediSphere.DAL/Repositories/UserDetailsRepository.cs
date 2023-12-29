using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Repositories
{
    public class UserDetailsRepository : IUserDetailsRepository
    {
        private readonly ApplicationDbContext _context;

        public UserDetailsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UsersDetails> GetUserDetailsByCNPAsync(string Cnp)
        {
            return await _context.UsersDetails.FirstOrDefaultAsync(uDetails => uDetails.cnp == Cnp);
        }

        public async Task<UsersDetails> GetUserDetailsByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(user => user.email == email);
            return await _context.UsersDetails.FirstOrDefaultAsync(uDetails => uDetails.cnp == user.cnp);

        }
        public async Task CreateUserDetailsAsync(UsersDetails userDetails)
        {
            _context.UsersDetails.Add(userDetails);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateUserDetailsAsync(UsersDetails userDetails)
        {
            _context.UsersDetails.Update(userDetails);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteUserDetailsAsync(string cnp)
        {
            var userDetails = await GetUserDetailsByCNPAsync(cnp);
            if (userDetails != null)
            {
                _context.UsersDetails.Remove(userDetails);
                await _context.SaveChangesAsync();
            }
        }

    }
}
