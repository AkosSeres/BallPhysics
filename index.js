(()=>{var T=class{constructor(e,t){this.x=e,this.y=t}get copy(){return new T(this.x,this.y)}setCoordinates(e,t){this.x=e,this.y=t}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get sqlength(){return this.x*this.x+this.y*this.y}get heading(){if(this.x===0&&this.y===0)return 0;if(this.x===0)return this.y>0?Math.PI/2:1.5*Math.PI;if(this.y===0)return this.x>0?0:Math.PI;let e=T.normalized(this);return this.x>0&&this.y>0?Math.asin(e.y):this.x<0&&this.y>0?Math.asin(-e.x)+Math.PI/2:this.x<0&&this.y<0?Math.asin(-e.y)+Math.PI:this.x>0&&this.y<0?Math.asin(e.x)+1.5*Math.PI:0}add(e){this.x+=e.x,this.y+=e.y}sub(e){this.x-=e.x,this.y-=e.y}mult(e){this.x*=e,this.y*=e}div(e){this.x/=e,this.y/=e}lerp(e,t){this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t}dist(e){return new T(this.x-e.x,this.y-e.y).length}pNorm(e){let t=e;return t<1&&(t=1),(Math.abs(this.x**t)+Math.abs(this.y**t))**(1/t)}setMag(e){this.length!==0&&this.mult(e/this.length)}normalize(){this.length!==0&&this.div(this.length)}scaleAround(e,t){this.x=e.x+(this.x-e.x)*t,this.y=e.y+(this.y-e.y)*t}scaleAroundX(e,t){this.x=e.x+(this.x-e.x)*t}scaleAroundY(e,t){this.y=e.y+(this.y-e.y)*t}rotate(e){let t=Math.cos(e),s=Math.sin(e);this.setCoordinates(this.x*t-this.y*s,this.x*s+this.y*t)}static rotateArr(e,t){let s=Math.cos(t),o=Math.sin(t);e.forEach(a=>{a.setCoordinates(a.x*s-a.y*o,a.x*o+a.y*s)})}rotate90(){let{x:e}=this;this.x=-this.y,this.y=e}rotate270(){let{x:e}=this;this.x=this.y,this.y=-e}static add(e,t){return new T(e.x+t.x,e.y+t.y)}static sub(e,t){return new T(e.x-t.x,e.y-t.y)}static mult(e,t){return new T(e.x*t,e.y*t)}static div(e,t){return new T(e.x/t,e.y/t)}static fromAngle(e){return new T(Math.cos(e),Math.sin(e))}static fromAnglePNorm(e,t){let s=new T(Math.cos(e),Math.sin(e));return s.div(s.pNorm(t)),s}static lerp(e,t,s){return T.add(e,T.mult(T.sub(t,e),s))}static dist(e,t){return T.sub(e,t).length}static dot(e,t){return e.x*t.x+e.y*t.y}static cross(e,t){return e.x*t.y-e.y*t.x}static crossScalarFirst(e,t){return new T(-t.y*e,t.x*e)}static crossScalarSecond(e,t){return new T(e.y*t,-e.x*t)}static angle(e,t){return Math.acos(Math.min(Math.max(T.dot(e,t)/Math.sqrt(e.sqlength*t.sqlength),1),-1))}static angleACW(e,t){let s=e.heading,a=t.heading-s;return a<0?2*Math.PI+a:a}static normalized(e){let t=e.length;return t===0?e:new T(e.x/t,e.y/t)}toJSON(){return{x:this.x,y:this.y}}static fromObject(e){return new T(e.x,e.y)}rotateAround(e,t){this.sub(e),this.rotate(t),this.add(e)}},i=T;var Cn=class{constructor(e,t){this.a=e,this.b=t}get length(){return i.dist(this.a,this.b)}distFromPoint(e){let t=i.sub(this.b,this.a),s=t.length;t.normalize();let o=i.sub(e,this.a),a=i.dot(t,o),r=i.cross(t,o);return a>=0&&a<=s?Math.abs(r):Math.sqrt(Math.min(o.sqlength,i.sub(e,this.b).sqlength))}get nearestPointO(){let e=i.sub(this.b,this.a);if(i.dot(this.a,e)>=0)return this.a.copy;if(i.dot(this.b,e)<=0)return this.b.copy;e.normalize();let t=-i.dot(this.a,e);return i.add(this.a,i.mult(e,t))}static intersect(e,t){let s=i.sub(e.b,e.a),o=s.y/s.x,a=e.b.y-e.b.x*o,r=i.sub(t.b,t.a),h=r.y/r.x,c=t.b.y-t.b.x*h;if(s.x===0&&r.x!==0){if(e.a.x>=t.a.x&&e.a.x<=t.b.x||e.a.x<=t.a.x&&e.a.x>=t.b.x){let g=h*e.a.x+c;if(g>e.a.y&&g<e.b.y||g<e.a.y&&g>e.b.y)return new i(e.a.x,g)}return!1}if(r.x===0&&s.x!==0){if(t.a.x>=e.a.x&&t.a.x<=e.b.x||t.a.x<=e.a.x&&t.a.x>=e.b.x){let g=o*t.a.x+a;if(g>t.a.y&&g<t.b.y||g<t.a.y&&g>t.b.y)return new i(t.a.x,g)}return!1}if(s.x===0&&r.x===0){if(e.a.x===t.a.x){let g;e.a.y<e.b.y?g=[e.a.y,e.b.y]:g=[e.b.y,e.a.y];let x;t.a.y<t.b.y?x=[t.a.y,t.b.y]:x=[t.b.y,t.a.y];let b=[g[0]>x[0]?g[0]:x[0],g[1]<x[1]?g[1]:x[1]];if(b[0]<=b[1])return new i(e.a.x,(b[0]+b[1])/2)}return!1}let f;e.a.x<e.b.x?f=[e.a.x,e.b.x]:f=[e.b.x,e.a.x];let u;t.a.x<t.b.x?u=[t.a.x,t.b.x]:u=[t.b.x,t.a.x];let d=[f[0]>u[0]?f[0]:u[0],f[1]<u[1]?f[1]:u[1]];if(o===h&&a===c&&d[0]<=d[1])return new i((d[0]+d[1])/2,(d[0]+d[1])/2*o+a);let p=(c-a)/(o-h);return p>=d[0]&&p<=d[1]?new i(p,p*o+a):!1}},X=Cn;var En=class extends X{get length(){return Number.POSITIVE_INFINITY}distFromPoint(e){let t=i.sub(this.a,this.b);t.setMag(1),t.rotate(Math.PI/2);let s=i.sub(e,this.a);return Math.abs(i.dot(s,t))}static intersect(e,t){let s=i.sub(e.b,e.a),o=s.y/s.x,a=e.b.y-e.b.x*o,r=i.sub(t.b,t.a),h=r.y/r.x,c=t.b.y-t.b.x*h;if(o===h)return e.distFromPoint(t.a)===0?new i((e.a.x+e.b.x+t.a.x+t.b.x)/4,(e.a.y+e.b.y+t.a.y+t.b.y)/4):!1;let f=(c-a)/(o-h);return new i(f,o*f+a)}static intersectWithLineSegment(e,t){let s=i.sub(e.b,e.a),o=s.y/s.x,a=e.b.y-e.b.x*o,r=i.sub(t.b,t.a),h=r.y/r.x,c=t.b.y-t.b.x*h;if(s.x===0){if(r.x===0)return e.a.x===t.a.x?new i((t.a.x+t.b.x)/2,(t.a.y+t.b.y)/2):!1;let d=e.a.x,p=h*d+c;return Math.min(t.a.x,t.b.x)<d&&d<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<p&&Math.max(t.a.y,t.b.y)>p?new i(d,p):!1}if(r.x===0){let d=t.a.x,p=o*d+a;return Math.min(t.a.x,t.b.x)<d&&d<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<p&&Math.max(t.a.y,t.b.y)>p?new i(d,p):!1}if(o===h)return e.distFromPoint(t.a)===0?new i((t.a.x+t.b.x)/2,(t.a.y+t.b.y)/2):!1;let f=(c-a)/(o-h),u=o*f+a;return Math.min(t.a.x,t.b.x)<f&&f<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<u&&Math.max(t.a.y,t.b.y)>u?new i(f,u):!1}},se=En;var F=class{constructor(e,t){this.min=e,this.max=t}size(){return this.max-this.min}add(e){this.min=Math.min(this.min,e.min),this.max=Math.max(this.max,e.max)}get copy(){return new F(this.min,this.max)}static fromPoints(...e){let t=new F(0,0);return t.min=Math.min(...e),t.max=Math.max(...e),t}};function $e(n){return new F(Math.min(...n),Math.max(...n))}function Ke(n,e){return new F(Math.max(n.min,e.min),Math.min(n.max,e.max))}var A=class{constructor(e){if(e.length<3)throw new Error("Not enough points in polygon (minimum required: 3)");this.points=e,this.makeAntiClockwise()}getSideVector(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),i.sub(this.points[(t+1)%this.points.length],this.points[t%this.points.length])}getSideSegment(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),new X(i.fromObject(this.points[(t+1)%this.points.length]),i.fromObject(this.points[t%this.points.length]))}getSideLine(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),new X(i.fromObject(this.points[(t+1)%this.points.length]),i.fromObject(this.points[t%this.points.length]))}get sides(){return this.points.length}makeAntiClockwise(){let e=0;for(let t=1;t<=this.sides;t+=1){let s=this.getSideVector(t),o=this.getSideVector(t-1);o.mult(-1),e+=i.angleACW(s,o)}this.sides===3?e>Math.PI*1.5&&this.reverseOrder():this.sides===4?i.angleACW(this.getSideVector(1),this.getSideVector(0))>=Math.PI&&this.reverseOrder():this.sides>4&&e-this.sides*Math.PI>0&&this.reverseOrder()}reverseOrder(){this.points=this.points.reverse()}isPointInside(e){let t=new i(e.x,e.y);if(i.dist(t,this.centerPoint)>this.boundRadius)return!1;let s=this.centerPoint.copy;s.add(i.mult(new i(1.1,.6),this.boundRadius));let o=new X(t,s),a=0;return[...Array(this.sides).keys()].map(r=>this.getSideSegment(r)).forEach(r=>{X.intersect(r,o)&&(a+=1)}),a%2==0?!1:a%2==1}get centerPoint(){let e=new i(0,0);return this.points.forEach(t=>{e.add(t)}),e.div(this.sides),e}get boundRadius(){let e=this.centerPoint;return Math.max(...this.points.map(t=>i.dist(t,e)))}get allSides(){return[...Array(this.sides).keys()].map(e=>this.getSideSegment(e))}static intersection(e,t){if(i.dist(e.centerPoint,t.centerPoint)>e.boundRadius+t.boundRadius)return;let s=[],o=e.allSides,a=t.allSides;if(o.forEach((d,p)=>{a.forEach((g,x)=>{let b=X.intersect(d,g);typeof b=="object"&&"x"in b&&(b.isIntersectionPoint=!0,s.push({intersectionPoint:b,sideNum1:p,sideNum2:x}))})}),s.length===0){if(e.isPointInside(t.points[0]))return new A(t.points.map(d=>i.fromObject(d)));if(t.isPointInside(e.points[0]))return new A(e.points.map(d=>i.fromObject(d)))}let r=new A(e.points);for(let d=r.points.length-1;d>=0;d-=1){let p=s.filter(g=>g.sideNum1===d);p.length>1&&p.sort((g,x)=>i.dist(r.points[d],g.intersectionPoint)-i.dist(r.points[d],x.intersectionPoint)),p.length>0&&r.points.splice(d+1,0,...p.map(g=>g.intersectionPoint))}let h=new A(t.points);for(let d=h.points.length-1;d>=0;d-=1){let p=s.filter(g=>g.sideNum2===d);p.length>1&&p.sort((g,x)=>i.dist(h.points[d],g.intersectionPoint)-i.dist(h.points[d],x.intersectionPoint)),p.length>0&&h.points.splice(d+1,0,...p.map(g=>g.intersectionPoint))}let c={polyNum:1,pointNum:0};for(let d=0;d<r.points.length;d+=1)if("isIntersectionPoint"in r.points[d]){c.pointNum=d;break}else if(h.isPointInside(r.points[d])){c.pointNum=d;break}let f=!1,u=[];for(;!f;){let d=c.polyNum===1?r:h,p=c.polyNum===1?h:r;if(u.push(i.fromObject(d.points[c.pointNum%d.points.length])),u.length>2&&u[0].x===u[u.length-1].x&&u[0].y===u[u.length-1].y){u.pop();break}if(u.length>r.points.length+h.points.length)break;"isIntersectionPoint"in d.points[c.pointNum%d.points.length]?"isIntersectionPoint"in d.points[(c.pointNum+1)%d.points.length]||p.isPointInside(d.points[(c.pointNum+1)%d.points.length])&&!("isIntersectionPoint"in d.points[(c.pointNum+1)%d.points.length])?c.pointNum+=1:(c.pointNum=p.points.indexOf(d.points[c.pointNum%d.points.length])+1,c.polyNum=c.polyNum===1?2:1):c.pointNum+=1}return new A(u)}static createCircle(e,t,s=25){let o=[...Array(s).keys()].map(a=>{let r=i.fromAngle(2*Math.PI*a/s);return r.setMag(e),r.add(t),r});return new A(o)}static fracture(e,t=500){return e.map((o,a)=>{let r=[];for(let c=0;c<e.length;c+=1)if(a!==c){let f=e[c],u=i.div(i.add(o,f),2),d=i.sub(o,f);d.rotate(Math.PI/2),r.push(new se(u,i.add(d,u)))}return r=r.filter((c,f)=>{let u=new X(c.a,o);for(let d=0;d<r.length;d+=1)if(f!==d&&se.intersectWithLineSegment(r[d],u))return!1;return!0}),r=r.sort((c,f)=>i.sub(c.a,c.b).heading-i.sub(f.a,f.b).heading),r.map((c,f)=>{let u=[];for(let p=0;p<r.length;p+=1)if(f!==p){let g=se.intersect(c,r[p]);g instanceof i&&u.push(g)}let d=i.sub(c.a,c.b);return u=u.filter(p=>{let g=i.sub(p,o);return d.setMag(1),i.dot(g,d)>0}),u.length===0&&u.push(i.add(i.mult(d,t*1.2),c.a)),u=u.sort((p,g)=>i.dist(p,o)-i.dist(g,o)),u[0]})}).filter(o=>o.length>=3).map(o=>new A(o))}},bt=A;var ae=class{constructor(){this.r=0,this.points=[new i(0,0)]}static Circle(e,t){let s=new ae;return s.r=Math.abs(e),s.points[0]=t.copy,s}static Polygon(e){let t=new ae;if(e.length<3)throw new Error("A polygon needs at least 3 points to be valid!");return t.points=new bt(e).points.map(s=>i.fromObject(s)),t}getGeometricalData(){let e={center:this.points[0].copy,area:0,secondArea:0};if(this.r!==0)e.area=this.r*this.r*Math.PI,e.secondArea=.5*Math.PI*this.r**4;else{let t=[];for(let r=2;r<this.points.length;r+=1)t.push([this.points[0],this.points[r-1],this.points[r]]);let s=0,o=0,a=new i(0,0);t.forEach(r=>{let h=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),c=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),u=(h+c+f)/2,d=Math.sqrt(u*(u-h)*(u-c)*(u-f));s+=d,a.x+=d*(r[0].x+r[1].x+r[2].x)/3,a.y+=d*(r[0].y+r[1].y+r[2].y)/3}),a.div(s),e.center=a,e.area=s,t.forEach(r=>{let h=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),c=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),u=(h+c+f)/2,d=Math.sqrt(u*(u-h)*(u-c)*(u-f)),g=new se(r[1],r[2]).distFromPoint(r[0]),x=i.sub(r[2],r[1]);x.rotate90(),x.add(r[1]),h=new se(r[1],x).distFromPoint(r[0]);let v=(c*c*c*g-c*c*g*h+c*g*h*h+c*g*g*g)/36;v+=new i((r[0].x+r[1].x+r[2].x)/3,(r[0].y+r[1].y+r[2].y)/3).dist(e.center)**2*d,o+=v}),e.secondArea=o}return e}getMinMaxX(){let e=$e(this.points.map(t=>t.x));return e.min-=this.r,e.max+=this.r,e}getMinMaxY(){let e=$e(this.points.map(t=>t.y));return e.min-=this.r,e.max+=this.r,e}getMinMaxInDirection(e){let t=$e(this.points.map(s=>i.dot(s,e)));return t.min-=this.r,t.max+=this.r,t}move(e){this.points.forEach(t=>t.add(e))}rotateAround(e,t){this.points.forEach(s=>{s.sub(e)}),i.rotateArr(this.points,t),this.points.forEach(s=>{s.add(e)})}containsPoint(e){if(this.r!==0)return i.sub(e,this.points[0]).sqlength<=this.r*this.r;if(this.points.length===4){let s=new i(this.getMinMaxX().max+10,this.getMinMaxY().max+10),o=new X(e,s),a=0;return this.sides.forEach(r=>{X.intersect(r,o)&&(a+=1)}),a%2==1}return this.points.map((s,o)=>{let a=i.sub(this.points[(o+1)%this.points.length],s);return a.rotate90(),a}).every((s,o)=>i.dot(s,i.sub(e,this.points[o]))>=0)}get sides(){return this.points.map((e,t)=>new X(e,this.points[(t+1)%this.points.length]))}getSide(e){return new X(this.points[e],this.points[(e+1)%this.points.length])}getSideLine(e){return new se(this.points[e],this.points[(e+1)%this.points.length])}getNormal(e){let t=i.sub(this.points[e],this.points[(e+1)%this.points.length]);return t.rotate90(),t.normalize(),t}getClosestPoint(e){let t=this.points.map(r=>i.sub(r,e).sqlength),s=t[0],o=0,a=t.length;for(let r=1;r<a;r+=1)t[r]<s&&(s=t[r],o=r);return this.points[o].copy}getConvexHull(){let e=this.points.map(a=>a),t=this.points[0],s=this.points[0];this.points.forEach(a=>{s.x<a.x&&(s=a),t.x>a.x&&(t=a)}),e.splice(e.indexOf(t),1),e.splice(e.indexOf(s),1);let o=new ae;o.points=[t,s];for(let a=0;a<o.points.length;a+=1){if(e.length===0)return o;let r=o.getNormal(a),h=o.points[a],c=e[0],f=i.dot(i.sub(e[0],h),r);if(e.forEach((u,d)=>{if(d===0)return;let p=i.dot(i.sub(u,h),r);p>f&&(f=p,c=u)}),f>0){o.points.splice(a+1,0,c),e.splice(e.indexOf(c),1);for(let u=e.length-1;u>=0;u-=1)o.containsPoint(e[u])&&e.splice(u,1);a-=1}}return o}static fromObject(e){let t=new ae;return t.r=e.r,t.points=e.points.map(s=>i.fromObject(s)),t}get copy(){let e=new ae;return e.r=this.r,e.points=this.points.map(t=>t.copy),e}},P=ae;var yt={white:"#faf3dd",green:"#02c39a",pink:"#e58c8a",pinkDarker:"#da5a58",pinkHover:"#de6a68",blue:"#3db2f1",black:"#363732",Beige:"#f2f3d9",Independence:"#38405f",Turquoise:"#5dd9c1","Rich Black FOGRA 29":"#0e131f","Independence 2":"#59546c","Roman Silver":"#8b939c","Imperial Red":"#ff0035","Hot Pink":"#fc6dab","Maximum Yellow Red":"#f5b841","Lavender Web":"#dcd6f7"},w=yt,Bn=yt.Turquoise,R=yt.Turquoise;var vo=15,Ye=class{constructor(e,t=1,s=.2,o=.5){this.shape=e,this.k=s,this.fc=o;let a=this.shape.getGeometricalData();this.m=a.area*t,this.pos=a.center,this.am=a.secondArea*t,this.rotation=0,this.ang=0,this.vel=new i(0,0),this.layer=void 0,this.defaultAxes=[],this.axes=[],this.calculateAxes(),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()},this.minMaxes=[],this.calculateMinMaxes(),this.style=R,this.texture="none",this.textureTransform={offset:new i(0,0),scale:1,rotation:0},this.textureRepeat="repeat"}calculateAxes(){let e=Math.cos(Math.PI/vo);this.defaultAxes=this.normals.map(t=>new i(t.x,Math.abs(t.y)));for(let t=this.defaultAxes.length-2;t>=0;t-=1)for(let s=this.defaultAxes.length-1;s>t;s-=1){let o=this.defaultAxes[s],a=this.defaultAxes[t];Math.abs(i.dot(o,a))>e&&(this.defaultAxes.splice(s,1),this.defaultAxes[t]=o)}this.axes=this.defaultAxes.map(t=>t.copy)}calculateMinMaxes(){this.minMaxes=this.axes.map(e=>this.shape.getMinMaxInDirection(e))}get normals(){if(this.shape.r!==0)return[new i(0,1)];let e=this.shape.points.map((t,s)=>i.sub(this.shape.points[(s+1)%this.shape.points.length],t));return e.forEach(t=>{t.rotate270(),t.normalize()}),e}move(e){this.shape.move(e),this.pos.add(e),this.boundingBox.x.max+=e.x,this.boundingBox.x.min+=e.x,this.boundingBox.y.max+=e.y,this.boundingBox.y.min+=e.y}rotate(e){this.rotation+=e,this.shape.r===0&&this.shape.rotateAround(this.pos,e),i.rotateArr(this.axes,e),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()}}rotateAround(e,t){this.rotation+=t,this.shape.rotateAround(e,t),this.pos.rotateAround(e,t),i.rotateArr(this.axes,t),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()}}velInPlace(e){let t=i.sub(e,this.pos);return t.rotate90(),t.mult(this.ang),t.add(this.vel),t}containsPoint(e){return this.shape.containsPoint(e)}get density(){return this.m/this.shape.getGeometricalData().area}set density(e){if(e<0||!Number.isFinite(e))return;let t=this.shape.getGeometricalData();this.m=t.area*e,this.am=t.secondArea*e}fixDown(){this.m=0}scaleAround(e,t){t!==0&&(this.pos.scaleAround(e,t),this.shape.points.forEach(s=>s.scaleAround(e,t)),this.shape.r=Math.abs(this.shape.r*t),this.m*=t**2,this.am*=t**4)}scaleAroundX(e,t){if(t===0)return;let{density:s}=this;this.shape.points.forEach(a=>a.scaleAroundX(e,t)),this.shape.r=Math.abs(this.shape.r*t);let o=this.shape.getGeometricalData();this.m=o.area*s,this.pos=o.center,this.am=o.secondArea*s,this.calculateAxes(),this.calculateMinMaxes()}scaleAroundY(e,t){if(t===0)return;let{density:s}=this;this.shape.points.forEach(a=>a.scaleAroundY(e,t)),this.shape.r=Math.abs(this.shape.r*t);let o=this.shape.getGeometricalData();this.m=o.area*s,this.pos=o.center,this.am=o.secondArea*s,this.calculateAxes(),this.calculateMinMaxes()}applyImpulse(e,t){if(this.m===0)return;let s=i.sub(e,this.pos);this.vel.add(i.div(t,this.m)),this.ang+=i.cross(s,t)/this.am}static detectCollision(e,t){let s=e,o=t;{let v=Ke(s.boundingBox.x,o.boundingBox.x);if(v.max<v.min)return!1;let M=Ke(s.boundingBox.y,o.boundingBox.y);if(M.max<M.min)return!1}let a=e.axes,r=t.axes;if(s.shape.r!==0){let v=o.shape.getClosestPoint(s.pos),M=i.sub(v,s.pos);M.normalize(),a=[M],s.minMaxes=[s.shape.getMinMaxInDirection(M)]}if(o.shape.r!==0){let v=s.shape.getClosestPoint(o.pos),M=i.sub(v,o.pos);M.normalize(),r=[M],o.minMaxes=[o.shape.getMinMaxInDirection(M)]}let h=[...a,...r],c=v=>s.shape.getMinMaxInDirection(v),f=v=>o.shape.getMinMaxInDirection(v),u=[];if(h.some((v,M)=>{let O;M<a.length?O=e.minMaxes[M]:O=c(v);let q;M>=a.length?q=t.minMaxes[M-a.length]:q=f(v);let k=Ke(O,q);return k.max<k.min?!0:(u.push(k),!1)}))return!1;let d=u.map(v=>v.size()),p=d[0],g=0;for(let v=1;v<d.length;v+=1)p>d[v]&&(p=d[v],g=v);let x=h[g].copy;i.dot(x,i.sub(s.pos,o.pos))>0&&x.mult(-1);let b;if(g<a.length){let v=o.shape.points.map(M=>i.dot(M,x));b=o.shape.points[v.indexOf(Math.min(...v))].copy,o.shape.r!==0&&b.sub(i.mult(x,o.shape.r))}else{let v=s.shape.points.map(M=>i.dot(M,x));b=s.shape.points[v.indexOf(Math.max(...v))].copy,s.shape.r!==0&&b.add(i.mult(x,s.shape.r))}return{normal:x,overlap:p,contactPoint:b}}static fromObject(e){let t=Object.create(Ye.prototype);return t.am=e.am,t.ang=e.ang,t.axes=e.axes.map(s=>i.fromObject(s)),t.boundingBox={x:new F(e.boundingBox.x.min,e.boundingBox.x.max),y:new F(e.boundingBox.y.min,e.boundingBox.y.max)},t.defaultAxes=e.defaultAxes.map(s=>i.fromObject(s)),t.fc=e.fc,t.k=e.k,t.layer=e.layer,t.m=e.m,t.pos=i.fromObject(e.pos),t.rotation=e.rotation,t.shape=P.fromObject(e.shape),t.style=e.style,t.vel=i.fromObject(e.vel),t.minMaxes=[],t.calculateMinMaxes(),t}get copy(){let e=Object.create(Ye.prototype);return e.am=this.am,e.ang=this.ang,e.axes=this.axes.map(t=>t.copy),e.boundingBox={x:this.boundingBox.x.copy,y:this.boundingBox.y.copy},e.defaultAxes=this.defaultAxes.map(t=>t.copy),e.fc=this.fc,e.k=this.k,e.layer=this.layer,e.m=this.m,e.pos=this.pos.copy,e.rotation=this.rotation,e.shape=this.shape.copy,e.style=this.style,e.vel=this.vel.copy,e.minMaxes=this.minMaxes.map(t=>t.copy),e.texture=this.texture,e.textureRepeat=this.textureRepeat,e.textureTransform={offset:this.textureTransform.offset.copy,rotation:this.textureTransform.rotation,scale:this.textureTransform.scale},e}},y=Ye;var Ze=class{constructor(e,t){this.length=e,this.springConstant=t,this.pinned=!1,this.objects=[],this.rotationLocked=!1,this.initialHeading=0,this.initialOrientations=[0,0],this.attachPoints=[],this.attachRotations=[],this.attachPositions=[]}get copy(){let e=Object.create(Ze.prototype);return e.length=this.length,e.springConstant=this.springConstant,typeof this.pinned=="boolean"?e.pinned=this.pinned:e.pinned={x:this.pinned.x,y:this.pinned.y},e.objects=this.objects,e.rotationLocked=this.rotationLocked,e.initialHeading=this.initialHeading,e.initialOrientations=[...this.initialOrientations],e.attachPoints=this.attachPoints.map(t=>t.copy),e.attachRotations=[...this.attachRotations],e.attachPositions=this.attachPositions.map(t=>t.copy),e}pinHere(e,t){this.pinned={x:e,y:t}}unpin(){this.pinned=!1}attachObject(e,t=void 0){let s=this.objects;s.push(e),t?this.attachPoints.push(t.copy):this.attachPoints.push(e.pos.copy),this.attachPositions.push(e.pos.copy),this.attachRotations.push(e.rotation),s.length===2&&(this.pinned=!1),s.length>=3&&(s=[s[s.length-2],s[s.length-1]],this.attachPoints=[this.attachPoints[this.attachPoints.length-2],this.attachPoints[this.attachPoints.length-1]],this.attachPositions=[this.attachPositions[this.attachPositions.length-2],this.attachPositions[this.attachPositions.length-1]],this.attachRotations=[this.attachRotations[this.attachRotations.length-2],this.attachRotations[this.attachRotations.length-1]])}updateAttachPoint0(e,t=0){let s=this.rotationLocked;s&&this.unlockRotation(),this.attachPoints[0]=e.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=t&&(this.attachPoints[0]=this.attachPositions[0].copy),s&&this.lockRotation()}updateAttachPoint1(e,t=0){let s=this.rotationLocked;s&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=e.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=t&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=e.copy),s&&this.lockRotation()}get points(){let e=this.objects.map((t,s)=>{let o=i.sub(this.attachPoints[s],this.attachPositions[s]);return o.rotate(t.rotation-this.attachRotations[s]),i.add(o,t.pos)});return typeof this.pinned!="boolean"&&e.push(i.fromObject(this.pinned)),e}lockRotation(){this.rotationLocked=!0,this.initialOrientations=this.objects.map(t=>t.rotation);let e=this.points;this.initialHeading=i.sub(e[1],e[0]).heading}unlockRotation(){this.rotationLocked=!1}arrangeOrientations(){let e=this.points,s=i.sub(e[1],e[0]).heading-this.initialHeading;this.objects.forEach((o,a)=>{let r=this.initialOrientations[a]+s;o.rotate(r-o.rotation)})}getAsSegment(){let e=this.points;return new X(e[0],e[1])}update(e){this.rotationLocked&&this.arrangeOrientations();let t,s;if(this.pinned instanceof Object&&this.objects[0]){[s,t]=[this.pinned,this.objects[0]];let o=this.points,a=new i(o[1].x-o[0].x,o[1].y-o[0].y),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*e),t.applyImpulse(o[1],a);let h=t.vel;if(h.rotate(-a.heading),this.rotationLocked&&t.m!==0){let c=new i(s.x,s.y),u=i.sub(t.pos,c).length,d=u*u*t.m+t.am,p=(t.am*t.ang-u*t.m*h.y)/d;h.y=-p*u,t.ang=p}h.rotate(a.heading)}else if(this.objects[0]&&this.objects[1]){[t,s]=[this.objects[0],this.objects[1]];let o=this.points,a=i.sub(o[0],o[1]),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*e),s.applyImpulse(o[1],a),a.mult(-1),t.applyImpulse(o[0],a),a=i.sub(t.pos,s.pos);let h=t.vel,c=s.vel;if(h.rotate(-a.heading),c.rotate(-a.heading),this.rotationLocked&&t.m!==0&&s.m!==0){let f=new i(t.pos.x*t.m+s.pos.x*s.m,t.pos.y*t.m+s.pos.y*s.m);f.div(t.m+s.m);let u=i.sub(t.pos,f),d=i.sub(s.pos,f),p=u.length,g=d.length,x=p*p*t.m+t.am+g*g*s.m+s.am,b=(h.y-c.y)*g/(p+g)+c.y,v=(t.am*t.ang+s.am*s.ang+p*t.m*(h.y-b)-g*s.m*(c.y-b))/x;h.y=v*p+b,c.y=-v*g+b,t.ang=v,s.ang=v}h.rotate(a.heading),c.rotate(a.heading)}}rotateAround(e,t){if(typeof this.pinned=="boolean")return;let s=i.fromObject(this.pinned);s.rotateAround(e,t),this.pinned.x=s.x,this.pinned.y=s.y}scaleAround(e,t){if(typeof this.pinned=="boolean")return;let s=i.fromObject(this.pinned);s.scaleAround(e,t),this.pinned.x=s.x,this.pinned.y=s.y,this.length*=t}getMinMaxX(){let e=[...this.objects.map(t=>t.pos.x)];return typeof this.pinned!="boolean"&&e.push(this.pinned.x),F.fromPoints(...e)}getMinMaxY(){let e=[...this.objects.map(t=>t.pos.y)];return typeof this.pinned!="boolean"&&e.push(this.pinned.y),F.fromPoints(...e)}},C=Ze;var Ae=class extends C{constructor(e){super(e,0);this.springConstant=0}get copy(){let e=Object.create(Ae.prototype);return e.length=this.length,e.springConstant=this.springConstant,typeof this.pinned=="boolean"?e.pinned=this.pinned:e.pinned={x:this.pinned.x,y:this.pinned.y},e.objects=this.objects,e.rotationLocked=this.rotationLocked,e.initialHeading=this.initialHeading,e.initialOrientations=[...this.initialOrientations],e.attachPoints=this.attachPoints.map(t=>t.copy),e.attachRotations=[...this.attachRotations],e.attachPositions=this.attachPositions.map(t=>t.copy),e}updateAttachPoint0(e,t=0){let s=this.rotationLocked;s&&this.unlockRotation(),this.attachPoints[0]=e.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=t&&(this.attachPoints[0]=this.attachPositions[0].copy),this.length=this.getAsSegment().length,s&&this.lockRotation()}updateAttachPoint1(e,t=0){let s=this.rotationLocked;s&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=e.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=t&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=e.copy),this.length=this.getAsSegment().length,s&&this.lockRotation()}update(){this.rotationLocked&&this.arrangeOrientations();let e,t;if(this.pinned instanceof Object&&"x"in this.pinned&&this.objects[0]){if([t,e]=[this.pinned,this.objects[0]],e.m===0)return;let s=this.points,o=new i(s[1].x-s[0].x,s[1].y-s[0].y);o.setMag(o.length-this.length),e.move(o),o=new i(s[1].x-s[0].x,s[1].y-s[0].y),o.normalize();let a=s[0],r=o,h=e,c=i.sub(a,h.pos),f=i.mult(h.velInPlace(a),-1),u=1/h.m;u+=i.dot(i.crossScalarFirst(i.cross(c,r)/h.am,c),r),u=-i.dot(f,r)/u;let d=i.sub(h.vel,i.mult(r,u/h.m)),p=h.ang-u*i.cross(c,r)/h.am;e.vel=d,e.ang=p;let g=e.vel;if(g.rotate(-o.heading),this.rotationLocked&&e.m!==0){let x=new i(t.x,t.y),v=i.sub(e.pos,x).length,M=v*v*e.m+e.am,O=(e.am*e.ang+v*e.m*g.y)/M;g.y=O*v,e.ang=O}g.rotate(o.heading)}else if(this.objects[0]&&this.objects[1]){[e,t]=[this.objects[0],this.objects[1]];let s=this.points,o=i.sub(s[0],s[1]),a=this.length-o.length;o.setMag(1);let r=e,h=t,c=r.m===0?Infinity:r.m,f=h.m===0?Infinity:h.m,u,d;if(c!==Infinity&&f!==Infinity)u=i.mult(o,a*f/(c+f)),d=i.mult(o,-a*c/(c+f));else if(c===Infinity&&f!==Infinity)u=new i(0,0),d=i.mult(o,-a);else if(c!==Infinity&&f===Infinity)d=new i(0,0),u=i.mult(o,a);else return;e.move(u),t.move(d),s=this.points,o=i.sub(s[1],s[0]),o.normalize();let p=o,g=s[0],x=s[1],b=r.ang,v=h.ang,M=i.sub(g,r.pos),O=i.sub(x,h.pos),q=r.m===0?Infinity:r.am,k=h.m===0?Infinity:h.am,J=r.velInPlace(g),Z=h.velInPlace(x),N=i.sub(Z,J),Y=1/c+1/f;Y+=i.dot(i.crossScalarFirst(i.cross(M,p)/q,M),p),Y+=i.dot(i.crossScalarFirst(i.cross(O,p)/k,O),p),Y=-i.dot(N,p)/Y;let me=i.sub(r.vel,i.mult(p,Y/c)),Oe=i.add(h.vel,i.mult(p,Y/f)),Xe=b-Y*i.cross(M,p)/q,H=v+Y*i.cross(O,p)/k;e.m!==0&&(e.vel=me,e.ang=Xe),t.m!==0&&(t.vel=Oe,t.ang=H);let W=e.vel,U=t.vel;if(W.rotate(-o.heading),U.rotate(-o.heading),this.rotationLocked&&e.m!==0&&t.m!==0){let gt=new i(e.pos.x*e.m+t.pos.x*t.m,e.pos.y*e.m+t.pos.y*t.m);gt.div(e.m+t.m);let Le=i.sub(e.pos,gt).length,ve=i.sub(t.pos,gt).length,xo=Le*Le*e.m+e.am+ve*ve*t.m+t.am,Je=(W.y-U.y)*ve/(Le+ve)+U.y,Qe=(e.am*e.ang+t.am*t.ang+Le*e.m*(W.y-Je)-ve*t.m*(U.y-Je))/xo;W.y=Qe*Le+Je,U.y=-Qe*ve+Je,e.ang=Qe,t.ang=Qe}W.rotate(o.heading),U.rotate(o.heading)}}},B=Ae;function wo(n,e,t,s){let o=s,a=t,r=n,h=e,c=r.vel,f=h.vel,u=r.ang,d=h.ang,p=i.sub(a,r.pos),g=i.sub(a,h.pos),x=r.am,b=h.am,v=r.m,M=h.m,O=(r.k+h.k)/2,q=(r.fc+h.fc)/2,k=r.velInPlace(a),J=h.velInPlace(a),Z=i.sub(J,k),N=1/v+1/M;N+=i.dot(i.crossScalarFirst(i.cross(p,o)/x,p),o),N+=i.dot(i.crossScalarFirst(i.cross(g,o)/b,g),o),N=-((1+O)*i.dot(Z,o))/N;let Y=i.sub(c,i.mult(o,N/v)),me=i.add(f,i.mult(o,N/M)),Oe=u-N*i.cross(p,o)/x,Xe=d+N*i.cross(g,o)/b,H=Z.copy;if(H.sub(i.mult(o,i.dot(Z,o))),H.setMag(1),i.dot(o,H)**2>.5)return[{dVel:i.sub(Y,r.vel),dAng:Oe-r.ang},{dVel:i.sub(me,h.vel),dAng:Xe-h.ang}];let W=1/v+1/M;W+=i.dot(i.crossScalarFirst(i.cross(p,H)/x,p),H),W+=i.dot(i.crossScalarFirst(i.cross(g,H)/b,g),H),W=-i.dot(Z,H)/W;let U=Math.sign(W)*N*q;return Math.abs(U)>Math.abs(W)&&(U=W),Y=i.sub(Y,i.mult(H,U/v)),me=i.add(me,i.mult(H,U/M)),Oe-=U*i.cross(p,H)/x,Xe+=U*i.cross(g,H)/b,[{dVel:i.sub(Y,r.vel),dAng:Oe-r.ang},{dVel:i.sub(me,h.vel),dAng:Xe-h.ang}]}function Tn(n,e,t){let s=e,o=t,a=n,r=i.sub(s,a.pos),{am:h,m:c}=a,f=i.mult(a.velInPlace(s),-1),u=1/c;u+=i.dot(i.crossScalarFirst(i.cross(r,o)/h,r),o),u=-((1+a.k)*i.dot(f,o))/u;let d=i.sub(a.vel,i.mult(o,u/c)),p=a.ang-u*i.cross(r,o)/h,g=f.copy;if(g.sub(i.mult(o,i.dot(f,o))),g.setMag(1),i.dot(o,g)**2>.5)return{dVel:i.sub(d,a.vel),dAng:p-a.ang};let x=1/c;x+=i.dot(i.crossScalarFirst(i.cross(r,g)/h,r),g),x=-i.dot(f,g)/x;let b=Math.sign(x)*u*a.fc;return Math.abs(b)>Math.abs(x)&&(b=x),d=i.sub(d,i.mult(g,b/c)),p-=b*i.cross(r,g)/h,{dVel:i.sub(d,a.vel),dAng:p-a.ang}}function Rn(n){let e=[],t=n.length,s=Array(t).fill(0),o=Array(t).fill(0),a=Array(t).fill(0),r=Array(t).fill(0),h=Array(t).fill(0),c=Array(t).fill(0);n.forEach(f=>f.calculateMinMaxes());for(let f=0;f<t-1;f+=1)for(let u=f+1;u<t;u+=1){let d=n[f],p=n[u];if(d.m===0&&p.m===0||Number.isFinite(d.layer)&&Number.isFinite(p.layer)&&d.layer===p.layer)continue;let g=y.detectCollision(d,p);if(g&&typeof g!="boolean"){let x=i.dot(d.velInPlace(g.contactPoint),g.normal),b=i.dot(p.velInPlace(g.contactPoint),g.normal);e.push({n:g.normal,cp:g.contactPoint});let v=-g.overlap,M=g.overlap;if(d.m===0){v=0;let k=Tn(p,g.contactPoint,i.mult(g.normal,-1));r[u]+=k.dVel.x,h[u]+=k.dVel.y,c[u]+=k.dAng,a[u]+=1}else if(p.m===0){M=0;let k=Tn(d,g.contactPoint,i.mult(g.normal,1));r[f]+=k.dVel.x,h[f]+=k.dVel.y,c[f]+=k.dAng,a[f]+=1}else{v*=p.m/(d.m+p.m),M*=d.m/(d.m+p.m);let[k,J]=wo(d,p,g.contactPoint,i.mult(g.normal,1));x>=b&&(r[f]+=k.dVel.x,h[f]+=k.dVel.y,c[f]+=k.dAng,r[u]+=J.dVel.x,h[u]+=J.dVel.y,c[u]+=J.dAng)}let O=i.mult(g.normal,v),q=i.mult(g.normal,M);s[f]+=O.x,s[u]+=q.x,o[f]+=O.y,o[u]+=q.y}}for(let f=0;f<t;f+=1){let u=n[f];if(u.m===0)continue;let d=Math.max(a[f],1);u.move(new i(s[f],o[f])),u.vel.add(new i(r[f]/d,h[f]/d)),u.ang+=c[f]/d}return e}var De=class{constructor(){this.bodies=[],this.springs=[],this.airFriction=1,this.gravity=new i(0,0)}update(e){let t=[];for(let s=0;s<this.bodies.length;s+=1)this.bodies[s].move(new i(this.bodies[s].vel.x*e,this.bodies[s].vel.y*e)),this.bodies[s].rotate(this.bodies[s].ang*e);this.springs.forEach((s,o,a)=>{a[a.length-1-o].update(e/2),s.update(e/2)});for(let s=0;s<this.bodies.length;s+=1)this.bodies[s].m!==0&&this.bodies[s].vel.add(new i(this.gravity.x*e,this.gravity.y*e));return t=Rn(this.bodies),this.bodies.forEach(s=>{let o=s;s.m!==0&&(o.vel.mult(this.airFriction**e),o.ang*=this.airFriction**e)}),t}get copy(){let e=new De;return e.airFriction=this.airFriction,e.gravity=this.gravity.copy,e.bodies=this.bodies.map(t=>t.copy),e.springs=this.springs.map(t=>{let s=t.objects.map(a=>this.bodies.indexOf(a)).map(a=>e.bodies[a]),o=t.copy;return o.objects=s,o}),e}getFreeLayer(){let e=new Set;return this.bodies.forEach(t=>{typeof t.layer=="number"&&e.add(t.layer)}),Math.max(...e)+1}setAirFriction(e){!Number.isFinite(e)||(this.airFriction=e,this.airFriction<0&&(this.airFriction=0),this.airFriction>1&&(this.airFriction=1))}setGravity(e){this.gravity=e.copy}addBody(e){this.bodies.push(e)}addSoftSquare(e,t,s,o,a=24,r=1){let h={sides:[],points:[]},c=Math.sqrt(t*t/Math.PI);h.points=[...new Array(a).keys()].map(p=>2*p*Math.PI/a).map(p=>i.add(i.mult(i.fromAngle(p),c),e)).map(p=>new y(P.Circle(Math.PI*c/a,p),1,.2,s));let f=this.getFreeLayer();h.points.forEach(p=>{p.layer=f}),h.sides=h.points.map((p,g)=>{let x=new B(1);return x.attachObject(p),x.attachObject(h.points[(g+1)%h.points.length]),x.lockRotation(),x}),h.sides.forEach(p=>{let g=p;g.length=.96*4*t/a}),h.points.forEach(p=>{let g=p;g.vel=o.copy}),this.bodies.push(...h.points),this.springs.push(...h.sides);let u=t*t*200*r,d=new C(Math.sqrt(c*c*Math.PI*1.1),u/2);d.attachObject(h.points[0]),d.attachObject(h.points[a/2]),this.springs.push(d),d=new C(Math.sqrt(c*c*Math.PI*1.1),u/2),d.attachObject(h.points[a/4]),d.attachObject(h.points[3*a/4]),this.springs.push(d),d=new C(Math.sqrt(2*c*c*Math.PI*1.1),u),d.attachObject(h.points[a/8]),d.attachObject(h.points[5*a/8]),this.springs.push(d),d=new C(Math.sqrt(2*c*c*Math.PI*1.1),u),d.attachObject(h.points[3*a/8]),d.attachObject(h.points[7*a/8]),this.springs.push(d)}addRectWall(e,t,s,o){let a=[];a.push(new i(e-s/2,t-o/2)),a.push(new i(e+s/2,t-o/2)),a.push(new i(e+s/2,t+o/2)),a.push(new i(e-s/2,t+o/2)),this.bodies.push(new y(P.Polygon(a),0))}addRectBody(e,t,s,o,a,r,h=R){let c=[];c.push(new i(e-s/2,t-o/2)),c.push(new i(e+s/2,t-o/2)),c.push(new i(e+s/2,t+o/2)),c.push(new i(e-s/2,t+o/2));let f=new y(P.Polygon(c),1,r,a);f.style=h,this.bodies.push(f)}addFixedBall(e,t,s){this.bodies.push(new y(P.Circle(s,new i(e,t)),0)),this.bodies[this.bodies.length-1].style=w.Beige}addSpring(e){this.springs.push(e)}getSpringsWithBody(e){return this.springs.filter(t=>t.objects.includes(e))}setBounds(e,t,s,o){let a=(r,h,c,f)=>{let u=[];return u.push(new i(r-c/2,h-f/2)),u.push(new i(r+c/2,h-f/2)),u.push(new i(r+c/2,h+f/2)),u.push(new i(r-c/2,h+f/2)),new y(P.Polygon(u),0)};this.bodies[0]=a(e-s,t,2*s,4*o),this.bodies[1]=a(e+2*s,t,2*s,4*o),this.bodies[2]=a(e,t-o,4*s,o*2),this.bodies[3]=a(e+s/2,t+2*o,5*s,2*o);for(let r=0;r<4;r+=1)this.bodies[r].style=w.Beige}getObjectAtCoordinates(e,t,s=0){let o=!1,a=new i(e,t);return this.bodies.some((r,h)=>r.containsPoint(a)&&h>=s?(o=r,!0):!1),o}removeObjFromSystem(e){let t=-1;if(e instanceof y&&(t=this.bodies.indexOf(e)),t!==-1){let s=this.getSpringsWithBody(this.bodies[t]);this.bodies.splice(t,1),s.forEach(o=>{this.removeObjFromSystem(o)});return}(e instanceof B||e instanceof C)&&(t=this.springs.indexOf(e)),t!==-1&&this.springs.splice(t,1)}getObjectIdentifier(e){return e instanceof y?{type:"body",index:this.bodies.indexOf(e)}:{type:"nothing",index:-1}}toJSON(){let e={};return e.airFriction=this.airFriction,e.gravity=this.gravity.toJSON(),e.bodies=this.bodies.map(t=>t.copy),e.springs=this.springs.map(t=>{let s={};return s.length=t.length,s.pinned=t.pinned,s.rotationLocked=t.rotationLocked,s.springConstant=t.springConstant,t instanceof C?s.type="spring":t instanceof B&&(s.type="stick"),s.objects=t.objects.map(o=>this.getObjectIdentifier(o)),s}),e}stickOrSpringFromObject(e){let t={};return e.type==="spring"?t=new C(e.length,e.springConstant):e.type==="stick"&&(t=new B(e.length)),t.pinned=e.pinned,t.rotationLocked=e.rotationLocked,t.objects=e.objects.map(s=>this.bodies[s.index]),t}static fromObject(e){let t=new De;return t.bodies=e.bodies.map(s=>y.fromObject(s)),t.airFriction=e.airFriction,t.gravity=i.fromObject(e.gravity),t.springs=e.springs.map(s=>t.stickOrSpringFromObject(s)),t}};var xt=De;var et=class{constructor(){this.bodies=[],this.springs=[]}addBody(e){this.bodies.push(e)}addSpring(e){this.springs.push(e)}move(e){this.bodies.forEach(t=>t.move(e)),this.springs.forEach(t=>{if(typeof t.pinned!="boolean"){let s=t.pinned;s.x+=e.x,s.y+=e.y}})}scaleAround(e,t){this.bodies.forEach(s=>{s.scaleAround(e,t),s.vel.mult(t),s.texture!=="none"&&(s.textureTransform.scale*=t,s.textureTransform.offset.mult(t))}),this.springs.forEach(s=>s.scaleAround(e,t))}rotateAround(e,t){this.bodies.forEach(s=>s.rotateAround(e,t)),this.springs.forEach(s=>s.rotateAround(e,t))}get boundingBox(){let e;this.bodies.length!==0?(e=this.bodies[0].shape.getMinMaxX(),this.bodies.forEach(s=>e.add(s.boundingBox.x)),this.springs.forEach(s=>e.add(s.getMinMaxX()))):this.springs.length!==0?(e=this.springs[0].getMinMaxX(),this.springs.forEach(s=>e.add(s.getMinMaxX()))):e=new F(0,0);let t;return this.bodies.length!==0?(t=this.bodies[0].shape.getMinMaxY(),this.bodies.forEach(s=>t.add(s.boundingBox.y)),this.springs.forEach(s=>t.add(s.getMinMaxY()))):this.springs.length!==0?(t=this.springs[0].getMinMaxY(),this.springs.forEach(s=>t.add(s.getMinMaxY()))):t=new F(0,0),{x:e,y:t}}removeUnusedSprings(){for(let e=this.springs.length-1;e>=0;e-=1)this.springs[e].objects.some(s=>!this.bodies.includes(s))&&this.springs.splice(e,1)}get copy(){let e=Object.create(et.prototype);return this.removeUnusedSprings(),e.bodies=this.bodies.map(t=>t.copy),e.springs=this.springs.map(t=>[...t.objects.map(s=>this.bodies.indexOf(s))]).map((t,s)=>{let o=this.springs[s].copy;return o.objects=t.map(a=>e.bodies[a]),o}),e}},tt=et;function ko(n,e="none"){let t=n.copy;return t.texture=e,t}function Mo(n,e){let t={};return t.length=n.length,t.springConstant=n.springConstant,typeof n.pinned=="boolean"?t.pinned=n.pinned:t.pinned={x:n.pinned.x,y:n.pinned.y},t.rotationLocked=n.rotationLocked,t.initialHeading=n.initialHeading,t.initialOrientations=[...n.initialOrientations],t.attachPoints=n.attachPoints.map(s=>s.copy),t.attachRotations=[...n.attachRotations],t.attachPositions=n.attachPositions.map(s=>s.copy),t.objects=[...n.objects.map(s=>e.bodies.indexOf(s))],n instanceof B?t.type="stick":t.type="spring",t}function So(n){let e=document.createElement("cnv");return e.width=n.width,e.height=n.height,e.getContext("2d").drawImage(n,0,0,n.width,n.height),e.toDataURL()}function Po(n){let e={};n.removeUnusedSprings();let t=n.bodies.map(c=>c.texture),s=[...new Set(t)],o=n.bodies.map(c=>s.indexOf(c.texture)),a=s.map(c=>typeof c=="string"?c:So(c)),r=[...new Set(a)],h=o.map(c=>r.indexOf(a[c]));return e.textureSet=r,e.bodies=n.bodies.map((c,f)=>ko(c,h[f])),e.springs=n.springs.map(c=>Mo(c,n)),e}function Fn(n){return JSON.stringify(Po(n))}function Io(n){return new Promise((e,t)=>{n==="none"&&e("none");try{let s=new Image;s.onload=()=>{createImageBitmap(s).then(o=>e(o)).catch(o=>t(o))},s.src=n}catch(s){t(new Error("Texture could not be loaded"))}})}function Co(n,e){let t=Object.create(y.prototype),s=n;return t.pos=i.fromObject(s.pos),t.shape=P.fromObject(s.shape),t.am=s.am,t.ang=s.ang,t.axes=s.axes.map(o=>i.fromObject(o)),t.boundingBox={x:new F(s.boundingBox.x.min,s.boundingBox.x.max),y:new F(s.boundingBox.y.min,s.boundingBox.y.max)},t.defaultAxes=s.defaultAxes.map(o=>i.fromObject(o)),t.fc=s.fc,t.k=s.k,Number.isFinite(s.layer)?t.layer=s.layer:t.layer=void 0,t.m=s.m,t.rotation=s.rotation,t.style=s.style,t.vel=i.fromObject(s.vel),t.minMaxes=s.minMaxes.map(o=>new F(o.min,o.max)),t.texture=e[s.texture],t.textureRepeat=s.textureRepeat,t.textureTransform={offset:i.fromObject(s.textureTransform.offset),scale:s.textureTransform.scale,rotation:s.textureTransform.rotation},t}function Eo(n,e){let t,s=n;return s.type==="stick"?t=Object.create(B.prototype):t=Object.create(C.prototype),t.length=s.length,t.springConstant=s.springConstant,t.pinned=s.pinned,t.objects=s.objects.map(o=>e[o]),t.rotationLocked=s.rotationLocked,t.initialHeading=s.initialHeading,t.initialOrientations=s.initialOrientations,t.attachRotations=s.attachRotations,t.attachPoints=s.attachPoints.map(o=>i.fromObject(o)),t.attachPositions=s.attachPositions.map(o=>i.fromObject(o)),t}async function Bo(n){let e=Object.create(tt.prototype),t=await Promise.all(n.textureSet.map(s=>Io(s)));return e.bodies=n.bodies.map(s=>Co(s,t)),e.springs=n.springs.map(s=>Eo(s,e.bodies)),e}function On(n){return Bo(JSON.parse(n))}var To="user-content",ee="creations",Xn="worlds",ze=window.indexedDB.open(To,1),te;ze.onupgradeneeded=()=>{te=ze.result,te.objectStoreNames.contains(ee)||te.createObjectStore(ee,{keyPath:"name"}).createIndex("description","description"),te.objectStoreNames.contains(Xn)||te.createObjectStore(Xn,{keyPath:"name"}).createIndex("description","description")};ze.onerror=()=>{throw new Error("Could not open database")};ze.onsuccess=()=>{te=ze.result};function Ln(n){let e={name:n.name,description:n.description,thumbnail:n.thumbnail,content:Fn(n.content)},o=te.transaction(ee,"readwrite").objectStore(ee).put(e);o.onerror=()=>{console.log("storing failed")},o.onsuccess=()=>{console.log("storing completed")}}function Yn(n){return new Promise((e,t)=>{let a=te.transaction(ee,"readwrite").objectStore(ee).delete(n);a.onerror=()=>{t(new Error(`Removal of creation '${n}' was not succesful`))},a.onsuccess=()=>{e(`Removal of creation '${n}' succeeded`)}})}function Dn(){return new Promise((n,e)=>{let o=te.transaction(ee,"readonly").objectStore(ee).getAllKeys();o.onerror=()=>{e(new Error(`The names could not be retrieved from the database: ${o.error}`))},o.onsuccess=()=>{n(o.result.map(a=>a.toString()))}})}function zn(n){return new Promise((e,t)=>{let a=te.transaction(ee,"readwrite").objectStore(ee).get(n);a.onerror=()=>{t(new Error(`The creation could not be retrieved from the database: ${a.error}`))},a.onsuccess=()=>{e(a.result)}})}var nt,Nn,Ne;function je(n){Nn=n,n?Ne.classList.add("bg-pink-darker"):Ne.classList.remove("bg-pink-darker")}function vt(n){nt=n.getPhysics().copy,Ne=document.getElementById("set start"),je(!1);let e=document.getElementById("pause");e&&(e.onclick=()=>{n.getTimeMultiplier()!==0?n.setTimeMultiplier(0):(n.setTimeMultiplier(1),Nn===!0&&(nt=n.getPhysics().copy),je(!1))});let t=document.getElementById("revert");t&&(t.onclick=()=>{n.setTimeMultiplier(0),n.setPhysics(nt.copy),je(!0)});let s=document.getElementById("clear all");s&&(s.onclick=()=>{je(!0);let a=n.getPhysics();a.springs=[],a.bodies=[]}),Ne&&(Ne.onclick=()=>{nt=n.getPhysics().copy,je(!0),n.setTimeMultiplier(0)});let o=!1;document.addEventListener("visibilitychange",()=>{document.hidden?n.getTimeMultiplier()!==0?(n.setTimeMultiplier(0),o=!0):o=!1:o&&n.setTimeMultiplier(1)})}function l(n,e,...t){let s=document.createElement(n);return e&&Object.entries(e).forEach(([o,a])=>{s[o]=a}),t&&t.forEach(o=>{typeof o=="string"?s.appendChild(document.createTextNode(o)):o instanceof HTMLElement&&s.appendChild(o)}),s}var jn=document.createElement("template");jn.innerHTML=`
  <style>
    .number-label {
        display: flex;
        align-items: center;
        font-weight: bold;
        padding-right: 0.45em;
        margin-top: 0.5em;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .number-label {
        margin-top: 0.6em;
        font-size: small;
      }
    }
  </style>
`;var Hn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(jn.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"number-label"},l("span",null,l("slot",null)),l("span",{id:"numberPlace"})))}set value(e){this.shadowRoot.querySelector("#numberPlace").innerText=e}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}};window.customElements.define("number-display",Hn);var Vn=document.createElement("template");Vn.innerHTML=`
  <style>
    .checkbox-label {
        font-weight: bold;
        padding-right: 0.45em;
        margin-top: 1.1em;
        display: flex;
    }
    .ch-box {
        display: none;
    }
    .checkbox-display {
        width: 1.15em;
        height: 1.15em;
        display: block;
        background-color: var(--roman-silver);
        margin-bottom: 0.3em;
        margin-right: 0.3em;
        margin-left: 0em;
        padding: 0;
        position: relative;
        border-radius: 0.2em;
        top: 0.2em;
        -webkit-transition: 0.2s;
        transition: background-color 0.2s;
        text-align: center;
        float: left;
    }
    input[type="checkbox"]:checked ~ .checkbox-display {
        background-color: var(--pinky-darker);
    }
    .checkbox-display:hover,
    .checkbox-label:hover > .checkbox-display {
        background-color: var(--independence);
    }
    input[type="checkbox"]:checked ~ .checkbox-display > .checkmark {
        transform: scale(1.2);
    }
    .checkmark {
        width: 75%;
        height: auto;
        fill: white;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform: scale(0);
    }
    .label-text {
        margin-top: 0.2em;
        flex: 1;
    }
    .cursor-pointer > * {
        cursor: pointer;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .checkbox-label {
        margin-top: 0.6em;
        font-size: small;
      }
    }
  </style>
`;var qn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Vn.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"cursor-pointer"},l("label",{htmlFor:"cbIdentifier",className:"checkbox-label"},l("input",{type:"checkbox",className:"ch-box",id:"cbIdentifier"}),l("div",{className:"checkbox-display"}),l("div",{className:"label-text"},l("slot",null))))),this.shadowRoot.querySelector(".checkbox-display").innerHTML='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.877px" height="101.052px" viewBox="0 0 122.877 101.052" id="checkmark-svg" enable-background="new 0 0 122.877 101.052" xml:space="preserve"><g><path d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"/></g></svg>',this.shadowRoot.querySelector("#checkmark-svg").classList.add("checkmark")}get checkbox(){return this.shadowRoot.querySelector("#cbIdentifier")}set checked(e){this.checkbox.checked=e}set onChange(e){this.checkbox.onchange=t=>e(t.target.checked)}};window.customElements.define("check-box",qn);var re={spring:!0,body:!0},Ro=7,Wn=document.createElement("div");function Un(n){if(!re.spring)return!1;let e=new i(n.mouseX,n.mouseY),t=n.physics.springs.find(s=>s.getAsSegment().distFromPoint(e)<=Ro);return typeof t=="undefined"?!1:t}var Fo={name:"Delete",description:"",element:Wn,drawFunc(n,e){let t=re.body&&n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY,4);if(typeof t!="boolean"){let o=n.cnv.getContext("2d");o.save(),o.fillStyle="#00000000",o.strokeStyle=w["Imperial Red"],o.lineWidth=3,n.renderer.renderBody(t,o),o.restore();return}let s=Un(n);if(s){let o=n.cnv.getContext("2d");o.save(),o.fillStyle="#00000000",o.strokeStyle=w["Imperial Red"],o.lineWidth=3,s instanceof B?n.renderer.renderStick(s,o):n.renderer.renderSpring(s,o),o.restore()}},startInteractionFunc(n){let e=Un(n);n.choosed&&n.choosed instanceof y&&re.body?n.physics.removeObjFromSystem(n.choosed):re.spring&&e&&n.physics.removeObjFromSystem(e)}};Wn.append(l("number-display",null,"Deletable types:"),l("check-box",{checked:re.body,onChange:n=>{re.body=n}},"Body"),l("check-box",{checked:re.spring,onChange:n=>{re.spring=n}},"Stick/Spring"));var Gn=Fo;var Oo=document.createElement("div"),Xo={name:"Move",description:"",element:Oo,drawFunc(n,e){let{choosed:t}=n,s=new i(n.mouseX,n.mouseY),o=t||n.physics.getObjectAtCoordinates(s.x,s.y,4);if(o instanceof y){let a=n.cnv.getContext("2d");a.save(),a.lineWidth=3,a.globalAlpha=.6,a.strokeStyle="#FFFFFF",a.fillStyle="#00000000",n.renderer.renderBody(o,a),a.restore()}if(t instanceof y&&t.m!==0){let a=new i(n.oldMouseX,n.oldMouseY),r=i.sub(s,a);e===0?(t.vel.x=0,t.vel.y=0,t.move(r)):(s.x<t.boundingBox.x.min?t.move(new i(s.x-t.boundingBox.x.min,0)):s.x>t.boundingBox.x.max&&t.move(new i(s.x-t.boundingBox.x.max,0)),s.y<t.boundingBox.y.min?t.move(new i(0,s.y-t.boundingBox.y.min)):s.y>t.boundingBox.y.max&&t.move(new i(0,s.y-t.boundingBox.y.max)),t.vel.x=r.x/e,t.vel.y=r.y/e),t.ang=0}},startInteractionFunc(n){let{choosed:e}=n;if(e instanceof y&&e.m!==0){let t=n;t.cnv.style.cursor="grabbing"}},endInteractionFunc(n){let{choosed:e}=n;if(e instanceof y&&e.m!==0){let t=n;t.cnv.style.cursor="grab"}},activated(n){let e=n;e.cnv.style.cursor="grab"},deactivated(n){let e=n;e.cnv.style.cursor="default"}},_n=Xo;var Jn=document.createElement("template");Jn.innerHTML=`
  <style>
    #btn {
        background-color: var(--independence);
        border: none;
        color: white;
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        text-align: center;
        text-decoration: none;
        display: block;
        font-size: medium;
        margin: 0px;
        -webkit-transition: 0.2s;
        transition: opacity 0.2s, background-color 0.2s;
        width: 100%;
        opacity: 0.8;
        cursor: pointer;
    }
    #btn:hover {
        opacity: 1;
    }
    .hidden {
      display: none;
    }
    .last {
      border-bottom-left-radius: 0.4em;
      border-bottom-right-radius: 0.4em;
    }
    .upper {
      border-top-left-radius: 0.4em;
      border-top-right-radius: 0.4em;
    }
    /* For tablets */
    @media (max-width: 768px) {
    }
    /* For smaller laptops */
    @media (max-width: 1125px) {
        #btn {
            padding-top: 0.12em;
            padding-bottom: 0.12em;
            font-size: small;
        }
    }
  </style>
`;var Qn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Jn.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{id:"btn"},l("slot",null))),this.hidden=!1}set bgColor(e){this.btn.style.backgroundColor=e}set textColor(e){this.btn.style.color=e}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(e){this.btn.onclick=e}set onEnter(e){this.btn.onpointerenter=e}set onLeave(e){this.btn.onpointerleave=e}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}asUpper(){this.btn.classList.add("upper")}asMiddle(){this.btn.classList.remove("upper"),this.btn.classList.remove("last")}asLast(){this.btn.classList.add("last")}};window.customElements.define("hover-detector-btn",Qn);var $n=document.createElement("template");$n.innerHTML=`
  <style>
    .number-label {
        display: flex;
        align-items: center;
        font-weight: bold;
        padding-right: 0.45em;
        margin-top: 0.5em;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .number-label {
        margin-top: 0.6em;
        font-size: small;
      }
    }
  </style>
`;var Kn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild($n.content.cloneNode(!0)),this.customHeightDiv=l("div",null),this.customHeightDiv.style.height="1rem",this.shadowRoot.appendChild(this.customHeightDiv)}set height(e){this.customHeightDiv.style.height=`${e}rem`}};window.customElements.define("space-height",Kn);var Zn=document.createElement("template");Zn.innerHTML=`
  <style>
    .slider {
      -webkit-appearance: none;
      height: 0.6rem;
      background: var(--pinky-darker);
      outline: none;
      opacity: 0.7;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      border-radius: 100vh;
      width: 100%;
    }
    .slider:hover {
      opacity: 1;
    }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 0.8rem;
      height: 0.8rem;
      background: var(--blues-hover);
      opacity: 0.7;
      cursor: pointer;
      border-radius: 100vh;
    }
    .slider::-moz-range-thumb {
      width: 0.8rem;
      height: 0.8rem;
      background: var(--blues-hover);
      opacity: 0.7;
      cursor: pointer;
      border-radius: 100vh;
    }
    .slider-label {
      margin-top: 1em;
      margin-bottom: 0.3em;
      padding-left: 0em;
      font-weight: bold;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .slider-label {
        font-weight: bold;
        margin-top: 0.5em;
        margin-bottom: 0rem;
        font-size: small;
      }
      .slider {
        height: 0.4rem;
      }
      .slider::-webkit-slider-thumb {
        width: 0.55rem;
        height: 0.55rem;
      }
      .slider::-moz-range-thumb {
        width: 0.55rem;
        height: 0.55rem;
      }
    }
  </style>
`;var An=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Zn.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",null,l("p",{className:"slider-label"},l("slot",null)),l("input",{id:"slider",type:"range",className:"slider"})))}get slider(){return this.shadowRoot.querySelector("#slider")}set min(e){this.slider.min=e}set max(e){this.slider.max=e}set step(e){this.slider.step=e}set value(e){this.slider.value=e}set onChange(e){this.slider.onchange=t=>e(t.target.valueAsNumber),this.slider.oninput=t=>e(t.target.valueAsNumber)}};window.customElements.define("range-slider",An);var es=document.createElement("template");es.innerHTML=`
  <style>
    .picker-label {
        display: flex;
        align-items: center;
        font-weight: bold;
        padding-right: 0.45em;
        margin-top: 1.3em;
    }
    #colorWell {
        margin-left: 0.5rem;
        border-radius: 100vh;
        background-color: var(--turquoise);
        border: none;
        height: 1rem;
        cursor: pointer;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .picker-label {
        margin-top: 0.6em;
        font-size: small;
      }
      #colorWell {
        height: 1em;
      }
    }
  </style>
