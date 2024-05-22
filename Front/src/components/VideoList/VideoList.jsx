import React from 'react';
import styles from './VideoList.module.scss';

const VideoList = ({ videos, onLike, onDislike }) => {
  return (
    <div className={styles.videoList}>
      {videos.length > 0 ? (
        videos.map((video) => (
          <div key={video._id} className={styles.videoItem}>
            <h3>{video.title}</h3>
            <video src={video.url} controls />
            <div>
              <button onClick={() => onLike(video._id)}>J'aime</button>
              <button onClick={() => onDislike(video._id)}>Je n'aime pas</button>
              <div>J'aime : {video.likes}</div>
              <div>Je n'aime pas : {video.dislikes}</div>
            </div>
          </div>
        ))
      ) : (
        <p>Actuellement aucune vidéo.</p>
      )}
    </div>
  );
};

export default VideoList;
