export interface ImageSizeResult {
  width: number;
  height: number;
  type: string;
}

export declare function imageSize(input: Uint8Array | ArrayBuffer): ImageSizeResult;
export declare function disableTypes(types: string[]): void;
export default imageSize;