export const getFilePath = (file) => {
    return `/files/${file._id}${file.extension}`;
};