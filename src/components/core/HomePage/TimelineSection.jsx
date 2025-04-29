import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timelineImage from "../../../assets/images/TimelineImage.png"
const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        MdDescription: "Fully committed to the success company",
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        MdDescription: "Students will always be our top priority",
    },
    {
        Logo: Logo3,
        heading: "Flexibility",
        MdDescription: "The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        heading: "Solve the problem",
        MdDescription: "Code your way to a solution",
    }
]

const TimelineSection = () => {
    return (
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-28 items-center justify-center">
        {/* Left Section (Timeline) */}
        <div className="w-[90%] lg:w-[45%] flex flex-col gap-5 items-center lg:items-start">
          {timeline.map((element, index) => (
            <div className="flex flex-row gap-5 items-center" key={index}>
              <div className="w-[50px] h-[50px] bg-white flex items-center justify-center">
                <img src={element.Logo} alt="" />
              </div>
              <div className="text-center lg:text-left">
                <h2 className="font-semibold text-[18px]">{element.heading}</h2>
                <p className="text-base">{element.MdDescription}</p>
              </div>
            </div>
          ))}
        </div>
  
        {/* Right Section (Image + Stats) */}
        <div className="relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]">
          <img
            src={timelineImage}
            alt="timelineImage"
            className="shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit"
          />
  
          {/* Stats Box */}
          <div className="absolute bg-caribbeangreen-700 flex flex-col lg:flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%] items-center text-center">
            <div className="flex flex-col lg:flex-row gap-5 items-center border-b lg:border-b-0 lg:border-r border-caribbeangreen-300 px-7 pb-4 lg:pb-0">
              <p className="text-3xl font-bold">10</p>
              <p className="text-caribbeangreen-300 text-sm">Years of Experience</p>
            </div>
  
            <div className="flex flex-col lg:flex-row gap-5 items-center px-7 pt-4 lg:pt-0">
              <p className="text-3xl font-bold">250</p>
              <p className="text-caribbeangreen-300 text-sm">Type of courses</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default TimelineSection
