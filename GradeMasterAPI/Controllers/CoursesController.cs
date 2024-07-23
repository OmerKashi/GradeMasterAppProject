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

namespace GradeMasterAPI.Controllers{

    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase {
        private readonly GradeMasterDbContext _context;

        public CoursesController(GradeMasterDbContext context){
            _context = context;
        }

        // GET: api/Courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses() {
            return await _context.Courses.ToListAsync();
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
                CourseDescription = courseDto.CourseDescription
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

            var course = new Course() {
                Id = courseDto.Id,
                CourseName = courseDto.CourseName,
                CourseDescription = courseDto.CourseDescription
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
