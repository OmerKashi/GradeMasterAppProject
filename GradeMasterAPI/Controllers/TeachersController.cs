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
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace GradeMasterAPI.Controllers{

    [Route("api/[controller]")] // 'api/Teachers'
    [ApiController]
    public class TeachersController : ControllerBase{
        private readonly GradeMasterDbContext _context;

        public TeachersController(GradeMasterDbContext context) {
            _context = context;
        }

        
        [HttpGet("sorted")] //api/Teachers//sorted
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachersSortedByLastName(string sortedBy ="") {
            return await _context.Teachers.OrderBy(t => t.LastName).ToListAsync();
        }

        // GET: api/Teachers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers(){
            return await _context.Teachers.ToListAsync(); //SELECT SQL
        }

        // GET: api/Teachers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(int id) {
            Teacher? teacher = await _context.Teachers.FindAsync(id); //SELECT WHERE

            if (teacher == null){
                return NotFound();
            }

            return teacher;
        }

        // PUT: api/Teachers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(int id, TeacherDTO teacherDto) {

            var teacher = new Teacher() {
                Id = teacherDto.Id,
                Email = teacherDto.Email,
                Password = teacherDto.Password,
                FirstName = teacherDto.FirstName,
                LastName = teacherDto.LastName,
                PhoneNumber = teacherDto.PhoneNumber
            };

            if (id != teacher.Id){
                return BadRequest();
            }

            _context.Entry(teacher).State = EntityState.Modified;

            try{
                await _context.SaveChangesAsync();
            }catch (DbUpdateConcurrencyException){
                if (!TeacherExists(id)){ return NotFound(); }else{ throw; }
            }

            return NoContent(); //Response 204 - nothing happend 
        }

        // POST: api/Teachers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Teacher>> PostTeacher(TeacherDTO teacherDto){
            //string hashedPassword = _pass
            //teacherDto.Id = _context.Entry();
            var teacher = new Teacher() {
                Id = teacherDto.Id,
                Email = teacherDto.Email,
                Password = teacherDto.Password,
                FirstName = teacherDto.FirstName,
                LastName = teacherDto.LastName,
                PhoneNumber = teacherDto.PhoneNumber
            };

            //Add to DB
            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            //201 - object created 
            //response header(location): 'api/teacher/5  
            //body: teacher
            return CreatedAtAction("GetTeacher", new { id = teacher.Id }, teacher);
        }



        // DELETE: api/Teachers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id){
            var teacher = await _context.Teachers.FindAsync(id);

            if (teacher == null) { return NotFound(); }

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool TeacherExists(int id) {
            return _context.Teachers.Any(e => e.Id == id);
        }

    }
}
