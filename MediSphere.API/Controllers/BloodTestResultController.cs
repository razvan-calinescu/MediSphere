namespace MediSphere.API.Controllers
{
    using MediSphere.BLL.Services;
    using MediSphere.DAL.Entities;
    using Microsoft.AspNetCore.Mvc;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [ApiController]
    [Route("[controller]")]
    public class BloodTestResultController : ControllerBase
    {
        private readonly BloodTestResultService _service;

        public BloodTestResultController(BloodTestResultService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IEnumerable<BloodTestResult>> GetAll()
        {
            return await _service.GetAllBloodTestResultsAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BloodTestResult>> Get(int id)
        {
            var bloodTestResult = await _service.GetBloodTestResultByIdAsync(id);
            if (bloodTestResult == null)
            {
                return NotFound();
            }
            return bloodTestResult;
        }

        [HttpGet("patient/{patientId}")]
        public async Task<IEnumerable<BloodTestResult>> GetByPatientId(string patientId)
        {
            return await _service.GetBloodTestResultsByPatientIdAsync(patientId);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BloodTestResult bloodTestResult)
        {
            await _service.AddBloodTestResultAsync(bloodTestResult);
            return CreatedAtAction(nameof(Get), new { id = bloodTestResult.Id }, bloodTestResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] BloodTestResult bloodTestResult)
        {
            if (id != bloodTestResult.Id)
            {
                return BadRequest();
            }

            await _service.UpdateBloodTestResultAsync(bloodTestResult);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteBloodTestResultAsync(id);
            return NoContent();
        }
    }

}
