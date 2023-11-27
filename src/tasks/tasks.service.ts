import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

 async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]>  {
    const { status, search } = filterDto;
    const query = await this.entityManager.createQueryBuilder(Task, 'task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        // if title or description contains the search term, return true
        // LOWER() converts the search term to lowercase before comparing it to the task title and description
        // LIKE() performs a case-insensitive search for the search term in the task title and description
        // %search% is a placeholder for the search term that will be replaced with the actual search term in the query
        // % is a wildcard character that matches any character or number of characters before and after the search term
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return query.getMany();
  }


  async getTaskById(id: any): Promise<Task | undefined> {
    const found = await this.entityManager.findOne(Task, { where: { id } });
  
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    } else {
      return found;
    }
  }

async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
  const { title, description } = createTaskDto;
  const task = new Task();
  task.title = title;
  task.description = description;
  task.status = TaskStatus.OPEN;
  await task.save(); // save the task to the database
  return task;
}

async deleteTask(id: number): Promise<void> {
  const result = await this.entityManager.delete(Task, id);
  if (result.affected === 0) {
    throw new NotFoundException(`Task with ID "${id}" not found`);
  } else {
    console.log('Task deleted successfully');
  }
}

async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const task = await this.getTaskById(id);
  task.status = status;
  await task.save();
  return task;
}

  // patchTask(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
