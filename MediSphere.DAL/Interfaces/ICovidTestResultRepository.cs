using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediSphere.DAL.Entities;

namespace MediSphere.DAL.Interfaces
{


    public interface ICovidTestResultRepository
    {
        Task<IEnumerable<CovidTestResult>> GetAllAsync();
        Task<CovidTestResult> GetByIdAsync(int id);
        Task<IEnumerable<CovidTestResult>> GetByPatientIdAsync(string patientId);
        Task AddAsync(CovidTestResult covidTestResult);
        Task UpdateAsync(CovidTestResult covidTestResult);
        Task DeleteAsync(int id);
    }
}
