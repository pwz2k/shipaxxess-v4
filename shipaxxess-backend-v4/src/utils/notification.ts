import { Model } from "@lib/model"
import { notifications } from "@schemas/notifications"
import { eq } from "drizzle-orm"



export interface INOtifcation {
    title:string
    description:string
    user_id:number
    uuid:string
}
export const SaveNotifcaiton = async (db: D1Database, notification: INOtifcation) => {
	
    const model = new Model(db)
    const data = await model.insert(notifications, { ...notification,})
    console.log("Notifcation added",data)

    return data
}


export const GetNotifcations = async (db: D1Database, user_id: number) => {
    const model = new Model(db)
    const data = await model.all(notifications, eq(notifications.user_id, user_id))
    return data
}

// update notification
export const UpdateNotifcation = async (db: D1Database, user_id: number, uuid: string) => {
    const model = new Model(db)
    const data = await model.update(notifications, { read: true }, eq(notifications.user_id, user_id))
    return data
}
