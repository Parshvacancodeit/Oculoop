// import React, { useState, useEffect } from 'react';
// import Masonry from 'react-masonry-css';
// import './ImageGrid.css';

// const ImageGrid = () => {
//   const [images, setImages] = useState([]);
//   const [hoverData, setHoverData] = useState({});
//   const [likedImages, setLikedImages] = useState({});

//   const fetchImages = async () => {
//     try {
//       const res = await fetch(`https://api.pexels.com/v1/search?query=technology&per_page=30`, {
//         headers: {
//           Authorization: import.meta.env.VITE_PEXELS_API_KEY,
//         },
//       });
//       const data = await res.json();
//       const photos = data.photos.map((img) => ({
//         id: img.id,
//         url: img.src.large,
//         alt: img.alt || 'No description',
//         liked: false,
//       }));
//       setImages(photos);
//     } catch (error) {
//       console.error("Error fetching images:", error);
//     }
//   };

//   useEffect(() => {
//     fetchImages();
//   }, []);

//   const handleLikeToggle = (id) => {
//     setLikedImages((prev) => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   const handleMouseEnter = (id) => {
//     setHoverData((prev) => ({
//       ...prev,
//       [id]: { enter: Date.now(), duration: 0 }
//     }));
//   };

//   const handleMouseLeave = (id) => {
//     const enterTime = hoverData[id]?.enter || Date.now();
//     const duration = Date.now() - enterTime;
//     console.log(`Image ${id} hovered for ${duration}ms`);
//     setHoverData((prev) => ({
//       ...prev,
//       [id]: { ...prev[id], duration }
//     }));
//   };

//   const breakpointColumnsObj = {
//     default: 4,
//     1100: 4,
//     800: 3,
//     500: 2
//   };

//   return (
//     <div className="image-grid-container">
//       <Masonry
//         breakpointCols={breakpointColumnsObj}
//         className="my-masonry-grid"
//         columnClassName="my-masonry-grid_column"
//       >
//         {images.map((img) => (
//           <div key={img.id} className="image-card">
//             <img
//               src={img.url}
//               alt={img.alt}
//               className="grid-image"
//               onMouseEnter={() => handleMouseEnter(img.id)}
//               onMouseLeave={() => handleMouseLeave(img.id)}
//             />
//             <div className="image-footer">
//               <p className="image-alt">{img.alt}</p>
//               <button
//                 className={`like-button ${likedImages[img.id] ? 'liked' : ''}`}
//                 onClick={() => handleLikeToggle(img.id)}
//               >
//                 ❤️
//               </button>
//             </div>
//           </div>
//         ))}
//       </Masonry>
//     </div>
//   );
// };

// export default ImageGrid;

// import React, { useState, useEffect, useRef } from 'react';
// import Masonry from 'react-masonry-css';
// import './ImageGrid.css';
// import imageData from '../assets/data/pexels_images.json';
// import ImageModal from './ImageModal';

// const breakpointColumnsObj = {
//   default: 4,
//   1100: 3,
//   800: 2,
//   500: 1,
// };

// const ImageGrid = () => {
//   const [images, setImages] = useState([]);
//   const [likedImages, setLikedImages] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const [hoverStartTimes, setHoverStartTimes] = useState({});
//   const interactionMap = useRef({});
//   const logTimeouts = useRef({});

//   useEffect(() => {
//     setImages(imageData);
//   }, []);

//   const logInteraction = (url) => {
//     const data = interactionMap.current[url];
//     if (!data) return;

//     const finalLog = {
//       url: data.url,
//       alt: data.alt,
//       tags: data.tags || [],
//       type: Array.from(data.type),
//       duration: data.duration || null,
//       liked: data.liked,
//       timestamp: new Date().toISOString(),
//     };

//     console.log('✅ Final Behavior Logged:', finalLog);

//     delete interactionMap.current[url];
//     clearTimeout(logTimeouts.current[url]);
//   };

//   const scheduleLog = (img) => {
//     clearTimeout(logTimeouts.current[img.url]);
//     logTimeouts.current[img.url] = setTimeout(() => {
//       logInteraction(img.url);
//     }, 3000); // Log 3 seconds after last interaction
//   };

//   const updateInteraction = (img, updates) => {
//     const current = interactionMap.current[img.url] || {
//       url: img.url,
//       alt: img.alt,
//       tags: img.tags || [],
//       type: new Set(),
//       liked: false,
//       duration: 0,
//     };

//     // Merge types
//     if (updates.type) {
//       updates.type.forEach((t) => current.type.add(t));
//     }

//     // Set latest liked state
//     if (typeof updates.liked === 'boolean') {
//       current.liked = updates.liked;
//     }

//     // Add hover duration
//     if (typeof updates.duration === 'number') {
//       current.duration += updates.duration;
//     }

//     interactionMap.current[img.url] = current;
//     scheduleLog(img);
//   };

//   const handleMouseEnter = (img) => {
//     setHoverStartTimes((prev) => ({
//       ...prev,
//       [img.url]: Date.now(),
//     }));
//   };

//   const handleMouseLeave = (img) => {
//     const start = hoverStartTimes[img.url];
//     if (start) {
//       const duration = Date.now() - start;
//       if (duration > 2000) {
//         updateInteraction(img, { type: ['hover'], duration });
//       }
//     }
//   };

//   const handleImageClick = (img) => {
//     updateInteraction(img, { type: ['modal'] });
//     setSelectedImage(img);
//     setIsModalOpen(true);
//   };

