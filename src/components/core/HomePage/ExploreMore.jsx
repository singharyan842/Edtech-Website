import React from 'react'
import { useState } from "react";
import { HomePageExplore } from '../../../data/homepage-explore';
import HighLightText from './HighLightText';
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]

const ExploreMore = () => {

    // State to manage the currently selected tab
    //means when the page loads, the first tab will be selected by default.
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    
    //courses linked with the tab
    const [courses, setCourses] = useState(HomePageExplore[0].courses);

    //current card which i want to show light theme
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        // Filter the courses based on the selected tab
        setCurrentTab(value);
         // Find the matching category
        const result = HomePageExplore.find((course) => course.tag === value);
        
        // Check if result exists before setting state
        if (result) {
            setCourses(result.courses);
            setCurrentCard(result.courses[0].heading);
        }
    }

  return (
    <div>
      <div className='text-4xl font-semibold text-center '>
        Unlock the
        <HighLightText text={" Power of Code"} />
      </div>

      <p className=' text-center text-richblack-300 mx-auto text-sm  mt-3'>
        Learn to build anything you can imagine
      </p>

      <div className='mt-5 flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100 px-1 py-1'>
        {
            tabsName.map((element, index) => {
                return (
                  <div
                  className={`text-[16px] flex flex-row items-center gap-2 rounded-full 
                    px-7 py-2 cursor-pointer duration-200 
                    ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium" : 
                    "text-richblack-200 bg-richblack-800 hover:bg-richblack-900 hover:text-richblack-5"}`} 
                  key={index} 
                  onClick={() => setMyCards(element)}
                >
                  {element}
                </div>
                )
            })
        }
      </div>

      <div className='lg:h-[150px]'></div>

      {/* course card ke group */}

      <div className='lg:absolute gap-12 justify-center 
         flex flex-wrap w-full lg:bottom-[0] lg:left-[50%]
         lg:translate-x-[-50%] lg:translate-y-[50%] 
         text-black lg:mb-0 mb-7 lg:px-0 px-3'
        >
        {
          courses.map((course, index) => {
            return(
              <CourseCard
               key={index}
               cardData={course}
               currentCard={currentCard}
               setCurrentCard={setCurrentCard}
              />
            )
          })
        }
      </div>

      
    </div>
  )
}

export default ExploreMore
