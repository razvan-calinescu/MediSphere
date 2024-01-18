using MediSphere.BLL.Services;
using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MediSphere.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DocumentDataController : ControllerBase
    {
        private readonly DocumentDataService _service;

        public DocumentDataController(DocumentDataService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentData>>> GetAll()
        {
            return Ok(await _service.GetAllDocumentsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentData>> Get(int id)
        {
            var documentData = await _service.GetDocumentByIdAsync(id);
            if (documentData == null)
                return NotFound();
            return documentData;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DocumentData documentData)
        {
            await _service.CreateDocumentAsync(documentData);
            return CreatedAtAction(nameof(Get), new { id = documentData.Id }, documentData);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] DocumentData documentData)
        {
            if (id != documentData.Id)
                return BadRequest();

            await _service.UpdateDocumentAsync(documentData);
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _service.DeleteDocumentAsync(id);
            return NoContent();
        }
    }


}