`;var ts=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(es.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",null,l("label",{htmlFor:"colorWell",className:"picker-label"},l("div",null,l("slot",null)),l("input",{type:"color",id:"colorWell"}))))}get picker(){return this.shadowRoot.querySelector("#colorWell")}set value(e){this.picker.value=e,this.picker.style["background-color"]=e}set onChange(e){let t=s=>{e(s.target.value),this.picker.style["background-color"]=s.target.value};this.picker.onchange=t,this.picker.oninput=t}};window.customElements.define("color-picker",ts);var He=35,wt=.5,kt=1.5,Mt=Bn,ns=document.createElement("div"),Lo={name:"Ball",description:"",element:ns,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black",n.mouseDown?(t.beginPath(),t.arc(n.lastX,n.lastY,He,0,2*Math.PI),t.stroke()):(t.beginPath(),t.arc(n.mouseX,n.mouseY,He,0,2*Math.PI),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new y(P.Circle(He,new i(n.lastX,n.lastY)),1,wt,kt);e.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),e.style=Mt,Number.isFinite(e.pos.x)&&Number.isFinite(e.pos.y)&&Number.isFinite(e.vel.x)&&Number.isFinite(e.vel.y)||(e.vel.x=0,e.vel.y=0),n.physics.addBody(e)}}};ns.append(l("range-slider",{min:5,max:120,step:1,value:He,onChange:n=>{He=n}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:wt,onChange:n=>{wt=n}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:kt,onChange:n=>{kt=n}},"Coefficient of friction"),l("color-picker",{value:Mt,onChange:n=>{Mt=n}},"Color:"));var ss=Lo;var Yo=document.createElement("div"),Do={name:"Rectangle wall",description:"",element:Yo,drawFunc(n,e){if(n.lastX!==0&&n.lastY!==0){let t=n.cnv.getContext("2d");t.strokeStyle="black",t.strokeRect(n.mouseX,n.mouseY,n.lastX-n.mouseX,n.lastY-n.mouseY)}},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){if(Math.abs(n.lastX-n.mouseX)<5&&Math.abs(n.lastY-n.mouseY)<5)return;n.physics.addRectWall(n.lastX/2+n.mouseX/2,n.lastY/2+n.mouseY/2,2*Math.abs(n.lastX/2-n.mouseX/2),2*Math.abs(n.lastY/2-n.mouseY/2));let e=n;e.physics.bodies[e.physics.bodies.length-1].style=w.Beige}}},os=Do;var St=.2,Pt=.5,It=R,is=document.createElement("div"),zo={name:"Rectangle body",description:"",element:is,drawFunc(n,e){let t=n.cnv.getContext("2d");n.lastX!==0&&n.lastY!==0&&(t.strokeStyle="black",t.strokeRect(n.mouseX,n.mouseY,n.lastX-n.mouseX,n.lastY-n.mouseY))},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=Math.abs(n.mouseX-n.lastX),t=Math.abs(n.mouseY-n.lastY);if(e/t>50||t/e>50||t===0||e===0)return;n.physics.addRectBody(n.lastX/2+n.mouseX/2,n.lastY/2+n.mouseY/2,2*Math.abs(n.lastX/2-n.mouseX/2),2*Math.abs(n.lastY/2-n.mouseY/2),Pt,St,It)}},keyGotUpFunc(n){},keyGotDownFunc(n){}};is.append(l("range-slider",{min:0,max:.6,step:.02,value:St,onChange:n=>{St=n}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:Pt,onChange:n=>{Pt=n}},"Coefficient of friction"),l("color-picker",{value:It,onChange:n=>{It=n}},"Color:"));var as=zo;var st=35,Ct=.5,Et=.5,ot=4,it=24,Bt=R,rs=document.createElement("div");function cs(n=24,e=4){return[...new Array(n).keys()].map(t=>i.fromAnglePNorm(Math.PI*2*t/n,e))}var No={name:"Squircle",description:"",element:rs,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=cs(it,ot);if(s.forEach(o=>o.mult(st)),n.mouseDown){t.beginPath(),t.moveTo(n.lastX+s[0].x,n.lastY+s[0].y);for(let o=1;o<s.length;o+=1)t.lineTo(n.lastX+s[o].x,n.lastY+s[o].y);t.closePath(),t.stroke()}else{t.beginPath(),t.moveTo(n.mouseX+s[0].x,n.mouseY+s[0].y);for(let o=1;o<s.length;o+=1)t.lineTo(n.mouseX+s[o].x,n.mouseY+s[o].y);t.closePath(),t.stroke()}n.mouseDown&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){let e=cs(it,ot),t=new i(n.lastX,n.lastY);if(e.forEach(s=>{s.mult(st),s.add(t)}),n.lastX!==0&&n.lastY!==0){let s=new y(P.Polygon(e),1,Ct,Et);s.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),s.style=Bt,n.physics.addBody(s)}}};rs.append(l("range-slider",{min:5,max:120,step:1,value:st,onChange:n=>{st=n}},"Size"),l("range-slider",{min:2,max:7,step:1,value:9-ot,onChange:n=>{ot=9-n}},"Roundness"),l("range-slider",{min:12,max:36,step:1,value:it,onChange:n=>{it=n}},"Resolution"),l("range-slider",{min:0,max:.9,step:.02,value:Ct,onChange:n=>{Ct=n}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:Et,onChange:n=>{Et=n}},"Coefficient of friction"),l("color-picker",{value:Bt,onChange:n=>{Bt=n}},"Color:"));var ls=No;var $=35;var Tt=1.5,Rt=24,Ft=1,hs=document.createElement("div"),jo={name:"Soft square",description:"",element:hs,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black",n.mouseDown?t.strokeRect(n.lastX-$,n.lastY-$,$*2,$*2):t.strokeRect(n.mouseX-$,n.mouseY-$,$*2,$*2),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){n.lastX!==0&&n.lastY!==0&&n.physics.addSoftSquare(new i(n.lastX,n.lastY),$*2,Tt,new i(n.lastX-n.mouseX,n.lastY-n.mouseY),Rt,Ft)}};hs.append(l("range-slider",{min:5,max:100,step:1,value:$,onChange:n=>{$=n}},"Size"),l("range-slider",{min:.4,max:3,step:.1,value:Ft,onChange:n=>{Ft=n}},"Pressure"),l("range-slider",{min:0,max:2,step:.1,value:Tt,onChange:n=>{Tt=n}},"Coefficient of friction"),l("range-slider",{min:16,max:48,step:8,value:Rt,onChange:n=>{Rt=n}},"Resolution"));var ds=jo;var at=20,ms=document.createElement("div"),Ho={name:"Wall drawer",description:"",element:ms,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black",t.beginPath(),t.arc(n.mouseX,n.mouseY,at,0,2*Math.PI),t.stroke(),n.lastX!==0&&n.lastY!==0&&n.physics.addFixedBall(n.mouseX,n.mouseY,at)}};ms.append(l("range-slider",{min:5,max:70,step:1,value:at,onChange:n=>{at=n}},"Size"));var us=Ho;var Ot=45,Xt=.2,Lt=1.5,Yt=R,fs=document.createElement("div");function Dt(n){let e=n;return n===void 0&&(e=new i(0,0)),P.Polygon([...new Array(3).keys()].map(t=>{let s=2*Math.PI*t/3,o=i.fromAngle(s);return o.rotate(-(Math.PI*7)/6),o.mult(Ot),o.add(e),o}))}var Vo={name:"Triangle",description:"",element:fs,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),Dt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),Dt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y(Dt(e),1,Xt,Lt);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=Yt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};fs.append(l("range-slider",{min:5,max:120,step:1,value:Ot,onChange:n=>{Ot=n}},"Size"),l("range-slider",{min:0,max:.35,step:.02,value:Xt,onChange:n=>{Xt=n}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:Lt,onChange:n=>{Lt=n}},"Coefficient of friction"),l("color-picker",{value:Yt,onChange:n=>{Yt=n}},"Color:"));var ps=Vo;var zt=45,Nt=.2,jt=1.5,Ht=R,gs=document.createElement("div");function Vt(n){let e=n;return n===void 0&&(e=new i(0,0)),P.Polygon([...new Array(5).keys()].map(t=>{let s=2*Math.PI*t/5,o=i.fromAngle(s);return o.rotate(-Math.PI/10),o.mult(zt),o.add(e),o}))}var qo={name:"Pentagon",description:"",element:gs,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),Vt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),Vt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y(Vt(e),1,Nt,jt);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=Ht,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};gs.append(l("range-slider",{min:5,max:120,step:1,value:zt,onChange:n=>{zt=n}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:Nt,onChange:n=>{Nt=n}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:jt,onChange:n=>{jt=n}},"Coefficient of friction"),l("color-picker",{value:Ht,onChange:n=>{Ht=n}},"Color:"));var bs=qo;var qt=45,Wt=.2,Ut=1.5,Gt=R,ys=document.createElement("div");function _t(n){let e=n;return n===void 0&&(e=new i(0,0)),P.Polygon([...new Array(6).keys()].map(t=>{let s=2*Math.PI*t/6,o=i.fromAngle(s);return o.mult(qt),o.add(e),o}))}var Wo={name:"Hexagon",description:"",element:ys,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),_t(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),_t(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y(_t(e),1,Wt,Ut);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=Gt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};ys.append(l("range-slider",{min:5,max:120,step:1,value:qt,onChange:n=>{qt=n}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:Wt,onChange:n=>{Wt=n}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:Ut,onChange:n=>{Ut=n}},"Coefficient of friction"),l("color-picker",{value:Gt,onChange:n=>{Gt=n}},"Color:"));var xs=Wo;var Jt=45,Qt=.2,$t=1.5,Kt=R,vs=document.createElement("div");function Zt(n){let e=n;return n===void 0&&(e=new i(0,0)),P.Polygon([...new Array(8).keys()].map(t=>{let s=2*Math.PI*t/8,o=i.fromAngle(s);return o.mult(Jt),o.add(e),o}))}var Uo={name:"Octagon",description:"",element:vs,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),Zt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),Zt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y(Zt(e),1,Qt,$t);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=Kt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};vs.append(l("range-slider",{min:5,max:120,step:1,value:Jt,onChange:n=>{Jt=n}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:Qt,onChange:n=>{Qt=n}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:$t,onChange:n=>{$t=n}},"Coefficient of friction"),l("color-picker",{value:Kt,onChange:n=>{Kt=n}},"Color:"));var ws=Uo;var rt=45,At=.2,en=1.5,tn=R,ks=document.createElement("div");function nn(n){let e=n;n===void 0&&(e=new i(0,0));let t=P.Polygon([...new Array(11).keys()].map(s=>{let o=Math.PI*s/11,a=i.fromAngle(o);return a.mult(rt),a.add(e),a}));return t.points.push(new i(-rt+e.x,e.y)),t}var Go={name:"Half circle",description:"",element:ks,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),nn(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),nn(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y(nn(e),1,At,en);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=tn,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};ks.append(l("range-slider",{min:5,max:120,step:1,value:rt,onChange:n=>{rt=n}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:At,onChange:n=>{At=n}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:en,onChange:n=>{en=n}},"Coefficient of friction"),l("color-picker",{value:tn,onChange:n=>{tn=n}},"Color:"));var Ms=Go;var sn=.2,on=1.5,an=R,Ss=document.createElement("div"),G=[],_o={name:"Draw convex shape",description:"",element:Ss,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown&&(G.some(o=>o.x===s.x&&o.y===s.y)||G.push(s),G.length>3&&(G=P.Polygon(G).getConvexHull().points)),t.beginPath(),G.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()},startInteractionFunc(n){},endInteractionFunc(n){if(G.length>3)G=P.Polygon(G).getConvexHull().points;else{G=[];return}if(n.lastX!==0&&n.lastY!==0){let e=new y(P.Polygon(G),1,sn,on),s=[...new Array(100).keys()].map(o=>i.fromAngle(2*Math.PI*o/100)).map(o=>e.shape.getMinMaxInDirection(o).size());if(Math.max(...s)/Math.min(...s)>15){G=[];return}e.style=an,Number.isFinite(e.pos.x)&&Number.isFinite(e.pos.y)&&Number.isFinite(e.vel.x)&&Number.isFinite(e.vel.y)||(e.vel.x=0,e.vel.y=0),n.physics.addBody(e)}G=[]}};Ss.append(l("range-slider",{min:0,max:.35,step:.02,value:sn,onChange:n=>{sn=n}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:on,onChange:n=>{on=n}},"Coefficient of friction"),l("color-picker",{value:an,onChange:n=>{an=n}},"Color:"));var Ps=_o;var we=[ss,as,os,us,Ps,ls,ds,Ms,ps,bs,xs,ws],V=we[0],Is=document.createElement("div"),rn=l("div",{className:"full-width"}),Cs;function Jo(){return we.indexOf(V)}function Es(n,e){var s;let t=e;(s=V.deactivated)==null||s.call(V,Cs),t[Jo()].bgColor=w.Independence,t[n].bgColor=w.pinkDarker,rn.innerHTML="",rn.appendChild(we[n].element),V=we[n]}var Ve=we.map((n,e)=>l("hover-detector-btn",{onClick:()=>{Es(e,Ve)}},n.name)),Qo={name:"Shapes",description:"",element:Is,drawFunc(n,e){var t;(t=V.drawFunc)==null||t.call(V,n,e)},startInteractionFunc(n){var e;(e=V.startInteractionFunc)==null||e.call(V,n)},endInteractionFunc(n){var e;(e=V.endInteractionFunc)==null||e.call(V,n)},init(n){Cs=n,we.forEach(e=>{var t;return(t=e.init)==null?void 0:t.call(e,n)}),Ve.forEach((e,t)=>{t===0&&e.asUpper(),t===Ve.length-1&&e.asLast()})}};Is.append(l("space-height",{height:1}),...Ve,rn);Es(0,Ve);var Bs=Qo;var cn=!1,qe=!0,ln=new i(0,0),hn=0,ue=1e4,fe=new C(1,ue);fe.attachObject(new y(P.Circle(1,new i(0,0))));var Ts=document.createElement("div");function Rs(n){let{choosed:e}=n,t=new i(n.lastX,n.lastY);if(n.lastX!==0&&n.lastY!==0&&e instanceof y){let s=i.sub(t,ln);return s.rotate(e.rotation-hn),qe&&(s.x=0,s.y=0),s.add(e.pos),s}return t}function $o(n,e){return fe.length=n.dist(e),fe.springConstant=ue,fe.objects[0].pos=n,fe.objects[0].shape.points[0]=n,fe.pinHere(e.x,e.y),fe}var Ko={name:"Spring creator",description:"",element:Ts,drawFunc(n,e){let t=n.cnv.getContext("2d");if(t.save(),n.lastX!==0&&n.lastY!==0){t.fillStyle="#00000000",t.strokeStyle="#FFFFFF";let o=Rs(n),a=new i(n.mouseX,n.mouseY),r=$o(o,a);n.renderer.renderSpring(r,t)}let s=n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY);s instanceof y&&(t.globalAlpha=.6,t.fillStyle="#00000000",t.strokeStyle="#FFFFFF",t.lineWidth=3,n.renderer.renderBody(s,t)),t.restore()},startInteractionFunc(n){n.choosed instanceof y?(ln=n.choosed.pos.copy,hn=n.choosed.rotation):typeof n.choosed!="boolean"&&(ln=new i(n.choosed.x,n.choosed.y),hn=0)},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY),t,s=Rs(n),o=new i(n.mouseX,n.mouseY);n.choosed instanceof y&&qe&&(s=n.choosed.pos.copy),e instanceof y&&qe&&(o=e.pos.copy);let a=C;if(typeof e=="boolean"&&(e={x:n.mouseX,y:n.mouseY,pinPoint:!0}),n.choosed===e||n.choosed===void 0&&e===void 0||n.choosed instanceof Object&&e instanceof Object&&"pinPoint"in n.choosed&&"pinPoint"in e||(n.choosed instanceof Object&&e instanceof Object&&"pinPoint"in n.choosed&&"pos"in e?(t=new a(Math.sqrt((n.choosed.x-e.pos.x)**2+(n.choosed.y-e.pos.y)**2),ue),t.attachObject(e,o),t.pinHere(n.choosed.x,n.choosed.y)):e instanceof Object&&n.choosed instanceof Object&&"pos"in n.choosed&&"pinPoint"in e?(t=new a(Math.sqrt((n.choosed.pos.x-e.x)**2+(n.choosed.pos.y-e.y)**2),ue),t.attachObject(n.choosed,s),t.pinHere(e.x,e.y)):n.choosed instanceof Object&&e instanceof Object&&"pos"in n.choosed&&"pos"in e&&(t=new a(Math.sqrt((n.choosed.pos.x-e.pos.x)**2+(n.choosed.pos.y-e.pos.y)**2),ue),t.attachObject(n.choosed,s),t.attachObject(e,o)),typeof t=="undefined"))return;n.physics.addSpring(t),cn&&t.lockRotation()}}};Ts.append(l("check-box",{checked:cn,onChange:n=>{cn=n}},"Lock rotation"),l("check-box",{checked:qe,onChange:n=>{qe=n}},"Snap to center"),l("range-slider",{min:2e3,max:1e5,value:ue,step:200,onChange:n=>{ue=n}},"Spring stiffness"));var Fs=Ko;var dn=!1,We=!0,mn=new i(0,0),un=0,ke=new B(1);ke.attachObject(new y(P.Circle(1,new i(0,0))));var fn=document.createElement("div");function Os(n){let{choosed:e}=n,t=new i(n.lastX,n.lastY);if(n.lastX!==0&&n.lastY!==0&&e instanceof y){let s=i.sub(t,mn);return s.rotate(e.rotation-un),We&&(s.x=0,s.y=0),s.add(e.pos),s}return t}function Zo(n,e){return ke.length=n.dist(e),ke.objects[0].pos=n,ke.objects[0].shape.points[0]=n,ke.pinHere(e.x,e.y),ke}var Ao={name:"Stick creator",description:"",element:fn,drawFunc(n,e){let t=n.cnv.getContext("2d");if(t.save(),n.lastX!==0&&n.lastY!==0){t.fillStyle="#00000000",t.strokeStyle="#FFFFFF";let o=Os(n),a=new i(n.mouseX,n.mouseY),r=Zo(o,a);n.renderer.renderStick(r,t)}let s=n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY);s instanceof y&&(t.globalAlpha=.6,t.fillStyle="#00000000",t.strokeStyle="#FFFFFF",t.lineWidth=3,n.renderer.renderBody(s,t)),t.restore()},startInteractionFunc(n){n.choosed instanceof y?(mn=n.choosed.pos.copy,un=n.choosed.rotation):typeof n.choosed!="boolean"&&(mn=new i(n.choosed.x,n.choosed.y),un=0)},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY),t,s=Os(n),o=new i(n.mouseX,n.mouseY);n.choosed instanceof y&&We&&(s=n.choosed.pos.copy),e instanceof y&&We&&(o=e.pos.copy);let a=B;if(typeof e=="boolean"&&(e={x:n.mouseX,y:n.mouseY,pinPoint:!0}),typeof n.choosed=="boolean"||n.choosed===e||n.choosed===void 0&&e===void 0||"pinPoint"in n.choosed&&"pinPoint"in e||("pinPoint"in n.choosed&&"pos"in e?(t=new a(Math.sqrt((n.choosed.x-e.pos.x)**2+(n.choosed.y-e.pos.y)**2)),t.attachObject(e,o),t.pinHere(n.choosed.x,n.choosed.y)):"pinPoint"in e&&"pos"in n.choosed?(t=new a(Math.sqrt((n.choosed.pos.x-e.x)**2+(n.choosed.pos.y-e.y)**2)),t.attachObject(n.choosed,s),t.pinHere(e.x,e.y)):"pos"in n.choosed&&"pos"in e&&(t=new a(Math.sqrt((n.choosed.pos.x-e.pos.x)**2+(n.choosed.pos.y-e.pos.y)**2)),t.attachObject(n.choosed,s),t.attachObject(e,o)),typeof t=="undefined"))return;n.physics.addSpring(t),dn&&t.lockRotation()}},keyGotUpFunc(n){},keyGotDownFunc(n){}};[l("check-box",{checked:dn,onChange:n=>{dn=n}},"Lock rotation"),l("check-box",{checked:We,onChange:n=>{We=n}},"Snap to center")].forEach(fn.appendChild.bind(fn));var Xs=Ao;var Ls=document.createElement("template");Ls.innerHTML=`
  <style>
    .number {
      display: block;
      height: 0.6rem;
      background: var(--independence);
      outline: none;
      opacity: 0.7;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      border-bottom-right-radius: 0.3rem;
      border-bottom-left-radius: 0.3rem;
      padding: 0px;
      padding-top: 0.15rem;
      padding-bottom: 0.15rem;
      border: 0px;
      margin-left: 2px;
      margin-right: 2px;
      text-align: center;
      width: 100%;
      color: white;
    }
    .disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    .number:hover {
      opacity: 1;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    .slider {
      -webkit-appearance: none;
      height: 0.6rem;
      background: var(--pinky-darker);
      outline: none;
      opacity: 0.7;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      border-top-left-radius: 0.3rem;
      border-top-right-radius: 0.3rem;
      width: 100%;
      margin-bottom: 0px;
      display: block;
    }
    .slider:hover {
      opacity: 1;
    }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 0.8rem;
      height: 0.8rem;
      background: var(--blues-hover);
      opacity: 0.7;
      cursor: pointer;
      border-radius: 100vh;
    }
    .slider::-moz-range-thumb {
      width: 0.8rem;
      height: 0.8rem;
      background: var(--blues-hover);
      opacity: 0.7;
      cursor: pointer;
      border-radius: 100vh;
    }
    .slider-label {
      margin-top: 1em;
      margin-bottom: 0.3em;
      padding-left: 0em;
      font-weight: bold;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .slider-label {
        font-weight: bold;
        margin-top: 0.5em;
        margin-bottom: 0rem;
        font-size: small;
      }
      .slider {
        height: 0.4rem;
      }
      .slider::-webkit-slider-thumb {
        width: 0.55rem;
        height: 0.55rem;
      }
      .slider::-moz-range-thumb {
        width: 0.55rem;
        height: 0.55rem;
      }
    }
  </style>
