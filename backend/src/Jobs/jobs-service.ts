import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Job } from './job-entity';
import { CreateJobDto } from './create-job-dto';
import { UpdateJobStatusDto } from './update-status-dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
  ) {}

  // Create a new job
  async createJob(data: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create({
      title: data.title,
      type: data.type,
      status: 'pending',
    });

    return this.jobsRepository.save(job);
  }

  // Get all jobs
  async getAllJobs(): Promise<Job[]> {
    return this.jobsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Update job status
  async updateStatus(
    id: string,
    data: UpdateJobStatusDto,
  ): Promise<Job> {
    const jobId = Number(id);
    const newStatus = data.Status;

    if (!Number.isInteger(jobId)) {
      throw new BadRequestException('Invalid job ID');
    }

    let requiredCurrentStatus: string;

    if (newStatus === 'running') {
      requiredCurrentStatus = 'pending';
    } else if (
      newStatus === 'completed' ||
      newStatus === 'failed'
    ) {
      requiredCurrentStatus = 'running';
    } else {
      throw new BadRequestException('Invalid status');
    }

    // Atomic update:
    // Only update if the job is still in the required current status.
    const result = await this.jobsRepository.update(
      {
        id: jobId,
        status: requiredCurrentStatus,
      },
      {
        status: newStatus,
      },
    );

    // If no row was updated, another request may have already
    // changed the status.
    if (result.affected === 0) {
      const job = await this.jobsRepository.findOne({
        where: { id: jobId },
      });

      if (!job) {
        throw new NotFoundException('Job not found');
      }

      throw new BadRequestException(
        `Invalid status transition: ${job.status} → ${newStatus}`,
      );
    }

    const updatedJob = await this.jobsRepository.findOne({
      where: { id: jobId },
    });

    if (!updatedJob) {
      throw new NotFoundException('Updated job not found');
    }

    return updatedJob;
  }

  // Delete a job
  async deleteJob(id: string): Promise<Job> {
    const jobId = Number(id);

    if (!Number.isInteger(jobId)) {
      throw new BadRequestException('Invalid job ID');
    }

    const job = await this.jobsRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return this.jobsRepository.remove(job);
  }
}