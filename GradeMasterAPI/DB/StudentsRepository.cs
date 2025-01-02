using GradeMasterAPI.DB.DbModules;
using System.Data.SqlClient;

namespace GradeMasterAPI.DB {
    public class StudentsRepository {
        private readonly string _connectionString;

        public StudentsRepository() {
            _connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=GradeMasterEFDB;Integrated Security=True;Connect Timeout=30;";
        }

        public StudentsRepository(string connectionString) {
            _connectionString = connectionString;
        }

        public List<Student> GetAllStudents() {
            List<Student> students = new List<Student>();

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    conn.Open();
                    var query = "SELECT * FROM Students";
                    var command = new SqlCommand(query, conn);

                    using (var reader = command.ExecuteReader()) {
                        while (reader.Read()) {
                            students.Add(new Student {
                                Id = reader.GetInt32(0),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                DateOfBirth = reader.GetDateTime(3),
                                Gender = reader.GetString(4),
                                PhoneNumber = reader.GetString(5),
                                Address = reader.GetString(6),
                                Email = reader.GetString(7),
                                EnrollmentDate = reader.GetDateTime(8)
                            });
                        }
                    }
                }
            } catch (Exception ex) {
                throw new Exception($"Error retrieving students: {ex.Message}");
            }

            return students;
        }

        public Student? GetStudentById(int id) {
            Student? student = null;

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    conn.Open();
                    var query = "SELECT * FROM Students WHERE Id = @Id";
                    var command = new SqlCommand(query, conn);
                    command.Parameters.AddWithValue("@Id", id);

                    using (var reader = command.ExecuteReader()) {
                        if (reader.Read()) {
                            student = new Student {
                                Id = reader.GetInt32(0),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                DateOfBirth = reader.GetDateTime(3),
                                Gender = reader.GetString(4),
                                PhoneNumber = reader.GetString(5),
                                Address = reader.GetString(6),
                                Email = reader.GetString(7),
                                EnrollmentDate = reader.GetDateTime(8)
                            };
                        }
                    }
                }
            } catch (Exception ex) {
                throw new Exception($"Error retrieving student: {ex.Message}");
            }

            return student;
        }

        public async Task<string> InsertStudentAsync(Student student) {
            string errors = "";

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    string query = "INSERT INTO Students (FirstName, LastName, DateOfBirth, Gender, PhoneNumber, Address, Email, EnrollmentDate)" +
                                   "VALUES (@FirstName, @LastName, @DateOfBirth, @Gender, @PhoneNumber, @Address, @Email, @EnrollmentDate)";

                    using (SqlCommand cmd = new SqlCommand(query, conn)) {
                        cmd.Parameters.AddWithValue("@FirstName", student.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", student.LastName);
                        cmd.Parameters.AddWithValue("@DateOfBirth", student.DateOfBirth);
                        cmd.Parameters.AddWithValue("@Gender", student.Gender);
                        cmd.Parameters.AddWithValue("@PhoneNumber", student.PhoneNumber);
                        cmd.Parameters.AddWithValue("@Address", student.Address);
                        cmd.Parameters.AddWithValue("@Email", student.Email);
                        cmd.Parameters.AddWithValue("@EnrollmentDate", student.EnrollmentDate);

                        conn.Open();
                        int affectedRows = await cmd.ExecuteNonQueryAsync();
                        if (affectedRows == 0) {
                            errors = "Insert not committed";
                        }
                    }
                }
            } catch (Exception ex) {
                errors = $"Exception: {ex.Message}";
            }

            return errors;
        }

        public string UpdateStudent(int id, Student student) {
            string errors = "";

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    string query = "UPDATE Students SET FirstName = @FirstName, LastName = @LastName, DateOfBirth = @DateOfBirth, Gender = @Gender, " +
                                   "PhoneNumber = @PhoneNumber, Address = @Address, Email = @Email, EnrollmentDate = @EnrollmentDate " +
                                   "WHERE Id = @Id";

                    using (SqlCommand cmd = new SqlCommand(query, conn)) {
                        cmd.Parameters.AddWithValue("@FirstName", student.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", student.LastName);
                        cmd.Parameters.AddWithValue("@DateOfBirth", student.DateOfBirth);
                        cmd.Parameters.AddWithValue("@Gender", student.Gender);
                        cmd.Parameters.AddWithValue("@PhoneNumber", student.PhoneNumber);
                        cmd.Parameters.AddWithValue("@Address", student.Address);
                        cmd.Parameters.AddWithValue("@Email", student.Email);
                        cmd.Parameters.AddWithValue("@EnrollmentDate", student.EnrollmentDate);
                        cmd.Parameters.AddWithValue("@Id", id);

                        conn.Open();
                        int affectedRows = cmd.ExecuteNonQuery();
                        if (affectedRows == 0) {
                            errors = "Update not committed";
                        }
                    }
                }
            } catch (Exception ex) {
                errors = $"Exception: {ex.Message}";
            }

            return errors;
        }

        public string DeleteStudent(int id) {
            string errors = "";

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    string query = "DELETE FROM Students WHERE Id = @Id";

                    using (SqlCommand cmd = new SqlCommand(query, conn)) {
                        cmd.Parameters.AddWithValue("@Id", id);

                        conn.Open();
                        int affectedRows = cmd.ExecuteNonQuery();
                        if (affectedRows == 0) {
                            errors = "Delete not committed";
                        }
                    }
                }
            } catch (Exception ex) {
                errors = $"Exception: {ex.Message}";
            }

            return errors;
        }
    }
}