`;var Ys=class extends HTMLElement{constructor(){super();this.minNum=0,this.maxNum=0,this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Ls.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{id:"mainContainer"},l("p",{className:"slider-label"},l("slot",null)),l("input",{id:"slider",type:"range",className:"slider"}),l("input",{id:"number-input",type:"number",className:"number"})))}get slider(){return this.shadowRoot.querySelector("#slider")}get numInput(){return this.shadowRoot.querySelector("#number-input")}set min(e){this.slider.min=e,this.numInput.min=e,this.minNum=e}set max(e){this.slider.max=e,this.numInput.max=e,this.maxNum=e}set step(e){this.slider.step=e,this.numInput.step=e}set value(e){this.slider.value=e,this.numInput.value=e}normalizeValue(e){return Math.min(Math.max(this.minNum,e),this.maxNum)}disable(){this.shadowRoot.querySelector("#mainContainer").classList.add("disabled")}enable(){this.shadowRoot.querySelector("#mainContainer").classList.remove("disabled")}set onChange(e){this.slider.onchange=t=>{let s=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(s)),this.value=s},this.slider.oninput=t=>{let s=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(s)),this.value=s},this.numInput.onchange=t=>{let s=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(s)),this.value=s}}};window.customElements.define("range-slider-number",Ys);var ei=document.createElement("div"),ti={name:"World settings",description:"",element:ei,init(n){let e=n;this.element.append(l("range-slider",{min:0,max:5e3,step:200,value:e.physics.gravity.y,onChange:t=>{e.physics.gravity.y=t}},"Gravity"),l("range-slider",{min:-5e3,max:5e3,step:1e3,value:e.physics.gravity.x,onChange:t=>{e.physics.gravity.x=t}},"Gravity in X direction"),l("range-slider",{min:0,max:.99,step:.01,value:1-e.physics.airFriction,onChange:t=>{e.physics.setAirFriction(1-t)}},"Air friction"),l("range-slider-number",{min:700,max:1e4,step:10,value:e.worldSize.width,onChange:t=>{e.setWorldSize({width:t,height:e.worldSize.height})}},"World width"),l("range-slider-number",{min:700,max:5e3,step:10,value:e.worldSize.height,onChange:t=>{e.setWorldSize({width:e.worldSize.width,height:t})}},"World height"),l("check-box",{checked:e.drawCollisions,onChange:t=>{e.drawCollisions=t}},"Show collision data"),l("check-box",{checked:e.showAxes,onChange:t=>{e.showAxes=t}},"Show body axes"),l("check-box",{checked:e.showBoundingBoxes,onChange:t=>{e.showBoundingBoxes=t}},"Show boounding boxes"),l("check-box",{checked:e.showVelocities,onChange:t=>{e.showVelocities=t}},"Show velocities"))}},Ds=ti;var zs=document.createElement("template");zs.innerHTML=`
  <style>
    .number-label {
        display: flex;
        align-items: center;
        font-weight: bold;
        padding-right: 0.45em;
        margin-top: 0.5em;
    }
    #indicatorContainer {
        display: inline-block;
        width: 1em;
        height: 1em;
        background: var(--pinky-darker);
        border-radius: 100vh;
        align-text: center;
    }
    #rotationIndicator {
        transform: translateY(0.1em) rotate(0deg);
        position: relative;
        width: 0.8em;
        border-top: 0.1em solid white;
        border-bottom: 0.1em solid white;
        border-right: 0.2em solid black;
    }
    .hidden {
      display: none;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .number-label {
        margin-top: 0.6em;
        font-size: small;
      }
    }
  </style>
