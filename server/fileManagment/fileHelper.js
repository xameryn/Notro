import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegPath);

const THUMBNAIL_SIZES = {
    small: 200,
    medium: 600,
    large: 1200
};

const QUALITY_LEVELS = {
    small: 25,
    medium: 50,
    large: 80
};

export const getFilePath = (file) => {
    return `/files/${file._id}${file.extension}`;
};

export const getThumbnailPath = (fileId, size = 'medium') => {
    return `/files/thumbnails/${fileId}_thumb_${size}.jpg`;
};

export const generateThumbnails = async (filePath, fileType, fileId) => {
    try {
        const thumbnailPaths = {};
        const baseDir = path.dirname(filePath);
        const thumbnailsDir = path.join(baseDir, 'thumbnails');
        const filteredSizes = Object.entries(THUMBNAIL_SIZES).filter(([size]) => size !== 'large');

        await fs.mkdir(thumbnailsDir, { recursive: true });
        
        if (fileType.startsWith('image/')) {
            // for (const [sizeName, width] of Object.entries(THUMBNAIL_SIZES)) { // includes large, unneded at the moment
            for (const [sizeName, width] of filteredSizes) {
                const thumbPath = path.join(thumbnailsDir, `${fileId}_thumb_${sizeName}.jpg`);
                await sharp(filePath)
                    .resize(width)
                    .jpeg({ quality: QUALITY_LEVELS[sizeName] })
                    .toFile(thumbPath);
                
                thumbnailPaths[sizeName] = getThumbnailPath(fileId, sizeName);
            }
        }
        else if (fileType.startsWith('video/')) {
            const largeThumbPath = path.join(thumbnailsDir, `${fileId}_thumb_large.jpg`);

            await new Promise((resolve, reject) => {
                ffmpeg(filePath)
                    .screenshots({
                        timestamps: ['00:00:01'],
                        filename: `${fileId}_thumb_large.jpg`,
                        folder: thumbnailsDir
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            thumbnailPaths.large = getThumbnailPath(fileId, 'large'); // large can be used for video preview before playing ?
 
            for (const [sizeName, width] of filteredSizes) {
                const thumbPath = path.join(thumbnailsDir, `${fileId}_thumb_${sizeName}.jpg`);
                await sharp(largeThumbPath)
                    .resize(width)
                    .jpeg({ quality: QUALITY_LEVELS[sizeName] })
                    .toFile(thumbPath);
                
                thumbnailPaths[sizeName] = getThumbnailPath(fileId, sizeName);
            }
        }
    } catch (error) {
        console.error('Error generating thumbnails:', error);
        return { small: '', medium: '' };
    }
};