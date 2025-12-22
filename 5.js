
"use strict";

// Imports.
import {getShader} from './libs/prepShader.js';
import {initShaders} from './libs/cuon-utils.js';

let squareVAO;

async function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl-canvas');

  // Get the rendering context for WebGL
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Read shaders and create shader program executable.
  const vertexShader = await getShader("Shaders/vertexShader.glsl");
  const fragmentShader = await getShader("Shaders/fragmentShader.glsl");

   // Initialize shaders
  if (!initShaders(gl, vertexShader, fragmentShader)) {
     console.log('Failed to intialize shaders.');
     return;
   }

   const n = initTriangles(gl);
    if (n < 0) {
        console.log('Failed to create triangles');
        return;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    console.log("Рисуем первый треугольник (красный), потом второй (зеленый)");
    
    gl.bindVertexArray(squareVAO);
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    
    gl.drawArrays(gl.TRIANGLES, 3, 3);
    
    gl.bindVertexArray(null);
}
// Красный - Зеленый
// (1,0,0,0.3)*0.3 + (0,0,0,1)*0.7 = (0.3,0,0,1)
// (0,1,0,0.3)*0.3 + (0.3,0,0,1)*0.7 = (0.21,0.3,0,1)

// Зеленый - Красный
// (0,0.3,0,1)
// (1,0,0,0.3)*0.3 + (0,0.3,0,1)*0.7 = (0.3,0.21,0,1)

function initTriangles(gl) {
    const n = 6;
    
    const positions = new Float32Array([
        -0.5, -0.5, 
         0.5, -0.5,  
         0.0,  0.5, 
        
        -0.3, -0.3,  
         0.7, -0.3, 
         0.2,  0.7 
    ]);

    const colors = new Float32Array([
        1.0, 0.0, 0.0, 0.3, 
        1.0, 0.0, 0.0, 0.3, 
        1.0, 0.0, 0.0, 0.3, 
        
        0.0, 1.0, 0.0, 0.3, 
        0.0, 1.0, 0.0, 0.3,
        0.0, 1.0, 0.0, 0.3 
    ]);

    const FSIZE = Float32Array.BYTES_PER_ELEMENT;

    squareVAO = gl.createVertexArray();
    gl.bindVertexArray(squareVAO);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}

window.onload = main;