using MediSphere.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Interfaces
{
    public interface IDocumentDataRepository
    {
        Task<IEnumerable<DocumentData>> GetAllAsync();
        Task<DocumentData> GetByIdAsync(int id);
        Task AddAsync(DocumentData documentData);
        Task UpdateAsync(DocumentData documentData);
        Task DeleteAsync(int id);
    }

}
