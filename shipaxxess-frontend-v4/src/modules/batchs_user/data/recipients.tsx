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
import { Address } from "@shipaxxess/shipaxxess-zod-v4";
import RecipientEditTableMenu from "../components/recipientEditTableMenu";

export const recipentsColumns: ColumnDef<Address.ZODSCHEMA>[] = [
	{
		accessorKey: "index",
		header: ({ column }) => {
			return (
				<Button
					className="px-0 whitespace-nowrap"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					#
					<ArrowUpDown className="w-4 h-4 ml-2" />
				</Button>
			);
		},
		cell: ({ row }) => <span>{row.index + 1}</span>,
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: "full_name",
		header: ({ column }) => {
			return (
				<Button
					className="px-0 whitespace-nowrap"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Full Name
					<ArrowUpDown className="w-4 h-4 ml-2" />
				</Button>
			);
		},
		cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("full_name")}</span>,
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: "company_name",
		header: ({ column }) => {
			return (
				<Button
					className="px-0 whitespace-nowrap"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Company Name
					<ArrowUpDown className="w-4 h-4 ml-2" />
				</Button>
			);
		},
		cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("company_name")}</span>,
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: "street_one",
		header: ({ column }) => {
			return (
				<Button
					className="px-0 whitespace-nowrap"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Street One
					<ArrowUpDown className="w-4 h-4 ml-2" />
				</Button>
			);
		},
		cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("street_one")}</span>,
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: "street_two",
		header: ({ column }) => {
			return (
				<Button
					className="px-0 whitespace-nowrap"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Street Two
					<ArrowUpDown className="w-4 h-4 ml-2" />
				</Button>
			);
		},
		cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("street_two")}</span>,
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: "city",
		header: ({ column }) => {
			return (
				<Button
					className="px-0 whitespace-nowrap"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					City
					<ArrowUpDown className="w-4 h-4 ml-2" />
				</Button>
			);
		},
		cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("city")}</span>,
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: "zip",
		header: ({ column }) => {
			return (
				<Button
					className="px-0 whitespace-nowrap"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Zip
					<ArrowUpDown className="w-4 h-4 ml-2" />
				</Button>
			);
		},
		cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("zip")}</span>,
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: "state",
		header: ({ column }) => {
			return (
				<Button
					className="px-0 whitespace-nowrap"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					State
					<ArrowUpDown className="w-4 h-4 ml-2" />
				</Button>
			);
		},
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: "country",
		header: ({ column }) => {
			return (
				<Button
					className="px-0 whitespace-nowrap"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Country
					<ArrowUpDown className="w-4 h-4 ml-2" />
				</Button>
			);
		},
		cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("country")}</span>,
		enableSorting: true,
		enableHiding: true,
	},
	{
		id: "action",
		enableSorting: false,
		enableHiding: false,
		cell: ({ row }) => <RecipientEditTableMenu row={row} />,
	},
];
