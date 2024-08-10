'use client';
import React from 'react'
import { HeroHighlightDemo } from '../components/Home'
import { useState, useEffect, useRef, useCallback } from 'react'

const HomePage = () => {
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(null);

  const worker = useRef(null);

  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      const onMessageReceived = (e) => {
        switch (e.data.status) {
          case 'initiate':
            setReady(false);
            break;
          case 'ready':
            setReady(true);
            break;
          case 'complete':
            setResult(e.data.output[0])
            break;
        }
      };
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  const classify = useCallback((text) => {
    if (worker.current) {
      worker.current.postMessage({ text });
    }
  }, []);

  return (
    <div>
      <HeroHighlightDemo></HeroHighlightDemo>
    </div>
  )
}

export default HomePage; 
