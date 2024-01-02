using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using MediSphere.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using MediSphere.DAL;

public class DoctorSpecialtyRepository : IDoctorSpecialtyRepository
{
    private readonly ApplicationDbContext _context; 

    public DoctorSpecialtyRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public void InsertDoctorSpecialty(DoctorSpecialities doctorSpecialty)
    {
        _context.DoctorSpecialties.Add(doctorSpecialty);
        _context.SaveChanges();
    }

    public IEnumerable<DoctorSpecialities> GetAllDoctorSpecialties()
    {
        return _context.DoctorSpecialties.ToList();
    }

    public DoctorSpecialities GetSpecialtyByCNP(string cnp)
    {
        return _context.DoctorSpecialties.FirstOrDefault(d => d.CNP == cnp);
    }
}
