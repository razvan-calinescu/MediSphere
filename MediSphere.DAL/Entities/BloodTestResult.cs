using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Entities
{

    public class BloodTestResult
    {
        public int Id { get; set; }

        public string DoctorId { get; set; }

        public string PatientId { get; set; }

        public int HGB { get; set; }
        public int RBC { get; set; }
        public int WBC { get; set; }
        public int PLT { get; set; }
        public int MCV { get; set; }

        public DateTime DateTime { get; set; } = DateTime.Now;
    }
}
