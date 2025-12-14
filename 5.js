
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

  // Write the positions of vertices to a vertex shader
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Bind the VAO
  gl.bindVertexArray(squareVAO);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);

  // Clean
  gl.bindVertexArray(null);
}

function initVertexBuffers(gl) {
    const n = 3; 
    const FSIZE = Float32Array.BYTES_PER_ELEMENT;
    
    const positions = new Float32Array([
        0.0, 0.5,    // Первая точка: x, y
        -0.5, -0.5,  // Вторая точка: x, y  
        0.5, -0.5    // Третья точка: x, y
    ]);

    const colours = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ])

    const sizes = new Float32Array([
        10.0,  // Первая точка: size
        20.0,  // Вторая точка: size
        30.0   // Третья точка: size
    ]);

    // Create VAO
    squareVAO = gl.createVertexArray();
    gl.bindVertexArray(squareVAO);

    // Create buffer
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    const positionsByteLength = positions.length * FSIZE
    const coloursBiteLength = colours.length * FSIZE
    const sizesByteLength = sizes.length * FSIZE
    const totalByteLength = positionsByteLength + coloursBiteLength + sizesByteLength

    // Bind and fill buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, totalByteLength, gl.STATIC_DRAW);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions)
    gl.bufferSubData(gl.ARRAY_BUFFER, positionsByteLength, colours)
    gl.bufferSubData(gl.ARRAY_BUFFER, positionsByteLength + coloursBiteLength, sizes)

    // Атрибут для позиции (2 компонента: x, y)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // Атрибут для цвета точки
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, positionsByteLength);
    gl.enableVertexAttribArray(1);
    
    // Атрибут для размера точки
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, positionsByteLength + coloursBiteLength);
    gl.enableVertexAttribArray(2);
    
    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}

window.onload = main;