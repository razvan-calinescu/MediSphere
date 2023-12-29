using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Entities
{
    public class UsersDetails
    {
        public int id { get; set; }
        public string email { get; set; }
        public string cnp { get; set; }
        public string gender { get; set; }
        public string phone { get; set; }
        public DateTime birthdate { get; set; }
        public string bloodType { get; set; }
        public string address { get; set; }
    }
}
