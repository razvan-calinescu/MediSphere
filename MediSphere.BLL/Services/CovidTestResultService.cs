using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.BLL.Services
{
    public class CovidTestResultService
    {
        private readonly ICovidTestResultRepository _repository;

        public CovidTestResultService(ICovidTestResultRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CovidTestResult>> GetAllCovidTestResultsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<CovidTestResult> GetCovidTestResultByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<CovidTestResult>> GetCovidTestResultsByPatientIdAsync(string patientId)
        {
            return await _repository.GetByPatientIdAsync(patientId);
        }

        public async Task AddCovidTestResultAsync(CovidTestResult covidTestResult)
        {
            await _repository.AddAsync(covidTestResult);
        }

        public async Task UpdateCovidTestResultAsync(CovidTestResult covidTestResult)
        {
            await _repository.UpdateAsync(covidTestResult);
        }

        public async Task DeleteCovidTestResultAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