`;var Ns=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(zs.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"number-label"},l("span",null,l("slot",null)),l("div",{id:"indicatorContainer"},l("hr",{id:"rotationIndicator"})),l("span",null,"\xA0"),l("span",{id:"numberPlace"}),l("span",{id:"symbolPlace"},"\xB0")))}set value(e){let t=e*180/Math.PI%360;this.shadowRoot.querySelector("#numberPlace").innerText=Math.abs(t).toFixed(),this.shadowRoot.querySelector("#rotationIndicator").style.transform=`translateY(-0.1em) rotate(${t}deg)`}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}hideNumber(){this.shadowRoot.querySelector("#numberPlace").classList.add("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.add("hidden")}showNumber(){this.shadowRoot.querySelector("#numberPlace").classList.remove("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.remove("hidden")}};window.customElements.define("angle-display",Ns);var js=document.createElement("template");js.innerHTML=`
  <style>
    #btn {
        background-color: var(--independence);
        border: none;
        color: white;
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        text-align: center;
        text-decoration: none;
        display: block;
        font-size: medium;
        border-radius: 0.4em;
        margin-top: 1em;
        box-shadow: 3px 3px 3px black;
        -webkit-transition: 0.2s;
        transition: opacity 0.2s;
        width: 100%;
        opacity: 0.8;
        cursor: pointer;
    }
    #btn:hover {
        opacity: 1;
    }
    .hidden {
      display: none !important;
    }
    /* For tablets */
    @media (max-width: 768px) {
        #btn {
            width: 100%;
        }
    }
    /* For smaller laptops */
    @media (max-width: 1125px) {
        #btn {
            padding-top: 0.12em;
            padding-bottom: 0.12em;
            font-size: small;
        }
    }
  </style>
