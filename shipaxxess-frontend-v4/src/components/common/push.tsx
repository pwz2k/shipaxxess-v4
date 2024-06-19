import Push from "push.js";
import { BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@client/components/ui/switch";
import { messaging } from "@client/firebase/firebaseConfig";
import { getToken, deleteToken } from "firebase/messaging";
import { api } from "@client/lib/api";
const { VITE_APP_VAPID_KEY } = import.meta.env;


const PushNotificationComponent = () => {
	// States
	const [state, setState] = useState(false);

	async function requestPermission() {
		try {
			// request permission to enable notifications
			const permission = await Notification.requestPermission();
			const pushOn = await Push.create("Notification", {
				body: "Thanks, now you will receive notifications from us",
				icon: "/favicon.ico",
			});
			console.log("Permission: ", permission);
			console.log("Push on: ", pushOn);


			if (permission === "granted") {
				const token = await getToken(messaging, {
					vapidKey: VITE_APP_VAPID_KEY,
				});

				// Token can be sent to the server here
				console.log("Token generated: ", token);
				// Send this to server side to save as subscription
				await api.url("/user/subscribe").post({ token: token });

				Push.create("Notification", {
					body: "Thanks, now you will receive notifications from us",
					icon: "/favicon.ico",
				});

				setState(true);
			} else if (permission === "denied") {
				setState(false);
			}
		} catch (error) {
			console.error("Error requesting notification permission: ", error);
			setState(false);
		}
	}

	async function disableNotifications() {
		// disbale notifications and also revoke permission

		const permission = await Notification.requestPermission();
		Push.clear();

		// console.log("Permission: ", permission);
		// if (permission === "granted") {
		// 	setState(false);
		// 	const currentToken = await getToken(messaging);
		// 	await deleteToken(messaging);
		// 	Push.Permission.request();
		// 	await api.url("/user/unsubscribe").delete({ currentToken });

		// }


	}

	const handleSwitchChange = async (checked: any) => {
		const hasPersistedState = Push.Permission.has();

		console.log("Has persisted state: ", hasPersistedState);
		if (hasPersistedState) {
			console.log("Disabling notifications");
			disableNotifications();
		}
		else {
			console.log("Requesting permission");
			requestPermission();
		}
	};

	useEffect(() => {
		// Check the initial notification permission state
		const checkNotificationPermission = () => {
			if (Notification.permission === "granted") {
				setState(true);
			} else {
				setState(false);
			}
		};

		checkNotificationPermission();
	}, []);

	return (
		<div className="flex items-center space-x-4 rounded-md border p-4">
			<BellRing />
			<div className="flex-1 space-y-1">
				<p className="text-sm font-medium leading-none">Push Notifications</p>
				<p className="text-sm text-muted-foreground">
					Send notifications to device.
				</p>
			</div>
			<Switch checked={state} onCheckedChange={handleSwitchChange} />
		</div>
	);
};

export default PushNotificationComponent;
