/**
 * Copyright (c) 2023 SakibHasan.dev. All rights reserved.
 *
 * This code is the intellectual property of sakibhasan.dev. Unauthorized use or reproduction
 * of this code, in whole or in part, without prior written permission from sakibhasan.dev is
 * strictly prohibited. This includes but is not limited to copying, modifying, distributing, selling,
 * or displaying the code for commercial or non-commercial purposes.
 *
 * Any use of this code must be accompanied by proper attribution to sakibhasan.dev,
 * including a mention of the original source code and a link to the website
 * (https://sakibhasan.dev). This code is provided as-is, without any warranty, express or implied
 *
 * sakibhasan.dev reserves the right to take legal action against individuals or entities that
 * infringe upon its copyright. For inquiries regarding the use or licensing of this code, please
 * contact legal@sakibhasan.dev.
 *
 * By using or accessing this code, you agree to comply with these copyright terms and conditions
 *
 * @author Sakib Hasan <shakibhasan.me09@gmail.com>
 * @source https://github.com/sakibhasan09/
 */

import { TabsList, TabsTrigger } from "@client/components/ui/tabs";
import { BadgePercent, BellRing, Trash, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsTabsList = () => {
	const navigate = useNavigate();

	return (
		<TabsList className="flex flex-col justify-start w-1/5 h-auto p-0 bg-transparent">
			<TabsTrigger
				onClick={() => navigate("?tab=profile")}
				value="profile"
				className="flex items-center justify-start w-full gap-2 py-4 rounded-lg shadow-none ring-0">
				<User size={16} /> Profile
			</TabsTrigger>
			<TabsTrigger
				onClick={() => navigate("?tab=coupons")}
				value="coupons"
				className="flex items-center justify-start w-full gap-2 py-4 rounded-lg shadow-none">
				<BadgePercent size={16} />
				Coupons
			</TabsTrigger>
			<TabsTrigger
				onClick={() => navigate("?tab=notifications")}
				value="notifications"
				className="flex items-center justify-start w-full gap-2 py-4 rounded-lg">
				<BellRing size={16} />
				Notifications
			</TabsTrigger>
			<TabsTrigger
				onClick={() => navigate("?tab=delete")}
				value="delete"
				className="flex items-center justify-start w-full gap-2 py-4 rounded-lg">
				<Trash size={16} />
				Delete Account
			</TabsTrigger>
		</TabsList>
	);
};

export default SettingsTabsList;
