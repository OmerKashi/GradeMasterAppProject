using GradeMasterAPI.DB.DbModules;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace GradeMasterAPI.DB {
    public class TeachersRepository {
        private readonly string _connectionString;

        public TeachersRepository() {
            _connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=GradeMasterEFDB;Integrated Security=True;Connect Timeout=30;";
        }

        public TeachersRepository(string connectionString) {
            _connectionString = connectionString;
        }

        public List<Teacher> GetAllTeachers() {
            List<Teacher> teachers = new List<Teacher>();

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    conn.Open();
                    var query = "SELECT * FROM Teachers";
                    var command = new SqlCommand(query, conn);

                    using (var reader = command.ExecuteReader()) {
                        while (reader.Read()) {
                            teachers.Add(new Teacher {
                                Id = reader.GetInt32(0),
                                Email = reader.GetString(1),
                                Password = reader.GetString(2),
                                FirstName = reader.GetString(3),
                                LastName = reader.GetString(4),
                                PhoneNumber = reader.GetString(5)
                            });
                        }
                    }
                }
            } catch (Exception ex) {
                throw new Exception($"Error retrieving teachers: {ex.Message}");
            }

            return teachers;
        }

        public Teacher GetTeacherById(int id) {
            Teacher teacher = null;

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    conn.Open();
                    var query = "SELECT * FROM Teachers WHERE Id = @Id";
                    var command = new SqlCommand(query, conn);
                    command.Parameters.AddWithValue("@Id", id);

                    using (var reader = command.ExecuteReader()) {
                        if (reader.Read()) {
                            teacher = new Teacher {
                                Id = reader.GetInt32(0),
                                Email = reader.GetString(1),
                                Password = reader.GetString(2),
                                FirstName = reader.GetString(3),
                                LastName = reader.GetString(4),
                                PhoneNumber = reader.GetString(5)
                            };
                        }
                    }
                }
            } catch (Exception ex) {
                throw new Exception($"Error retrieving teacher: {ex.Message}");
            }

            return teacher;
        }

        public string InsertTeacher(Teacher teacher) {
            string errors = "";

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    string query = "INSERT INTO Teachers (Email, Password, FirstName, LastName, PhoneNumber)" +
                                   "VALUES (@Email, @Password, @FirstName, @LastName, @PhoneNumber)";

                    using (SqlCommand cmd = new SqlCommand(query, conn)) {
                        cmd.Parameters.AddWithValue("@Email", teacher.Email);
                        cmd.Parameters.AddWithValue("@Password", teacher.Password);
                        cmd.Parameters.AddWithValue("@FirstName", teacher.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", teacher.LastName);
                        cmd.Parameters.AddWithValue("@PhoneNumber", teacher.PhoneNumber);

                        conn.Open();
                        int affectedRows = cmd.ExecuteNonQuery();
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

        public string UpdateTeacher(int id, Teacher teacher) {
            string errors = "";

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    string query = "UPDATE Teachers SET Email = @Email, Password = @Password, FirstName = @FirstName, " +
                                    "LastName = @LastName, PhoneNumber = @PhoneNumber" +
                                    "WHERE Id = @Id";

                    using (SqlCommand cmd = new SqlCommand(query, conn)) {
                        cmd.Parameters.AddWithValue("@Id", id);
                        cmd.Parameters.AddWithValue("@Email", teacher.Email);
                        cmd.Parameters.AddWithValue("@Password", teacher.Password);
                        cmd.Parameters.AddWithValue("@FirstName", teacher.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", teacher.LastName);
                        cmd.Parameters.AddWithValue("@PhoneNumber", teacher.PhoneNumber);

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

        public string DeleteTeacher(int id) {
            string errors = "";

            try {
                using (SqlConnection conn = new SqlConnection(_connectionString)) {
                    string query = "DELETE FROM Teachers WHERE Id = @Id";

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
