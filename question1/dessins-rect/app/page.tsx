"use client";

import axios from "axios";
import { useState, useRef  } from 'react';
import Canvas from './components/canvas';
import { Button } from './components/ui/button';
import { createSquare, createCircle, createStar } from '@/lib/utils';
import type { Shape } from '@/lib/utils';

type DrawingEvent =
  | { type: 'Circle'; x: number; y: number }
  | { type: 'Square'; x: number; y: number }
  | { type: 'Star'; x: number; y: number; innerRadius: number }
  | { type: 'Wait'; secondes: number }
  | { type: 'ChangeColor'; color: string };

export default function Home() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const currentColor = useRef("blue");

  // Seulement un exemple local pour comprendre comment dessiner des formes avec un délai
  async function afficherTestLocal(){
    clearShapes();

    await wait(1);
    
    drawSquare(1,1);
    
    await wait(2);

    currentColor.current = "red";
    drawCircle(3,1);
  }

  async function afficherEvents1(){
    clearShapes();
    const result = await axios.get<DrawingEvent>('http://localhost:5269/api/Dessins/GetDrawing1');
    console.log(result.data);
    await applyEvents(result.data);
  }

  async function afficherEvents2(){
    clearShapes();
    const result = await axios.get<DrawingEvent[]>('http://localhost:5269/api/Dessins/GetDrawing2');
    console.log(result.data);
    await applyEvents(result.data);
  }

  async function applyEvents(event: DrawingEvent | DrawingEvent[]){
    if (Array.isArray(event)) {
      for (const drawingEvent of event) {
        await applyEvents(drawingEvent);
      }
      return;
    }

    console.log("Applying event " + event.type);

    switch(event.type){
      case "Circle": {
        drawCircle(event.x, event.y);
        break;
      }
      case "Square": {
        drawSquare(event.x, event.y);
        break;
      }
      case "Star": {
        drawStar(event.x, event.y, event.innerRadius);
        break;
      }
      case "Wait": {
        await wait(event.secondes);
        break;
      }
      case "ChangeColor": {
        currentColor.current = event.color;
        break;
      }
    }
  }

  // ATTENTION: Les méthodes suivantes n'ont pas besoin d'être modifiées pour répondre à la question

  return (
    <div className='m-4'>
      <Button variant="outline" className="mr-2" onClick={() => afficherTestLocal()}>Afficher Test Local</Button>
      <Button variant="outline" className="mr-2" onClick={() => afficherEvents1()}>Afficher Événements 1</Button>
      <Button variant="outline" onClick={() => afficherEvents2()}>Afficher Événements 2</Button>
      <Canvas shapes={shapes} />
    </div>
  );

  function drawSquare(x :number, y:number){
    const color = currentColor.current;
    setShapes((shapes) => [...shapes, createSquare(x, y, color)]);
  }

  function drawCircle(x :number, y:number){
    const color = currentColor.current;
    setShapes((shapes) => [...shapes, createCircle(x, y, color)]);
  }

  function drawStar(x :number, y:number, innerRadius:number){
    const color = currentColor.current;
    setShapes((shapes) => [...shapes, createStar(x, y, innerRadius,color)]);
  }

  function clearShapes(){
    setShapes([]);
    currentColor.current = "blue";
  }

  async function wait(s: number){
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  }
}
