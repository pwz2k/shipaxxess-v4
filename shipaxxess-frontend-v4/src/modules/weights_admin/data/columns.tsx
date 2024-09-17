import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@client/components/ui/button";
import moment from "moment-timezone";
import { AdminWeightsSelectModel } from "@db/adminWeights";
import { app } from "@client/config/app";
import { TypesSelectModel } from "@db/types";
import TableMenu from "../components/tableMenu";

export const weightsColumns = (timezone: string) =>
	[
		{
			accessorKey: "type.label",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Label
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "width",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Width
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<span>
					{row.original.width} inch
				</span>
			),
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "height",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Height
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<span>
					{row.original.height} inch
				</span>
			),
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "length",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Length
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<span>
					{row.original.length} inch
				</span>
			),
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "user_cost",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						User Cost
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span>${row.original.user_cost.toFixed(2)}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "reseller_cost",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Reseller Cost
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span>${row.original.reseller_cost.toFixed(2)}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "created_at",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Created At
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span>{moment.utc(row.original.created_at).tz(timezone).format(app.time.format)}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{ id: "action", cell: ({ row }) => <TableMenu id={row.original.id} uuid={row.original.uuid} /> },
	] as ColumnDef<AdminWeightsSelectModel & { type: TypesSelectModel }>[];
