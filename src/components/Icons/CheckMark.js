import React from 'react'

export default function CheckMark ({ color = "#00E376", size = '12px' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6.28571L5.71429 8L8 4" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="6" r="5" stroke={color}/>
    </svg>
  )
}
