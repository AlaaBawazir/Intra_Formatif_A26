import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSquare(x: number, y: number, color: string){
  return { type: 'rect' as const, props: { x: 100 * x, y: 100 * y, width: 100, height: 100, fill: color } };
}

export function createCircle(x: number, y: number, color: string){
  return { type: 'circle' as const, props: { x: 100 * x + 50, y: 100 * y + 50, radius: 50, fill: color } };
}

export function createStar(x: number, y: number, innerRadius:number, color: string){
  return { type: 'star' as const, props: { x: 100 * x + 50, y: 100 * y + 50, numPoints: 5, innerRadius: innerRadius, outerRadius: 50, fill: color } };
}

export type Shape =
  | { type: 'rect'; props: { x: number; y: number; width: number; height: number; fill: string } }
  | { type: 'circle'; props: { x: number; y: number; radius: number; fill: string } }
  | { type: 'star'; props: { x: number; y: number; numPoints: number; innerRadius: number; outerRadius: number; fill: string } };
