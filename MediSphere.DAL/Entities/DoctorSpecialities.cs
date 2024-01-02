using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Entities
{
    public class DoctorSpecialities
    {
        [Key]
        public string CNP { get; set; }
        public string Specialty { get; set; }

    }
}
