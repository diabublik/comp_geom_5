#version 300 es
precision mediump float;

flat in vec3 flatColor; // из вершинного шейдера
in vec3 smoothColor; // из вершинного шейдера

out vec3 fragColor;

void main() {
    if (gl_FragCoord.x < 200.0){ // левая часть сплошная
      fragColor = flatColor;
    }
    else { // правая градиентная
      fragColor = smoothColor;
    }
}