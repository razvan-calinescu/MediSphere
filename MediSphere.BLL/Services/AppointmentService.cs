using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.BLL.Services
{
    public class AppointmentService
    {
        private readonly IAppointmentRepository _repository;

        public AppointmentService(IAppointmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(string doctorId)
        {
            return await _repository.GetByDoctorIdAsync(doctorId);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByEmailAsync(string email)
        {
            return await _repository.GetByEmailAsync(email);
        }

        public async Task CreateAppointmentAsync(Appointment appointment)
        {
            await _repository.AddAsync(appointment);
        }

        public async Task UpdateAppointmentAsync(Appointment appointment)
        {
            await _repository.UpdateAsync(appointment);
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<string>> GetAvailableSlotsAsync(string doctorId, DateTime date)
        {
            var appointments = await _repository.GetAppointmentsByDoctorAndDateAsync(doctorId, date);
            var bookedSlots = appointments.Select(a => a.Date.TimeOfDay).ToList();

            var availableSlots = new List<string>();
            var startTime = new TimeSpan(9, 0, 0); // 09:00 AM
            var endTime = new TimeSpan(16, 30, 0); // 04:30 PM

            for (var time = startTime; time <= endTime; time = time.Add(new TimeSpan(0, 30, 0)))
            {
                // Exclude the time slot if it matches any booked slot
                if (!bookedSlots.Any(b => b.Hours == time.Hours && b.Minutes == time.Minutes))
                {
                    availableSlots.Add(time.ToString(@"hh\:mm"));
                }
            }

            return availableSlots;
        }


    }

}
