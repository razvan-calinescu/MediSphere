using MediSphere.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetAllAsync();
        Task<Appointment> GetByIdAsync(int id);
        Task<IEnumerable<Appointment>> GetByDoctorIdAsync(string doctorId);
        Task<IEnumerable<Appointment>> GetByEmailAsync(string email);
        Task AddAsync(Appointment appointment);
        Task UpdateAsync(Appointment appointment);
        Task DeleteAsync(int id);

        Task<IEnumerable<Appointment>> GetAppointmentsByDoctorAndDateAsync(string doctorId, DateTime date);
    }

}
