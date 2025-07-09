import { executarComandoSQL } from "../database/mysql";
import { Course } from "../models/entity/CourseEntity";

export class CourseRepository {
  private static instance: CourseRepository;
  private course: Course[] = [];

  private constructor() {
    this.course = [
      new Course("ADS", 1),
      new Course("Pedagogia", 2),
      new Course("Administração", 3)
    ];
  }

  public static getInstance(): CourseRepository {
    if (!this.instance) {
      this.instance = new CourseRepository();
    }
    return this.instance;
  }

  list() {
    return this.course;
  }

  getIdByName(name: string): number | undefined {
    return this.course.find(course => course.nome === name)?.id;
  }

  imprimeResult(err: any, result: any) {
    if (err) {
      console.error('Erro no callback:', err);
    } else if (result !== undefined) {
      console.log('Dentro do callback:', result);
    }
  }

  async createCourseTable() {
    try {
      const query = `
      CREATE TABLE IF NOT EXISTS Curso (
        id INT PRIMARY KEY,
        nome ENUM('ADS', 'Pedagogia', 'Administração') NOT NULL
      )
    `;

      executarComandoSQL(query, [], this.imprimeResult);
      console.log('Tabela "Course" criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar a tabela "Course":', err);
    }
  }

  async insertDefaultCourses() {
    try {
      const cursos = [
        { id: 1, nome: 'ADS' },
        { id: 2, nome: 'Pedagogia' },
        { id: 3, nome: 'Administração' }
      ];

      for (const curso of cursos) {
        const query = `
        INSERT INTO Curso (id, nome)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE nome = VALUES(nome)
      `;

        await executarComandoSQL(query, [curso.id, curso.nome], this.imprimeResult);
      }

      console.log('Cursos padrão inseridos com sucesso!');
    } catch (err) {
      console.error('Erro ao inserir cursos padrão:', err);
    }
  }
}