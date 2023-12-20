import { HeaderProps, SidebarProps } from "@client/types/layout";
import {
	Home,
	Tags,
	MapPin,
	Boxes,
	CreditCard,
	Ticket,
	Users,
	Store,
	Settings,
	UserCircle2,
	BadgePercent,
	BellDot,
	User,
} from "lucide-react";

// Sidebar items
export const sidebarItems: SidebarProps[] = [
	{
		icon: <Home color="#fff" size={20} />,
		label: "Dashboard",
		slug: "/dashboard",
	},
	{
		icon: <Tags color="#fff" size={20} />,
		label: "Batch labels",
		slug: "/batchs",
		badge: "new",
	},
	{
		icon: <MapPin color="#fff" size={20} />,
		label: "Saved addresses",
		slug: "/addresses",
		badge: "new",
	},
	{
		icon: <Boxes color="#fff" size={20} />,
		label: "Saved packages",
		slug: "/packages",
		badge: "new",
	},
	{
		icon: <CreditCard color="#fff" size={20} />,
		label: "Payments",
		slug: "/payments",
		badge: "new",
	},
	{
		icon: <Ticket color="#fff" size={20} />,
		label: "Tickets",
		slug: "/tickets",
		badge: "new",
	},
	{
		icon: <Users color="#fff" size={20} />,
		label: "Referrals",
		slug: "/referrals",
		badge: "new",
	},
	{
		icon: <Store color="#fff" size={20} />,
		label: "Stores",
		slug: "/stores",
		badge: "new",
	},
	{
		icon: <Settings color="#fff" size={20} />,
		label: "Settings",
		slug: "/settings",
	},
];

// Header items
export const headerItems: HeaderProps[] = [
	{ label: "Profile", slug: "/settings?tab=profile", icon: <UserCircle2 /> },
	{ label: "Coupons", slug: "/settings?tab=coupons", icon: <BadgePercent /> },
	{
		label: "Notifications",
		slug: "/settings?tab=notifications",
		icon: <BellDot />,
	},
];

// Admin items
export const adminHeaderItems: HeaderProps[] = [
	...headerItems,
	{
		icon: <User />,
		label: "Admin Mode",
		slug: "/admin/labels",
	},
];
