using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Repositories
{
    using MediSphere.DAL.Entities;
    using MediSphere.DAL.Interfaces;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class BloodTestResultRepository : IBloodTestResultRepository
    {
        private readonly ApplicationDbContext _context;

        public BloodTestResultRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BloodTestResult>> GetAllAsync()
        {
            return await _context.Set<BloodTestResult>().ToListAsync();
        }

        public async Task<BloodTestResult> GetByIdAsync(int id)
        {
            return await _context.Set<BloodTestResult>().FindAsync(id);
        }

        public async Task<IEnumerable<BloodTestResult>> GetByPatientIdAsync(string patientId)
        {
            return await _context.Set<BloodTestResult>().Where(t => t.PatientId == patientId).ToListAsync();
        }

        public async Task AddAsync(BloodTestResult bloodTestResult)
        {
            await _context.Set<BloodTestResult>().AddAsync(bloodTestResult);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(BloodTestResult bloodTestResult)
        {
            _context.Set<BloodTestResult>().Update(bloodTestResult);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var bloodTestResult = await GetByIdAsync(id);
            if (bloodTestResult != null)
            {
                _context.Set<BloodTestResult>().Remove(bloodTestResult);
                await _context.SaveChangesAsync();
            }
        }
    }

}
