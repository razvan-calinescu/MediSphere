using MediSphere.BLL.Services;
using MediSphere.DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MediSphere.API.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly AppointmentService _service;

        public AppointmentController(AppointmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _service.GetAllAppointmentsAsync();
            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            var appointment = await _service.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                return NotFound($"Appointment with ID {id} not found.");
            }
            return Ok(appointment);
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetAppointmentsByDoctorId(string doctorId)
        {
            var appointments = await _service.GetAppointmentsByDoctorIdAsync(doctorId);
            return Ok(appointments);
        }

        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetAppointmentsByEmail(string email)
        {
            var appointments = await _service.GetAppointmentsByEmailAsync(email);
            return Ok(appointments);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment appointment)
        {
            if (appointment == null)
            {
                return BadRequest("Appointment data is required.");
            }

            await _service.CreateAppointmentAsync(appointment);
            return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.Id }, appointment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] Appointment appointment)
        {
            if (appointment == null)
            {
                return BadRequest("Appointment data is required.");
            }

            var existingAppointment = await _service.GetAppointmentByIdAsync(id);
            if (existingAppointment == null)
            {
                return NotFound($"Appointment with ID {id} not found.");
            }

            await _service.UpdateAppointmentAsync(appointment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _service.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                return NotFound($"Appointment with ID {id} not found.");
            }

            await _service.DeleteAppointmentAsync(id);
            return NoContent();
        }

        [HttpGet("available-slots/{doctorId}/{date}")]
        public async Task<IActionResult> GetAvailableSlots(string doctorId, DateTime date)
        {
            if (string.IsNullOrWhiteSpace(doctorId) || date == default)
            {
                return BadRequest("Invalid doctor ID or date.");
            }

            var availableSlots = await _service.GetAvailableSlotsAsync(doctorId, date);
            return Ok(availableSlots);
        }

    }
}
