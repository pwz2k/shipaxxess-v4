import { Model } from "@lib/model"
import { notifications } from "@schemas/notifications"
import { subscribtion } from "@schemas/subscribtion"
import { sendPushNotification } from "@utils/push"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/d1"
import { Context } from "hono"



export interface INOtifcation {
    title: string
    description: string
    user_id: number
    uuid: string
}
// user notification handler
const Get = async (c: Context<App>) => {

    try {
        const user_id = c.get("jwtPayload").id


        const data = await drizzle(c.env.DB).select().from(notifications).where(eq(notifications.user_id, user_id)).orderBy(eq(notifications.created_at, "asc")).limit(50).all()

        return c.json(data)


    } catch (error: any) {
        return c.json({ error: error.message })
    }
}

// mark notification as read user notification handler
const MarkAsRead = async (c: Context<App>) => {
    try {
        const user_id = c.get("jwtPayload").id
        const model = new Model(c.env.DB)
        const data = await model.update(notifications, { read: true }, eq(notifications.user_id, user_id))
        return c.json(data) // Remove the argument from the json() method call
    } catch (error: any) {
        return c.json({ error: error.message })
    }
}
const Subscribe = async (c: Context<App>) => {

    try {
        // get all the data from the request and log it
        const body = await c.req.json();




        // get the user id from the jwt payload
        const user_id = c.get("jwtPayload").id

        // get the token from the payload
        const token = body.token
        // save the token to the database in subscriptions table
        const model = new Model(c.env.DB)
        const data = await model.insert(subscribtion, { user_id, subscription: token, token })

        await sendPushNotification(c.env.ENCODED_SERVICE_ACCOUNT_KEY, token, { title: "Welcome to Shipaxxess", body: "You have successfully subscribed to Shipaxxess notification" })



        return c.json({ message: "Subscribed" })
    } catch (error: any) {
        return c.json({ error: error.message })
    }
}

const UserNotification = { Get, MarkAsRead, Subscribe }
export { UserNotification }

