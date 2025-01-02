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
using System.Diagnostics;

namespace GradeMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentSubmissionsController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public AssignmentSubmissionsController(GradeMasterDbContext context)
        {
            _context = context;
        }

        // GET: api/AssignmentSubmissions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssignmentSubmission>>> GetAssignmentSubmission()
        {
            return await _context.AssignmentSubmission.ToListAsync();
        }

        // GET: api/AssignmentSubmissions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssignmentSubmission>> GetAssignmentSubmission(int id)
        {
            var assignmentSubmission = await _context.AssignmentSubmission.FindAsync(id);

            if (assignmentSubmission == null)
            {
                return NotFound();
            }

            return assignmentSubmission;
        }

        [HttpGet("byAssignments")]
        public async Task<ActionResult<IEnumerable<AssignmentSubmission>>> GetAssignmentSubmissionsByAssignments([FromQuery] List<int> assignmentIds) {
            var submissions = await _context.AssignmentSubmission
                .Where(a => assignmentIds.Contains(a.AssignmentId))
                .Select(a => new {       
                    a.Id,        
                    a.AssignmentId,
                    a.StudentId,
                    a.Grade
                })
                .ToListAsync();

            if (!submissions.Any()) {
                return Ok(new List<AssignmentSubmission>());
            }

            return Ok(submissions);
        }



        // PUT: api/AssignmentSubmissions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssignmentSubmission(int id, AssignmentSubmissionDTO assignmentSubmissionDto)
        {
            var assignmentSubmission = new AssignmentSubmission() {
                Id = 0,
                FilePath = assignmentSubmissionDto.FilePath,
                AssignmentId = assignmentSubmissionDto.AssignmentId,
                StudentId = assignmentSubmissionDto.StudentId,
                SubmissionDate = assignmentSubmissionDto.SubmissionDate,
                Feedback = assignmentSubmissionDto.Feedback,
                Grade = assignmentSubmissionDto.Grade,
            };

            if (id != assignmentSubmission.Id)
            {
                return BadRequest();
            }

            _context.Entry(assignmentSubmission).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssignmentSubmissionExists(id))
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

        // POST: api/AssignmentSubmissions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AssignmentSubmission>> PostAssignmentSubmission(AssignmentSubmissionDTO assignmentSubmissionDto)
        {

            Console.WriteLine($"Assignment ID: {assignmentSubmissionDto.AssignmentId}");
            Console.WriteLine($"Student ID: {assignmentSubmissionDto.StudentId}");

            var assignmentSubmission = new AssignmentSubmission() { 
                Id = 0,
                FilePath = assignmentSubmissionDto.FilePath,
                AssignmentId = assignmentSubmissionDto.AssignmentId,
                StudentId = assignmentSubmissionDto.StudentId,
                SubmissionDate = assignmentSubmissionDto.SubmissionDate,
                Feedback = assignmentSubmissionDto.Feedback,
                Grade = assignmentSubmissionDto.Grade,
            };

            _context.AssignmentSubmission.Add(assignmentSubmission);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssignmentSubmission", new { id = assignmentSubmission.Id }, assignmentSubmission);
        }

        // DELETE: api/AssignmentSubmissions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignmentSubmission(int id)
        {
            var assignmentSubmission = await _context.AssignmentSubmission.FindAsync(id);
            if (assignmentSubmission == null)
            {
                return NotFound();
            }

            _context.AssignmentSubmission.Remove(assignmentSubmission);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AssignmentSubmissionExists(int id)
        {
            return _context.AssignmentSubmission.Any(e => e.Id == id);
        }
    }
}
