varying vec3 vNormal;
varying float vPerlinStrength;

void main()
{
    float temp = vPerlinStrength+0.1;
    temp *=0.9;

    gl_FragColor = vec4(temp*0.9, temp*0.9,temp*5.9, 1.0);
}