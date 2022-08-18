"use strict";
import axios from "axios";
import {
	Context,
	Service,
	ServiceBroker,
	ServiceSchema,
	Errors,
} from "moleculer";
import path from "path";
import {
	analyze,
	getColorHistogramData,
	resizeImage,
} from "../utils/imagetransformation.utils";
export default class ImageTransformation extends Service {
	// @ts-ignore
	public constructor(
		public broker: ServiceBroker,
		schema: ServiceSchema<{}> = { name: "imagetransformation" }
	) {
		super(broker);
		this.parseServiceSchema({
			name: "imagetransformation",
			mixins: [],
			settings: {
				// Available fields in the responses
				fields: ["_id", "name", "quantity", "price"],

				// Validator for the `create` & `insert` actions.
				entityValidator: {
					name: "string|min:3",
					price: "number|positive",
				},
			},
			hooks: {},
			actions: {
				resize: {
					rest: "POST /resizeImage",
					params: {},
					async handler(
						ctx: Context<{
							imageFile: string | Buffer;
							newWidth: number;
							newHeight: number;
							outputPath: string;
						}>
					) {
						const resizeResult = await resizeImage(
							ctx.params.imageFile,
							ctx.params.outputPath,
							ctx.params.newWidth,
							ctx.params.newHeight
						);
						return { resizeOperationStatus: resizeResult };
					},
				},
				analyze: {
					rest: "POST /analyze",
					params: {},
					handler: async (
						ctx: Context<{ imageFilePath: string }>
					) => {
						const url = new URL(ctx.params.imageFilePath);
						const pathName = url.pathname;
						const decodedImageFileURI = decodeURI(pathName);
						const finalImagePath = path.resolve(
							"." + decodedImageFileURI
						);

						const analyzedData = await analyze(finalImagePath);
						const colorHistogramData = await getColorHistogramData(
							finalImagePath,
							false
						);

						return {
							analyzedData,
							colorHistogramData,
						};
					},
				},
			},
			methods: {},
		});
	}
}
