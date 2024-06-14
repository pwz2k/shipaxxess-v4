import AlertWrapper from "@client/components/common/alert";
import { Button } from "@client/components/ui/button";
import { app } from "@client/config/app";
import { useLoading } from "@client/hooks/useLoading";
import { api } from "@client/lib/api";
import { BatchsSelectModel } from "@db/batchs";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { BadgeDollarSign, EyeIcon, FileDown, LifeBuoy } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const TableMenu = ({ row }: { row: Row<any> }) => {
	const queryClient = useQueryClient();

	const [refund, setRefund] = React.useState(false);
	const { button: RefundSubmitButton, setIsLoading } = useLoading({
		label: "Refund The Label",
		async click() {
			setIsLoading(true);

			const req = await api.url("/user/labels/batch/refund").useAuth().post({ batch_uuid: row.original.uuid });
			const res = await req.json<{ success: boolean }>();

			if (res.success) {
				api.showSuccessToast();
				setIsLoading(false);
				setRefund(false);
				queryClient.invalidateQueries({ queryKey: ["batches", row.original.uuid] });
				return;
			}

			api.showErrorToast();
			setIsLoading(false);
			setRefund(false);
		},
	});

	const downloadSinglePDF = async () => {
		const download = () =>
			new Promise((resolve, reject) => {
				fetch(`${app.api}/user/labels/batch/download`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({
						uuid: row.original.uuid,
					}),
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						return response.blob();
					})
					.then((blob) => {
						if (row.original.merge_pdf_key === null) {
							reject("No PDF found");
						}

						const url = window.URL.createObjectURL(new Blob([blob]));
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", row.original.merge_pdf_key!);
						document.body.appendChild(link);
						link.click();
						link.parentNode?.removeChild(link);
						resolve(true);
					})
					.catch((error) => {
						reject(error);
					});
			});

		toast.promise(download, {
			loading: "Downloading PDF...",
			success: "PDF Downloaded!",
			error: "PDF Download Failed!",
		});
	};

	return (


		<div className="flex gap-2">
			<Button
				variant="outline"
				size="icon"
				disabled={row.original.is_downloaded === false}
				onClick={downloadSinglePDF}>
				<FileDown />
			</Button>
			<Link to={`/tickets/new?type=label&id=${row.original.uuid}`}>
				<Button variant="outline" size="icon">
					<LifeBuoy />
				</Button>
			</Link>

			<Button variant="outline" size="icon" disabled>
				<EyeIcon />
			</Button>
		</div>


	);
};

export default TableMenu;
