using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.BLL.Services
{
    public class DocumentDataService
    {
        private readonly IDocumentDataRepository _repository;

        public DocumentDataService(IDocumentDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<DocumentData>> GetAllDocumentsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<DocumentData> GetDocumentByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task CreateDocumentAsync(DocumentData documentData)
        {
            await _repository.AddAsync(documentData);
        }

        public async Task UpdateDocumentAsync(DocumentData documentData)
        {
            await _repository.UpdateAsync(documentData);
        }

        public async Task DeleteDocumentAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }

}
