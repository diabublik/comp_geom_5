#version 300 es
precision mediump float;

in vec3 vColor; // из вершинного шейдера
out vec4 fragColor;

void main() {
    // Используем переданный цвет
    fragColor = vec4(vColor, 1);
}