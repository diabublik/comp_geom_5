#version 300 es
precision mediump float;

in vec3 vColor;        // Цвет из вершинного шейдера
out vec4 fragColor;

void main() {
    // Смещаем координаты так, чтобы центр был в (0,0)
    float dist = distance(gl_PointCoord, vec2(0.5));
    
    if (dist > 0.5) {
        discard;  // Этот фрагмент не рисуется
    }
    
    fragColor = vec4(vColor, 1.0);
}