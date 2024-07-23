using GradeMasterAPI.DB.DbModules;
using System.Data.SqlClient;

namespace GradeMasterAPI.DB {
    public class CoursesRepository {

        private readonly string _connectionString;

        public CoursesRepository() {
            _connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=GradeMasterEFDB;Integrated Security=True;Connect Timeout=30;";
        }

        public CoursesRepository(string connectionString) {
            _connectionString = connectionString;
        }


        public List<Course> GetAllCoursess() {
            List<Course> courses = new List<Course>();

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    conn.Open();
                    var query = "SELECT * FROM Course";
                    var command = new SqlCommand(query, conn);

                    using (var reader = command.ExecuteReader()) {
                        while (reader.Read()) {
                            courses.Add(new Course {
                                Id = reader.GetInt32(0),
                                CourseName = reader.GetString(1),
                                CourseDescription = reader.GetString(2)
                            });
                        }
                    }
                }
            } catch (Exception ex) {
                throw new Exception($"Error retrieving courses: {ex.Message}");
            }

            return courses;
        }




    }
}
