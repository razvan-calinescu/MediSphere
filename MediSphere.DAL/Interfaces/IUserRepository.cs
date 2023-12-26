using MediSphere.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(string cnp);
        Task<User> GetByUsernameAsync(string email);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string cnp);

    }
}
