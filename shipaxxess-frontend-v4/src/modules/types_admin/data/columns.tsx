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

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@client/components/ui/button";
import { Checkbox } from "@client/components/ui/checkbox";
import moment from "moment-timezone";
import { TypesSelectModel } from "@db/types";
import { app } from "@client/config/app";
import TableMenu from "../components/tableMenu";

export const typesColumns = (timezone: string) =>
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
			accessorKey: "type",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Type
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "unit",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Unit
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span>{row.getValue("unit")}</span>,
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "value",
			header: ({ column }) => {
				return (
					<Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Value
						<ArrowUpDown className="w-4 h-4 ml-2" />
					</Button>
				);
			},
			cell: ({ row }) => <span>{row.getValue("value")}</span>,
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
		{
			id: "action",
			cell: ({ row }) => <TableMenu id={row.original.id} uuid={row.original.uuid} />,
			enableSorting: false,
			enableHiding: false,
		},
	] as ColumnDef<TypesSelectModel>[];
