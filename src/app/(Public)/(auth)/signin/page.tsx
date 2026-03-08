export const dynamic = "force-dynamic";
import Signinview from "@/modules/signin/view/Signinview";
import React, { Suspense } from "react";

function page() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Signinview />
      </Suspense>
    </div>
  );
}

export default page;
