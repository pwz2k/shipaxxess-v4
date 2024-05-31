import { Model } from "@lib/model"
import { notifications } from "@schemas/notifications"



export interface INOtifcation {
    title: string
    description: string
    user_id: number
    uuid: string
}
export const SaveNotifcaiton = async (db: D1Database, notification: INOtifcation) => {
    console.log("notification", notification)
    try {
        const model = new Model(db)
        const data = await model.insert(notifications, { ...notification, })
        console.log("Notifcation added", data)

        return data
    } catch (error: any) {
        console.log("Error", error)
        return { error: error.message }
    }
}


// export const GetNotifcations = async (db: D1Database, user_id: number) => {
//     const model = new Model(db)
//     const data = await model.all(notifications, eq(notifications.user_id, user_id))
//     return data
// }

// // update notification
// export const UpdateNotifcation = async (db: D1Database, user_id: number, uuid: string) => {
//     const model = new Model(db)
//     const data = await model.update(notifications, { read: true }, eq(notifications.user_id, user_id))
//     return data
// }
