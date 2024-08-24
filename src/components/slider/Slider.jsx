"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';    
import { Observer } from "gsap/Observer";


gsap.registerPlugin(Observer);
import dynamic from 'next/dynamic';
import { videos } from './videos';

const ReacPlayer = dynamic(() => import('react-player'), { ssr: false });


const Slider = () => {
  const sliderRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  let animating = false;
 

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if(isClient && slider) {
      initializeCards();
    }
  }
  , [isClient]);

  Observer.create({
      target: sliderRef.current, // can be any element (selector text is fine)
      type: "wheel,touch", // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
      wheelSpeed: 0.005,
      onUp: () => {
        !animating && slideToUp();
      },
      onDown: () => {
        !animating && slideToDown();
      },
      tolerance: 5,
      preventDefault: true,
      scrollSpeed: 0.01
    });

  const initializeCards = () => {
    const cards = Array.from(sliderRef.current.querySelectorAll('.card'));
    gsap.to(cards, {
      y: (i) => 0 + 20 * i + '%',
      z: (i) => 15 * i,
      duration: 1,
      ease: 'power3.out',
      stagger: -0.1
    })
  };

  const slideToDown = () => {
    animating = true;
    const slider = sliderRef.current;
    const cards = Array.from(slider.querySelectorAll('.card'));
    const lastCard = cards.pop();
    
    gsap.to(lastCard, {
      y: "+=150%",
      duration: 0.75,
      ease: 'power3.inOut',
      onStart: () => {
        setTimeout(() => {
          slider.prepend(lastCard);
          initializeCards();
          setTimeout(() => {
            animating = false
          }, 1000);
        }, 300);
      }
    })
  }

  const slideToUp = () => {
    animating = true;
    const slider = sliderRef.current;
    const cards = Array.from(slider.querySelectorAll('.card'));
    const firstCard = cards.shift();
    
    gsap.to(firstCard, {
      y: "+=150%",
      z: 0,
      duration: 0.75,
      ease: 'power3.inOut',
      onStart: () => {
        setTimeout(() => {
          slider.append(firstCard);
          initializeCards();
          setTimeout(() => {
            animating = false
          }, 1000);
        }, 300);
      }
    })
  }

  return (
    <>
      <div className="container">
        <div className="slider" ref={sliderRef}>
          {videos.map((video, index) => (
            <div className="card" key={index}>
              <div className="card-info">
                <div className="card-item">
                  <p>{video.date}</p>
                </div>
                <div className="card-item">
                  <p>{video.title}</p>
                </div>
                <div className="card-item">
                  <p>{video.category}</p>
                </div>
              </div>
              <div className="video-player">
                <ReacPlayer
                  url={`https://vimeo.com/${video.id}`}
                  controls={false}
                  playing={true}
                  loop={true}
                  muted={true}
                  autoPlay={true}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Slider;