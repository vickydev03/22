import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

function ClassDetails({className="w-full mt-48 mx-auto hidden md:block"}:{className?:string}) {
  return (
    <div className={className}>
      <div className="w-[90%] bg-[#F4F1ED] rounded-2xl mx-auto">
        <div className="grid grid-cols-15">
          <div className=" relative col-span-7  p-6 flex items-center justify-center  w-fulal">
            <Image
              className="w-full rounded-3xl h-84  object-bottom object-cover"
              src={"/image/contect_details.jpg"}
              alt="details"
              quality={75}
              sizes="100vw"
              height={100}
              width={100}
            />
          </div>
          <div className="col-span-8 p-6 flex items-center gap-4 pla-4">
            <h3 className="font-passion-one max-w-64 text-primary md:4xl lg:text-6xl uppercase">
              Regular Dance classes
            </h3>
            <div className="max-w-84 flex flex-col gap-4">
              <p className="text-md text-regular leading-6">
                From beginners to experienced dancers, our regular batches focus
                on technique, expression, and confidence. Learn in a space
                that’s warm, welcoming, and full of energy.
              </p>
              <Button className="bg-primary w-fit uppercase px-4 py-2 cursor-pointer rounded-full">
                view details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassDetails;
