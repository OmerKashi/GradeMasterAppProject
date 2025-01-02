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
    public class GradesController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public GradesController(GradeMasterDbContext context)
        {
            _context = context;
        }

        // GET: api/Grades
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Grades>>> GetGrades()
        {
            return await _context.Grades.ToListAsync();
        }

        // GET: api/Grades/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Grades>> GetGrades(int id)
        {
            var grades = await _context.Grades.FindAsync(id);

            if (grades == null)
            {
                return NotFound();
            }

            return grades;
        }

        [HttpGet("byStudentCourse")]
        public async Task<ActionResult<Grades>> GetGradesByStudentCourse(int studentId, int courseId) {
            try {
                // Query the Grades table for the specific student and course
                var grades = await _context.Grades
                    .FirstOrDefaultAsync(g => g.StudentId == studentId && g.CourseId == courseId);

                if (grades == null) {
                    return NotFound("Grade not found for the specified student and course.");
                }

                // Map the result to a DTO if needed (optional)
                var gradesDto = new GradesDTO {
                    Id = grades.Id,
                    StudentId = grades.StudentId,
                    CourseId = grades.CourseId,
                    FinalGrade = grades.FinalGrade,
                    SubbmissionsGrades = grades.SubbmissionsGrades,
                    Attendence = grades.Attendence,
                    ExamGrade = grades.ExamGrade
                };

                return Ok(gradesDto);
            } catch (Exception ex) {
                Console.WriteLine($"Error fetching grade: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching the grade.");
            }
        }

        // PUT: api/Grades/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrades(int id, Grades grades)
        { //GradesDTO?
            if (id != grades.Id)
            {
                return BadRequest();
            }

            _context.Entry(grades).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GradesExists(id))
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

        // POST: api/Grades
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Grades>> PostGrades(Grades grades)
        {
            _context.Grades.Add(grades);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGrades", new { id = grades.Id }, grades);
        }


        [HttpPost("saveGrades")]
        public async Task<IActionResult> SaveGrades([FromBody] IEnumerable<GradesDTO> grades) {
            try {
                foreach (var grade in grades) {
                    // Check if the grade entity already exists
                    var existingGrade = await _context.Grades
                        .FirstOrDefaultAsync(g => g.StudentId == grade.StudentId && g.CourseId == grade.CourseId);

                    if (existingGrade != null) {
                        // Update the existing grade
                        existingGrade.FinalGrade = grade.FinalGrade;
                        existingGrade.SubbmissionsGrades = grade.SubbmissionsGrades;
                        existingGrade.Attendence = grade.Attendence;
                        existingGrade.ExamGrade = grade.ExamGrade;

                        _context.Grades.Update(existingGrade);
                    } else {
                        // Insert a new grade record
                        var newGrade = new Grades {
                            StudentId = grade.StudentId,
                            CourseId = grade.CourseId,
                            FinalGrade = grade.FinalGrade,
                            SubbmissionsGrades = grade.SubbmissionsGrades,
                            Attendence = grade.Attendence,
                            ExamGrade = grade.ExamGrade
                        };

                        _context.Grades.Add(newGrade);
                    }
                }

                // Save all changes
                await _context.SaveChangesAsync();

                return Ok("Grades saved or updated successfully.");
            } catch (Exception ex) {
                Console.WriteLine($"Error saving or updating grades: {ex.Message}");
                return StatusCode(500, "An error occurred while saving or updating grades.");
            }
        }


        // DELETE: api/Grades/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGrades(int id)
        {
            var grades = await _context.Grades.FindAsync(id);
            if (grades == null)
            {
                return NotFound();
            }

            _context.Grades.Remove(grades);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GradesExists(int id)
        {
            return _context.Grades.Any(e => e.Id == id);
        }
    }
}
