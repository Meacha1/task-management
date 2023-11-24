import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
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

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put('/:id/:status')
  patchTask(
    @Param('id') id: string,
    @Param('status') status: TaskStatus,
  ): Task {
    return this.tasksService.patchTask(id, status);
  }
}
