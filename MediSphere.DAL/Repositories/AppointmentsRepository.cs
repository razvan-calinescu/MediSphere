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
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;

        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            return await _context.appointments.ToListAsync();
        }

        public async Task<Appointment> GetByIdAsync(int id)
        {
            return await _context.appointments.FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Appointment>> GetByDoctorIdAsync(string doctorId)
        {
            return await _context.appointments.Where(a => a.DoctorId == doctorId).ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetByEmailAsync(string email)
        {
            return await _context.appointments.Where(a => a.Email == email).ToListAsync();
        }

        public async Task AddAsync(Appointment appointment)
        {
            _context.appointments.Add(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Appointment appointment)
        {
            _context.appointments.Update(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var appointment = await _context.appointments.FirstOrDefaultAsync(a => a.Id == id);
            if (appointment != null)
            {
                _context.appointments.Remove(appointment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorAndDateAsync(string doctorId, DateTime date)
        {
            return await _context.appointments
                .Where(a => a.DoctorId == doctorId && a.Date.Date == date.Date)
                .ToListAsync();
        }


    }

}
