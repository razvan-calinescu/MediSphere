using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.BLL.Services
{

    public class BloodTestResultService
    {
        private readonly IBloodTestResultRepository _repository;

        public BloodTestResultService(IBloodTestResultRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<BloodTestResult>> GetAllBloodTestResultsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<BloodTestResult> GetBloodTestResultByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<BloodTestResult>> GetBloodTestResultsByPatientIdAsync(string patientId)
        {
            return await _repository.GetByPatientIdAsync(patientId);
        }

        public async Task AddBloodTestResultAsync(BloodTestResult bloodTestResult)
        {
            await _repository.AddAsync(bloodTestResult);
        }

        public async Task UpdateBloodTestResultAsync(BloodTestResult bloodTestResult)
        {
            await _repository.UpdateAsync(bloodTestResult);
        }

        public async Task DeleteBloodTestResultAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}