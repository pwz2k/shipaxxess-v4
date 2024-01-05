import Meta from "@client/components/common/meta";
import { useSettingsQuery } from "../hooks/useSettingsQuery";
import Title from "@client/components/common/title";
import Breadcrumb from "@client/components/common/breadcrumb";
import { Settings } from "lucide-react";
import { Tabs } from "@client/components/ui/tabs";
import SettingsTabsList from "../components/tabList";

const SettingsAdminPage = () => {
	const settingsQuery = useSettingsQuery();

	console.log(settingsQuery.data);

	return (
		<>
			<Meta title="Settings" />

			<div className="px-4 py-8 space-y-8">
				<Title title="Settings" />
				<Breadcrumb items={[{ title: "Settings", link: "/settings", icon: <Settings size={16} /> }]} />

				<Tabs defaultValue="profile" value={"profile"} className="flex w-full">
					<SettingsTabsList />
					<div className="w-4/5 p-8 bg-white rounded-lg shadow pr-96"></div>
				</Tabs>
			</div>
		</>
	);
};

export default SettingsAdminPage;
