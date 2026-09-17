import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { JobsService } from './jobs-service';
import { Job } from './job-entity';
import { CreateJobDto } from './create-job-dto';
import { UpdateJobStatusDto } from './update-status-dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // POST /jobs
  @Post()
  createJob(@Body() data: CreateJobDto): Promise<Job> {
    return this.jobsService.createJob(data);
  }

  // GET /jobs
  @Get()
  getAllJobs(): Promise<Job[]> {
    return this.jobsService.getAllJobs();
  }

  // PATCH /jobs/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() data: UpdateJobStatusDto,
  ): Promise<Job> {
    return this.jobsService.updateStatus(id, data);
  }

  // DELETE /jobs/:id
  @Delete(':id')
  deleteJob(@Param('id') id: string): Promise<Job> {
    return this.jobsService.deleteJob(id);
  }
}