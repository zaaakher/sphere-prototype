varying vec3 vNormal;
varying float vPerlinStrength;
uniform vec3 uHighColor;
uniform vec3 uLowColor;

vec3 fade(float fade, vec3 c1, vec3 c2)
{
	float ox = fade * c1.x + (1.0 - fade) * c2.x;
	float oy = fade * c1.y + (1.0 - fade) * c2.y;
	float oz = fade * c1.z + (1.0 - fade) * c2.z;
	return vec3(ox, oy, oz);
}
void main()
{
    float temp = vPerlinStrength+0.1;
    temp *=0.5;
	vec3 highColor = vec3(uHighColor.x, uHighColor.y, uHighColor.z); 
	vec3 lowColor = vec3(uLowColor.x, uLowColor.y, uLowColor.z);
    
	//vec3 highColor = vec3(1.0, 0.1, 1.0);
	//vec3 lowColor = vec3(0.1, 0.1, 1.0);

	vec3 final = fade(temp, highColor, lowColor);
	
    gl_FragColor = vec4(final, 1.0);
}