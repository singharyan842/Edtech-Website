import React from 'react'
import HighLightText from './HighLightText'
import know_your_progress from '../../../assets/images/Know_your_progress.png'
import compare_with_others from '../../../assets/images/Compare_with_others.png'
import plan_your_lessions from '../../../assets/images/Plan_your_lessons.png'
import CTAButton from '../HomePage/Button'

const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px]'>
      <div className='flex flex-col gap-5 mt-[130px] items-center'>

        <div className='text-4xl font-semibold text-center r'>
          Your Swiss Knife for  
          <HighLightText text={" Learning any Language"} />
        </div>

        <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
        Using spin making learning multiple languages easy. with 20+ languages realistic voice-over,
        progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-col lg:flex-row items-center justify-center mt-5'>
            <img src={know_your_progress} alt="KnowYourProgressImage" className='object-contain -mr-32'/>
            <img src={compare_with_others} alt="CompareWithOthers" className='object-contain'/>
             <img src={plan_your_lessions} alt="PlanYourLessions" className='object-contain -ml-36'/>
        </div>

        <div className='w-fit mb-10'>
          <CTAButton active={true} link='/signup'>
              <div >
                Learn More
              </div>
          </CTAButton>
        </div>

      </div>
      
    </div>
  )
}

export default LearningLanguageSection

