using MediSphere.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Interfaces
{
    public interface IBloodTestResultRepository
    {
        Task<IEnumerable<BloodTestResult>> GetAllAsync();
        Task<BloodTestResult> GetByIdAsync(int id);
        Task<IEnumerable<BloodTestResult>> GetByPatientIdAsync(string patientId);
        Task AddAsync(BloodTestResult bloodTestResult);
        Task UpdateAsync(BloodTestResult bloodTestResult);
        Task DeleteAsync(int id);
    }
}
