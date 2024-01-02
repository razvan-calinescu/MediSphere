using MediSphere.DAL.Entities;

public class DoctorSpecialtyService
{
    private readonly IDoctorSpecialtyRepository _repository;

    public DoctorSpecialtyService(IDoctorSpecialtyRepository repository)
    {
        _repository = repository;
    }

    public void AddDoctorSpecialty(DoctorSpecialities doctorSpecialty)
    {
        _repository.InsertDoctorSpecialty(doctorSpecialty);
    }

    public IEnumerable<DoctorSpecialities> RetrieveAllDoctorSpecialties()
    {
        return _repository.GetAllDoctorSpecialties();
    }

    public DoctorSpecialities FindSpecialtyByCNP(string cnp)
    {
        return _repository.GetSpecialtyByCNP(cnp);
    }
}
