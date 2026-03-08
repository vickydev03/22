import PaymentView from '@/modules/tutorials/view/PaymentView'
import React from 'react'


type Props = {
  params: {
    id: string;
  };
};

async function page({params}:Props) {
    const {id}=await params; 
  return (
    <PaymentView id={id}/>
  )
}

export default page