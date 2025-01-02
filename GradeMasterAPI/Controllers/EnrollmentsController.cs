using GradeMasterAPI.ApiModules;
using GradeMasterAPI.DB;
using GradeMasterAPI.DB.DbModules;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace GradeMasterAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentsController : ControllerBase {
        private readonly GradeMasterDbContext _context;
        private readonly StudentsController _studentsController;

        public EnrollmentsController(GradeMasterDbContext context) {
            _context = context;
        }

        // GET: api/Enrollments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollment() {
            return await _context.Enrollments.ToListAsync();
        }

        // GET: api/Enrollments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Enrollment>> GetEnrollment(int id) {
            var enrollment = await _context.Enrollments.FindAsync(id);

            if (enrollment == null) {
                return NotFound();
            }

            return enrollment;
        }

        // PUT: api/Enrollments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEnrollment(int id, EnrollmentDTO enrollmentDTO) {
            var enrollment = new Enrollment() {
                Id = enrollmentDTO.Id,
                StudentId = enrollmentDTO.StudentId,
                CourseId = enrollmentDTO.CourseId,
                EnrollmentDate = enrollmentDTO.EnrollmentDate,
                FinalGrade = enrollmentDTO.FinalGrade,
            };

            if (id != enrollment.Id) {
                return BadRequest();
            }

            _context.Entry(enrollment).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!EnrollmentExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Enrollments
        
        [HttpPost]
        public async Task<ActionResult<Enrollment>> PostEnrollment(EnrollmentDTO enrollmentDTO) {
            // Check if the student exists
            var student = await _context.Students.FindAsync(enrollmentDTO.StudentId);
            if (student == null) {
                return NotFound($"No student found with ID {enrollmentDTO.StudentId}.");
            }

            // Check if the course exists
            var course = await _context.Courses.FindAsync(enrollmentDTO.CourseId);
            if (course == null) {
                return NotFound($"No course found with ID {enrollmentDTO.CourseId}.");
            }

            var enrollment = new Enrollment() {
                Id = enrollmentDTO.Id,
                StudentId = enrollmentDTO.StudentId,
                CourseId = enrollmentDTO.CourseId,
                EnrollmentDate = enrollmentDTO.EnrollmentDate,
                FinalGrade = enrollmentDTO.FinalGrade,
                Student = student,
                Course = course
            };


            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEnrollment", new { id = enrollment.Id }, enrollment);
        }

        // DELETE: api/Enrollments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnrollment(int id) {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null) {
                return NotFound();
            }

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EnrollmentExists(int id) {
            return _context.Enrollments.Any(e => e.Id == id);
        }

        [HttpGet("bycourse/{courseId}")]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudentByCourse(int courseId) {
            var students = await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Select(e => e.Student)
                .ToListAsync();

            return Ok(students);
        }

    }
}
