import Matter from 'matter-js';
import p5 from 'p5';
import React, { useCallback, useRef } from 'react'
import Alphabet from './Alphabet';
import Chain from './Chain';
import wordPath from './wordsPath';

function Canvas() {
  const canvasDivRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className='canvas__container'></div>
  )
}

export default Canvas