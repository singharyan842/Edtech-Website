//Shortcut: rafce
// rafce: React Arrow Function Component with Export
import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import HighlightText from '../components/core/HomePage/HighLightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/images/banner.mp4';
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';
const Home = () => {
  return (
    <div>
      {/*Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white justify-between overflow-visible'>

        <Link to={"/signup"}>
        
            <div className='group mx-auto, rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                <div className='group-hover:bg-richblack-900 flex flex-row mt-16 p-1 items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200'>
                    <p>Become an Instructor</p>
                    {/*get arrow icon from react-icons library*/}
                    <FaArrowRight />
                </div>
            </div>

        </Link>

        <div className='text-center text-4xl font-semibold mt-7'>
            Empower Your Future with
            <HighlightText text={"Coding Skills"} />
        </div>

        <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
          With our online coding courses, you can learn 
          at your own pace, from anywhere in the world, 
          and get access to a wealth of resources, including
          hands-on projects, quizzes, and personalized feedback from instructors.
        </div>

        <div className='flex flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto="/signup">
                Learn More
            </CTAButton>

            <CTAButton active={false} linkto="/login">
                Book a Demo
            </CTAButton>

        </div>

        <div className='mt-16 mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
          <video className="shadow-[20px_20px_rgba(255,255,255)]" muted loop autoPlay src={Banner}>
          </video>
        </div>

        {/* Code Section 1 */}
        <div className="flex flex-col items-center text-center lg:text-left">
            <CodeBlocks 
                postion={"lg:flex-row"} 
                heading={
                  <div className='text-4xl font-semibold'>
                    Unlock Your
                    <HighlightText text={" coding potential "} />
                    with our online 
                  </div>
                }
                subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                ctabtn1={{active: true, linkto: "/signup", btnText: "Try it yourself"}}
                ctabtn2={{active: false, linkto: "/login", btnText: "Learn more"}}
                codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                codecolor={"text-yellow-25"}
                backgroundGradient={<div className="codeblock1 absolute"></div>}
            />
        </div>
        
        {/* Code Section 2 */}
        <div className="flex flex-col items-center text-center lg:text-left">
            <CodeBlocks 
                postion={"lg:flex-row-reverse"} 
                heading={
                  <div className='text-4xl font-semibold'>
                    Start
                    <HighlightText text={"Coding in seconds"}/>
                  </div>
                }
                subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                ctabtn1={{active: true, linkto: "/signup", btnText: "Continue Lesson"}}
                ctabtn2={{active: false, linkto: "/login", btnText: "Learn More"}}
                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                codecolor={"text-white"}
                backgroundGradient={<div className="codeblock2 absolute"></div>}
            />
        </div>


        <ExploreMore/>

      </div>

      {/*Section 2 */}  

      <div className='bg-pure-greys-5 text-richblack-700'>
        <div className='homepage_bg h-[333px] mx-auto'>
          {/*The outer div (bg-pure-greys-5 text-richblack-700) is used to define the overall background color and text color for the section.*/}
          {/*The inner div (homepage_bg h-[333px]) is specifically used to apply the background image and control its height (h-[333px]).*/}
          {/*items-center -> Aligns the child elements vertically in the center of the flex container */}
          {/*mx-auto ->  Applies margin-left: auto and margin-right: auto, centering the div horizontally within its parent container. */}
          <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>

              <div className='h-[150px]'></div>

              <div className='flex flex-col lg:flex-row gap-7 text-white'>
                <CTAButton active={true} linkto="/signup">
                    <div className='flex items-center gap-3'>
                      Explore full catalog
                      <FaArrowRight />
                    </div>
                </CTAButton>
                <CTAButton active={false} linkto="/signup">
                    <div className='flex items-center gap-3'>
                      Learn more
                    </div>
                </CTAButton>
              </div>
          </div>

        </div>

        <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
           <div className="flex flex-col lg:flex-row gap-5 items-center lg:items-start justify-center text-center lg:text-left mt-[110px] mb-10">
             <div className="text-4xl font-semibold w-[90%] lg:w-[45%]">
               Get the skills you need for
               <HighlightText text={" Job that is in demand"} />
             </div>
             <div className="flex flex-col gap-10 w-[90%] lg:w-[40%] items-center lg:items-start">
               <div className="text-[16px]">
                 The modern StudyNotion dictates its own terms. Today, to be a competitive 
                 specialist requires more than professional skills.
               </div>
               <CTAButton active={true} linkto={"/signup"}>
                 <div>Learn More</div>
               </CTAButton>
             </div>
           </div>

           <TimelineSection />

           <LearningLanguageSection /> 
           
        </div>

      </div>

      {/*Section 3 */}
      <div className='w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>

       <InstructorSection />

       <h2 className='text-center text-4xl font-semibold mt-10 mb-20'>Review from Other Learners</h2>

       {/* Review Slider */}

      </div>
      

      {/*footer */}
      <Footer />

    </div>
  )
}

export default Home
