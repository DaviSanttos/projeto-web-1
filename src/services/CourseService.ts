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

    relacionCourseToBookCategory(couserId: number, bookCategoryId: number): boolean {
        if (couserId === 1 && bookCategoryId === 2) return true
        if (couserId === 2 && bookCategoryId === 3) return true
        if (couserId === 3 && bookCategoryId === 4) return true

        return false
    }
}

export default new CourseService();