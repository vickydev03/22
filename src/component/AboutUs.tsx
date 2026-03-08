import React from "react";
import Navbar from "./Navbar";
import TheStory from "./TheStory";
import Teaching from "./Teaching";
import Experience from "./Experience";
import Wrapper from "./Wrapper";
import ExperienceSection from "./Experience";

function AboutUs() {
  return (
    <div className="w-full h-full ">
      <Wrapper classname="w-[85%] flex items-center flex-col mx-auto">

      <TheStory />
      <Teaching />
      </Wrapper>
      <ExperienceSection/>
    </div>
  );
}

export default AboutUs;
