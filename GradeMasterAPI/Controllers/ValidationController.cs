using Microsoft.AspNetCore.Mvc;
using GradeMasterAPI.DB;
using GradeMasterAPI.DB.DbModules;
using System.Linq;

namespace GradeMasterAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class ValidationController : ControllerBase {
        private readonly StudentsRepository _studentsRepository;
        private readonly TeachersRepository _teachersRepository;

        public ValidationController() {
            _studentsRepository = new StudentsRepository();
            _teachersRepository = new TeachersRepository();
        }

        [HttpPost("validateUserRole")]
        public IActionResult ValidateUserRole([FromBody] UserRoleValidationRequest request) {
            if (request.Role == "student") {
                var student = _studentsRepository.GetAllStudents().FirstOrDefault(s => s.Email == request.Email);
                return Ok(new { isValid = student != null });
            } else if (request.Role == "teacher") {
                var teacher = _teachersRepository.GetAllTeachers().FirstOrDefault(t => t.Email == request.Email);
                return Ok(new { isValid = teacher != null });
            }

            return BadRequest("Invalid role.");
        }
    }

    public class UserRoleValidationRequest {
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