`;var Hs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(js.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{id:"btn"},l("slot",null))),this.hidden=!1}set bgColor(e){this.btn.style.backgroundColor=e}set textColor(e){this.btn.style.color=e}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(e){this.btn.onclick=e}smallMargin(){this.btn.style.marginTop="0.2em"}set decreasedMargin(e){e&&(this.btn.style.marginTop="0.2em")}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}};window.customElements.define("button-btn",Hs);var Vs=document.createElement("template");Vs.innerHTML=`
  <style>
    #inputEl {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
      cursor: pointer;
    }
    #inputLabel {
      background-color: var(--independence);
      border: none;
      color: white;
      padding-left: 0px;
      padding-right: 0px;
      padding-top: 0.2em;
      padding-bottom: 0.2em;
      text-align: center;
      text-decoration: none;
      display: block;
      font-size: medium;
      border-radius: 0.4em;
      box-shadow: var(--blacky);
      margin-top: 0.2em;
      box-shadow: 3px 3px 3px black;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      width: 100%;
      opacity: 0.8;
      cursor: pointer;
    }
    #inputLabel:hover {
      opacity: 1;
    }
    #inputLabel:focus {
      background-color: var(--pinky-darker);
    }
    /* For tablets */
    @media (max-width: 768px) {
      #inputLabel {
        font-size: small;
      }
    }
  </style>
`;var qs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Vs.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",null,l("input",{type:"file",id:"inputEl",name:"inputEl"}),l("label",{id:"inputLabel",htmlFor:"inputEl"},l("slot",null))))}get input(){return this.shadowRoot.getElementById("inputEl")}set accept(e){this.input.accept=e}set onFile(e){let t=s=>{s.target.files.length!==0&&e(s.target.files[0])};this.input.onchange=t}};window.customElements.define("file-input",qs);var Ws=document.createElement("template");Ws.innerHTML=`
  <style>
    .btn {
        border: none;
        color: white;
        padding-left: 0.2em;
        padding-right: 0.2em;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        text-align: center;
        text-decoration: none;
        font-size: medium;
        border-radius: 0.4em;
        box-shadow: var(--blacky);
        margin-top: 0.3em;
        -webkit-transition: 0.2s;
        transition: opacity 0.2s;
        opacity: 0.8;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    #cancel {
      background-color: var(--imperial-red);
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
    #apply {
      background-color: var(--greeny-hover);
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .btn:hover {
        opacity: 1;
    }
    #container {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        box-shadow: 3px 3px 3px black;
        cursor: pointer;
    }
    .small-size {
      font-size: small !important;
      padding-top: 0.12em;
      padding-bottom: 0.12em;
    }
    /* For tablets */
    @media (max-width: 768px) {
    }
    /* For smaller laptops */
    @media (max-width: 1125px) {
        .btn {
            padding-top: 0.12em;
            padding-bottom: 0.12em;
            font-size: small;
        }
    }
  </style>
`;var Us=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Ws.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{id:"container"},l("div",{id:"apply",className:"btn"},"Apply"),l("div",{id:"cancel",className:"btn"},"Cancel")))}set visible(e){if(e){let t=this.containerElement;t.style.display!=="flex"&&(t.style.display="flex")}else{let t=this.containerElement;t.style.display!=="none"&&(t.style.display="none")}}get containerElement(){return this.shadowRoot.getElementById("container")}get applyBtn(){return this.shadowRoot.getElementById("apply")}get cancelBtn(){return this.shadowRoot.getElementById("cancel")}set onApply(e){this.applyBtn.onclick=e}set onCancel(e){this.cancelBtn.onclick=e}set applyText(e){this.applyBtn.innerText=e}set cancelText(e){this.cancelBtn.innerText=e}set width(e){this.containerElement.style.width=e}set small(e){e?(this.applyBtn.classList.add("small-size"),this.cancelBtn.classList.add("small-size")):(this.applyBtn.classList.remove("small-size"),this.cancelBtn.classList.remove("small-size"))}};window.customElements.define("apply-cancel",Us);var Gs=document.createElement("template");Gs.innerHTML=`
  <style>
    ul, div {
        list-style: none;
        margin: 0;
        padding-left: 0;
    }
    ul {
        background: #00000000;
        width: 100%;
    }
    div {
        background: var(--independence);
        display: block;
        position: relative;
        z-index: 5;
        box-shadow: 3px 3px 3px black;
        margin-top: 0.2rem;
        margin-bottom: 0.4rem;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        border-radius: 0.4em;
        transition: background 0.2s ease, opacity 0.2s ease;
        text-align: center;
        width: 100%;
        opacity: 0.8;
    }
    div:hover {
        background: var(--blacky-hover);
        opacity: 1;
    }
    li {
        color: #fff;
        background: var(--independence);
        display: block;
        float: left;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        position: relative;
        width: 100%;
        text-decoration: none;
        transition-duration: 0.5s;
    }
    li:hover,
    li:focus-within {
        background: var(--pinky);
        cursor: pointer;
    }
    li:focus-within a {
        outline: none;
    }
    div ul {
        background: var(--independence);
        visibility: hidden;
        opacity: 0;
        min-width: 5rem;
        position: absolute;
        transition: all 0.5s ease;
        margin-top: 0rem;
        left: 0;
        display: none;
        border-bottom-left-radius: 0.4em;
        border-bottom-right-radius: 0.4em;
    }
    div:hover > ul,
    div:focus-within > ul,
    div ul:hover,
    div ul:focus {
        visibility: visible;
        opacity: 1;
        display: block
    }
    div ul li {
        clear: both;
        width: 100%;
        border-radius: 0.4em;
    }
    .hidden {
        visibility: hidden !important;
    }
    .chosen {
        background: var(--pinky-darker) !important;
    }
    /* For tablets */
    @media (max-width: 768px) {
        div {
          font-size: small;
        }
    }
  </style>
`;var _s=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Gs.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",null,l("span",null,l("slot",null)),l("ul",{id:"listHolder",className:"dropdown"})))}set entries(e){this.entryList=e;let{listHolder:t}=this;t.innerHTML="",t.append(...this.entryList.map(s=>l("li",{innerText:s})))}set value(e){this.listHolder.childNodes.forEach(t=>{"classList"in t&&(t.innerText===e?t.classList.add("chosen"):t.classList.remove("chosen"))})}get listHolder(){return this.shadowRoot.getElementById("listHolder")}set onChoice(e){let t=o=>{e(o.target.innerText),this.listHolder.classList.add("hidden"),this.listHolder.childNodes.forEach(a=>{"classList"in a&&(a.innerText===o.target.innerText?a.classList.add("chosen"):a.classList.remove("chosen"))}),setTimeout(()=>{this.listHolder.classList.remove("hidden")},20)},s=this.listHolder;this.listHolder.childNodes.forEach(o=>{let a=o.cloneNode(!0);a.addEventListener("click",t),s.replaceChild(a,o)})}};window.customElements.define("drop-down",_s);var Js=document.createElement("template");Js.innerHTML=`
  <style>
    .container {
        width: 100%;
        display: block;
        margin-top: 1.3em;
    }
    label {
        display: block;
        width: 100%;
        border-radius: 0.3em;
        background-color: var(--independence);
        cursor: pointer;
        padding: 0.2em 0px;
        color: #BBBBBB;
        text-align: center;
        transform: color 0.2 ease, border-radius 0.25s ease-in;
    }
    .toggle:hover {
        color: #FEFEFE;
    }
    .toggle::before {
        content: ' ';
        display: inline-block;
        border-top: 0.25em solid transparent;
        border-bottom: 0.25em solid transparent;
        border-left: 0.25em solid currentColor;
        vertical-align: middle;
        margin-right: 0.45em;
        transform: translateY(-0.1em);
        transition: transform 0.2s ease-out;
    }
    input[type='checkbox'] {
        display: none;
    }
    input[type='checkbox']:checked + .toggle::before {
        transform: rotate(90deg) translateX(-3px);
    }
    input[type='checkbox']:checked + .toggle{
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
    }
    input[type='checkbox']:checked + .toggle + .toClose {
        display: block;
    }
    .toClose {
        border-bottom-left-radius: 0.3rem;
        border-bottom-right-radius: 0.3rem;
        margin: 0px;
        overflow: hidden;
        display: none;
    }
    /* For tablets */
    @media (max-width: 768px) {
    }
    /* For smaller laptops */
    @media (max-width: 1125px) {
        .toggle {
            padding-top: 0.12em;
            padding-bottom: 0.12em;
            font-size: small;
        }
    }
  </style>
