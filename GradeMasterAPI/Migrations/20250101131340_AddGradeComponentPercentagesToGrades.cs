using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GradeMasterAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddGradeComponentPercentagesToGrades : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExamsGrade",
                table: "Grades",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "GradeComponentPercentages",
                table: "Grades",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExamsGrade",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "GradeComponentPercentages",
                table: "Grades");
        }
    }
}
