import { UspsService } from "@lib/usps";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";

export const batchLabelQueue = async (batch: MessageBatch<Usps.BATCHZODSCHEMA>, env: Bindings) => {
	for (const item of batch.messages) {
		console.log(item.body.batch_uuid);

		for (const recipient of item.body.recipient) {
			const usps = new UspsService(
				env,
				{
					package: item.body.package,
					recipient: recipient,
					sender: item.body.sender,
					type: item.body.type,
					shippingdate: item.body.shippingdate,
				},
				1,
			);

			await usps.insertLabel({ code: null, id: null, pdf: null }, { user: 100, reseller: 100 });
			const payload = await usps.generateLabel();
		}
	}
};
