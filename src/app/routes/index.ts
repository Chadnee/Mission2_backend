import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { StudentRoute } from "../modules/student/student.route";
import { AcademicSemesterRoute } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRouter} from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoute } from "../modules/academic Department/academicDepartment.route";
import { FacultyRouter } from "../modules/faculty/faculty.route";
import { AdminRouter } from "../modules/admin/admin.router";
import { CourseRouter } from "../modules/course/course.route";
import { SemesterRegistrationRoute } from "../modules/semestersRegistration/semesterRegistration.route";
import { OfferedCourseRoute } from "../modules/offeredCourse/offeredCourse.route";
import { AuthRoute } from "../modules/auth/auth.route";

const router = Router();

// router.use('/users', UserRoutes);
// router.use('/students', StudentRoute)

const modulesRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/students',
        route: StudentRoute,
    },
    {    path: '/academic-semesters',
        route: AcademicSemesterRoute
    },
    {
        path: '/academic-faculty',
        route: AcademicFacultyRouter
    },
    {
        path: '/academic-department',
        route: AcademicDepartmentRoute
    },
    {
        path: '/faculties',
        route: FacultyRouter
    },
    {
        path: '/admins',
        route: AdminRouter
    },
    {
        path: '/courses',
        route: CourseRouter,
    },
    {
        path: '/semester-registration',
        route: SemesterRegistrationRoute
    },
    {
        path: '/offered-courses',
        route: OfferedCourseRoute
    },
    {
        path: '/auth',
        route: AuthRoute
    }
]

modulesRoutes.forEach((route)=> router.use(route.path, route.route))

export default router;