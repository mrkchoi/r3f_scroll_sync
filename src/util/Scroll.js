import React from 'react';

let current = 0;
let target = 0;
let ease = 0.06;

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

export default useSmoothScroll = () => {};
