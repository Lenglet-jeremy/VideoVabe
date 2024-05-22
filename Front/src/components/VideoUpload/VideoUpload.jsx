import React, { useState } from 'react';
import styles from './VideoUpload.module.scss';

const VideoUpload = ({ onVideoUploaded }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', file);

    try {
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        setTitle('');
        setFile(null);
        onVideoUploaded();
      } else {
        console.error('Failed to upload video.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <form className={styles.videoUploadForm} onSubmit={handleUpload}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Titre</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="video">Fichier</label>
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Upload Video</button>
    </form>
  );
};

export default VideoUpload;
