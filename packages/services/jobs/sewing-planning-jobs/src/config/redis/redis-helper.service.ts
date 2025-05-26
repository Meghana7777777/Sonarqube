
import { RedisConfigModel } from './models/redis-config.model';
import { Injectable } from '@nestjs/common';
import { redisJobConfigs } from './redis-config'
import BullQueue from "bull";
import Redis from 'ioredis';

@Injectable()
export class RedisHelperService {
    constructor(
    ) {

    }

    /**
     * adds the the given payload to the given redis queue
     * @param queueName 
     * @param data 
     * @param jobConfig 
     * @param redisConfig 
     * @returns 
     */
    async addJobToQueue(queueName: any, data: any, redisConfig: RedisConfigModel, jobConfig?: BullQueue.JobOptions): Promise<boolean> {
        let redisConnection: Redis;
        try {
            const redisOptions = {
                connectTimeout: 10000,
                retry_strategy: null,
                maxRetriesPerRequest: null,
                reconnectOnError: (err: Error) => { return false },
                // tls: {
                //     rejectUnauthorized: false,
                // },
                keepAlive: 1000,
            }
            // establish the redis connection
            redisConnection = redisConfig ? new Redis(redisConfig.port, redisConfig.host, { password: redisConfig.password, ...redisOptions }) : new Redis(redisJobConfigs.redis.port, redisJobConfigs.redis.host, { password: redisJobConfigs.redis.password, ...redisOptions });
            // Setting up the queue
            const queueInstance = new BullQueue(queueName, {
                redis: {
                    host: redisConnection.options.host,
                    port: redisConnection.options.port,
                    password: redisConnection.options.password,
                    // tls: {
                    //     rejectUnauthorized: false,
                    // }
                },
                defaultJobOptions: {
                    ...redisJobConfigs.bullJobOptions,
                }, settings: {
                    ...redisJobConfigs.bullAdvancedSettings
                }
            });
            console.log(jobConfig);
            await queueInstance.add(queueName, data, jobConfig);
            // close the queue
            await queueInstance.close();
            // release the connection 
            redisConnection.disconnect();
            return true;
        } catch (error) {
            console.log(error);
            // release the connection 
            redisConnection.disconnect();
            // save the job info into a entity
            await this.reserveFailedJob(queueName, data, jobConfig);
            throw error;
        }
    }


    /**
     * saves the failed job in a NO SQL structure, so can be retried later
     * @param queueName 
     * @param data 
     * @param jobConfig 
     */
    async reserveFailedJob(queueName: any, data: any, jobConfig: BullQueue.JobOptions): Promise<boolean> {
        // const failedJobRec = { jobName: queueName, payload: data, jobConfig: jobConfig, created_user: 'SYSTEM', status: JobStatusEnum.OPEN }
        // await this.failedJobsRepo.create(failedJobRec);
        return true;
    }

    /**
     * gets all the failed jobs
     * @returns 
     */
    async getFailedJobs(): Promise<any[]> {
        // const jobs: FailedJobModel[] = await this.failedJobsRepo.find({ status: JobStatusEnum.OPEN });
        // if (jobs.length > 0) {
        //     return jobs.map(job => new JobModel(job._id, job.jobName, job.payload, job.jobConfig));
        // }
        return [];
    }

    /**
     * deletes the job by id
     * @param id 
     * @returns 
     */
    async deleteJob(id: string): Promise<boolean> {
        // await this.failedJobsRepo.remove({ id: id });
        return true;
    }
    /**
     * 
     * @param queName string
     * @returns 
     */
    async removeAllRepeatable(queueName: string, redisConfig: RedisConfigModel, jobConfig?: BullQueue.JobOptions): Promise<boolean> {
        let redisConnection: any;
        try {
            const redisOptions = {
                retry_strategy: null,
                maxRetriesPerRequest: null,
                reconnectOnError: (err: Error) => { return false },
                // tls:{
                //     rejectUnauthorized: false,
                // }
            }
            // establish the redis connection
            redisConnection = redisConfig ? new Redis(redisConfig.port, redisConfig.host, { password: redisConfig.password, ...redisOptions }) : new Redis(redisJobConfigs.redis.port, redisJobConfigs.redis.host, { password: redisJobConfigs.redis.password, ...redisOptions });
            const queueInstance = new BullQueue(queueName, {
                redis: {
                    host: redisConnection.options.host,
                    port: redisConnection.options.port,
                    password: redisConnection.options.password,
                    // tls:{
                    //     rejectUnauthorized: false,
                    // }
                },
                defaultJobOptions: {
                    ...redisJobConfigs.bullJobOptions,
                }, settings: {
                    ...redisJobConfigs.bullAdvancedSettings
                }
            });

            const jobs = await queueInstance.getRepeatableJobs();
            console.log(jobs);
            for (let i = 0; i < jobs.length; i++) {
                const job = jobs[i];
                await queueInstance.removeRepeatable({ cron: job.cron, jobId: job.id });
            }
            // close the queue
            await queueInstance.close();
            // release the connection 
            redisConnection.disconnect();
            return true;
        } catch (error) {
            // release the connection 
            redisConnection.disconnect();
            throw error;
        }

    };

    /**
     * re pushes the failed jobs to the bull queue
     */
    async triggerFailedJobs(): Promise<any> {
        const redisConn = redisJobConfigs.redis;
        // get all the failed jobs
        const jobs = await this.getFailedJobs();
        if (jobs.length > 0) {
            for (const job of jobs) {
                await this.addJobToQueue(job.queueName, job.data, redisConn, job.jobConfig);
                await this.deleteJob(job.id);
            }
        }
        // return new JobTriggerResponse(true, 1, 'Job triggered successfully');
        return true;
    }

}