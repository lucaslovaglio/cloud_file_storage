import {CloudProvider} from "./provider/provider.interface";

export interface FileData {
    name: string;
    content: string;
}

export interface FilesListItem {
    name: string;
    size: number;
}

export interface UploadOperation {
    data: FileData;
    result: void;
}
