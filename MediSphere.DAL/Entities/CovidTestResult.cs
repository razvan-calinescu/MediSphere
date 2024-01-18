using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Entities
{
    public class CovidTestResult
    {
        public int Id { get; set; }

        public string DoctorId { get; set; }

        public string PatientId { get; set; }

        public int Pcr { get; set; }

        public int Antigen { get; set; }

        public DateTime DateTime { get; set; } = DateTime.Now;
    }
}
