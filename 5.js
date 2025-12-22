
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
  const n = initPoints(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Настройка WebGL
    gl.clearColor(0, 0, 0, 1);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Включаем прозрачность для плавных краев
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Рисуем
    gl.bindVertexArray(squareVAO);
    gl.drawArrays(gl.POINTS, 0, n);
    gl.bindVertexArray(null);
}

function initPoints(gl) {
    const n = 3; // 3 точки
    
    // Данные: позиции, цвета, размеры
    const positions = new Float32Array([
        0.0, 0.5,    // Точка 1: вверху
        -0.5, -0.5,  // Точка 2: слева внизу
        0.5, -0.5    // Точка 3: справа внизу
    ]);

    const colors = new Float32Array([
        1.0, 0.0, 0.0,  // Красный
        0.0, 1.0, 0.0,  // Зеленый
        0.0, 0.0, 1.0   // Синий
    ]);

    const sizes = new Float32Array([
        50.0,  // Большая точка (50 пикселей)
        30.0,  // Средняя
        20.0   // Маленькая
    ]);

    const FSIZE = Float32Array.BYTES_PER_ELEMENT;

    // Создаем VAO
    squareVAO = gl.createVertexArray();
    gl.bindVertexArray(squareVAO);

    // Создаем буфер для позиций
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // Создаем буфер для цветов
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    // Создаем буфер для размеров
    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(2);

    // Отвязываем
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}

window.onload = main;