import { Model } from "@lib/model";
import { notifications } from "@schemas/notifications";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { v4 } from "uuid";
export interface INotification{
    title:string,
    description:string
}

const Get = async (c: Context<App>) => {
	const model = new Model(c.env.DB);
    console.log("userid",c.get("jwtPayload").id)
	const  data= await model.all(notifications,eq(notifications.user_id,c.get("jwtPayload").id));
 

	return c.json(data);
};

const Add = async (notification: INotification, db: D1Database,user_id:number) => {
    const model = new Model(db);
 const data=   await model.insert(notifications, {
        title: notification.title,
        description: notification.description,
        uuid: v4(),
        user_id: user_id
    });

    console.log('Notification added:', data);
};
const MarkAllRead=async (c:Context)=>{
 
    const model=new Model(c.env.DB)
 const data=   await model.update(
        notifications,
        { read: true },
        eq(notifications.user_id,c.get("jwtPayload").id)
    );
    console.log("Data",data)
    return c.json(data)
};


const NotificationUsers = { Get ,Add,MarkAllRead};


export { NotificationUsers };

