export const dynamic = "force-dynamic";
import ProfileView from '@/modules/home/view/ProfileView'
import React, { Suspense } from 'react'

function page() {
  return (
    <Suspense fallback>
    <ProfileView/>

    </Suspense>
  )
}

export default page