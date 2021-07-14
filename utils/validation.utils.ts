import {
	IExplodedPathResponse,
	IExtractComicBookCoverErrorResponse,
	IExtractedComicBookCoverFile,
	IExtractionOptions,
	IFolderData,
} from "../interfaces/folder.interface";
const Validator = require("fastest-validator");
import { logger } from "./logger.utils";

export const validateComicBookMetadata = (
	comicBookMetadataObject: IExtractedComicBookCoverFile
): boolean => {
	const validator = new Validator();
	const sch = {
		name: { type: "string" },
		fileSize: { type: "number", positive: true, integer: true },
		path: { type: "string" },
	};
	const check = validator.compile(sch);
	if (check(comicBookMetadataObject)) {
		logger.info(`Valid comic book metadata: ${comicBookMetadataObject}`);
	} else {
		logger.error(
			`Comic book metadata was invalid:
			${comicBookMetadataObject}`
		);
	}
	return check(comicBookMetadataObject);
};