`;var Qs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Js.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"container"},l("input",{id:"collapsible",className:"toggle",type:"checkbox",checked:!0}),l("label",{htmlFor:"collapsible",className:"toggle",id:"toggleEl"},"More"),l("div",{className:"toClose"},l("slot",null))))}get input(){return this.shadowRoot.getElementById("collapsible")}set title(e){this.shadowRoot.querySelector("#toggleEl").innerText=e}collapse(){this.input.checked=!1}open(){this.input.checked=!0}set closed(e){this.input.checked=!e}};window.customElements.define("collapsible-element",Qs);var ni="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAyklEQVQ4T6XST0qCQRjH8Y8JBnoCr9DGjXQBEbqDm6QQgvZeoX0bQVy7cRtBeIPcewi3bYLKeF6mmAZBeZvN8Pz5PvOb53ka/p4mHnGDVgp9YIVrvCdft5FxV3guCpXmBD1sfsAhXrKseOUVcV/ivKgwDvAMn1ngFosisVRTgQ+YpsQ7zA7IjX/fZ/4KfEMHX4jmlKePUeFcBrhPzi0ujjTnN/wv8JjUXMQO7fjWqc0JeIB1qvJUdxydOgtQjazOys1Dbg6GfeqS+wZwAS6Pac4meQAAAABJRU5ErkJggg==') 6.5 6.5, auto",pe=ni;var ce=7,le=6.5,pn=8,gn=25,Me=7,$s=8,ct=7,Ks=7,bn=23,Se=30,Zs=4,m=!1,Pe=!1,Ie=!1,S=!1,ge=!1,he=!1,be=document.createElement("div"),j,_=!1,ye=1,I=new i(0,0),Ce=0,Ue="repeat",K=0,L=1,Ee={body:!0,spring:!0};function lt(n){be.innerHTML="",_=!1;let e=l("collapsible-element",{title:"Bodies",closed:!0}),t=[];for(let a=Zs;a<n.physics.bodies.length;a+=1){let r=n.physics.bodies[a],h=a-Zs,c=l("hover-detector-btn",{bgColor:w.pinkDarker},`Body #${h}`);c.onClick=()=>{Pe=r,Ie=!1},c.onEnter=()=>{Ie=r},c.onLeave=()=>{Ie===r&&(Ie=!1)},a===n.physics.bodies.length-1&&c.asLast(),t.push(c)}e.append(...t);let s=l("collapsible-element",{title:"Sticks/Springs",closed:!0}),o=[];for(let a=0;a<n.physics.springs.length;a+=1){let r=n.physics.springs[a],h=r instanceof B?"Stick":"Spring",c=l("hover-detector-btn",{bgColor:w.pinkDarker},`${h} #${a}`);c.onClick=()=>{ge=r,he=!1},c.onEnter=()=>{he=r},c.onLeave=()=>{he===r&&(he=!1)},a===n.physics.bodies.length-1&&c.asLast(),o.push(c)}s.append(...o),be.append(l("number-display",{value:""},"Selectable types:"),l("check-box",{checked:Ee.body,onChange:a=>{Ee.body=a}},"Body"),l("check-box",{checked:Ee.spring,onChange:a=>{Ee.spring=a}},"Stick/Spring"),e,s)}var D="none";function As(n){if(Pe instanceof y){let e=Pe;return Pe=!1,e}return ge instanceof C||!Ee.body?!1:n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY,4)}function ht(n){if(Pe instanceof y||ge instanceof C)return"none";if(typeof _!="boolean"){let e=new i(n.mouseX,n.mouseY);return I.dist(e)<=$s?"move-texture":new i(I.x,I.y-bn).dist(e)<=ct?"rotate-texture":new i(I.x+Se,I.y+Se).dist(e)<=Ks?"scale-texture-xy":"choose-texture"}if(n.timeMultiplier!==0&&!(m instanceof y&&m.m===0))return"none";if(m instanceof y){let e=m.boundingBox,t=new i(e.x.min,e.y.min),s=new i(e.x.max,e.y.min),o=new i(e.x.min,e.y.max),a=new i(e.x.max,e.y.max),r=i.add(i.lerp(s,t,.5),new i(0,-gn)),h=new i(n.mouseX,n.mouseY);if(i.dist(r,h)<=pn)return"rotate";if(i.dist(o,h)<=ce)return"resize-bl";if(i.dist(a,h)<=ce)return"resize-br";if(i.dist(t,h)<=ce)return"resize-tl";if(i.dist(s,h)<=ce)return"resize-tr";if(i.dist(i.lerp(s,t,.5),h)<=le)return"resize-t";if(i.dist(i.lerp(a,o,.5),h)<=le)return"resize-b";if(i.dist(i.lerp(t,o,.5),h)<=le)return"resize-l";if(i.dist(i.lerp(s,a,.5),h)<=le)return"resize-r";if(h.x>=t.x&&h.y>=t.y&&h.x<=a.x&&h.y<=a.y)return"move"}else if(typeof S!="boolean"){let e=S.points,t=new i(n.mouseX,n.mouseY);if(e[0].dist(t)<=Me)return"move-spring0";if(e[1].dist(t)<=Me)return"move-spring1"}return"none"}function si(n){if(!(m instanceof y))return;let e=m.boundingBox,t=new i(e.x.min,e.y.min),s=new i(e.x.max,e.y.min),o=new i(e.x.min,e.y.max),a=new i(e.x.max,e.y.max);L=1,n==="rotate"&&(K=m.rotation),n==="resize-bl"&&(K=i.sub(o,s).heading),n==="resize-br"&&(K=i.sub(a,t).heading),n==="resize-tl"&&(K=i.sub(t,a).heading),n==="resize-tr"&&(K=i.sub(s,o).heading),n==="resize-t"&&(K=new i(0,-1).heading),n==="resize-b"&&(K=new i(0,1).heading),n==="resize-l"&&(K=new i(-1,0).heading),n==="resize-r"&&(K=new i(1,0).heading),n==="rotate-texture"&&(K=Math.PI)}function yn(n){if(typeof m!="boolean"){let e=new i(n.mouseX,n.mouseY),t=new i(n.oldMouseX,n.oldMouseY),s=i.sub(t,m.pos),o=i.sub(e,m.pos),a=m.boundingBox,r=new i(a.x.min,a.y.min),h=new i(a.x.max,a.y.min),c=new i(a.x.min,a.y.max),f=new i(a.x.max,a.y.max),u=i.lerp(r,h,.5),d=i.lerp(c,f,.5),p=i.lerp(f,h,.5),g=i.lerp(c,r,.5),x=i.fromAngle(K),b=1;switch(D){case"move":m.move(new i(n.mouseX-n.oldMouseX,n.mouseY-n.oldMouseY));break;case"rotate":m.rotate(o.heading-s.heading);break;case"resize-bl":b=i.dot(x,i.sub(e,h))/i.dot(x,i.sub(t,h)),b*L>=.03?(m.scaleAround(h,b),m.textureTransform.offset.mult(b),m.textureTransform.scale*=b,L*=b):D="none";break;case"resize-br":b=i.dot(x,i.sub(e,r))/i.dot(x,i.sub(t,r)),b*L>=.03?(m.scaleAround(r,b),m.textureTransform.offset.mult(b),m.textureTransform.scale*=b,L*=b):D="none";break;case"resize-tl":b=i.dot(x,i.sub(e,f))/i.dot(x,i.sub(t,f)),b*L>=.03?(m.scaleAround(f,b),m.textureTransform.offset.mult(b),m.textureTransform.scale*=b,L*=b):D="none";break;case"resize-tr":b=i.dot(x,i.sub(e,c))/i.dot(x,i.sub(t,c)),b*L>=.03?(m.scaleAround(c,b),m.textureTransform.offset.mult(b),m.textureTransform.scale*=b,L*=b):D="none";break;case"resize-t":b=i.dot(x,i.sub(e,d))/i.dot(x,i.sub(t,d)),b*L>=.1?(m.scaleAroundY(d,b),L*=b):D="none";break;case"resize-b":b=i.dot(x,i.sub(e,u))/i.dot(x,i.sub(t,u)),b*L>=.1?(m.scaleAroundY(u,b),L*=b):D="none";break;case"resize-l":b=i.dot(x,i.sub(e,p))/i.dot(x,i.sub(t,p)),b*L>=.1?(m.scaleAroundX(p,b),L*=b):D="none";break;case"resize-r":b=i.dot(x,i.sub(e,g))/i.dot(x,i.sub(t,g)),b*L>=.1?(m.scaleAroundX(g,b),L*=b):D="none";break;default:break}}else if(typeof S!="boolean"){let e=new i(n.mouseX,n.mouseY);switch(D){case"move-spring0":S.updateAttachPoint0(e,Me);break;case"move-spring1":S.updateAttachPoint1(e,Me);break;default:break}}if(typeof _!="boolean"&&typeof m!="boolean"){let e=new i(n.mouseX,n.mouseY),t=new i(n.oldMouseX,n.oldMouseY),s=i.sub(e,I),o=i.sub(t,I),a=new i(1,1);switch(D){case"move-texture":I.x=n.mouseX,I.y=n.mouseY;break;case"scale-texture-xy":ye*=i.dot(s,a)/i.dot(o,a),ye*=i.dot(s,a)/i.dot(o,a);break;case"rotate-texture":Ce+=s.heading-o.heading;break;default:break}}}var xn={none:"default",move:"move",rotate:pe,"resize-bl":"nesw-resize","resize-br":"nwse-resize","resize-tl":"nwse-resize","resize-tr":"nesw-resize","resize-t":"ns-resize","resize-b":"ns-resize","resize-l":"ew-resize","resize-r":"ew-resize","move-spring0":"move","move-spring1":"move","move-texture":"move","rotate-texture":pe,"scale-texture-xy":"nwse-resize","choose-texture":"default"};function eo(n){if(ge instanceof C){let s=ge;return ge=!1,s}if(!Ee.spring)return!1;let e=new i(n.mouseX,n.mouseY),t=n.physics.springs.find(s=>s.getAsSegment().distFromPoint(e)<=Me);return typeof t=="undefined"?!1:t}function oi(n,e){if(m instanceof y)if(D!=="rotate"){n.strokeStyle=w["Roman Silver"],n.setLineDash([5,3.5]),n.strokeRect(m.boundingBox.x.min,m.boundingBox.y.min,m.boundingBox.x.max-m.boundingBox.x.min,m.boundingBox.y.max-m.boundingBox.y.min),n.beginPath(),n.moveTo(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.min),n.lineTo(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.min-gn),n.stroke(),n.fillStyle=w.blue,n.beginPath(),n.arc(m.boundingBox.x.min,m.boundingBox.y.min,ce,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.min,m.boundingBox.y.max,ce,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max,m.boundingBox.y.min,ce,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max,m.boundingBox.y.max,ce,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.min,m.boundingBox.y.min/2+m.boundingBox.y.max/2,le,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max,m.boundingBox.y.min/2+m.boundingBox.y.max/2,le,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.max,le,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.min,le,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.min-gn,pn,0,Math.PI*2),n.fill();let t=ht(e),s=xn[t],o=e.cnv.style;o.cursor!==s&&(o.cursor=s)}else n.strokeStyle=w["Roman Silver"],n.setLineDash([5,3.5]),n.beginPath(),n.moveTo(m.pos.x,m.pos.y),n.lineTo(e.mouseX,e.mouseY),n.stroke(),n.fillStyle=w.blue,n.beginPath(),n.arc(e.mouseX,e.mouseY,pn,0,Math.PI*2),n.fill()}function ii(n,e){if(typeof S!="boolean"){let t=S.points;n.fillStyle=w.blue,n.beginPath(),t.forEach(r=>{n.arc(r.x,r.y,Me,0,Math.PI*2)}),n.fill();let s=ht(e),o=xn[s],a=e.cnv.style;a.cursor!==o&&(a.cursor=o)}}function ai(n){let e=eo(n);if(typeof e!="boolean"){be.innerHTML="",S=e;let t=l("number-display",{value:S.getAsSegment().length.toFixed(1)},"Length:\xA0"),s=l("range-slider-number",{min:15,max:Math.max(n.worldSize.width,n.worldSize.height),step:1,value:S.length.toFixed(1),onChange:r=>{typeof S!="boolean"&&(S.length=r)}},"Start length"),o;S instanceof C&&!(S instanceof B)?o=l("range-slider-number",{min:2e3,max:1e5,value:S.springConstant,step:200,onChange:r=>{S instanceof C&&(S.springConstant=r)}},"Spring stiffness"):o=l("div",null);let a=l("angle-display",{value:0},"Orientation:\xA0");a.hideNumber(),be.append(l("number-display",{value:S instanceof B?"stick":"spring"},"Type:\xA0"),t,a,s,o,l("check-box",{checked:S.rotationLocked,onChange:r=>{typeof S!="boolean"&&(r?S.lockRotation():S.unlockRotation())}},"Locked"),l("button-btn",{bgColor:w["Imperial Red"],textColor:"white",onClick:()=>{typeof S!="boolean"&&(n.physics.removeObjFromSystem(S),lt(n),j=()=>{},m=!1,S=!1)}},"Delete")),j=()=>{if(typeof S=="boolean")return;t.value=S.getAsSegment().length.toFixed(1);let r=S.getAsSegment();a.value=i.sub(r.b,r.a).heading}}else S=!1,lt(n)}function ri(n,e){if(n.strokeStyle=w["Roman Silver"],n.setLineDash([5,3.5]),D==="rotate-texture"){let t=new i(e.mouseX,e.mouseY);n.beginPath(),n.moveTo(I.x,I.y),n.lineTo(t.x,t.y),n.stroke(),n.fillStyle=w.blue,n.setLineDash([]),n.beginPath(),n.arc(I.x,I.y,ct,0,Math.PI*2),n.closePath(),n.fill(),n.beginPath(),n.arc(t.x,t.y,ct,0,Math.PI*2),n.closePath(),n.fill();return}n.beginPath(),n.moveTo(I.x,I.y-bn),n.lineTo(I.x,I.y),n.stroke(),n.beginPath(),n.moveTo(I.x,I.y),n.lineTo(I.x+Se,I.y+Se),n.stroke(),n.setLineDash([]),n.fillStyle=w.blue,n.beginPath(),n.arc(I.x,I.y,$s,0,Math.PI*2),n.closePath(),n.fill(),n.beginPath(),n.arc(I.x,I.y-bn,ct,0,Math.PI*2),n.closePath(),n.fill(),n.beginPath(),n.arc(I.x+Se,I.y+Se,Ks,0,Math.PI*2),n.closePath(),n.fill()}var ci={name:"Select",description:"",element:be,drawFunc(n,e){var a,r;Pe instanceof y&&((a=this.startInteractionFunc)==null||a.call(this,n)),ge instanceof C&&((r=this.startInteractionFunc)==null||r.call(this,n));let t=As(n),s=eo(n),o=n.cnv.getContext("2d");if(o.save(),o.strokeStyle="orange",o.fillStyle="#00000000",o.setLineDash([]),o.lineWidth=4,typeof m!="boolean")if(n.renderer.renderBody(m,o),o.globalAlpha=.6,n.physics.getSpringsWithBody(m).forEach(h=>{o.fillStyle="#00000000",o.strokeStyle="#FFFFFF",h instanceof B?n.renderer.renderStick(h,o):h instanceof C&&n.renderer.renderSpring(h,o)}),o.globalAlpha=1,typeof _!="boolean"){let h=o.createPattern(_,Ue);Ce%=Math.PI*2;let c=new DOMMatrix([ye,0,0,ye,I.x,I.y]);c.rotateSelf(0,0,Ce*180/Math.PI),h.setTransform(c),o.fillStyle=h,o.strokeStyle="#00000000",n.renderer.renderBody(m,o),ri(o,n),yn(n);let f=ht(n),u=xn[f],d=n.cnv.style;d.cursor!==u&&(d.cursor=u)}else(m.m===0||n.timeMultiplier===0)&&(yn(n),oi(o,n));else{let h=n.cnv.style;h.cursor!=="default"&&(h.cursor="default")}if(typeof S!="boolean")o.fillStyle="#00000000",S instanceof B?n.renderer.renderStick(S,o):S instanceof C&&n.renderer.renderSpring(S,o),o.globalAlpha=.6,o.strokeStyle="#FFFFFF",S.objects.forEach(h=>n.renderer.renderBody(h,o)),o.globalAlpha=1,n.timeMultiplier===0&&(yn(n),ii(o,n));else if(typeof m=="boolean"){let h=n.cnv.style;h.cursor!=="default"&&(h.cursor="default")}Ie instanceof y&&(o.strokeStyle="yellow",o.fillStyle="#00000000",o.setLineDash([3,5]),n.renderer.renderBody(Ie,o)),he instanceof C&&(o.strokeStyle="yellow",o.fillStyle="#00000000",o.setLineDash([3,5]),he instanceof B?n.renderer.renderStick(he,o):n.renderer.renderSpring(he,o)),o.strokeStyle="yellow",o.fillStyle="#00000000",o.setLineDash([3,5]),typeof t!="boolean"?n.renderer.renderBody(t,o):typeof s!="boolean"&&(o.fillStyle="#00000000",s instanceof B?n.renderer.renderStick(s,o):n.renderer.renderSpring(s,o)),o.restore(),j==null||j()},startInteractionFunc(n){let e=ht(n);if(e!=="none"){D=e,si(e);return}D="none";let t=As(n);if(t instanceof y&&m!==t&&e==="none"){be.innerHTML="",m=t,S=!1;let s=l("range-slider-number",{min:.1,max:25,step:.05,value:Number.parseFloat(m.density.toFixed(2)),onChange:k=>{m instanceof y&&(m.density=k),j==null||j()}},"Density");m.m===0&&s.disable();let o=l("check-box",{checked:m.m===0,onChange:k=>{m instanceof y&&(k?(s.disable(),m.density=0,m.vel=new i(0,0),m.ang=0,s.value=0):(s.enable(),m.density=1,s.value=m.density),j==null||j())}},"Fixed down"),a=l("number-display",{value:m.shape.r!==0?"circle":"polygon"},"Type:\xA0"),r=l("number-display",{value:m.m.toFixed(2)},"Mass:\xA0"),h=l("number-display",{value:m.pos.x.toFixed(2)},"X coord:\xA0"),c=l("number-display",{value:m.pos.y.toFixed(2)},"Y coord:\xA0"),f=l("number-display",{value:m.vel.x.toFixed(2)},"X vel:\xA0"),u=l("number-display",{value:m.vel.y.toFixed(2)},"Y vel:\xA0"),d=l("button-btn",{onClick:()=>{m instanceof y&&(m.vel.x=0,m.vel.y=0,m.ang=0)}},"Reset motion");d.smallMargin();let p=l("angle-display",{value:m.rotation.toFixed(2)},"Rotation:\xA0"),g=l("number-display",{value:m.texture==="none"?"none":"set"},"Texture:\xA0"),x=l("file-input",{accept:"image/*",onFile:k=>{if(k.type.includes("image")){let J=new FileReader;J.readAsDataURL(k),J.onload=()=>{if(typeof J.result!="string")return;let Z=new Image;Z.onload=()=>{createImageBitmap(Z).then(N=>{var Y;m instanceof y?(n.timeMultiplier!==0&&((Y=document.getElementById("pause"))==null||Y.click()),_=N,ye=Math.max(m.boundingBox.x.size()/N.width,m.boundingBox.y.size()/N.height),I.x=m.boundingBox.x.min,I.y=m.boundingBox.y.min,Ce=0,m.texture="none"):_=!1})},Z.src=J.result}}}},"Select image"),b=l("apply-cancel",{visible:!0,onApply:()=>{if(typeof m=="boolean"||typeof _=="boolean")return;let k=i.sub(I,m.pos);k.rotate(-m.rotation),m.textureTransform={scale:ye,rotation:Ce-m.rotation,offset:k},m.texture=_,m.textureRepeat=Ue,_=!1},onCancel:()=>{_=!1}}),v=l("button-btn",{textColor:"white",onClick:()=>{if(typeof m!="boolean"&&m.texture!=="none"){_=m.texture,m.texture="none",ye=m.textureTransform.scale,Ce=m.textureTransform.rotation+m.rotation;let k=m.textureTransform.offset.copy;k.rotate(m.rotation),k.add(m.pos),I.x=k.x,I.y=k.y}}},"Edit texture");v.smallMargin(),m.texture!=="none"?v.show():v.hide();let M=l("button-btn",{bgColor:w["Imperial Red"],textColor:"white",onClick:()=>{typeof m!="boolean"&&(m.texture="none")}},"Remove texture");M.smallMargin(),m.texture!=="none"?M.show():M.hide();let O=["repeat","repeat-x","repeat-y","no-repeat"];Ue=m.textureRepeat;let q=l("drop-down",{entries:O,value:Ue,onChoice:k=>{O.includes(k)&&(Ue=k,typeof m!="boolean"&&(m.textureRepeat=k))}},"\u25BC\xA0Texture mode");j=()=>{m instanceof y&&(h.value!=m.pos.x&&(h.value=m.pos.x.toFixed(2)),c.value!=m.pos.y&&(c.value=m.pos.y.toFixed(2)),f.value!=m.vel.x&&(f.value=m.vel.x.toFixed(2)),u.value!=m.vel.y&&(u.value=m.vel.y.toFixed(2)),r.value!=m.m&&(r.value=m.m.toFixed(2)),p.value=m.rotation.toFixed(2),g.value!==m.texture&&(g.value=m.texture==="none"?"none":"set"),typeof _!="boolean"?b.visible=!0:b.visible=!1,m.texture!=="none"?M.hidden&&M.show():M.hidden||M.hide(),m.texture!=="none"?v.hidden&&v.show():v.hidden||v.hide())},be.append(a,r,p,h,c,f,u,d,o,s,l("range-slider-number",{min:0,max:.98,step:.02,value:m.k,onChange:k=>{m instanceof y&&(m.k=k)}},"Bounciness"),l("range-slider-number",{min:0,max:2,step:.1,value:m.fc,onChange:k=>{m instanceof y&&(m.fc=k)}},"Coefficient of friction"),l("color-picker",{value:m.style,onChange:k=>{m instanceof y&&(m.style=k)}},"Color:"),g,q,x,b,v,M,l("button-btn",{bgColor:w["Imperial Red"],textColor:"white",onClick:()=>{typeof m!="boolean"&&(n.physics.removeObjFromSystem(m),lt(n),j=()=>{},m=!1,S=!1)}},"Delete"))}else typeof t=="boolean"&&e==="none"&&(m=t,j=()=>{},ai(n))},endInteractionFunc(n){D="none"},deactivated(){m=!1,S=!1,j=()=>{}},activated(n){lt(n)}},to=ci;var no=document.createElement("template");no.innerHTML=`
  <style>
    .inputLabel {
        margin-left: 1.2rem;
        margin-top: 0.7rem;
        display: block;
        transition: transform 0.3s, color 0.25s;
        transform: scale(0.95);
        color: grey;
    }
    
    .inputText {
        background-color: var(--independence);
        font-size: medium;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        padding-left: 0.5em;
        padding-right: 0.5em;
        border-radius: 100vh;
        color: #FFFFFF;
        border: none;
        height: 1.2em;
        width: 100%;
        outline: none;
        display: block;
        transition: border 0.25s;
    }

    .inputText:focus {
      border: 1.5px solid var(--roman-silver);
    }

    .container:focus-within > .inputLabel {
      transform: scale(1);
      color: white;
    }

    .container {
      width: 65%;
      margin: 0 auto;
      margin-bottom: 0.7rem;
    }
  
    /* For tablets */
    @media (max-width: 768px) {
        .container {
          width: 80%;
        }
    }

    /* For mobile devices */
    @media (max-width: 500px) {
        .container {
          width: 90%;
        }
    }
  </style>
