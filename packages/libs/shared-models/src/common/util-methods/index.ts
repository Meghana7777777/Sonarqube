export const getChunkRecords = <T>(allRecords: T[], chunkSize: number): T[][] => {
    const numberOfChunks = Math.ceil(allRecords.length / chunkSize);
    const chunks: T[][] = [];
    for (let i = 0; i < numberOfChunks; i++) {
        const startIndex = i * chunkSize;
        const endIndex = (i + 1) * chunkSize;
        const chunk = allRecords.slice(startIndex, endIndex);
        chunks.push(chunk);
    }
    return chunks;
};