using GradeMasterAPI.DB;
using GradeMasterAPI.DB.DbModules;
using jwt.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GradeMasterAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase {
        private readonly StudentsRepository _studentsRepository;
        private readonly TeachersRepository _teachersRepository;
        private readonly IPasswordHasher<IdentityUser> _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly GradeMasterDbContext _context;

        public AuthController(
            StudentsRepository studentsRepository,
            TeachersRepository teachersRepository,
            IPasswordHasher<IdentityUser> passwordHasher,
            IJwtTokenGenerator jwtTokenGenerator,
            GradeMasterDbContext context) {
            _studentsRepository = studentsRepository;
            _teachersRepository = teachersRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
            _context = context;

        }

        [HttpPost("AuthUser")]
        public async Task<IActionResult> AuthUser([FromBody] UserRoleValidationRequest request) {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Role)) {
                return BadRequest("Email, password, and role are required.");
            }

            AuthResult authResult = null;
            string role = request.Role.ToLower();

            switch (role) {
                case "student":
                    authResult = await AuthStudent(request.Email, request.Password);
                    break;
                case "teacher":
                    authResult = await AuthTeacher(request.Email, request.Password);
                    break;
                default:
                    return BadRequest("Invalid role specified");
            }

            if (authResult.IsValid) {
                string token = _jwtTokenGenerator.GenerateToken(authResult.User as IdentityUser, role);
                return Ok(new { IsValid = true, Token = token, UserData = authResult.User });
            }
            return Unauthorized();
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request) {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Role)) {
                return BadRequest("Email, password, and role are required.");
            }
            switch (request.Role.ToLower()) {
                case "student":
                    var newStudent = new Student {
                        Email = request.Email,
                        Password = request.Password,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        DateOfBirth = request.DateOfBirth,
                        Gender = request.Gender,
                        PhoneNumber = request.PhoneNumber,
                        Address = request.Address,
                        EnrollmentDate = request.EnrollmentDate

                    };
                    _context.Students.Add(newStudent);
                    break;

                case "teacher":

                    var newTeacher = new Teacher {
                        Email = request.Email,
                        Password = request.Password,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        PhoneNumber = request.PhoneNumber
                    };
                    _context.Teachers.Add(newTeacher);
                    break;

                default: return BadRequest("Invalid role");
            }
            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateException) { return StatusCode(500, "Could not add user"); }

            return Ok("User registered succesfully");
        }


        private async Task<AuthResult> AuthStudent(string email, string password) {
            // Implement your student authentication logic here
            // Example:
            var student = _studentsRepository.GetAllStudents().FirstOrDefault(s => s.Email == email);
            if (student != null && _passwordHasher.VerifyHashedPassword(new IdentityUser(), student.Password, password) == PasswordVerificationResult.Success) {
                return new AuthResult { IsValid = true, User = student };
            }
            return new AuthResult { IsValid = false };
        }

        private async Task<AuthResult> AuthTeacher(string email, string password) {
            // Implement your teacher authentication logic here
            // Example:
            var teacher = _teachersRepository.GetAllTeachers().FirstOrDefault(t => t.Email == email);
            if (teacher != null && _passwordHasher.VerifyHashedPassword(new IdentityUser(), teacher.Password, password) == PasswordVerificationResult.Success) {
                return new AuthResult { IsValid = true, User = teacher };
            }
            return new AuthResult { IsValid = false };
        }
    }
}

namespace jwt.Services {
    public interface IJwtTokenGenerator {
        string GenerateToken(IdentityUser user, string role);
    }
}

public class UserRoleValidationRequest {
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}

public class AuthResult {
    public bool IsValid { get; set; }
    public object User { get; set; }
}

public class RegisterRequest {
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public DateTime EnrollmentDate { get; set; }

}

