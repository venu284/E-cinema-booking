// src/components/Reusables/PageWrapper.js

import React from 'react'

export const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl bg-black/60 backdrop-blur-md text-white rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  )
}
