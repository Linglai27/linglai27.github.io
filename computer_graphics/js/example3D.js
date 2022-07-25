
rooms.example3D = function() {

lib3D();

description = 'Interactive WebGL<br>on a single square.';

code = {
'explanation': `
   S.html(\`
      Most of the work happens in a fragment shader.
      <p>
      Input to the fragment shader is x,y and time: <code>uPos, uTime</code>
      <p>
      We can also interact by adding information about the cursor: <code>uX,uY</code>
      <p>
      Output at each fragment is: red,green,blue,alpha
   \`);
`,
vertex: `
S.setVertexShader(\`

   attribute vec3 aPos;
   varying   vec3 vPos;

   void main() {
      vPos = aPos;
      gl_Position = vec4(aPos, 1.);
   }

\`)
`,
fragment: `

S.setFragmentShader(\`

uniform float uTime, uSpace, uX, uY;
   varying vec3 vPos;

   float turbulence(vec3 p) {
      float t = 0., f = 1.;
      for (int i = 0 ; i < 10 ; i++) {
         t += abs(noise(f * p)) / f;
         f *= 1.5;
      }
      return t;
   }

   float disk(vec2 p, float x, float y, float r) {
      x = p.x - x;
      y = p.y - y;
      return clamp(10. * (x*x + y*y - r*r), 0., 1.);
   }

   vec3 divide_line(vec2 p, float slope, float intercept){
      if (abs(p.x*slope+intercept-p.y)<0.05){
          return vec3(.9/25.5,13.9/25.5,24.0/25.5);
      }else {
          return vec3(1.,1.,1.);
       }
   }

    

   vec3 ring(vec2 p, float x, float y, float r, float thickness) {
      x = p.x - x;
      y = p.y - y;
      if (abs(sqrt(p.x*p.x+p.y*p.y) - r)<thickness){
          return vec3(p.y/sqrt(p.x*p.x+p.y+p.y),p.x/sqrt(p.x*p.x+p.y+p.y),sin(uTime));
      }else {
          return vec3(p.x/sqrt(p.x*p.x+p.y+p.y),p.y/sqrt(p.x*p.x+p.y+p.y),sin(uTime));
       }
   }

   vec3 stripes(float x) {
      float t = pow(sin(x) *.5 + .5, .1);
      return vec3(t*t*t, t*t, t);
   }

   vec3 oceanLine(vec3 vpos, float v){
      vec3 color = divide_line(vpos.xy,max(9.*turbulence(5.*vPos/3.),1.9),v);
      return color;
   }

   vec3 clouds(float y) {
      vec3 sky = vec3(.3,.6,1.);
      float s = mix(.6,1., clamp(3.*y-2., 0.,1.));
      return mix(sky, vec3(s), clamp(.5*y,0.,1.));
   }

   void main() {
    vec3 p = 6.*vPos; // THESE TWO LINES MAKE MARBLE
    vec3 color = ring(vPos.xy+sin(uTime)*turbulence(sin(uTime)*p), 0., 0., sin(uTime), 0.);
    gl_FragColor = vec4(sqrt(color), 1.);
   }




\`)
`,
render: `
   S.setUniform('1f', 'uTime', time);
   S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, 4);
`,
events: `
   onDrag = (x,y) => {
      S.setUniform('1f', 'uX', x);
      S.setUniform('1f', 'uY', y);
   }
   onKeyPress  =k=>S.setUniform('1f','uSpace',k==32);
   onKeyRelease=k=>S.setUniform('1f','uSpace',false);
`
}

}

