import { Model } from "@lib/model"
import { notifications } from "@schemas/notifications"
import { eq } from "drizzle-orm"
import { Context } from "hono"



export interface INOtifcation {
    title:string
    description:string
    user_id:number
    uuid:string
}
// user notification handler
const Get =  async (c: Context<App>) => {
    try {
        const user_id = c.get("jwtPayload").id
        const model = new Model(c.env.DB)
        const data = await model.all(notifications, eq(notifications.user_id, user_id))
        return c.json(data) // Remove the argument from the json() method call
    } catch (error: any) {
        return c.json({ error: error.message})
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
        return c.json({ error: error.message})
    }   }

 const UserNotification = { Get, MarkAsRead}
export { UserNotification }

