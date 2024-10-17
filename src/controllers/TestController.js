import { prismaClient } from '../model/PrismaClient.js'
import { body, query } from 'express-validator'

export class TestController {
    tokenPing = {
        validation: [
            body('title').notEmpty(),
            body('description').notEmpty(),
            body('eventDate').notEmpty(),
            body('organizer').notEmpty(),
        ],
        handler: async (req, res) => {
            const { title, description, eventDate, organizer } = req.body

            const event = await prismaClient.event.create({
                data: {
                    title: title,
                    description: description,
                    eventDate: eventDate,
                    organizer: organizer
                }
            })

            res.status(200).json(event)
        }
    }
}

const testController = new TestController()
export { testController }