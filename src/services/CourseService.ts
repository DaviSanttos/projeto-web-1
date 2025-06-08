import { Course } from "../models/CourseModel";
import { CourseRepository } from "../repositories/CourseRepository";

class CourseService {
    courseRepository = CourseRepository.getInstance();

    findCourseIdByname(name: string): number {

        if (!name) throw new Error("sem nome de curso");

        const course = this.courseRepository.getIdByName(name);

        if (!course) throw new Error("Curso nao encontrado");
        return course;
    }

    list(): Course[] {
        return this.courseRepository.list();
    }
}

export default new CourseService();