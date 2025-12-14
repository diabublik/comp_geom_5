#version 300 es
layout(location = 0) in vec4 aPosition;   
layout(location = 1) in vec3 aColor;      
layout(location = 2) in float aPointSize;

out vec3 vColor;  // Передаем цвет во фрагментный шейдер

void main() {
    gl_Position = aPosition;
    gl_PointSize = aPointSize;
    vColor = aColor; 
}