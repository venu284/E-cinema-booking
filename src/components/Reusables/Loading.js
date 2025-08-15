import React from 'react'

export const Loading = () => {
  return (
    <div
      className='fixed w-full h-screen text-center loading'
      style={{
        background: '#0008',
        color: 'white',
        top: 0,
        left: 0,
        zIndex: 50
      }}
    >
      <svg width='205' height='250' viewBox='0 0 40 50'>
        <polygon
          stroke='#fff'
          strokeWidth='1'
          fill='none'
          points='20,1 40,40 1,40'
        />
        <text fill='#fff' x='5' y='47'>
          Loading
        </text>
      </svg>
      <style jsx>{`
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .loading svg {
          font-size: 5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          animation: text 1s ease-in-out infinite;
        }
        @keyframes text {
          50% {
            opacity: 0.1;
          }
        }
        .loading polygon {
          stroke-dasharray: 22;
          stroke-dashoffset: 1;
          animation: dash 4s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite
            alternate-reverse;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 234;
          }
        }
      `}</style>
    </div>
  )
}
