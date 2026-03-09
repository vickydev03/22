import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";

function Introduction() {
  return (
    <div className=" w-full h-64 mt-10 ">
      <div className="w-[90%] mx-auto bg-[#C4B1D4] rounded-3xl">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 md:px-12 gap-y-5 py-8">
          <div className=" col-span-8 order-2 space-y-6 md:order-1">
            <div className="flex items-center flex-col md:flex-row gap-4 ">
              <h3 className="text-4xl font-passion-one uppercase  text-[#4B4740]">
                Meet Vicky–Akku
              </h3>
              <div className="flex items-center gap-4">
                <div className="bg-[#4B4740CC] size-7 rounded-full flex items-center justify-center">
                  <Image
                    src="/image/svg/social.svg"
                    height={100}
                    width={100}
                    className="size-4"
                    alt="social"
                  />
                </div>
                <div className="bg-[#4B4740CC] size-7 rounded-full flex items-center justify-center">
                  <Image
                    src="/image/svg/social.svg"
                    height={100}
                    width={100}
                    className="size-4"
                    alt="social"
                  />
                </div>
                <div className="bg-[#4B4740CC] size-7 rounded-full flex items-center justify-center">
                  <Image
                    src="/image/svg/social.svg"
                    height={100}
                    width={100}
                    className="size-4"
                    alt="social"
                  />
                </div>
                <div className="bg-[#4B4740CC] size-7 rounded-full flex items-center justify-center">
                  <Image
                    src="/image/svg/social.svg"
                    height={100}
                    width={100}
                    className="size-4"
                    alt="social"
                  />
                </div>
              </div>
            </div>
            <div className="max-w-175 px-14 text-center md:text-start md:px-0">
              <p className="text-[#4B4740] text-md">
                Vicky Dadheech and Aakanksha Tripathi popularly known as
                Vicky-Akku are Mumbai based choreographers with over a decade of
                experience in teaching and performing dance. Known for their
                chemistry, expressive storytelling, and soulful teaching style,
                they believe dance is more than steps it’s about connection and
                joy.
              </p>
            </div>
            <div className="flex items-center justify-center md:justify-normal">
              <Button className="uppercase rounded-full transition-all duration-500 cursor-pointer font-open-sauce text-sm  md:text-lg text-white bg-[#4B4740] hover:bg-[#827B70] font-light">
<Link href={"/about-us"}>
                read their story
</Link>
              </Button>
            </div>
          </div>

          <div className=" col-span-4 order-1 md:order-2 ">
            <div className="w-full flex items-center justify-center">
              <div className="relative w-56 h-56  md:w-72 md:h-84 ">
                <Image
                  className=" object-cover w-full h-full rounded-2xl  absolute right-0"
                  src={"/image/intro.webp"}
                  quality={100}
                  sizes="100vw"
                  alt="akku"
                  height={100}
                  width={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Introduction;
