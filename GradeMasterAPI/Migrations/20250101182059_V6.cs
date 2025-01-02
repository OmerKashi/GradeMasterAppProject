using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GradeMasterAPI.Migrations
{
    /// <inheritdoc />
    public partial class V6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ExamsGrade",
                table: "Grades",
                newName: "ExamGrade");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ExamGrade",
                table: "Grades",
                newName: "ExamsGrade");
        }
    }
}
