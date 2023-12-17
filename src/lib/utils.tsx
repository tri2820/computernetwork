export const uint8ArrayToString = (arr: Uint8Array) => {
    return Buffer.from(arr).toString('base64')
}