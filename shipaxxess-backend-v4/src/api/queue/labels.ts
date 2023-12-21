import { UspsService } from "@lib/usps";
import { Usps } from "@shipaxxess/shipaxxess-zod-v4";

export const batchLabelQueue = async (batch: MessageBatch<Usps.BATCHZODSCHEMA>, env: Bindings) => {
	for (const item of batch.messages) {
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

			const payload = await usps.generateLabel();
			await usps.insertLabel(payload.payload, { user: 100, reseller: 100 });
		}
	}
};
