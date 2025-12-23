import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from './config';

const MESSAGES_COLLECTION = 'messages';
const STORAGE_FOLDER = 'message-media';

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} messageId - The message ID to associate with the file
 * @param {string} fileType - Type of file (photo, video, audio)
 * @returns {Promise<string>} - Download URL of the uploaded file
 */
export const uploadFile = async (file, messageId, fileType) => {
  try {
    const timestamp = Date.now();
    const fileName = `${messageId}_${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${STORAGE_FOLDER}/${fileType}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      name: file.name,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} filePath - The storage path of the file to delete
 */
export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw - we still want to delete the message even if file deletion fails
  }
};

/**
 * Add a new message to Firestore
 * @param {Object} messageData - Message data including text, name, and optional media files
 * @returns {Promise<Object>} - The created message with ID
 */
export const addMessage = async (messageData) => {
  try {
    const { text, name, photos, videos, audio } = messageData;

    // Create initial message document
    const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
      text,
      name,
      date: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const messageId = messageRef.id;
    const mediaUrls = {};

    // Upload photos if provided
    if (photos && photos.length > 0) {
      const photoUrls = [];
      for (const photo of photos) {
        const photoData = await uploadFile(photo, messageId, 'photo');
        photoUrls.push(photoData);
      }
      mediaUrls.photos = photoUrls;
    }

    // Upload videos if provided
    if (videos && videos.length > 0) {
      const videoUrls = [];
      for (const video of videos) {
        const videoData = await uploadFile(video, messageId, 'video');
        videoUrls.push(videoData);
      }
      mediaUrls.videos = videoUrls;
    }

    // Upload audio if provided
    if (audio) {
      const audioData = await uploadFile(audio, messageId, 'audio');
      mediaUrls.audio = audioData;
    }

    // Update message with media URLs only if there are any
    if (Object.keys(mediaUrls).length > 0) {
      await updateDoc(messageRef, mediaUrls);
    }

    return {
      id: messageId,
      text,
      name,
      date: new Date().toISOString().split('T')[0],
      photos: mediaUrls.photos || [],
      videos: mediaUrls.videos || [],
      audio: mediaUrls.audio || null
    };
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};

/**
 * Get all messages from Firestore
 * @returns {Promise<Array>} - Array of messages
 */
export const getMessages = async () => {
  try {
    const messagesQuery = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(messagesQuery);
    const messages = [];

    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

/**
 * Update an existing message
 * @param {string} messageId - The ID of the message to update
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<void>}
 */
export const updateMessage = async (messageId, updates) => {
  try {
    const messageRef = doc(db, MESSAGES_COLLECTION, messageId);

    const updateData = {
      text: updates.text,
      name: updates.name,
      updatedAt: serverTimestamp()
    };

    // Handle photo updates
    if (updates.newPhotos && updates.newPhotos.length > 0) {
      const newPhotoUrls = [];
      for (const photo of updates.newPhotos) {
        const photoData = await uploadFile(photo, messageId, 'photo');
        newPhotoUrls.push(photoData);
      }
      updateData.photos = [...(updates.photos || []), ...newPhotoUrls];
    } else {
      // No new photos being added, just update with existing photos
      updateData.photos = updates.photos || [];
    }

    // Handle video updates
    if (updates.newVideos && updates.newVideos.length > 0) {
      const newVideoUrls = [];
      for (const video of updates.newVideos) {
        const videoData = await uploadFile(video, messageId, 'video');
        newVideoUrls.push(videoData);
      }
      updateData.videos = [...(updates.videos || []), ...newVideoUrls];
    } else {
      // No new videos being added, just update with existing videos
      updateData.videos = updates.videos || [];
    }

    // Handle audio updates
    if (updates.newAudio) {
      // Delete old audio if exists
      if (updates.oldAudioPath) {
        await deleteFile(updates.oldAudioPath);
      }
      const audioData = await uploadFile(updates.newAudio, messageId, 'audio');
      updateData.audio = audioData;
    } else if (updates.deleteAudio) {
      // Audio was deleted without replacement
      if (updates.oldAudioPath) {
        await deleteFile(updates.oldAudioPath);
      }
      updateData.audio = null;
    }

    // Delete removed photos from storage
    if (updates.deletedPhotos && updates.deletedPhotos.length > 0) {
      for (const photo of updates.deletedPhotos) {
        if (photo.path) {
          await deleteFile(photo.path);
        }
      }
    }

    // Delete removed videos from storage
    if (updates.deletedVideos && updates.deletedVideos.length > 0) {
      for (const video of updates.deletedVideos) {
        if (video.path) {
          await deleteFile(video.path);
        }
      }
    }

    await updateDoc(messageRef, updateData);
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

/**
 * Delete a message and its associated media files
 * @param {string} messageId - The ID of the message to delete
 * @param {Object} mediaFiles - Object containing media file paths to delete
 * @returns {Promise<void>}
 */
export const deleteMessage = async (messageId, mediaFiles = {}) => {
  try {
    // Delete associated media files
    if (mediaFiles.photos && mediaFiles.photos.length > 0) {
      for (const photo of mediaFiles.photos) {
        if (photo.path) {
          await deleteFile(photo.path);
        }
      }
    }

    if (mediaFiles.videos && mediaFiles.videos.length > 0) {
      for (const video of mediaFiles.videos) {
        if (video.path) {
          await deleteFile(video.path);
        }
      }
    }

    if (mediaFiles.audio && mediaFiles.audio.path) {
      await deleteFile(mediaFiles.audio.path);
    }

    // Delete the message document
    const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};
