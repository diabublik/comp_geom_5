
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

  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight

  // location uniform переменных из фрагментного шейдера
  const program = gl.getParameter(gl.CURRENT_PROGRAM)
  const u_Width = gl.getUniformLocation(program, 'u_Width');
  const u_Height = gl.getUniformLocation(program, 'u_Height');

  // Передаем размеры в шейдер
  gl.uniform1f(u_Width, width);
  gl.uniform1f(u_Height, height);

  // Write the positions of vertices to a vertex shader
  const n = initQuad(gl);
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
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

  // Clean
  gl.bindVertexArray(null);
}

function initQuad(gl) {
    const n = 4; 
    const FSIZE = Float32Array.BYTES_PER_ELEMENT;
    
    const vertices = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0
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

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Настраиваем атрибут
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // Отвязываем
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}

window.onload = main;