`;var so=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(no.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"container"},l("label",{htmlFor:"textInput",className:"inputLabel"},l("slot",null)),l("input",{type:"text",className:"inputText",id:"textInput",placeholder:this.slot,autoComplete:"off"})))}get textInput(){return this.shadowRoot.getElementById("textInput")}get inputValue(){return this.textInput.value}set onChange(e){let t=s=>{e(s.target.value)};this.picker.onchange=t}};window.customElements.define("text-input",so);var oo=class{constructor(){this.textures=[]}renderBody(e,t){if(e.shape.r!==0)t.beginPath(),t.arc(e.pos.x,e.pos.y,e.shape.r,0,Math.PI*2),t.stroke(),t.fill();else{t.beginPath(),t.moveTo(e.shape.points[0].x,e.shape.points[0].y);for(let s=1;s<e.shape.points.length;s+=1)t.lineTo(e.shape.points[s].x,e.shape.points[s].y);t.closePath(),t.stroke(),t.fill()}}renderSpring(e,t){let s=e.points,o=s[0].x,a=s[0].y,r=s[1].x,h=s[1].y,c=new i(r-o,h-a),f=c.copy;c.rotate(Math.PI/2),c.setMag(5);let u=new i(o,a),d=Math.floor(e.length/10);for(let p=1;p<=d;p+=1)p===d&&(c=new i(0,0)),t.beginPath(),t.moveTo(u.x,u.y),t.lineTo(o+p/d*f.x+c.x,a+p/d*f.y+c.y),t.stroke(),u=new i(o+p/d*f.x+c.x,a+p/d*f.y+c.y),c.mult(-1);t.strokeStyle="black",e.points.forEach(p=>{t.beginPath(),t.arc(p.x,p.y,2.5,0,Math.PI*2),t.fill(),t.stroke()})}renderStick(e,t){let s=e.points;t.beginPath(),t.moveTo(s[0].x,s[0].y),t.lineTo(s[1].x,s[1].y),t.stroke(),t.strokeStyle="black",e.points.forEach(o=>{t.beginPath(),t.arc(o.x,o.y,2.5,0,Math.PI*2),t.fill(),t.stroke()})}},dt=oo;var Ge=400,_e=300,li=1.2,io=class{constructor(e,t,s){this.name=e,this.description=t,this.content=s.copy;let o=this.content.boundingBox;this.content.move(new i(-o.x.min-o.x.size()/2,-o.y.min-o.y.size()/2)),this.thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",this.generateThumbnail()}generateThumbnail(){let e=document.createElement("canvas");e.width=Ge,e.height=_e;let t=this.content.boundingBox,s=Ge/_e,o;s>t.x.size()/t.y.size()?o=t.y.size()/_e:o=t.x.size()/Ge,o=1/o/li;let a=new dt,r=e.getContext("2d");r.fillStyle=w.Independence,r.fillRect(0,0,Ge,_e),r.translate(Ge/2,_e/2),r.scale(o,o);let h=c=>{if(c.m===0&&(r.strokeStyle="#00000000"),c.shape.r!==0){let f=c;r.beginPath(),r.arc(f.pos.x,f.pos.y,f.shape.r,0,2*Math.PI),r.stroke(),r.fill(),c.m!==0&&(r.beginPath(),r.moveTo(f.pos.x,f.pos.y),r.lineTo(f.pos.x+f.shape.r*Math.cos(f.rotation),f.pos.y+f.shape.r*Math.sin(f.rotation)),r.stroke())}else r.beginPath(),r.moveTo(c.shape.points[c.shape.points.length-1].x,c.shape.points[c.shape.points.length-1].y),c.shape.points.forEach(f=>{r.lineTo(f.x,f.y)}),r.stroke(),r.fill(),c.m!==0&&(r.beginPath(),r.arc(c.pos.x,c.pos.y,1.5,0,Math.PI*2),r.stroke())};this.content.bodies.forEach(c=>{r.fillStyle=c.style,r.strokeStyle="black",h(c)}),this.content.bodies.forEach(c=>{if(c.texture==="none")return;let f=c.textureTransform,u=f.offset.copy;u.rotate(c.rotation),u.add(c.pos);let d=new DOMMatrix([f.scale,0,0,f.scale,u.x,u.y]);d.rotateSelf(0,0,(f.rotation+c.rotation)*180/Math.PI);let p=r.createPattern(c.texture,c.textureRepeat);p.setTransform(d),r.fillStyle=p,r.strokeStyle="#00000000",h(c)}),r.lineWidth=2,this.content.springs.forEach(c=>{c instanceof C&&!(c instanceof B)?(r.strokeStyle=w.blue,r.fillStyle=w.blue,a.renderSpring(c,r)):(r.strokeStyle=w.blue,r.fillStyle=w.blue,a.renderStick(c,r))}),this.thumbnail=e.toDataURL()}},ao=io;function ro(n,e){let t=document.getElementById("creation-modal");if(t){t.innerHTML="",t.append(...n);let s=document.getElementById("modal-bg");s&&s.classList.add("showModal");let o=document.getElementById("close-button");o&&(o.onclick=null,o.onclick=()=>{s&&s.classList.remove("showModal"),e()})}}function mt(){let n=document.getElementById("creation-modal");n&&(n.innerHTML="")}function vn(){let n=document.getElementById("modal-bg");n&&n.classList.remove("showModal")}var Q;(function(n){n.Select="SELECT",n.Resize="RESIZE"})(Q||(Q={}));var wn=35,de=8,ut=9,hi=7,E=new tt,kn=Q.Select,Mn=document.createElement("div"),Be=Object.create({});function co(n){let e=new i(n.mouseX,n.mouseY),t=n.physics.springs.find(s=>s.getAsSegment().distFromPoint(e)<=hi);return typeof t=="undefined"?!1:t}function Te(n){Mn.innerHTML="",kn=n;let e=Be[kn];e&&(Mn.append(e.element),e.activated())}function ft(){return Be[kn]}function di(n){return new Promise((e,t)=>{let s=l("div",null,"You cannot leave the 'Name' field empty!");s.style.color=w["Imperial Red"],s.style.fontSize="small",s.style.marginLeft="auto",s.style.marginRight="auto",s.style.width="100%",s.style.display="none",s.style.textAlign="center";let o=l("text-input",null,"Name of creation"),a=l("text-input",null,"Description"),r=l("apply-cancel",{applyText:"Save",cancelText:"Cancel",onCancel:()=>{vn(),setTimeout(mt,450),t(new Error("Canceled"))},onApply:()=>{if(o.inputValue==="")s.style.display="block";else{let c={name:o.inputValue,description:a.inputValue};vn(),setTimeout(mt,450),e(c)}}});r.width="35%";let h=r.containerElement;h.style.marginLeft="auto",h.style.marginRight="auto",h.style.marginBottom="0.7em",h.style.height="1.5em",h.style.fontSize="large",ro([n,s,o,a,r],()=>{setTimeout(mt,450),t(new Error("Canceled"))})})}async function mi(){let n=new Image;n.className="creation-image-modal";let e=new ao("","",E);n.src=e.thumbnail;try{let t=await di(n);e.name=t.name,e.description=t.description,Ln(e)}catch(t){}}Be[Q.Select]={update(n,e,t){let{boundingBox:s}=E;s.x.size()!==0&&(t.lineWidth=3,t.setLineDash([3,5]),t.strokeStyle="#FFFFFF55",t.strokeRect(s.x.min,s.y.min,s.x.size(),s.y.size()))},startInteraction(n){let e=new i(n.mouseX,n.mouseY),t=n.physics.getObjectAtCoordinates(e.x,e.y,4);if(t instanceof y){E.bodies.includes(t)?E.bodies.splice(E.bodies.indexOf(t),1):E.addBody(t);return}let s=co(n);s instanceof C&&(E.springs.includes(s)?E.springs.splice(E.springs.indexOf(s),1):E.addSpring(s))},endInteraction(){E.bodies.length===0?this.editBtn.hide():this.editBtn.show()},init(){this.editBtn.smallMargin(),E.bodies.length===0?this.editBtn.hide():this.editBtn.show()},activated(){E.bodies.length===0?this.editBtn.hide():this.editBtn.show()},get editBtn(){return this.element.querySelector("#editBtn")},element:l("div",null,l("number-display",null,"Select/deselect anything"),l("button-btn",{id:"editBtn",onClick:()=>{Te(Q.Resize)}},"Edit selection"))};Be[Q.Resize]={update(n,e,t){var a;this.toDelete&&(this.toDelete=!1,E.bodies.forEach(r=>{n.physics.removeObjFromSystem(r)}),E.bodies=[],E.springs=[],Te(Q.Select)),n.timeMultiplier!==0&&((a=document.getElementById("pause"))==null||a.click()),t.lineWidth=3,t.setLineDash([5,3.5]),t.strokeStyle=w["Roman Silver"];let{boundingBox:s}=E,o=s;if(this.command!=="rotate"?(t.strokeRect(s.x.min,s.y.min,s.x.max-s.x.min,s.y.max-s.y.min),t.beginPath(),t.moveTo(s.x.max/2+s.x.min/2,s.y.min),t.lineTo(s.x.max/2+s.x.min/2,s.y.min-wn),t.stroke(),t.fillStyle=w.blue,t.beginPath(),t.arc(o.x.min,o.y.min,de,0,2*Math.PI),t.fill(),t.beginPath(),t.arc(o.x.max,o.y.min,de,0,2*Math.PI),t.fill(),t.beginPath(),t.arc(o.x.max,o.y.max,de,0,2*Math.PI),t.fill(),t.beginPath(),t.arc(o.x.min,o.y.max,de,0,2*Math.PI),t.fill(),t.beginPath(),t.arc((o.x.min+o.x.max)/2,o.y.min-wn,ut,0,2*Math.PI),t.fill()):(t.fillStyle=w.blue,t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(this.rotateCenter.x,this.rotateCenter.y),t.stroke(),t.beginPath(),t.arc(n.mouseX,n.mouseY,ut,0,2*Math.PI),t.fill(),t.beginPath(),t.arc(this.rotateCenter.x,this.rotateCenter.y,ut,0,2*Math.PI),t.fill()),this.command==="none"){let r=this.findCommand(n.mouseX,n.mouseY),h=n;h.cnv.style.cursor!==this.cursors[r]&&(h.cnv.style.cursor=this.cursors[r])}this.updateCommand(n)},startInteraction(n){if(this.command=this.findCommand(n.mouseX,n.mouseY),this.command==="rotate"){let e=E.boundingBox,t=new i(e.x.max,e.y.max),s=new i(e.x.min,e.y.min);this.rotateCenter=i.add(s,t),this.rotateCenter.div(2)}},endInteraction(n){let e=n;e.cnv.style.cursor="default",this.command="none"},updateCommand(n){if(this.command==="none")return;let e=new i(n.mouseX,n.mouseY),t=new i(n.oldMouseX,n.oldMouseY),s=i.sub(e,t),o=E.boundingBox,a=new i(o.x.min,o.y.min),r=new i(o.x.max,o.y.min),h=new i(o.x.min,o.y.max),c=new i(o.x.max,o.y.max),f=i.add(a,c);f.div(2);let u=i.sub(e,f).heading-i.sub(t,f).heading,d=i.sub(a,c),p=i.sub(r,h);switch(this.command){case"move":E.move(s);break;case"rotate":E.rotateAround(this.rotateCenter,u);break;case"resize-br":E.scaleAround(a,i.dot(i.sub(e,a),d)/i.dot(i.sub(t,a),d));break;case"resize-bl":E.scaleAround(r,i.dot(i.sub(e,r),p)/i.dot(i.sub(t,r),p));break;case"resize-tr":E.scaleAround(h,i.dot(i.sub(e,h),p)/i.dot(i.sub(t,h),p));break;case"resize-tl":E.scaleAround(c,i.dot(i.sub(e,c),d)/i.dot(i.sub(t,c),d));break;default:break}},findCommand(n,e){let t=new i(n,e),s=E.boundingBox;if(t.dist(new i(s.x.min,s.y.min))<=de)return"resize-tl";if(t.dist(new i(s.x.max,s.y.min))<=de)return"resize-tr";if(t.dist(new i(s.x.min,s.y.max))<=de)return"resize-bl";if(t.dist(new i(s.x.max,s.y.max))<=de)return"resize-br";if(t.x>=s.x.min&&t.x<=s.x.max&&t.y>=s.y.min&&t.y<=s.y.max)return"move";let o=new i((s.x.min+s.x.max)/2,s.y.min-wn);return t.dist(o)<=ut?"rotate":"none"},command:"none",cursors:{none:"default",rotate:pe,move:"move","resize-bl":"nesw-resize","resize-br":"nwse-resize","resize-tl":"nwse-resize","resize-tr":"nesw-resize"},rotateCenter:new i(0,0),init(){E.removeUnusedSprings(),E.bodies.length===0&&Te(Q.Select)},activated(){this.command="none"},element:l("div",null,l("number-display",null,"Move, resize, scale or export creation"),l("button-btn",{bgColor:w["Imperial Red"],onClick:()=>{let n=Be[Q.Resize];n&&(n.toDelete=!0)},decreasedMargin:!0},"Delete"),l("button-btn",{onClick:()=>mi(),decreasedMargin:!0},"Save as creation"),l("button-btn",{onClick:()=>Te(Q.Select),decreasedMargin:!0},"Stop editing")),toDelete:!1};var ui={name:"Select multiple",description:"",element:Mn,drawFunc(n,e){var r,h;let{cnv:t}=n,s=t.getContext("2d");s.save();let o=new i(n.mouseX,n.mouseY);s.lineWidth=4,s.fillStyle="#00000000",s.setLineDash([]),s.strokeStyle="orange",E.bodies.forEach(c=>{n.renderer.renderBody(c,s)}),E.springs.forEach(c=>{s.strokeStyle="orange",c instanceof B?n.renderer.renderStick(c,s):n.renderer.renderSpring(c,s)}),s.strokeStyle="yellow",s.setLineDash([3,5]);let a=n.physics.getObjectAtCoordinates(o.x,o.y,4);if(a instanceof y)n.renderer.renderBody(a,s);else{let c=co(n);c instanceof C&&(c instanceof B?n.renderer.renderStick(c,s):n.renderer.renderSpring(c,s))}(h=(r=ft())==null?void 0:r.update)==null||h.call(r,n,e,s),s.restore()},startInteractionFunc(n){var e,t;(t=(e=ft())==null?void 0:e.startInteraction)==null||t.call(e,n)},endInteractionFunc(n){var e,t;(t=(e=ft())==null?void 0:e.endInteraction)==null||t.call(e,n)},deactivated(n){E.bodies=[],E.springs=[];let e=n;e.cnv.style.cursor="default",Te(Q.Select)},activated(){var n;(n=ft())==null||n.activated()}};Te(Q.Select);Object.values(Be).forEach(n=>{n&&n.init()});var lo=ui;var ho=document.createElement("template");ho.innerHTML=`
  <style>
  .container {
      width: 100%;
      border-radius: 0.5rem;
      background-color: var(--pinky-darker);
      box-shadow: 3px 3px 3px black;
      margin-bottom: 0.5rem;
  }

  .thumbnail {
      width: 100%;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
  }

  .name-holder {
      font-size: small;
      font-weight: bold;
      margin: 0em 0.2em;
  }

  .description-holder {
    font-size: small;
    font-weight: light;
    margin: 0em 0.2em;
    padding-bottom: 0.1em;
  }
  </style>
