using MediSphere.BLL.Services;
using MediSphere.DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MediSphere.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CovidTestResultController : ControllerBase
    {
        private readonly CovidTestResultService _service;

        public CovidTestResultController(CovidTestResultService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IEnumerable<CovidTestResult>> GetAll()
        {
            return await _service.GetAllCovidTestResultsAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CovidTestResult>> Get(int id)
        {
            var covidTestResult = await _service.GetCovidTestResultByIdAsync(id);
            if (covidTestResult == null)
            {
                return NotFound();
            }
            return covidTestResult;
        }

        [HttpGet("patient/{patientId}")]
        public async Task<IEnumerable<CovidTestResult>> GetByPatientId(string patientId)
        {
            return await _service.GetCovidTestResultsByPatientIdAsync(patientId);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CovidTestResult covidTestResult)
        {
            await _service.AddCovidTestResultAsync(covidTestResult);
            return CreatedAtAction(nameof(Get), new { id = covidTestResult.Id }, covidTestResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CovidTestResult covidTestResult)
        {
            if (id != covidTestResult.Id)
            {
                return BadRequest();
            }

            await _service.UpdateCovidTestResultAsync(covidTestResult);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteCovidTestResultAsync(id);
            return NoContent();
        }
    }
}
