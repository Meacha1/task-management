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

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //   // destructuring
  //   const { status, search } = filterDto;

  //   // define a temporary array to hold the result
  //   let tasks: Task[] = this.getAllTasks();

  //   // do something with status
  //   if (status) {
  //     tasks = tasks.filter((task: Task) => task.status === status); // filter out the tasks with the given status and return the remaining tasks
  //   }

  //   // do something with search
  //   if (search) {
  //     tasks = tasks.filter((task: Task) => {
  //       // filter out the tasks with the given search term and return the remaining tasks
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }

  //   // return the result
  //   return tasks;
  // }

  async getTaskById(id: any): Promise<Task | undefined> {
    const found = await this.entityManager.findOne(Task, { where: { id } });
  
    if (!found) {
      throw new NotFoundException();
    } else {
      return found;
    }
  }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task: Task) => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException();
  //   } else {
  //     return found;
  //   }
  // }

  // deleteTask(id: string): void {
  //   const found = this.getTaskById(id); // get the task with the given id
  //   if (!found) {
  //     throw new NotFoundException();
  //   } else {
  //     this.tasks = this.tasks.splice(this.tasks.indexOf(found), 1); // remove the task from the array and return the remaining tasks
  //   }
  // }

  // patchTask(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid.v4(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }
}
