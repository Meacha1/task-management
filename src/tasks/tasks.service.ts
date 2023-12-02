import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

 async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]>  {
    const { status, search } = filterDto;
    const query = await this.entityManager.createQueryBuilder(Task, 'task');
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return query.getMany();
  }


  async getTaskById(id: number, user: User): Promise<Task | undefined> {
    const found = await this.entityManager.findOne(Task, { where: { id, userId: user.id } });
  
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    } else {
      return found;
    }
  }

async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
  const { title, description } = createTaskDto;
  const task = new Task();
  task.title = title;
  task.description = description;
  task.status = TaskStatus.OPEN;
  task.user = user;
  await task.save(); // save the task to the database
  delete task.user; // remove the user property from the task object that will be returned
  return task;
}

async deleteTask(id: number, user: User): Promise<void> {
  const result = await this.entityManager.delete(Task, { id, userId: user.id });
  if (result.affected === 0) {
    throw new NotFoundException(`Task with ID "${id}" not found`);
  } else {
    console.log('Task deleted successfully');
  }
}

async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
  const task = await this.getTaskById(id, user);
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
