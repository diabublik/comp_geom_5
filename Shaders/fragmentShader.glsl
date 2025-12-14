#version 300 es
precision mediump float;

uniform float u_Width;
uniform float u_Height;

out vec4 fragColor;

void main() {
    fragColor = vec4(gl_FragCoord.x / u_Width, 
                     0.0, 
                     gl_FragCoord.y / u_Height, 
                     1.0);
}