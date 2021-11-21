import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { GITHUB_EXTRACTOR_QUEUE } from './constants';

@Injectable()
export class GithubExtractorScheduler {
  constructor(
    @InjectQueue(GITHUB_EXTRACTOR_QUEUE) private readonly queue: Queue
  ) {}
  private logger = new Logger(GithubExtractorScheduler.name);

  @Cron(CronExpression.EVERY_4_HOURS)
  async extract() {
    this.queue.add('extract');
    this.logger.log(
      `The cronjob for GitHub's extraction got called, the job is now in the queue.`
    );
  }

  async flushQueue() {
    this.queue.removeJobs('*');
  }
}