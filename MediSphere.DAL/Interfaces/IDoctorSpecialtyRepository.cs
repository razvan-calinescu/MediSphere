using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using MediSphere.DAL.Entities;

public interface IDoctorSpecialtyRepository
{
    void InsertDoctorSpecialty(DoctorSpecialities doctorSpecialty);
    IEnumerable<DoctorSpecialities> GetAllDoctorSpecialties();
    DoctorSpecialities GetSpecialtyByCNP(string cnp);
}

