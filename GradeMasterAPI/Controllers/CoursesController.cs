﻿using GradeMasterAPI.ApiModules;
using GradeMasterAPI.DB;
using GradeMasterAPI.DB.DbModules;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GradeMasterAPI.Controllers {

    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase {
        private readonly GradeMasterDbContext _context;

        public CoursesController(GradeMasterDbContext context) {
            _context = context;
        }

        // GET: api/Courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses() {
            return await _context.Courses.ToListAsync();
        }

        // GET: api/Courses/byTeacher/{id}
        [HttpGet("byTeacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<Course>>> GetCoursesByTeacher(int teacherId) {
            /*var teacher = await _context.Teachers.FindAsync(teacherId);
            if (teacher == null) {
                return NotFound($"Teacher with ID {teacherId} not found.");
            }

            var courses = await _context.Courses.Where(c => c.TeacherId == teacherId).ToListAsync();
            return Ok(courses);*/

            var teacher = await _context.Teachers.FindAsync(teacherId);

            if (teacher == null) {
                return NotFound($"Teacher with ID {teacherId} not found.");
            }

            var courses = await _context.Courses.Where(c => c.TeacherId == teacherId).Select( c=> new CourseDTO { Id = c.Id, CourseName = c.CourseName, CourseDescription = c.CourseDescription, TeacherId = c.TeacherId}).ToListAsync();
            if (courses == null) {
                return NotFound($"No courses were found for Teacher with ID {teacherId}.");
            }

            return Ok(courses);
        }

        // GET: api/Courses/{courseId}/students
        [HttpGet("{courseId}/students")]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudentsInCourse(int courseId) {
            var course = await _context.Courses
                .Include(c => c.Enrollments)
                .ThenInclude(e => e.Student)
                .FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null) {
                return NotFound("Course not found");
            }

            // Using HashSet to avoid duplicates, assuming Student entity has properly overridden Equals and GetHashCode methods
            var uniqueStudents = new HashSet<Student>(course.Enrollments.Select(e => e.Student));
            return Ok(uniqueStudents);
        }

        // GET: api/Courses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(int id) {
            var course = await _context.Courses.FindAsync(id);

            if (course == null) {
                return NotFound();
            }

            return course;
        }

        // PUT: api/Courses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(int id, CourseDTO courseDto) {

            var course = new Course() {
                Id = courseDto.Id,
                CourseName = courseDto.CourseName,
                CourseDescription = courseDto.CourseDescription,
                TeacherId = courseDto.TeacherId
            };

            if (id != course.Id) {
                return BadRequest();
            }

            _context.Entry(course).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!CourseExists(id)) { return NotFound(); } else { throw; }
            }

            return NoContent(); //Response 204 - nothing happend 

        }

        // POST: api/Courses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse(CourseDTO courseDto) {
            var teacher = await _context.Teachers.FindAsync(courseDto.TeacherId);
            if (teacher == null) {
                return BadRequest($"Teacher {courseDto.TeacherId} does not exist");
            }

            var course = new Course {
                //Id = courseDto.Id,
                CourseName = courseDto.CourseName,
                CourseDescription = courseDto.CourseDescription,
                TeacherId = courseDto.TeacherId
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCourse", new { id = course.Id }, course);
        }

        // DELETE: api/Courses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id) {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) {
                return NotFound();
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseExists(int id) {
            return _context.Courses.Any(e => e.Id == id);
        }
    }
}
