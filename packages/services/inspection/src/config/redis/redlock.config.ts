import { redisJobConfigs } from './redis-config';
const Redlock = require('redlock');
const client1 = require('redis').createClient({
    host: redisJobConfigs.redis.host,
    port:redisJobConfigs.redis.port,
    password: redisJobConfigs.redis.password,
	// tls: {
	// 	rejectUnauthorized: false,
	// }
});
export const redlock = new Redlock(
	// you should have one client for each independent redis node
	// or cluster
	[client1],
	{
		// the expected clock drift; for more details
		// see http://redis.io/topics/distlock
		driftFactor: 0.01, // multiplied by lock ttl to determine drift time

		// the max number of times Redlock will attempt
		// to lock a resource before erroring
		retryCount:  999,

		// the time in ms between attempts
		retryDelay:  1000, // time in ms

		// the max time in ms randomly added to retries
		// to improve performance under high contention
		// see https://www.awsarchitectureblog.com/2015/03/backoff.html
		retryJitter:  200 // time in ms
	}
);

export const dynamicRedlock = new Redlock(
	// you should have one client for each independent redis node
	// or cluster
	[client1],
	{
		// the expected clock drift; for more details
		// see http://redis.io/topics/distlock
		driftFactor: 0.01, // multiplied by lock ttl to determine drift time

		// the max number of times Redlock will attempt
		// to lock a resource before erroring
		retryCount:  1,

		// the time in ms between attempts
		retryDelay:  1000, // time in ms

		// the max time in ms randomly added to retries
		// to improve performance under high contention
		// see https://www.awsarchitectureblog.com/2015/03/backoff.html
		retryJitter:  200 // time in ms
	}
);
