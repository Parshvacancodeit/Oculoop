// import React, { useEffect, useRef } from 'react';
// import './ImageModal.css';
// import axios from 'axios';

// const ImageModal = ({ image, isOpen, onClose, onLike, isLiked }) => {
//   const openTimestamp = useRef(null);

//   // Log behavior to backend
//   const sendBehaviorLog = async (type, duration = null) => {
//     if (!image || !image.url) return;

//     const logData = {
//       url: image.url,
//       alt: image.alt,
//       tags: image.tags,
//       type: [type],
//       duration,
//       liked: isLiked,
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       await axios.post('http://localhost:5051/log-behavior', logData);
//       console.log(`📤 Sent ${type} log:`, logData);
//     } catch (err) {
//       console.error(`❌ Error sending ${type} log:`, err);
//     }
//   };

//   // Track open and close time for modal
//   useEffect(() => {
//     if (isOpen) {
//       openTimestamp.current = Date.now();
//     } else if (openTimestamp.current && image) {
//       const duration = Date.now() - openTimestamp.current;
//       sendBehaviorLog('modal', duration);
//       openTimestamp.current = null;
//     }
//   }, [isOpen]);

//   // Send log on like
//   const handleLike = () => {
//     onLike();
//     setTimeout(() => sendBehaviorLog('like'), 100);
//   };

//   if (!isOpen || !image) return null;

//   return (
//     <div className="modal-backdrop" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <img src={image.url} alt={image.alt} className="modal-image" />
//         <div className="modal-details">
//           <h2>{image.alt || "Untitled Image"}</h2>
//           <p>{image.description || "No description available."}</p>
//           <div className="modal-tags">
//             {image.tags?.map((tag, i) => (
//               <span key={i} className="tag">#{tag}</span>
//             ))}
//           </div>
//           <button onClick={handleLike}>
//             {isLiked ? '❤️ Liked' : '🤍 Like'}
//           </button>
//         </div>
//         <button className="close-button" onClick={onClose}>X</button>
//       </div>
//     </div>
//   );
// };

// export default ImageModal;


import React, { useEffect, useRef } from 'react';
import './ImageModal.css';
import smartLog from '../utils/smartLog';

const ImageModal = ({ image, isOpen, onClose, onLike, isLiked }) => {
  const openTimestamp = useRef(null);

  // Track open and close time for modal
  useEffect(() => {
    if (isOpen) {
      openTimestamp.current = Date.now();
    } else if (openTimestamp.current && image) {
      const duration = Date.now() - openTimestamp.current;

      const modalLog = {
        url: image.url,
        alt: image.alt,
        tags: image.tags,
        type: ['modal'],
        duration,
        liked: isLiked,
        timestamp: new Date().toISOString(),
      };

      smartLog(modalLog);
      openTimestamp.current = null;
    }
  }, [isOpen]);

  // Like handler
  const handleLike = () => {
    onLike();

    const likeLog = {
      url: image.url,
      alt: image.alt,
      tags: image.tags,
      type: ['like'],
      duration: null,
      liked: true,
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => smartLog(likeLog), 100);
  };

  if (!isOpen || !image) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={image.url} alt={image.alt} className="modal-image" />
        <div className="modal-details">
          <h2>{image.alt || "Untitled Image"}</h2>
          <p>{image.description || "No description available."}</p>
          <div className="modal-tags">
            {image.tags?.map((tag, i) => (
              <span key={i} className="tag">#{tag}</span>
            ))}
          </div>
          <button onClick={handleLike}>
            {isLiked ? '❤️ Liked' : '🤍 Like'}
          </button>
        </div>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default ImageModal;

