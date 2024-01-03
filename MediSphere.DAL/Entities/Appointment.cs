using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Entities
{
    public class Appointment
    {
        public int Id { get; set; }
        public string DoctorId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public string FName { get; set; }
        public string LName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Specialty { get; set; }
    }

}
