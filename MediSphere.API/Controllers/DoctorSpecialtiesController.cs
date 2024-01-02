using MediSphere.DAL.Entities;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("[controller]")]
public class DoctorSpecialtyController : ControllerBase
{
    private readonly DoctorSpecialtyService _service;

    public DoctorSpecialtyController(DoctorSpecialtyService service)
    {
        _service = service;
    }

    [HttpPost]
    public IActionResult Post([FromBody] DoctorSpecialities doctorSpecialty)
    {
        _service.AddDoctorSpecialty(doctorSpecialty);
        return Ok();
    }

    [HttpGet]
    public ActionResult<IEnumerable<DoctorSpecialities>> Get()
    {
        return Ok(_service.RetrieveAllDoctorSpecialties());
    }

    [HttpGet("{cnp}")]
    public ActionResult<DoctorSpecialities> GetByCNP(string cnp)
    {
        var specialty = _service.FindSpecialtyByCNP(cnp);
        if (specialty == null)
        {
            return NotFound();
        }

        return Ok(specialty);
    }
}

