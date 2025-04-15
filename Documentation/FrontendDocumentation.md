# Frontend Documentation

## Homepage UI

On the Notro homepage, the following elements are displayed: 
- the user's servers (in the left sidebar - in this screenshot, there is only one)
- the user's selected server (highlighted in grey)
- the server's files (in the middle)
- file searching/filtering/sorting/viewing options (in the middle, on top)
- an upload file field (to the right)

Each individual file displays: 
- the file display name
- a thumbnail
- the file's tags

![Screenshot 2025-04-15 122904](https://github.com/user-attachments/assets/1c6d2880-c6f4-463b-8813-bcfaac7a63a2)


<br>

## Uploading UI

When the user drags a file into the "Upload a file" component (or clicks on it, and selects a file from their directory), the following screen is displayed: 

The user sees:
- their selected file (with the option to change it)
- the display name input field (which they can fill or leave blank - if left blank, the display name will be the original file name)
- the tags field (where they can type a tag and hit the enter key to add it)
- a preview of the file to be uploaded (only works for images, not for video/audio/text files)
- options to "Upload" or "Cancel"

After click "Upload," an "Uploading..." button replaces the two options. 

![Screenshot 2025-04-15 122947](https://github.com/user-attachments/assets/3c8d6228-329d-41e3-a061-40a0652eeb74)

<br>

## Successful Upload UI

After a successful upload, the new file displays on the homepage, and a toast notification displays to let the user know their upload was a success.

![Screenshot 2025-04-15 122956](https://github.com/user-attachments/assets/f3e1db19-9b67-42b3-9335-4cfcfe393ef1)

<br>

## File Inspection UI

After clicking on a file, a popup dialog opens. It displays:
- the file display name
- the media
- the tags
- three options to "Copy URL," "Download," and "Delete"

![Screenshot 2025-04-15 123056](https://github.com/user-attachments/assets/c1c7b9ab-4603-480f-abd8-3ff63a0df52f)

## Delete File UI

When "Delete" is selected, it changes to "Confirm Delete." Once the user confirms, the file will be deleted, and a toast notification will appear to confirm it. 

![Screenshot 2025-04-15 123104](https://github.com/user-attachments/assets/98707b35-5354-463f-b5db-f89e403a32d7)

![Screenshot 2025-04-15 123112](https://github.com/user-attachments/assets/3225e891-6a63-47ca-bc33-94d8b2d0c8c3)

## View Options

The user can choose how they want to view their files on the homepage. They can select:
-to view/hide file names
-to view/hide file tags

If they choose to hide both of those features, the homepage will look like this: 

![Screenshot 2025-04-15 123157](https://github.com/user-attachments/assets/ac324028-7ce7-4524-9cbc-005a3e19a44b)

## Sort Options

The user can can choose how to sort their files:
- recent (default)
- oldest
- alphabetical

![Screenshot 2025-04-15 123131](https://github.com/user-attachments/assets/c30c9b0a-fc21-4e5c-abbe-420c9f1f1dba)

## Mediatype Options

The user can choose what type of media they want to view:
- all (default)
- images
- videos
- audio files
- text files
- other

![Screenshot 2025-04-15 123210](https://github.com/user-attachments/assets/44bf39e6-dc2b-43eb-9793-9ff77461ab79)

## Searchbar

There is also a searchbar, where the user can search for files by name or tags.

Searching for files by name: 
![Screenshot 2025-04-15 123221](https://github.com/user-attachments/assets/f1058a9e-86cd-4d9a-874d-b981c92ce705)

Searching for files by tags:
![Screenshot 2025-04-15 123232](https://github.com/user-attachments/assets/1da4aa27-3fa8-4d79-9bc1-c947776e5895)

