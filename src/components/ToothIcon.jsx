import React from 'react';

export const ToothIcon = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C9.5 2 7.5 4 7.5 6.5V10C7.5 11.5 7 13 6 14C5.5 14.5 5 15.5 5 16.5V18.5C5 20 6 21 7.5 21C8.5 21 9.5 20.5 10 19.5C10.5 18.5 11 17.5 11 16.5V14.5C11 13.5 11.5 12.5 12 12.5C12.5 12.5 13 13.5 13 14.5V16.5C13 17.5 13.5 18.5 14 19.5C14.5 20.5 15.5 21 16.5 21C18 21 19 20 19 18.5V16.5C19 15.5 18.5 14.5 18 14C17 13 16.5 11.5 16.5 10V6.5C16.5 4 14.5 2 12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
      />
      <path
        d="M10.5 8C10.5 8.3 10.2 8.5 10 8.5C9.7 8.5 9.5 8.3 9.5 8C9.5 7.7 9.7 7.5 10 7.5C10.2 7.5 10.5 7.7 10.5 8Z"
        fill="white"
      />
      <path
        d="M14.5 8C14.5 8.3 14.2 8.5 14 8.5C13.7 8.5 13.5 8.3 13.5 8C13.5 7.7 13.7 7.5 14 7.5C14.2 7.5 14.5 7.7 14.5 8Z"
        fill="white"
      />
    </svg>
  );
};