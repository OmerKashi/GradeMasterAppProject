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

namespace GradeMasterAPI.Controllers{

    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase {
        private readonly GradeMasterDbContext _context;

        public StudentsController(GradeMasterDbContext context) {
            _context = context;
        }

        // GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents() {
            return await _context.Students.ToListAsync();
        }

        //GET: api/Students/{email}
        [HttpGet("{email}")]
        public async Task<ActionResult<Student>> GetStudentByEmail(string _email) {
            var student = await _context.Students.FindAsync(_email);

            if (student == null) {
                return NotFound();
            }

            return student;
        }

        // GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id) {
            var student = await _context.Students.FindAsync(id);

            if (student == null) {
                return NotFound();
            }

            return student;
        }

        // PUT: api/Students/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, StudentDTO studentDto) {
            var student = new Student() {
                Id = studentDto.Id,
                FirstName = studentDto.FirstName,
                LastName = studentDto.LastName,
                Email = studentDto.Email,
                PhoneNumber = studentDto.PhoneNumber,
                Gender = studentDto.Gender,
                Address = studentDto.Address,
                EnrollmentDate = studentDto.EnrollmentDate,
                DateOfBirth = studentDto.DateOfBirth
            };

            if (id != student.Id) {
                return BadRequest();
            }

            _context.Entry(student).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!StudentExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Students
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(StudentDTO studentDto) {
            var student = new Student() {
                Id = studentDto.Id,
                FirstName = studentDto.FirstName,
                LastName = studentDto.LastName,
                Email = studentDto.Email,
                PhoneNumber = studentDto.PhoneNumber,
                Gender = studentDto.Gender,
                Address = studentDto.Address,
                EnrollmentDate = studentDto.EnrollmentDate,
                DateOfBirth = studentDto.DateOfBirth
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = student.Id }, student);
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id) {
            var student = await _context.Students.FindAsync(id);

            if (student == null) {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentExists(int id) {
            return _context.Students.Any(e => e.Id == id);
        }
    }
}
