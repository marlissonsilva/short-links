import { FastifyRequest, FastifyReply } from 'fastify';
import { sql } from "../lib/postgres";
import postgres from "postgres";
import { redis } from "../lib/redis";
import { z } from 'zod'

const linkService = {
    create: async (request: FastifyRequest, reply: FastifyReply) => {
        console.log(request.body)
        const createLinkSchema = z.object({
            code: z.string().min(3),
            url: z.string().url()
        })
        const { code, url } = createLinkSchema.parse(request.body)

        try {
            const result = await sql/*sql*/`
            INSERT INTO short_links(code,original_url)
            VALUES (${code}, ${url})
            RETURNING code
        `
            const link = result[0]

            return reply.status(201).send({ shortLink: link.code })
        } catch (error) {
            if (error instanceof postgres.PostgresError) {
                if (error.code === "23505") {
                    return reply.status(400).send({ message: "Duplicated code" })
                }
            }
            return reply.status(500).send({ message: "Internal error" })
        }
    },

    redirect: async (request: FastifyRequest, reply: FastifyReply) => {
        const createCodeSchema = z.object({
            code: z.string().min(3)
        })

        const { code } = createCodeSchema.parse(request.params)

        const result = await sql/*sql*/`
            SELECT id, original_url
            FROM  short_links
            WHERE short_links.code = ${code}   
        `

        if (result.length === 0) {
            return reply.status(400).send({ message: "Link not found" })
        }

        const link = result[0]
        console.log("LINK", link)

        await redis.zIncrBy('metrics', 1, String(code))

        // 301 = permanente | 302 = temporario
        return reply.redirect(301, link.original_url)
    },

    getLinks: async () => {
        const result = await sql/*sql*/`
            SELECT * 
            FROM short_links
            ORDER BY created_at DESC
        `
        return result
    },

    metrics: async () => {
        const result = await redis.zRangeByScoreWithScores('metrics', 0, 50)
        const metrics = result
            .sort((a, b) => b.score - a.score)
            .map(item => {
                return {
                    shortLink: item.value,
                    clicks: item.score,
                }
            })

        return metrics
    }
}

export default linkService