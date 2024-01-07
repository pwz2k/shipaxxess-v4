import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@client/components/ui/button";
import { Checkbox } from "@client/components/ui/checkbox";
import moment from "moment-timezone";
import { AdminWeightsSelectModel } from "@db/adminWeights";
import { app } from "@client/config/app";

export const weightsColumns = (timezone: string) =>
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
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Id
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span>{row.index + 1}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "label",
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
			accessorKey: "from_weight",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						From Weight
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "to_weight",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						To Weight
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
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
						Date
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span>{moment.utc(row.original.created_at).tz(timezone).format(app.time.format)}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{ id: "action" },
	] as ColumnDef<AdminWeightsSelectModel>[];
