using MediSphere.DAL.Entities;
using MediSphere.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MediSphere.DAL.Repositories
{
    public class DocumentDataRepository : IDocumentDataRepository
    {
        private readonly ApplicationDbContext _context;

        public DocumentDataRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DocumentData>> GetAllAsync()
        {
            return await _context.documentData.ToListAsync();
        }

        public async Task<DocumentData> GetByIdAsync(int id)
        {
            return await _context.documentData.FindAsync(id);
        }

        public async Task AddAsync(DocumentData documentData)
        {
            _context.documentData.Add(documentData);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(DocumentData documentData)
        {
            _context.Entry(documentData).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var documentData = await _context.documentData.FindAsync(id);
            if (documentData != null)
            {
                _context.documentData.Remove(documentData);
                await _context.SaveChangesAsync();
            }
        }
    }

}
