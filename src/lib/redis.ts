import { createClient } from 'redis'

export const redis = createClient({
    url: 'redis://:doker@localhost:6379'
})

redis.connect()