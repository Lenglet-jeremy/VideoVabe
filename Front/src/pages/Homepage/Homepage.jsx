import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import VideoUpload from '../../components/VideoUpload/VideoUpload';
import VideoList from '../../components/VideoList/VideoList';
import styles from './Homepage.module.scss';

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserVideos();
    }
  }, [isAuthenticated]);

  const fetchUserVideos = async () => {
    try {
      const response = await fetch('/api/videos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await fetch(`/api/videos/${id}/like`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        fetchUserVideos();
      }
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async (id) => {
    try {
      const response = await fetch(`/api/videos/${id}/dislike`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        fetchUserVideos();
      }
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  return (
    <div className={`d-flex ${styles.homePage}`}>
      {isAuthenticated ? (
        <>
          <div className={styles.videoPanel}>
            <h2>Mes Vidéos</h2>
            <VideoList videos={videos} onLike={handleLike} onDislike={handleDislike} />
          </div>
          <div className={styles.uploadPanel}>
            <h2>Upload une Nouvelle Vidéo</h2>
            <VideoUpload onVideoUploaded={fetchUserVideos} />
          </div>
        </>
      ) : (
        <div className={styles.welcomeMessage}>
          <h1>Bienvenue chez VideoVibe !</h1>
          <p>Upload une vidéo !</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
