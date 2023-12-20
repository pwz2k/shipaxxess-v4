import Push from "push.js";
import { BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@client/components/ui/switch";

const PushNotificationComponent = () => {
	// States
	const [state, setState] = useState(false);

	//  Push
	const pushON = (data: boolean) => {
		Push.create(`Notification`, {
			body: "Thanks, now you will receive notifications from us",
			icon: "/favicon.ico",
		});
		console.log(data);
	};

	useEffect(() => {
		if (!window) return;
		if (Push.Permission.has()) {
			setState(true);
		} else {
			setState(false);
		}
	}, []);

	return (
		<div className=" flex items-center space-x-4 rounded-md border p-4">
			<BellRing />
			<div className="flex-1 space-y-1">
				<p className="text-sm font-medium leading-none">Push Notifications</p>
				<p className="text-sm text-muted-foreground">Send notifications to device.</p>
			</div>
			<Switch checked={state} onCheckedChange={pushON} />
		</div>
	);
};

export default PushNotificationComponent;
