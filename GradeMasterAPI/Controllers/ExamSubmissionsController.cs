using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GradeMasterAPI.DB;
using GradeMasterAPI.DB.DbModules;
using GradeMasterAPI.ApiModules;

namespace GradeMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamSubmissionsController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public ExamSubmissionsController(GradeMasterDbContext context)
        {
            _context = context;
        }

        // GET: api/ExamSubmissions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamSubmission>>> GetExamSubmission()
        {
            return await _context.ExamSubmission.ToListAsync();
        }

        // GET: api/ExamSubmissions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExamSubmission>> GetExamSubmission(int id)
        {
            var examSubmission = await _context.ExamSubmission.FindAsync(id);

            if (examSubmission == null)
            {
                return NotFound();
            }

            return examSubmission;
        }

        [HttpGet("byExam/{examId}")]
        public async Task<ActionResult<IEnumerable<ExamSubmission>>> GetExamSubmissionsByExam(int examId) {
            var submissions = await _context.ExamSubmission
                .Where(es => es.ExamId == examId)
                .Select(es => new {
                    es.Id,
                    es.StudentId,
                    es.ExamId,
                    es.SubmissionDate,
                    es.ExamFilePath,
                    es.Grade
                })
                .ToListAsync();

            if (!submissions.Any()) {
                return NotFound("No submissions found for this exam.");
            }

            return Ok(submissions);
        }



        // PUT: api/ExamSubmissions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExamSubmission(int id, ExamSubmissionDTO examSubmissionDTO)
        {
            var examSubmission = new ExamSubmission() {
                Id = examSubmissionDTO.Id,
                ExamFilePath = examSubmissionDTO.ExamFilePath,
                ExamId = examSubmissionDTO.ExamId,
                StudentId = examSubmissionDTO.StudentId,
                SubmissionDate = examSubmissionDTO.SubmissionDate,
                Grade = examSubmissionDTO.Grade,
            };

            if (id != examSubmission.Id)
            {
                return BadRequest();
            }

            _context.Entry(examSubmission).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExamSubmissionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ExamSubmissions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ExamSubmission>> PostExamSubmission(ExamSubmissionDTO examSubmissionDTO)
        {
            var examSubmission = new ExamSubmission() { 
                Id = examSubmissionDTO.Id,
                ExamFilePath = examSubmissionDTO.ExamFilePath,
                ExamId = examSubmissionDTO.ExamId,
                StudentId = examSubmissionDTO.StudentId,
                SubmissionDate = examSubmissionDTO.SubmissionDate,
                Grade = examSubmissionDTO.Grade,
            };

            _context.ExamSubmission.Add(examSubmission);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExamSubmission", new { id = examSubmission.Id }, examSubmission);
        }

        // DELETE: api/ExamSubmissions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExamSubmission(int id)
        {
            var examSubmission = await _context.ExamSubmission.FindAsync(id);
            if (examSubmission == null)
            {
                return NotFound();
            }

            _context.ExamSubmission.Remove(examSubmission);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExamSubmissionExists(int id)
        {
            return _context.ExamSubmission.Any(e => e.Id == id);
        }
    }
}
