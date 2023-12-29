using MediSphere.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Interfaces
{
    public interface IUserDetailsRepository
    {
        Task<UsersDetails> GetUserDetailsByCNPAsync(string cnp);
        Task<UsersDetails> GetUserDetailsByEmailAsync(string email);
        Task CreateUserDetailsAsync(UsersDetails userDetails);
        Task UpdateUserDetailsAsync(UsersDetails userDetails);
        Task DeleteUserDetailsAsync(string cnp);
    }
}
