import React from 'react'

const HighLightText = ({text}) => {
  return (
    <span className='font-bold bg-gradient-to-b from-[#12D8FA] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent'>
        {" "}
        {text}
    </span>
  )
}

export default HighLightText
