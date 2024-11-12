// Utility function to get the file extension and description
export function GetFileExtension(filePath) {
  // Extract the extension using regex
  const extensionMatch = filePath.match(/\.([a-zA-Z0-9]+)$/);
  const extension = extensionMatch ? extensionMatch[0] : null;

  // Map of file extensions to their corresponding descriptions
  const fileTypes = {
    '.xlsx': 'Excel',
    '.xls': 'Excel',
    '.docx': 'Word Document',
    '.doc': 'Word Document',
    '.pdf': 'PDF Document',
    '.jpg': 'JPEG Image',
    '.jpeg': 'JPEG Image',
    '.png': 'PNG Image',
    '.txt': 'Text File',
    '.pptx': 'PowerPoint Presentation',
    '.ppt': 'PowerPoint Presentation',
    '.zip': 'ZIP Archive',
    '.rar': 'RAR Archive',
    '.csv': 'CSV File',
    '.mp4': 'MP4 Video',
    '.mp3': 'MP3 Audio',
    '.gif': 'GIF Image',
    '.html': 'HTML Document',
    '.json': 'JSON File',
    // Add more extensions and descriptions as needed
  };

  // Check if the extracted extension is valid and exists in the fileTypes map
  if (extension && fileTypes[extension]) {
    return `${extension} - ${fileTypes[extension]}`;
  } else {
    return 'Unknown File Type'; // Return this if the extension is not recognized
  }
}
