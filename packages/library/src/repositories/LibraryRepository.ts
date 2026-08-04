import type { Repository } from "@knowledgeos/domain";
import type { LibraryId } from "../identity/LibraryId.js";
import type { Library } from "../model/Library.js";
export interface LibraryRepository extends Repository<LibraryId, Library> {}
