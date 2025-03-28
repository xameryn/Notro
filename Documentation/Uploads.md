# Notro File Upload Documentation

## Overview

This document describes the file upload system in Notro, including the upload process, file storage, thumbnail generation, and how to access files from the frontend.

## Upload Process

### Frontend to Backend Flow

1. **User Selection**: 
   - User selects a file via the Upload component
   - User can provide optional metadata (display name, tags)

2. **File Submission**:
   - Frontend creates a FormData object containing:
     - The file itself
     - JSON-stringified metadata object

3. **API Request**:
   ```javascript
   // Upload request
   const formData = new FormData();
   formData.append("file", selectedFile);
   formData.append("metadata", JSON.stringify(fileMetadata));
   
   fetch("http://localhost:4000/api/upload", {
     method: "POST",
     body: formData
   });
   ```

### Backend Processing

1. **Request Handling**:
   - `multer` middleware processes the file upload
   - Generates a UUID for the file
   - Saves the file to the `files/` directory

2. **File Storage**:
   - Files are stored in `server/files/` with UUID-based filenames
   - Original file extension is preserved: `{uuid}{extension}`

3. **Metadata Processing**:
   - Extracts metadata from request body
   - Creates thumbnails if applicable
   - Saves metadata to MongoDB using the File model

## File Storage Structure

```
server/
├── files/
│   ├── {fileId}{extension}         # Original files
│   └── thumbnails/
│       ├── {fileId}_thumb_small.jpg
│       ├── {fileId}_thumb_medium.jpg
│       └── {fileId}_thumb_large.jpg
```

## Thumbnail Generation

Thumbnails are automatically generated for supported file types:

### For Images:
- Small (200px width, 25% quality)
- Medium (600px width, 50% quality)

### For Videos:
- Screenshot taken at 00:00:01 timestamp
- Large thumbnail created directly (1200px width)
- Small and medium thumbnails created from the large one

### Access Paths
Thumbnails are accessible via URLs:
```
/files/thumbnails/{fileId}_thumb_{size}.jpg
```
Where `size` is one of: `small`, `medium`, or `large`

## File Model Schema

Files are stored in MongoDB with the following structure:

```javascript
{
  _id: String,            // File UUID
  name: String,           // Display name
  type: String,           // MIME type category
  extension: String,      // File extension
  uploadDate: Date,       // Upload timestamp
  serverFile: Boolean,    // Shared with server
  tagList: [String],      // User-defined tags
  thumbnails: {
    small: String,        // Path to small thumbnail
    medium: String,       // Path to medium thumbnail
    large: String         // Path to large thumbnail
  },
  size: Number            // Size in bytes
}
```

## Accessing Files from Frontend

### File URLs

- **Original file**: `/files/{fileId}{extension}`
- **Thumbnails**:    `/files/thumbnails/{fileId}_thumb_{size}.jpg`

### API Endpoints

1. **Upload a file**:
   ```
   POST /api/upload
   ```
   - Accepts: `multipart/form-data` with `file` and `metadata` fields

2. **Get all files**:
   ```
   GET /api/files
   ```
   - Returns: Array of file metadata objects

3. **Get files by user** (not implemented in routes but controller exists):
   ```
   GET /api/files/user/{userID}
   ```

4. **Get files by server** (not implemented in routes but controller exists):
   ```
   GET /api/files/server/{serverID}
   ```

## Frontend Display

When displaying files, use the following approach:

1. **Images**: 
   - Small thumbnails for lists/grids
   - Medium thumbnails for previews
   - Original file for full-size view

2. **Videos**:
   - Thumbnails for preview
   - Original file for playback

3. **Other file types**:
   - Display appropriate icon based on file type
   - Link to original file for download

## Error Handling

The system includes error handling for:
- Missing files
- Thumbnail generation failures
- Database errors

Failed thumbnail generation will return empty paths, allowing the frontend to display fallback icons.