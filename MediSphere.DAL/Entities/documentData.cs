using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Entities
{
    public class DocumentData
    {
        public int Id { get; set; }
        public string DoctorId { get; set; }
        public string PatientId { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public DateTime Issued { get; set; }

        public string DocumentType { get; set; }    
    }

}
