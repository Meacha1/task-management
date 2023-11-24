import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  /**
   * The constructor function takes a TasksService as a parameter and assigns it to the tasksService
   * property.
   * @param {TasksService} tasksService - The tasksService parameter is an instance of the TasksService
   * class. It is a dependency that is injected into the constructor of the current class. This allows
   * the current class to access and use the methods and properties of the TasksService class.
   */
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }
}
