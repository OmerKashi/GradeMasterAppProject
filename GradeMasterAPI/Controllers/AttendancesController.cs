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
using NuGet.DependencyResolver;

namespace GradeMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendancesController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public AttendancesController(GradeMasterDbContext context)
        {
            _context = context;
        } 
        private bool CourseExists(int id) {
            return _context.Courses.Any(e => e.Id == id);
        }

        // GET: api/Attendances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendance()
        {
            return await _context.Attendance.ToListAsync();
        }

        // GET: api/Attendances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetAttendance(int id)
        {
            var attendance = await _context.Attendance.FindAsync(id);

            if (attendance == null)
            {
                return NotFound();
            }

            return attendance;
        }

        [HttpGet("byStudentCourse/{studentId}/{courseId}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendancesByStudentCourse(int studentId, int courseId) {
            var attendances = await _context.Attendance
                                    .Where(a => a.StudentId == studentId && a.CourseId == courseId)
                                    .Select(a => new {
                                        a.Id,
                                        a.RoomNum,
                                        a.Start,
                                        a.DurationMinutes,
                                        a.Status,
                                        a.Notes,
                                        a.CourseId,
                                        a.StudentId,
                                        StudentName = a.StudentRef.FirstName + " " + a.StudentRef.LastName
                                    })
                                    .ToListAsync();

            if (!attendances.Any()) {
                return Ok(new List<Attendance>()); // Return an empty list instead of 404
            }

            return Ok(attendances);
        }


        [HttpGet("byCourse/{courseId}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendancesByCourse(int courseId) {

            var attendances = await _context.Attendance
                                    .Where(a => a.CourseId == courseId)
                                    .Include(a => a.StudentRef)
                                    .Select(a => new {
                                        a.Id,
                                        a.RoomNum,
                                        a.Start,
                                        a.DurationMinutes,
                                        a.Status,
                                        a.Notes,
                                        a.CourseId,
                                        a.StudentId,
                                        StudentName = a.StudentRef.FirstName + " " + a.StudentRef.LastName
                                    })
                                    .ToListAsync();

            if (!attendances.Any()) {
                return Ok(new List<Attendance>()); // Return an empty list instead of 404
            }

            return Ok(attendances);
        }



        // PUT: api/Attendances/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttendance(int id, AttendanceDto attendanceDto)
        {
            var attendance = new Attendance {
                Id = attendanceDto.Id,
                StudentId = attendanceDto.StudentId,
                CourseId = attendanceDto.CourseId,
                Start = attendanceDto.Start,
                Status = attendanceDto.Status, 
                Notes = attendanceDto.Notes,
                RoomNum = attendanceDto.RoomNum,
                DurationMinutes = attendanceDto.DurationMinutes
            };

            if (id != attendance.Id) {
                return BadRequest();
            }
            _context.Entry(attendance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttendanceExists(id))
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

        // POST: api/Attendances/searchOrCreate
        [HttpPost("searchOrCreate")]
        public async Task<ActionResult<IEnumerable<Attendance>>> SearchOrCreateAttendance(AttendanceDto searchDto) {
            var attendances = await _context.Attendance
                .Include(a => a.StudentRef)
                .Where(a => a.CourseId == searchDto.CourseId && a.Start.Date == searchDto.Start.Date)
                .ToListAsync();

            if (attendances.Any()) {
                return attendances; // Return existing attendances if found
            }

            // If not found, create new attendance records
            var students = await _context.Enrollments
                .Where(e => e.CourseId == searchDto.CourseId)
                .Select(e => e.Student)
                .ToListAsync();

            foreach (var student in students) {
                var newAttendance = new Attendance {
                    StudentId = student.Id,
                    CourseId = searchDto.CourseId,
                    Start = searchDto.Start,
                    Status = "Absent", // Default status
                    Notes = "",
                    RoomNum = searchDto.RoomNum,
                    DurationMinutes = searchDto.DurationMinutes
                };
                _context.Attendance.Add(newAttendance);
            }

            await _context.SaveChangesAsync();
            return await _context.Attendance
                .Include(a => a.StudentRef)
                .Where(a => a.CourseId == searchDto.CourseId && a.Start.Date == searchDto.Start.Date)
                .ToListAsync();
        }

        // POST: api/Attendances
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Attendance>> PostAttendance(AttendanceDto attendanceDTO)
        {
            var course = await _context.Courses.FindAsync(attendanceDTO.CourseId);

            if (course == null) {
                return NotFound($"No course found with ID {attendanceDTO.CourseId}.");
            }

            var attendance = new Attendance() {
                Id = attendanceDTO.Id,
                CourseId = attendanceDTO.CourseId,
                Start = attendanceDTO.Start,
                RoomNum = attendanceDTO.RoomNum,
                DurationMinutes = attendanceDTO.DurationMinutes,
                Notes = attendanceDTO.Notes,
                StudentId = attendanceDTO.StudentId,
                Status = attendanceDTO.Status,
            };

            _context.Attendance.Add(attendance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttendance", new { id = attendance.Id }, attendance);
        }

        // DELETE: api/Attendances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendance(int id)
        {
            var attendance = await _context.Attendance.FindAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            _context.Attendance.Remove(attendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttendanceExists(int id)
        {
            return _context.Attendance.Any(e => e.Id == id);
        }
    }
}
