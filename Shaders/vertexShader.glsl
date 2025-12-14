#version 300 es
layout(location = 0) in vec4 aPosition;   
layout(location = 1) in vec3 aColor;      
layout(location = 2) in float aPointSize;

flat out vec3 flatColor;  // Передаем сплошной цвет во фрагментный шейдер
out vec3 smoothColor; // Передаем плавный цвет во фрагментный шейдер

void main() {
    gl_Position = aPosition;
    gl_PointSize = aPointSize;
    flatColor = aColor; 
    smoothColor = aColor;
}