import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, addEffect } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';

import Scene from './Scene';

import './RGBDistortion.css';

import img01 from './assets/images/1.jpeg';
import img02 from './assets/images/2.jpeg';
import img03 from './assets/images/3.jpeg';
import img04 from './assets/images/4.jpeg';

const IMAGES = [
  { title: 'Monochrome', src: img01 },
  { title: 'Street', src: img02 },
  { title: 'Abstract', src: img03 },
  { title: 'Rose', src: img04 },
];

const PERSPECTIVE = 1000;
const FOV =
  (180 * (2 * Math.atan(window.innerHeight / 2 / PERSPECTIVE))) / Math.PI;

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};
let current = 0;
let target = 0;
let ease = 0.06;

function RGBDistortion() {
  const scrollableRef = useRef(null);
  const [images, setImages] = useState([]);
  const [targetScroll, setTargetScroll] = useState(0);
  const [actualScroll, setActualScroll] = useState(0);

  useEffect(() => {
    // get all images from DOM and set them to state for use in canvas scene
    const allImages = [...document.querySelectorAll('.rgbDistortion__img')];
    setImages(allImages);
  }, []);

  // SMOOTH SCROLL SYNC SETUP
  useEffect(() => {
    // SET VIRTUAL SCROLL PARENT HEIGHT, UPDATE ON RESIZE
    const init = () => {
      document.body.style.height = `${
        scrollableRef.current.getBoundingClientRect().height
      }px`;
    };
    init();
    window.addEventListener('resize', init);

    // UPDATE SCROLLABLE CONTAINER Y POSITION IN ANIMATION LOOP
    const smoothScroll = () => {
      target = window.scrollY;
      current = lerp(current, target, ease);
      setTargetScroll(target);
      setActualScroll(current);
      scrollableRef.current.style.transform = `
        translate3d(0, -${current}px, 0)
        `;
      requestAnimationFrame(smoothScroll);
    };
    smoothScroll();

    return () => {
      cancelAnimationFrame(smoothScroll);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <div className="rgbDistortion__main">
      <div ref={scrollableRef} className="rgbDistortion__scrollable">
        {IMAGES.map((image, index) => (
          <div key={index} className="rgbDistortion__section">
            <img
              className={[
                'rgbDistortion__img',
                `rgbDistortion__img--${index + 1}`,
              ].join(' ')}
              src={image.src}
              alt={image.title}
            />
            <h2
              className={[
                'rgbDistortion__title',
                `rgbDistortion__title--${index + 1}`,
              ].join(' ')}
            >
              {image.title}
            </h2>
          </div>
        ))}
      </div>
      <div className="rgbDistortion__canvasWrapper">
        <Canvas>
          <OrthographicCamera
            makeDefault
            position={[0, 0, PERSPECTIVE]}
            zoom={1}
            fov={FOV}
            aspect={window.innerWidth / window.innerHeight}
            near={0.01}
            far={1000}
          />
          <Suspense fallback={<span>loading...</span>}>
            <Scene
              images={images}
              targetScroll={targetScroll}
              actualScroll={actualScroll}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default RGBDistortion;
