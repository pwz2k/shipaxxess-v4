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
			const permission = await Notification.requestPermission();
			console.log("Permission requested: ", permission);
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
				alert("You denied the notification request.");
				setState(false);
			}
		} catch (error) {
			console.error("Error requesting notification permission: ", error);
			setState(false);
		}
	}

	async function disableNotifications() {
		try {
			const token = await getToken(messaging, {
				vapidKey: VITE_APP_VAPID_KEY,
			});

			await deleteToken(token);

			// Inform the server that the subscription is removed
			await api.url("/user/unsubscribe").post({ token: token });

			setState(false);
			console.log("Notifications disabled, token deleted: ", token);
		} catch (error) {
			console.error("Error disabling notifications: ", error);
		}
	}

	const handleSwitchChange = async (checked: any) => {
		console.log("Switch changed: ", checked);
		if (checked) {
			await requestPermission();
		} else {
			await disableNotifications();
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
