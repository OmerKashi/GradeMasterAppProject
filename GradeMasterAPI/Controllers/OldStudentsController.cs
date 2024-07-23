using Microsoft.AspNetCore.Mvc;
using GradeMasterAPI.DB;
using GradeMasterAPI.DB.DbModules;
using System.Collections.Generic;
using GradeMasterAPI.ApiModules;

namespace GradeMasterAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class OldStudentsController : ControllerBase {
        private readonly StudentsRepository _studentsRepository;

        public OldStudentsController() {
            _studentsRepository = new StudentsRepository();
        }

        // GET: api/Students
        [HttpGet]
        public IActionResult GetAllStudents() {
            try {
                List<Student> students = _studentsRepository.GetAllStudents();
                return Ok(students);
            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Students/5
        [HttpGet("{id}", Name = "GetStudentById")]
        public IActionResult GetStudentById(int id) {
            try {
                Student? student = _studentsRepository.GetStudentById(id);
                if (student == null) {
                    return NotFound($"Student with id={id} not found.");
                }
                return Ok(student);
            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Students
        [HttpPost]
        public async Task<IActionResult> AddStudent([FromBody] StudentDTO studentDto) {

            try {
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

                if (student == null) {
                    return BadRequest("Student object is null.");
                }

                string error = await _studentsRepository.InsertStudentAsync(student);

                if (!string.IsNullOrEmpty(error)) {
                    return BadRequest($"Student not added: {error}");
                }

                return CreatedAtRoute("GetStudentById", new { id = student.Id }, student);

            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Students/5
        [HttpPut("{id}")]
        public IActionResult UpdateStudent(int id, [FromBody] StudentDTO studentDto) {
            try {
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

                if (student == null || id != student.Id) {
                    return BadRequest("Invalid student data.");
                }

                string error = _studentsRepository.UpdateStudent(id, student);
                if (!string.IsNullOrEmpty(error)) {
                    return BadRequest($"Student not updated: {error}");
                }

                return NoContent(); // 204 No Content
            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public IActionResult DeleteStudent(int id) {
            try {
                string error = _studentsRepository.DeleteStudent(id);
                if (!string.IsNullOrEmpty(error)) {
                    return BadRequest($"Student not deleted: {error}");
                }

                return NoContent(); // 204 No Content
            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