//   const toggleLike = (img) => {
//     const isLiked = likedImages.includes(img.url);
//     const updatedLikes = isLiked
//       ? likedImages.filter((url) => url !== img.url)
//       : [...likedImages, img.url];

//     setLikedImages(updatedLikes);

//     updateInteraction(img, {
//       type: ['like'],
//       liked: !isLiked,
//     });
//   };

//   const handleModalLike = () => {
//     if (selectedImage) {
//       toggleLike(selectedImage);
//     }
//   };

//   return (
//     <div className="image-grid-container">
//       <Masonry
//         breakpointCols={breakpointColumnsObj}
//         className="my-masonry-grid"
//         columnClassName="my-masonry-grid_column"
//       >
//         {images.map((img) => (
//           <div key={img.url} className="grid-item">
//             <img
//               src={img.url}
//               alt={img.alt}
//               className="grid-image"
//               onMouseEnter={() => handleMouseEnter(img)}
//               onMouseLeave={() => handleMouseLeave(img)}
//               onClick={() => handleImageClick(img)}
//             />
//             <p className="image-caption">{img.alt}</p>
//             <button
//               className={`like-button ${likedImages.includes(img.url) ? 'liked' : ''}`}
//               onClick={() => toggleLike(img)}
//             >
//               {likedImages.includes(img.url) ? '❤️ Liked' : '🤍 Like'}
//             </button>
//           </div>
//         ))}
//       </Masonry>

//       <ImageModal
//         image={selectedImage}
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onLike={handleModalLike}
//         isLiked={selectedImage ? likedImages.includes(selectedImage.url) : false}
//       />
//     </div>
//   );
// };

// export default ImageGrid;



import React, { useState, useEffect, useRef } from 'react';
import Masonry from 'react-masonry-css';
import './ImageGrid.css';
import imageData from '../assets/data/pexels_images.json';
import ImageModal from './ImageModal';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  800: 2,
  500: 1,
};

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [hoverStartTimes, setHoverStartTimes] = useState({});
  const interactionMap = useRef({});
  const logTimeouts = useRef({});

  useEffect(() => {
    setImages(imageData);
  }, []);

  const logInteraction = async (url) => {
    const data = interactionMap.current[url];
    if (!data) return;

    const finalLog = {
      url: data.url,
      alt: data.alt,
      tags: data.tags || [],
      type: Array.from(data.type),
      duration: data.duration || null,
      liked: data.liked,
      timestamp: new Date().toISOString(),
    };

    console.log('✅ Final Behavior Logged:', finalLog);

    // Send to backend
    try {
      const response = await fetch('http://localhost:5051/log-behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalLog),
      });
      const result = await response.json();
      console.log('📤 Sent to backend:', result);
    } catch (error) {
      console.error('❌ Error sending log:', error);
    }

    delete interactionMap.current[url];
    clearTimeout(logTimeouts.current[url]);
  };

  const scheduleLog = (img) => {
    clearTimeout(logTimeouts.current[img.url]);
    logTimeouts.current[img.url] = setTimeout(() => {
      logInteraction(img.url);
    }, 3000);
  };

  const updateInteraction = (img, updates) => {
    const current = interactionMap.current[img.url] || {
      url: img.url,
      alt: img.alt,
      tags: img.tags || [],
      type: new Set(),
      liked: false,
      duration: 0,
    };

    if (updates.type) {
      updates.type.forEach((t) => current.type.add(t));
    }

    if (typeof updates.liked === 'boolean') {
      current.liked = updates.liked;
    }

    if (typeof updates.duration === 'number') {
      current.duration += updates.duration;
    }

    interactionMap.current[img.url] = current;
    scheduleLog(img);
  };

  const handleMouseEnter = (img) => {
    setHoverStartTimes((prev) => ({
      ...prev,
      [img.url]: Date.now(),
    }));
  };

  const handleMouseLeave = (img) => {
    const start = hoverStartTimes[img.url];
    if (start) {
      const duration = Date.now() - start;
      if (duration > 2000) {
        updateInteraction(img, { type: ['hover'], duration });
      }
    }
  };

  const handleImageClick = (img) => {
    updateInteraction(img, { type: ['modal'] });
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const toggleLike = (img) => {
    const isLiked = likedImages.includes(img.url);
    const updatedLikes = isLiked
      ? likedImages.filter((url) => url !== img.url)
      : [...likedImages, img.url];

    setLikedImages(updatedLikes);

    updateInteraction(img, {
      type: ['like'],
      liked: !isLiked,
    });
  };

  const handleModalLike = () => {
    if (selectedImage) {
      toggleLike(selectedImage);
    }
  };

  return (
    <div className="image-grid-container">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((img) => (
          <div key={img.url} className="grid-item">
            <img
              src={img.url}
              alt={img.alt}
              className="grid-image"
              onMouseEnter={() => handleMouseEnter(img)}
              onMouseLeave={() => handleMouseLeave(img)}
              onClick={() => handleImageClick(img)}
            />
            <p className="image-caption">{img.alt}</p>
            <button
              className={`like-button ${likedImages.includes(img.url) ? 'liked' : ''}`}
              onClick={() => toggleLike(img)}
            >
              {likedImages.includes(img.url) ? '❤️ Liked' : '🤍 Like'}
            </button>
          </div>
        ))}
      </Masonry>

      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLike={handleModalLike}
        isLiked={selectedImage ? likedImages.includes(selectedImage.url) : false}
      />
    </div>
  );
};

export default ImageGrid;
