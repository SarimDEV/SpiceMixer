import { storage } from '../../services/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (imageUri, successCallback, errorCallback) => {
  // Create the file metadata
  const metadata = {
    contentType: 'image/jpeg',
  };

  const img = await fetch(imageUri);
  const bytes = await img.blob();
  const storageLocation = `images/${uuidv4()}`;

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, storageLocation);
  const uploadTask = uploadBytesResumable(storageRef, bytes, metadata);

  // Listen for state changes, errors, and completion of the upload.
  try {
    let url = await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }

          reject(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
    return successCallback(url);
  } catch (err) {
    return errorCallback(err);
  }
};
