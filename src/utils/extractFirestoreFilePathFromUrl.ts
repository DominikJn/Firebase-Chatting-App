export default function extractFirestoreFilePathFromUrl(url: string): string {
  // Find the part after "/o/" and before "?"
  const filePath = url.split("/o/")[1]?.split("?")[0];

  // Decode URI component to get the original file path
  return decodeURIComponent(filePath);
}