`;var mo=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ho.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"container"},l("img",{alt:"thumbnail",id:"thumbnail-image",className:"thumbnail"}),l("div",{id:"name-holder",className:"name-holder"}),l("div",{id:"description-holder",className:"description-holder"}),l("apply-cancel",{applyText:"Place",cancelText:"Delete",id:"place-delete",small:!0})))}set onPlace(e){this.placeDeleteBtn.onApply=e}set onDelete(e){this.placeDeleteBtn.onCancel=e}get placeDeleteBtn(){return this.shadowRoot.getElementById("place-delete")}get thumbnail(){return this.shadowRoot.getElementById("thumbnail-image")}get nameHolder(){return this.shadowRoot.getElementById("name-holder")}get descHolder(){return this.shadowRoot.getElementById("description-holder")}set thumbnailSrc(e){this.thumbnail.src=e}set creationName(e){this.nameHolder.innerText=e}set description(e){this.descHolder.innerText=e}set data(e){this.creationData=e,this.thumbnailSrc=e.thumbnail,this.creationName=e.name,this.description=e.description}};window.customElements.define("creation-display",mo);var Sn=8,Pn=7,uo=7,In=23,Re=30,Fe=document.createElement("div"),z=!1,oe="none",ie=new i(0,0);async function fi(n,e){let t=await On(n.content),s=e.convertToPhysicsSpace(new i(e.cnv.clientWidth/2,e.cnv.clientHeight/2));t.move(s),z=t,Fe.innerHTML="",Fe.append(l("number-display",null,"Find the intended place for the creation then press 'Accept' or 'Cancel' to discard"),l("space-height",{value:.5}),l("apply-cancel",{onCancel:()=>{var o;(o=xe.activated)==null||o.call(xe,e)},onApply:()=>{var o;z&&(z.bodies.forEach(a=>e.physics.addBody(a)),z.springs.forEach(a=>e.physics.addSpring(a)),z=!1),(o=xe.activated)==null||o.call(xe,e)}}))}function pi(n,e,t){if(n.strokeStyle=w["Roman Silver"],n.setLineDash([5,3.5]),oe==="rotate"){n.beginPath(),n.moveTo(ie.x,ie.y),n.lineTo(t.mouseX,t.mouseY),n.stroke(),n.setLineDash([]),n.fillStyle=w.blue,n.beginPath(),n.arc(ie.x,ie.y,Sn,0,Math.PI*2),n.closePath(),n.fill(),n.beginPath(),n.arc(t.mouseX,t.mouseY,Pn,0,Math.PI*2),n.closePath(),n.fill();return}n.beginPath(),n.moveTo(e.x,e.y-In),n.lineTo(e.x,e.y),n.stroke(),n.beginPath(),n.moveTo(e.x,e.y),n.lineTo(e.x+Re,e.y+Re),n.stroke(),n.setLineDash([]),n.fillStyle=w.blue,n.beginPath(),n.arc(e.x,e.y,Sn,0,Math.PI*2),n.closePath(),n.fill(),n.beginPath(),n.arc(e.x,e.y-In,Pn,0,Math.PI*2),n.closePath(),n.fill(),n.beginPath(),n.arc(e.x+Re,e.y+Re,uo,0,Math.PI*2),n.closePath(),n.fill()}function fo(n,e){let t=new i(e.mouseX,e.mouseY);return n.dist(t)<=Sn?"move":new i(n.x,n.y-In).dist(t)<=Pn?"rotate":new i(n.x+Re,n.y+Re).dist(t)<=uo?"scale":"none"}function gi(n,e){if(!z||oe==="none")return;let t=new i(e.mouseX,e.mouseY),s=new i(e.oldMouseX,e.oldMouseY),o=i.sub(t,s),a=i.sub(t,ie),r=i.sub(s,ie);switch(oe){case"move":z.move(o);break;case"rotate":z.rotateAround(ie,a.heading-r.heading);break;case"scale":z.scaleAround(n,a.length/r.length);break;default:break}}var bi={none:"default",move:"move",scale:"nwse-resize",rotate:pe},xe={name:"Creations",description:"",element:Fe,drawFunc(n,e){if(z){let t=z.boundingBox,s=i.div(i.add(new i(t.x.min,t.y.min),new i(t.x.max,t.y.max)),2);gi(s,n);let{cnv:o}=n,a=o.getContext("2d");a.save(),a.lineWidth=2,a.fillStyle="#00000000",a.strokeStyle="#000000",z.bodies.forEach(c=>{n.renderer.renderBody(c,a)}),z.springs.forEach(c=>{c instanceof B?n.renderer.renderStick(c,a):n.renderer.renderSpring(c,a)}),oe==="rotate"&&(s=ie.copy),pi(a,s,n),a.restore();let r;oe!=="none"?r=oe:r=bi[fo(s,n)];let h=o.style.cursor;r!==h&&(o.style.cursor=r)}else oe="none"},startInteractionFunc(n){if(z){let e=z.boundingBox,t=i.div(i.add(new i(e.x.min,e.y.min),new i(e.x.max,e.y.max)),2);ie=t.copy,oe=fo(t,n)}},endInteractionFunc(n){oe="none"},async activated(n){Fe.innerHTML="",z=!1,Fe.append(l("number-display",null,"My creations:"),l("space-height",{value:1}));let e=await Dn(),t=await Promise.all(e.map(s=>zn(s)));Fe.append(...t.map(s=>l("creation-display",{data:s,onPlace:()=>{fi(s,n)},onDelete:async()=>{var a;let o=await Yn(s.name);(a=this.activated)==null||a.call(this,n)}})))}},po=xe;var go=[Bs,to,lo,Xs,Fs,_n,Gn,Ds,po];var ne=go,pt=ne.map(n=>n.name),bo=class{constructor(){this.resizeCanvas=()=>{let e=this.canvasHolder.getBoundingClientRect();this.cnv.width=e.width,this.cnv.height=window.innerHeight-e.top;let t=window.devicePixelRatio||1,s=e;this.cnv.width=s.width*t,this.cnv.height=s.height*t,this.cnv.style.width=`${s.width}px`,this.cnv.style.height=`${s.height}px`,this.scaling=this.cnv.height/this.worldSize.height,this.scaling/=t,this.scaling*=.9,this.viewOffsetX=.01*this.cnv.width,this.viewOffsetY=.03*this.cnv.height;let o=this.cnv.getContext("2d");o&&(o.scale(t,t),o.lineWidth=t),this.defaultSize=(this.cnv.width+this.cnv.height)/80};this.drawFunction=()=>{var o,a;Number.isFinite(this.lastFrameTime)||(this.lastFrameTime=performance.now());let e=performance.now()-this.lastFrameTime;Number.isFinite(e)||(e=0),e/=1e3,e=Math.min(e,.04166666666);let t=this.cnv.getContext("2d");t.fillStyle=w.Beige,t.fillRect(0,0,this.cnv.width,this.cnv.height),t.save(),t.translate(this.viewOffsetX,this.viewOffsetY),t.scale(this.scaling,this.scaling),this.physicsDraw(),(a=(o=ne[this.mode]).drawFunc)==null||a.call(o,this,e*this.timeMultiplier),t.restore(),this.collisionData=[],e*=this.timeMultiplier;let s=this.physics.bodies.find(r=>r.m!==0);s&&(this.right&&(s.ang=Math.min(s.ang+300*e,15)),this.left&&(s.ang=Math.max(s.ang-300*e,-15))),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.lastFrameTime=performance.now(),requestAnimationFrame(this.drawFunction),this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY};this.startInteraction=(e,t)=>{var s,o;this.mouseX=e/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=t/this.scaling-this.viewOffsetY/this.scaling,this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY,this.choosed=this.physics.getObjectAtCoordinates(this.mouseX,this.mouseY,4),!this.choosed&&typeof this.choosed=="boolean"&&(this.choosed={x:this.mouseX,y:this.mouseY,pinPoint:!0}),this.lastX=this.mouseX,this.lastY=this.mouseY,this.mouseDown=!0,(o=(s=ne[this.mode]).startInteractionFunc)==null||o.call(s,this)};this.endInteraction=(e,t)=>{var s,o;this.mouseX=e/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=t/this.scaling-this.viewOffsetY/this.scaling,(o=(s=ne[this.mode]).endInteractionFunc)==null||o.call(s,this),this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.discardInteraction=()=>{this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.keyGotDown=e=>{let t=e.key;t==="s"&&this.spawnNewtonsCradle(this.cnv.width/2,this.cnv.height/2,.5,this.physics),t==="a"&&(this.scaling+=.01),t==="d"&&(this.scaling-=.01),t==="j"&&(this.viewOffsetX-=10),t==="l"&&(this.viewOffsetX+=10),t==="k"&&(this.viewOffsetY-=10),t==="i"&&(this.viewOffsetY+=10),t==="ArrowRight"&&(this.right=!0),t==="ArrowLeft"&&(this.left=!0)};this.keyGotUp=e=>{let t=e.key;t==="ArrowRight"&&(this.right=!1),t==="ArrowLeft"&&(this.left=!1)};this.startTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();return e.touches.length>1?(this.discardInteraction(),e.touches.length===2&&(this.touchIDs.push(e.touches[0].identifier),this.touchIDs.push(e.touches[1].identifier),this.touchCoords.push(new i(e.touches[0].clientX-t.left,e.touches[0].clientY-t.top)),this.touchCoords.push(new i(e.touches[1].clientX-t.left,e.touches[1].clientY-t.top))),e.touches.length>2&&(this.touchIDs=[],this.touchCoords=[]),!1):(this.startInteraction(e.changedTouches[0].clientX-t.left,e.changedTouches[0].clientY-t.top),!1)};this.endTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();return e.touches.length<=1&&(this.touchIDs=[],this.touchCoords=[]),this.endInteraction(e.changedTouches[0].clientX-t.left,e.changedTouches[0].clientY-t.top),!1};this.moveTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();if(e.touches.length===2){let s=[];return e.touches.item(0).identifier===this.touchIDs[0]?(s.push(e.touches.item(0)),s.push(e.touches.item(1))):(s.push(e.touches.item(1)),s.push(e.touches.item(0))),s=s.map(o=>new i(o.clientX-t.left,o.clientY-t.top)),this.processMultiTouchGesture(this.touchCoords,s),this.touchCoords=s,!1}return e.touches.length>2||(this.mouseX=e.changedTouches[0].clientX-t.left,this.mouseY=e.changedTouches[0].clientY-t.top,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling),!1};this.processMultiTouchGesture=(e,t)=>{let s=i.add(e[1],e[0]);s.mult(.5);let o=i.add(t[1],t[0]);o.mult(.5);let a=i.dist(e[1],e[0]),r=i.dist(t[1],t[0]),h=Math.sqrt(r/a),c=i.add(s,o);c.mult(.5);let f=i.sub(o,s);f.mult(h),this.scaleAround(c,h),this.viewOffsetX+=f.x,this.viewOffsetY+=f.y};this.scaleAround=(e,t)=>{this.viewOffsetX=e.x-(e.x-this.viewOffsetX)*t,this.viewOffsetY=e.y-(e.y-this.viewOffsetY)*t,this.scaling*=t};this.startMouse=e=>(e.button===0&&this.startInteraction(e.offsetX,e.offsetY),e.button===2&&(this.rightButtonDown=new i(e.offsetX,e.offsetY),this.cnv.style.cursor="all-scroll"),!1);this.endMouse=e=>(e.button===0&&this.endInteraction(e.offsetX,e.offsetY),e.button===2&&(this.rightButtonDown=!1,this.cnv.style.cursor="default"),!1);this.handleMouseMovement=e=>{if(this.mouseX=e.offsetX,this.mouseY=e.offsetY,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling,this.rightButtonDown){let t=new i(e.offsetX,e.offsetY),s=i.sub(t,this.rightButtonDown);this.viewOffsetX+=s.x,this.viewOffsetY+=s.y,this.rightButtonDown=t}};this.handleMouseWheel=e=>{e.preventDefault();let t=new i(e.offsetX,e.offsetY),s=5e-4;e.deltaMode===WheelEvent.DOM_DELTA_LINE&&(s/=16);let o=1-e.deltaY*s;this.scaleAround(t,o)};this.convertToPhysicsSpace=e=>new i(e.x/this.scaling-this.viewOffsetX/this.scaling,e.y/this.scaling-this.viewOffsetY/this.scaling);this.convertToCanvasSpace=e=>new i(e.x*this.scaling+this.viewOffsetX,e.y*this.scaling+this.viewOffsetY);this.physicsDraw=()=>{let e=this.cnv.getContext("2d");if(e){e.fillStyle=w.Independence,e.fillRect(0,0,this.worldSize.width,this.worldSize.height);let t=o=>{if(o.m===0&&(e.strokeStyle="#00000000"),o.shape.r!==0){let a=o;e.beginPath(),e.arc(a.pos.x,a.pos.y,a.shape.r,0,2*Math.PI),e.stroke(),e.fill(),o.m!==0&&(e.beginPath(),e.moveTo(a.pos.x,a.pos.y),e.lineTo(a.pos.x+a.shape.r*Math.cos(a.rotation),a.pos.y+a.shape.r*Math.sin(a.rotation)),e.stroke())}else e.beginPath(),e.moveTo(o.shape.points[o.shape.points.length-1].x,o.shape.points[o.shape.points.length-1].y),o.shape.points.forEach(a=>{e.lineTo(a.x,a.y)}),e.stroke(),e.fill(),o.m!==0&&(e.beginPath(),e.arc(o.pos.x,o.pos.y,1.5,0,Math.PI*2),e.stroke()),this.showAxes&&(e.strokeStyle="black",o.axes.forEach(a=>{e.beginPath(),e.moveTo(o.pos.x,o.pos.y),e.lineTo(o.pos.x+a.x*30,o.pos.y+a.y*30),e.stroke()}))};if(this.physics.bodies.forEach(o=>{e.fillStyle=o.style,e.strokeStyle="black",t(o)}),this.physics.bodies.forEach(o=>{if(o.texture==="none")return;let a=o.textureTransform,r=a.offset.copy;r.rotate(o.rotation),r.add(o.pos);let h=new DOMMatrix([a.scale,0,0,a.scale,r.x,r.y]);h.rotateSelf(0,0,(a.rotation+o.rotation)*180/Math.PI);let c=e.createPattern(o.texture,o.textureRepeat);c.setTransform(h),e.fillStyle=c,e.strokeStyle="#00000000",t(o)}),e.save(),e.lineWidth=2,this.physics.springs.forEach(o=>{o instanceof C&&!(o instanceof B)?(e.strokeStyle=w.blue,e.fillStyle=w.blue,this.renderer.renderSpring(o,e)):(e.strokeStyle=w.blue,e.fillStyle=w.blue,this.renderer.renderStick(o,e))}),e.restore(),e.strokeStyle="rgba(255, 255, 255, 0.2)",this.showBoundingBoxes&&this.physics.bodies.forEach(o=>{e.strokeRect(o.boundingBox.x.min,o.boundingBox.y.min,o.boundingBox.x.max-o.boundingBox.x.min,o.boundingBox.y.max-o.boundingBox.y.min)}),this.showVelocities){let o=e.lineWidth;e.strokeStyle=w.pink,e.fillStyle=w.pink,e.lineWidth=3.5;let a=.05;this.physics.bodies.forEach(r=>{let h=r.pos.copy,c=i.add(h,i.mult(r.vel,a));e.beginPath(),e.moveTo(h.x,h.y),e.lineTo(c.x,c.y),e.stroke();let f=Math.min(r.vel.length/5,15),u=r.vel.copy;u.normalize(),u.setMag(f);let d=i.add(c,u);u.rotate90(),u.div(3),e.beginPath(),e.moveTo(d.x,d.y),e.lineTo(c.x+u.x,c.y+u.y),e.lineTo(c.x-u.x,c.y-u.y),e.closePath(),e.fill()}),e.lineWidth=o}e.fillStyle=w["Maximum Yellow Red"],e.strokeStyle=w["Maximum Yellow Red"];let s=e.lineWidth;e.lineWidth=4,this.drawCollisions&&this.collisionData.forEach(o=>{e.beginPath(),e.moveTo(o.cp.x,o.cp.y),e.lineTo(o.cp.x+o.n.x*30,o.cp.y+o.n.y*30),e.stroke(),e.beginPath(),e.arc(o.cp.x,o.cp.y,4,0,Math.PI*2),e.fill()}),e.lineWidth=s}};this.spawnNewtonsCradle=(e,t,s,o)=>{let a=[],r=25,h=250,c=8;a.push(new y(P.Circle(s*r,new i(e,t)),1,1,0));let f=1;for(let u=0;u<c-1;u+=1)a.push(new y(P.Circle(s*r,new i(e+f*s*r*1.01*2,t)),1,1,0)),f*=-1,f>0&&(f+=1),u===c-2&&(a[a.length-1].vel.x=-Math.sign(f)*s*r*8);a.forEach(u=>{o.addBody(u);let d=new B(h);d.attachObject(u),d.pinHere(u.pos.x,u.pos.y-h),o.addSpring(d),d.lockRotation()})};this.modeButtonClicked=e=>{let t=e.target.id.replace("-btn",""),s=pt.indexOf(t);this.switchToMode(s)};this.switchToMode=e=>{var o,a,r,h;let t=document.getElementById(`${pt[this.mode]}-btn`);t&&t.classList.remove("bg-pink-darker"),this.sidebar.innerHTML="",(a=(o=ne[this.mode]).deactivated)==null||a.call(o,this),(h=(r=ne[e]).activated)==null||h.call(r,this);let s=document.getElementById(`${pt[e]}-btn`);s&&s.classList.add("bg-pink-darker"),this.modeTitleHolder.innerText=ne[e].name,this.mode=e,this.sidebar.appendChild(ne[this.mode].element)};this.setupModes=()=>{let e=document.getElementById("button-holder");pt.forEach((t,s)=>{var a,r;let o=document.createElement("div");o.classList.add("big-button"),o.id=`${t}-btn`,o.textContent=ne[s].name,(r=(a=ne[s]).init)==null||r.call(a,this),o.onclick=this.modeButtonClicked,e&&e.appendChild(o)}),this.switchToMode(this.mode)};this.setTimeMultiplier=e=>{Number.isFinite(e)&&e>=0&&(this.timeMultiplier=e,e===0?this.pauseBtn.classList.add("bg-pink-darker"):this.pauseBtn.classList.remove("bg-pink-darker"))};this.getTimeMultiplier=()=>this.timeMultiplier;this.setPhysics=e=>{e instanceof xt&&(this.physics=e)};this.getPhysics=()=>this.physics;this.physics=new xt,this.mouseX=0,this.mouseY=0,this.oldMouseX=0,this.oldMouseY=0,this.mouseDown=!1,this.defaultSize=30,this.k=.5,this.fc=2,this.springConstant=2e3,this.scaling=1,this.viewOffsetX=0,this.viewOffsetY=0,this.mode=0,this.lastX=0,this.lastY=0,this.touchIDs=[],this.touchCoords=[],this.rightButtonDown=!1,this.timeMultiplier=1,this.lastFrameTime=performance.now(),this.choosed=!1,this.drawCollisions=!1,this.showAxes=!1,this.worldSize={width:0,height:0},this.collisionData=[],this.showBoundingBoxes=!1,this.showVelocities=!1,this.renderer=new dt,this.left=!1,this.right=!1,this.cnv=document.getElementById("defaulCanvas0"),this.canvasHolder=document.getElementById("canvas-holder"),this.sidebar=document.getElementById("sidebar"),this.modeTitleHolder=document.getElementById("mode-title-text"),this.pauseBtn=document.getElementById("pause"),this.setWorldSize({width:2e3,height:1e3}),this.physics.setGravity(new i(0,1e3)),this.physics.setAirFriction(.9),this.cnv.setAttribute("tabindex","1"),this.cnv.addEventListener("touchstart",this.startTouch,!1),this.cnv.addEventListener("touchend",this.endTouch,!1),this.cnv.addEventListener("touchmove",this.moveTouch,!1),this.cnv.addEventListener("mousedown",this.startMouse,!1),this.cnv.addEventListener("mouseup",this.endMouse,!1),this.cnv.addEventListener("mousemove",this.handleMouseMovement,!1),this.cnv.addEventListener("wheel",this.handleMouseWheel),this.cnv.addEventListener("contextmenu",e=>e.preventDefault()),this.cnv.addEventListener("keydown",this.keyGotDown,!1),this.cnv.addEventListener("keyup",this.keyGotUp,!1),window.addEventListener("resize",this.resizeCanvas,!1),this.resizeCanvas(),this.setupModes(),vt(this),requestAnimationFrame(this.drawFunction)}setWorldSize(e){this.physics.setBounds(0,0,e.width,e.height),this.worldSize=e}},yo=bo;window.onload=()=>{window.editorApp=new yo,"serviceWorker"in navigator&&navigator.serviceWorker.register("serviceworker.js").then(()=>{},n=>{console.log("ServiceWorker registration failed: ",n)})};})();
