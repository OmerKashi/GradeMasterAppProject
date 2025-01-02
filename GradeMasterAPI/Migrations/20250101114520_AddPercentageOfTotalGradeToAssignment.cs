using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GradeMasterAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPercentageOfTotalGradeToAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) {


            migrationBuilder.AddColumn<int>(
                name: "PercentageOfTotalGrade",
                table: "Assignment",
                type: "int",
                nullable: false,
                defaultValue: 0);



        }
    }
}
