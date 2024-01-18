using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MediSphere.DAL.Repositories
{
    public class CovidTestResultRepository : ICovidTestResultRepository
    {
        private readonly ApplicationDbContext _context;

        public CovidTestResultRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CovidTestResult>> GetAllAsync()
        {
            return await _context.Set<CovidTestResult>().ToListAsync();
        }

        public async Task<CovidTestResult> GetByIdAsync(int id)
        {
            return await _context.Set<CovidTestResult>().FindAsync(id);
        }

        public async Task<IEnumerable<CovidTestResult>> GetByPatientIdAsync(string patientId)
        {
            return await _context.Set<CovidTestResult>().Where(t => t.PatientId == patientId).ToListAsync();
        }

        public async Task AddAsync(CovidTestResult covidTestResult)
        {
            await _context.Set<CovidTestResult>().AddAsync(covidTestResult);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(CovidTestResult covidTestResult)
        {
            _context.Set<CovidTestResult>().Update(covidTestResult);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var covidTestResult = await GetByIdAsync(id);
            if (covidTestResult != null)
            {
                _context.Set<CovidTestResult>().Remove(covidTestResult);
                await _context.SaveChangesAsync();
            }
        }
    }
}
