import React from 'react'
import {ChatResponse} from "../../../components/ChatResponse.tsx";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function PlaceholdersAndVanishInputDemo() {

  await new Promise((resolve) => { setTimeout(resolve, 1000) });
  // THIS WILL CREATE NEW QUERY CLIENT.
  const queryClient = new QueryClient();
  
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatResponse></ChatResponse> 
      </HydrationBoundary>
    </div>
  );
}

 