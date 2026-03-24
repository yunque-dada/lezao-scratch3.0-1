/**
 * 图片懒加载组件
 */
import React, { useState } from 'react';

const LazyImage = ({ 
  src, 
  alt = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5Ij5sb2FkaW5nLjwvdGV4dD48L3N2Zz4=',
  style = {},
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      {!loaded && (
        <img
          src={placeholder}
          alt={alt}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      <img
        src={error ? placeholder : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...style
        }}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default LazyImage;
