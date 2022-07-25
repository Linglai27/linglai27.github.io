
rooms.example2Da = function() {

lib2D();

description = `
<b>Playground of Koch Fractal </b>
<p>
<b><i>Note:</i></b>
<ol>
<li> The rotate angle has range [-180 deg, 180 deg].
<p>
<li> The complexity refers to the number of iteration in producing the fractal.
<p>
<li> The interpolation decides the middle two points position for a line segment.
<p>
</ol>
      <p>
          <input type=range id=number_of_koch_curves> number of Koch Curves
          <br>
          <input type=range id=size> size
          <br>
          <input type=range id=rotate_speed> rotate speed
          <br>
          <input type=range id=rotate_angle> rotate angle
          <br>
          <input type=range id=complexity> complexity
          <br>
          <input type=range id=interpolation> interpolation
          <br>
`

code = {
init: `
  S.x = 400;
  S.y = 400;
`,
assets: `
  
  S.line = (ax,ay,bx,by,color) => {
     S.context.beginPath();
     S.context.moveTo(ax,ay);
     S.context.lineTo(bx,by);
     S.context.strokeStyle = color;
     S.context.shadowBlur = 0;
     S.context.shadowColor = "white";
     S.context.lineWidth = 1;
     S.context.stroke();
  }

    S.rect = (centerh,centerv,w,color,rad) => {
    for (i=0;i<4;i++){
S.line(centerh+w*Math.cos(rad+Math.PI/2*i),centerv+w*Math.sin(rad+Math.PI/2*i),centerh+w*Math.cos(rad+Math.PI/2*(i+1)),centerv+w*Math.sin(rad+Math.PI/2*(i+1)),color)
}  

  }


  S.arc = (center1,center2,radius,ia,ea,counter,color,w,blurcolor,blur) => {
    S.context.beginPath();
    S.context.shadowBlur = blur;
    S.context.shadowColor = blurcolor;
    S.context.lineWidth = w;
    S.context.arc(center1, center2, radius, ia,ea,counter);
    S.context.strokeStyle = color;
    S.context.stroke();
  }

   S.text= (txt,ft,x,y,color,blur,blurcolor) => {
    S.context.beginPath();
    S.context.font = ft;
    S.context.shadowBlur = blur;
    S.context.shadowColor = blurcolor;
    S.context.textAlign = "center";
    S.context.fillText(txt,x,y);
    S.context.fillStyle = color;
}

  S.subfractal = (ax,ay,bx,by,t,rot,color,iteration) => {

    if (iteration < 0){
      return;
    }
    
    let theta = rot;

    var cx = t*bx+(1-t)*ax;
    var cy = t*by+(1-t)*ay;

    var dx = t*ax+(1-t)*bx;
    var dy = t*ay+(1-t)*by;

    var ex = cx + Math.cos(theta)*(dx - cx) - Math.sin(theta)*(dy - cy);
    var ey = cy + Math.sin(theta)*(dx - cx) + Math.cos(theta)*(dy - cy);

    S.line(ax,ay,cx,cy,color);
    S.line(dx,dy,bx,by,color);

    if (iteration!=0){
       for (let i = 0; i<10; i++){
          S.line(cx,cy,dx,dy,"black");
       }
    }

    S.subfractal(ax,ay,cx,cy,t,rot,color,iteration-1);
    S.subfractal(cx,cy,ex,ey,t,rot,color,iteration-1);
    S.subfractal(ex,ey,dx,dy,t,rot,color,iteration-1);
    S.subfractal(dx,dy,bx,by,t,rot,color,iteration-1);
}

S.fractal = (c1,c2,r,n,theta,t,rot,color,iteration) => {
for (let i = 0; i<n; i++){ 
S.subfractal(c1+r*Math.cos(2*i*Math.PI/n+theta),c2+r*Math.sin(2*i*Math.PI/n+theta),c1+r*Math.cos(2*(i-1)*Math.PI/n+theta),c2+r*Math.sin(2*(i-1)*Math.PI/n+theta),t,rot,color,iteration)
}
}
    
S.mix = (a,b,t) => {
  return a*(1-t)+b*t;
}
`,
render: `

let com = Math.round(S.mix(0,8,complexity.value/100));
let rs = S.mix(0,0.5,rotate_speed.value/100);

let N = 5;

for (let i=1; i<N; i++){
S.fractal(400,80*time%(1000),50,3,i*Math.PI/6+rs*time,1/3,-Math.PI/3,"#FFFFFF",4)
}

for (let i=1; i<N; i++){
S.fractal(200,80*time%(1000)+50,25,3,i*Math.PI/6+rs*time,1/3,-Math.PI/2,"#FFFFFF",4)
}

for (let i=1; i<N; i++){
S.fractal(500,80*time%(1000)+75,3,i*Math.PI/6+rs*time,1/6,-Math.PI/3,"#FFFFFF",3)
}

`,
events: `
  onDrag = (x,y) => {
     S.x = x;
     S.y = y;
  }
  onKeyPress   = key => S.isSpace = key == 32;
  onKeyRelease = key => S.isSpace = false;
`
};

}

