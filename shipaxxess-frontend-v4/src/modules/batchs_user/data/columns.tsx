import moment from "moment-timezone";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@client/components/ui/button";
import { Checkbox } from "@client/components/ui/checkbox";
import { BatchsSelectModel } from "@db/batchs";
import { app } from "@client/config/app";
import { Badge } from "@client/components/ui/badge";
import { Link } from "react-router-dom";

export const batchColumns = (timezone: string) =>
	[
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "id",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Batch Id
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span>{row.original.uuid}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "sender_full_name",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Sender Name
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "type_label",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Type
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("type_label")}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "package_weight",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Weight
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<span className="whitespace-nowrap">
					{row.getValue("package_weight")} {row.original.type_unit}
				</span>
			),
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "cost_user",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Cost
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span className="whitespace-nowrap">${row.original.cost_user.toFixed(2)}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "total_labels",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Total Labels
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "failed_labels",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Failed Labels
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "is_downloaded",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Downloaded
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span>{row.original.is_downloaded ? "Yes" : "No"}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "status_label",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Status
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <Badge>{row.original.status_label}</Badge>,
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "shipping_date",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Shipping Date
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<span className="whitespace-nowrap">{moment(row.original.shipping_date).format("DD MMM, YYYY")}</span>
			),
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "created_at",
			header: ({ column }) => {
				return (
					<Button
						className="px-0 whitespace-nowrap"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Date
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<span className="whitespace-nowrap">
					{moment.utc(row.original.created_at).tz(timezone).format(app.time.format)}
				</span>
			),
			enableSorting: true,
			enableHiding: true,
		},
		{
			id: "action",
			enableSorting: false,
			enableHiding: false,
			cell: ({ row }) => (
				<Link to={`/batchs/view?uuid=${row.original.uuid}`}>
					<Button variant="outline">View</Button>
				</Link>
			),
		},
	] as ColumnDef<BatchsSelectModel>[];
