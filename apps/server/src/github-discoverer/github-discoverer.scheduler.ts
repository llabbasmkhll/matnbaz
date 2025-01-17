import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { GITHUB_QUEUE } from '../queue';

@Injectable()
export class GithubDiscovererScheduler {
  constructor(@InjectQueue(GITHUB_QUEUE) private readonly queue: Queue) {}
  private logger = new Logger(GithubDiscovererScheduler.name);

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async discover() {
    this.queue.add('discover');
    this.logger.log(
      `The cronjob for GitHub's discovery got called, the job is now in the queue.`
    );
  }
}
