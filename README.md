Bs.c Fullstack course - Final Project  

GradeMaster Overview:
GradeMaster is a web application that allows teachers to manage the grades of the students, their attendance and determine weights for the grades of the exams and assignments.
The entire application is managed in the client side as a web app in the teacher’s computer.

1.Client-Side:
 Architecture: Component-based architecture using React.
 Key Features:
   -State management using useState and useEffect.
   -API interaction using axios.
   -Modular design with APIs abstracted into separate files (e.g. AttendanceApi.js, AssignmentsApi.js, AssignmentSubmissionsApi, CoursesApi, EnrollmentsApi, ExamsApi, ExamSubmissionsApi, GradesApi, StudentsApi, TeachersApi).
   -React bootstrap

2. Server-Side:
 Architecture: RESTful API built with ASP.NET Core.
 Key Features:
  -Entity Framework Core for ORM and database operations.
  -Modular controllers for handling specific resources (AssignmentSubmissionsController, GradesController, etc.).
  -DTOs (e.g., AssignmentSubmissionAM) to shape API responses.

*Modules*
•	Client-Side Modules:
1.	Components: 
	Attendance.jsx
	Assignment.jsx
	FinalGrades.jsx
	Submissions.jsx
2.	APIs: 
	AttendanceApi.js
	AssignmentsApi.js
	ExamsSubmissionsApi.js
	GradesApi.js
3.	State Management: 
	Local state (useState) for managing component-specific data.
•	Server-Side Modules:
1.	Controllers: 
	AssignmentsController
	AssignmentSubmissionsController
	AttendancesController
	ExamSubmissionsController
	GradesController
2.	Entity Models: 
	Assignment, Exam, Attendance, Grades, Student, AssignmentSubmission, ExamSubmission
3.	Services (Implicit through DbContext and EF Core): 
	Entity management through DbContext.
________________________________________




