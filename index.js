(()=>{var T=class{constructor(e,t){this.x=e,this.y=t}get copy(){return new T(this.x,this.y)}setCoordinates(e,t){this.x=e,this.y=t}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get sqlength(){return this.x*this.x+this.y*this.y}get heading(){if(this.x===0&&this.y===0)return 0;if(this.x===0)return this.y>0?Math.PI/2:1.5*Math.PI;if(this.y===0)return this.x>0?0:Math.PI;let e=T.normalized(this);return this.x>0&&this.y>0?Math.asin(e.y):this.x<0&&this.y>0?Math.asin(-e.x)+Math.PI/2:this.x<0&&this.y<0?Math.asin(-e.y)+Math.PI:this.x>0&&this.y<0?Math.asin(e.x)+1.5*Math.PI:0}add(e){this.x+=e.x,this.y+=e.y}sub(e){this.x-=e.x,this.y-=e.y}mult(e){this.x*=e,this.y*=e}div(e){this.x/=e,this.y/=e}lerp(e,t){this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t}dist(e){return new T(this.x-e.x,this.y-e.y).length}pNorm(e){let t=e;return t<1&&(t=1),(Math.abs(this.x**t)+Math.abs(this.y**t))**(1/t)}setMag(e){this.length!==0&&this.mult(e/this.length)}normalize(){this.length!==0&&this.div(this.length)}scaleAround(e,t){this.x=e.x+(this.x-e.x)*t,this.y=e.y+(this.y-e.y)*t}scaleAroundX(e,t){this.x=e.x+(this.x-e.x)*t}scaleAroundY(e,t){this.y=e.y+(this.y-e.y)*t}rotate(e){let t=Math.cos(e),s=Math.sin(e);this.setCoordinates(this.x*t-this.y*s,this.x*s+this.y*t)}static rotateArr(e,t){let s=Math.cos(t),o=Math.sin(t);e.forEach(a=>{a.setCoordinates(a.x*s-a.y*o,a.x*o+a.y*s)})}rotate90(){let{x:e}=this;this.x=-this.y,this.y=e}rotate270(){let{x:e}=this;this.x=this.y,this.y=-e}static add(e,t){return new T(e.x+t.x,e.y+t.y)}static sub(e,t){return new T(e.x-t.x,e.y-t.y)}static mult(e,t){return new T(e.x*t,e.y*t)}static div(e,t){return new T(e.x/t,e.y/t)}static fromAngle(e){return new T(Math.cos(e),Math.sin(e))}static fromAnglePNorm(e,t){let s=new T(Math.cos(e),Math.sin(e));return s.div(s.pNorm(t)),s}static lerp(e,t,s){return T.add(e,T.mult(T.sub(t,e),s))}static dist(e,t){return T.sub(e,t).length}static dot(e,t){return e.x*t.x+e.y*t.y}static cross(e,t){return e.x*t.y-e.y*t.x}static crossScalarFirst(e,t){return new T(-t.y*e,t.x*e)}static crossScalarSecond(e,t){return new T(e.y*t,-e.x*t)}static angle(e,t){return Math.acos(Math.min(Math.max(T.dot(e,t)/Math.sqrt(e.sqlength*t.sqlength),1),-1))}static angleACW(e,t){let s=e.heading,a=t.heading-s;return a<0?2*Math.PI+a:a}static normalized(e){let t=e.length;return t===0?e:new T(e.x/t,e.y/t)}toJSON(){return{x:this.x,y:this.y}}static fromObject(e){return new T(e.x,e.y)}rotateAround(e,t){this.sub(e),this.rotate(t),this.add(e)}},i=T;var yn=class{constructor(e,t){this.a=e,this.b=t}get length(){return i.dist(this.a,this.b)}distFromPoint(e){let t=i.sub(this.b,this.a),s=t.length;t.normalize();let o=i.sub(e,this.a),a=i.dot(t,o),r=i.cross(t,o);return a>=0&&a<=s?Math.abs(r):Math.sqrt(Math.min(o.sqlength,i.sub(e,this.b).sqlength))}get nearestPointO(){let e=i.sub(this.b,this.a);if(i.dot(this.a,e)>=0)return this.a.copy;if(i.dot(this.b,e)<=0)return this.b.copy;e.normalize();let t=-i.dot(this.a,e);return i.add(this.a,i.mult(e,t))}static intersect(e,t){let s=i.sub(e.b,e.a),o=s.y/s.x,a=e.b.y-e.b.x*o,r=i.sub(t.b,t.a),l=r.y/r.x,c=t.b.y-t.b.x*l;if(s.x===0&&r.x!==0){if(e.a.x>=t.a.x&&e.a.x<=t.b.x||e.a.x<=t.a.x&&e.a.x>=t.b.x){let g=l*e.a.x+c;if(g>e.a.y&&g<e.b.y||g<e.a.y&&g>e.b.y)return new i(e.a.x,g)}return!1}if(r.x===0&&s.x!==0){if(t.a.x>=e.a.x&&t.a.x<=e.b.x||t.a.x<=e.a.x&&t.a.x>=e.b.x){let g=o*t.a.x+a;if(g>t.a.y&&g<t.b.y||g<t.a.y&&g>t.b.y)return new i(t.a.x,g)}return!1}if(s.x===0&&r.x===0){if(e.a.x===t.a.x){let g;e.a.y<e.b.y?g=[e.a.y,e.b.y]:g=[e.b.y,e.a.y];let x;t.a.y<t.b.y?x=[t.a.y,t.b.y]:x=[t.b.y,t.a.y];let b=[g[0]>x[0]?g[0]:x[0],g[1]<x[1]?g[1]:x[1]];if(b[0]<=b[1])return new i(e.a.x,(b[0]+b[1])/2)}return!1}let f;e.a.x<e.b.x?f=[e.a.x,e.b.x]:f=[e.b.x,e.a.x];let u;t.a.x<t.b.x?u=[t.a.x,t.b.x]:u=[t.b.x,t.a.x];let d=[f[0]>u[0]?f[0]:u[0],f[1]<u[1]?f[1]:u[1]];if(o===l&&a===c&&d[0]<=d[1])return new i((d[0]+d[1])/2,(d[0]+d[1])/2*o+a);let p=(c-a)/(o-l);return p>=d[0]&&p<=d[1]?new i(p,p*o+a):!1}},O=yn;var xn=class extends O{get length(){return Number.POSITIVE_INFINITY}distFromPoint(e){let t=i.sub(this.a,this.b);t.setMag(1),t.rotate(Math.PI/2);let s=i.sub(e,this.a);return Math.abs(i.dot(s,t))}static intersect(e,t){let s=i.sub(e.b,e.a),o=s.y/s.x,a=e.b.y-e.b.x*o,r=i.sub(t.b,t.a),l=r.y/r.x,c=t.b.y-t.b.x*l;if(o===l)return e.distFromPoint(t.a)===0?new i((e.a.x+e.b.x+t.a.x+t.b.x)/4,(e.a.y+e.b.y+t.a.y+t.b.y)/4):!1;let f=(c-a)/(o-l);return new i(f,o*f+a)}static intersectWithLineSegment(e,t){let s=i.sub(e.b,e.a),o=s.y/s.x,a=e.b.y-e.b.x*o,r=i.sub(t.b,t.a),l=r.y/r.x,c=t.b.y-t.b.x*l;if(s.x===0){if(r.x===0)return e.a.x===t.a.x?new i((t.a.x+t.b.x)/2,(t.a.y+t.b.y)/2):!1;let d=e.a.x,p=l*d+c;return Math.min(t.a.x,t.b.x)<d&&d<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<p&&Math.max(t.a.y,t.b.y)>p?new i(d,p):!1}if(r.x===0){let d=t.a.x,p=o*d+a;return Math.min(t.a.x,t.b.x)<d&&d<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<p&&Math.max(t.a.y,t.b.y)>p?new i(d,p):!1}if(o===l)return e.distFromPoint(t.a)===0?new i((t.a.x+t.b.x)/2,(t.a.y+t.b.y)/2):!1;let f=(c-a)/(o-l),u=o*f+a;return Math.min(t.a.x,t.b.x)<f&&f<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<u&&Math.max(t.a.y,t.b.y)>u?new i(f,u):!1}},ee=xn;var L=class{constructor(e,t){this.min=e,this.max=t}size(){return this.max-this.min}add(e){this.min=Math.min(this.min,e.min),this.max=Math.max(this.max,e.max)}get copy(){return new L(this.min,this.max)}static fromPoints(...e){let t=new L(0,0);return t.min=Math.min(...e),t.max=Math.max(...e),t}};function qe(n){return new L(Math.min(...n),Math.max(...n))}function We(n,e){return new L(Math.max(n.min,e.min),Math.min(n.max,e.max))}var Z=class{constructor(e){if(e.length<3)throw new Error("Not enough points in polygon (minimum required: 3)");this.points=e,this.makeAntiClockwise()}getSideVector(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),i.sub(this.points[(t+1)%this.points.length],this.points[t%this.points.length])}getSideSegment(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),new O(i.fromObject(this.points[(t+1)%this.points.length]),i.fromObject(this.points[t%this.points.length]))}getSideLine(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),new O(i.fromObject(this.points[(t+1)%this.points.length]),i.fromObject(this.points[t%this.points.length]))}get sides(){return this.points.length}makeAntiClockwise(){let e=0;for(let t=1;t<=this.sides;t+=1){let s=this.getSideVector(t),o=this.getSideVector(t-1);o.mult(-1),e+=i.angleACW(s,o)}this.sides===3?e>Math.PI*1.5&&this.reverseOrder():this.sides===4?i.angleACW(this.getSideVector(1),this.getSideVector(0))>=Math.PI&&this.reverseOrder():this.sides>4&&e-this.sides*Math.PI>0&&this.reverseOrder()}reverseOrder(){this.points=this.points.reverse()}isPointInside(e){let t=new i(e.x,e.y);if(i.dist(t,this.centerPoint)>this.boundRadius)return!1;let s=this.centerPoint.copy;s.add(i.mult(new i(1.1,.6),this.boundRadius));let o=new O(t,s),a=0;return[...Array(this.sides).keys()].map(r=>this.getSideSegment(r)).forEach(r=>{O.intersect(r,o)&&(a+=1)}),a%2==0?!1:a%2==1}get centerPoint(){let e=new i(0,0);return this.points.forEach(t=>{e.add(t)}),e.div(this.sides),e}get boundRadius(){let e=this.centerPoint;return Math.max(...this.points.map(t=>i.dist(t,e)))}get allSides(){return[...Array(this.sides).keys()].map(e=>this.getSideSegment(e))}static intersection(e,t){if(i.dist(e.centerPoint,t.centerPoint)>e.boundRadius+t.boundRadius)return;let s=[],o=e.allSides,a=t.allSides;if(o.forEach((d,p)=>{a.forEach((g,x)=>{let b=O.intersect(d,g);typeof b=="object"&&"x"in b&&(b.isIntersectionPoint=!0,s.push({intersectionPoint:b,sideNum1:p,sideNum2:x}))})}),s.length===0){if(e.isPointInside(t.points[0]))return new Z(t.points.map(d=>i.fromObject(d)));if(t.isPointInside(e.points[0]))return new Z(e.points.map(d=>i.fromObject(d)))}let r=new Z(e.points);for(let d=r.points.length-1;d>=0;d-=1){let p=s.filter(g=>g.sideNum1===d);p.length>1&&p.sort((g,x)=>i.dist(r.points[d],g.intersectionPoint)-i.dist(r.points[d],x.intersectionPoint)),p.length>0&&r.points.splice(d+1,0,...p.map(g=>g.intersectionPoint))}let l=new Z(t.points);for(let d=l.points.length-1;d>=0;d-=1){let p=s.filter(g=>g.sideNum2===d);p.length>1&&p.sort((g,x)=>i.dist(l.points[d],g.intersectionPoint)-i.dist(l.points[d],x.intersectionPoint)),p.length>0&&l.points.splice(d+1,0,...p.map(g=>g.intersectionPoint))}let c={polyNum:1,pointNum:0};for(let d=0;d<r.points.length;d+=1)if("isIntersectionPoint"in r.points[d]){c.pointNum=d;break}else if(l.isPointInside(r.points[d])){c.pointNum=d;break}let f=!1,u=[];for(;!f;){let d=c.polyNum===1?r:l,p=c.polyNum===1?l:r;if(u.push(i.fromObject(d.points[c.pointNum%d.points.length])),u.length>2&&u[0].x===u[u.length-1].x&&u[0].y===u[u.length-1].y){u.pop();break}if(u.length>r.points.length+l.points.length)break;"isIntersectionPoint"in d.points[c.pointNum%d.points.length]?"isIntersectionPoint"in d.points[(c.pointNum+1)%d.points.length]||p.isPointInside(d.points[(c.pointNum+1)%d.points.length])&&!("isIntersectionPoint"in d.points[(c.pointNum+1)%d.points.length])?c.pointNum+=1:(c.pointNum=p.points.indexOf(d.points[c.pointNum%d.points.length])+1,c.polyNum=c.polyNum===1?2:1):c.pointNum+=1}return new Z(u)}static createCircle(e,t,s=25){let o=[...Array(s).keys()].map(a=>{let r=i.fromAngle(2*Math.PI*a/s);return r.setMag(e),r.add(t),r});return new Z(o)}static fracture(e,t=500){return e.map((o,a)=>{let r=[];for(let c=0;c<e.length;c+=1)if(a!==c){let f=e[c],u=i.div(i.add(o,f),2),d=i.sub(o,f);d.rotate(Math.PI/2),r.push(new ee(u,i.add(d,u)))}return r=r.filter((c,f)=>{let u=new O(c.a,o);for(let d=0;d<r.length;d+=1)if(f!==d&&ee.intersectWithLineSegment(r[d],u))return!1;return!0}),r=r.sort((c,f)=>i.sub(c.a,c.b).heading-i.sub(f.a,f.b).heading),r.map((c,f)=>{let u=[];for(let p=0;p<r.length;p+=1)if(f!==p){let g=ee.intersect(c,r[p]);g instanceof i&&u.push(g)}let d=i.sub(c.a,c.b);return u=u.filter(p=>{let g=i.sub(p,o);return d.setMag(1),i.dot(g,d)>0}),u.length===0&&u.push(i.add(i.mult(d,t*1.2),c.a)),u=u.sort((p,g)=>i.dist(p,o)-i.dist(g,o)),u[0]})}).filter(o=>o.length>=3).map(o=>new Z(o))}},ht=Z;var te=class{constructor(){this.r=0,this.points=[new i(0,0)]}static Circle(e,t){let s=new te;return s.r=Math.abs(e),s.points[0]=t.copy,s}static Polygon(e){let t=new te;if(e.length<3)throw new Error("A polygon needs at least 3 points to be valid!");return t.points=new ht(e).points.map(s=>i.fromObject(s)),t}getGeometricalData(){let e={center:this.points[0].copy,area:0,secondArea:0};if(this.r!==0)e.area=this.r*this.r*Math.PI,e.secondArea=.5*Math.PI*this.r**4;else{let t=[];for(let r=2;r<this.points.length;r+=1)t.push([this.points[0],this.points[r-1],this.points[r]]);let s=0,o=0,a=new i(0,0);t.forEach(r=>{let l=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),c=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),u=(l+c+f)/2,d=Math.sqrt(u*(u-l)*(u-c)*(u-f));s+=d,a.x+=d*(r[0].x+r[1].x+r[2].x)/3,a.y+=d*(r[0].y+r[1].y+r[2].y)/3}),a.div(s),e.center=a,e.area=s,t.forEach(r=>{let l=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),c=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),u=(l+c+f)/2,d=Math.sqrt(u*(u-l)*(u-c)*(u-f)),g=new ee(r[1],r[2]).distFromPoint(r[0]),x=i.sub(r[2],r[1]);x.rotate90(),x.add(r[1]),l=new ee(r[1],x).distFromPoint(r[0]);let v=(c*c*c*g-c*c*g*l+c*g*l*l+c*g*g*g)/36;v+=new i((r[0].x+r[1].x+r[2].x)/3,(r[0].y+r[1].y+r[2].y)/3).dist(e.center)**2*d,o+=v}),e.secondArea=o}return e}getMinMaxX(){let e=qe(this.points.map(t=>t.x));return e.min-=this.r,e.max+=this.r,e}getMinMaxY(){let e=qe(this.points.map(t=>t.y));return e.min-=this.r,e.max+=this.r,e}getMinMaxInDirection(e){let t=qe(this.points.map(s=>i.dot(s,e)));return t.min-=this.r,t.max+=this.r,t}move(e){this.points.forEach(t=>t.add(e))}rotateAround(e,t){this.points.forEach(s=>{s.sub(e)}),i.rotateArr(this.points,t),this.points.forEach(s=>{s.add(e)})}containsPoint(e){if(this.r!==0)return i.sub(e,this.points[0]).sqlength<=this.r*this.r;if(this.points.length===4){let s=new i(this.getMinMaxX().max+10,this.getMinMaxY().max+10),o=new O(e,s),a=0;return this.sides.forEach(r=>{O.intersect(r,o)&&(a+=1)}),a%2==1}return this.points.map((s,o)=>{let a=i.sub(this.points[(o+1)%this.points.length],s);return a.rotate90(),a}).every((s,o)=>i.dot(s,i.sub(e,this.points[o]))>=0)}get sides(){return this.points.map((e,t)=>new O(e,this.points[(t+1)%this.points.length]))}getSide(e){return new O(this.points[e],this.points[(e+1)%this.points.length])}getSideLine(e){return new ee(this.points[e],this.points[(e+1)%this.points.length])}getNormal(e){let t=i.sub(this.points[e],this.points[(e+1)%this.points.length]);return t.rotate90(),t.normalize(),t}getClosestPoint(e){let t=this.points.map(r=>i.sub(r,e).sqlength),s=t[0],o=0,a=t.length;for(let r=1;r<a;r+=1)t[r]<s&&(s=t[r],o=r);return this.points[o].copy}getConvexHull(){let e=this.points.map(a=>a),t=this.points[0],s=this.points[0];this.points.forEach(a=>{s.x<a.x&&(s=a),t.x>a.x&&(t=a)}),e.splice(e.indexOf(t),1),e.splice(e.indexOf(s),1);let o=new te;o.points=[t,s];for(let a=0;a<o.points.length;a+=1){if(e.length===0)return o;let r=o.getNormal(a),l=o.points[a],c=e[0],f=i.dot(i.sub(e[0],l),r);if(e.forEach((u,d)=>{if(d===0)return;let p=i.dot(i.sub(u,l),r);p>f&&(f=p,c=u)}),f>0){o.points.splice(a+1,0,c),e.splice(e.indexOf(c),1);for(let u=e.length-1;u>=0;u-=1)o.containsPoint(e[u])&&e.splice(u,1);a-=1}}return o}static fromObject(e){let t=new te;return t.r=e.r,t.points=e.points.map(s=>i.fromObject(s)),t}get copy(){let e=new te;return e.r=this.r,e.points=this.points.map(t=>t.copy),e}},P=te;var dt={white:"#faf3dd",green:"#02c39a",pink:"#e58c8a",pinkDarker:"#da5a58",pinkHover:"#de6a68",blue:"#3db2f1",black:"#363732",Beige:"#f2f3d9",Independence:"#38405f",Turquoise:"#5dd9c1","Rich Black FOGRA 29":"#0e131f","Independence 2":"#59546c","Roman Silver":"#8b939c","Imperial Red":"#ff0035","Hot Pink":"#fc6dab","Maximum Yellow Red":"#f5b841","Lavender Web":"#dcd6f7"},w=dt,vn=dt.Turquoise,R=dt.Turquoise;var to=15,Be=class{constructor(e,t=1,s=.2,o=.5){this.shape=e,this.k=s,this.fc=o;let a=this.shape.getGeometricalData();this.m=a.area*t,this.pos=a.center,this.am=a.secondArea*t,this.rotation=0,this.ang=0,this.vel=new i(0,0),this.layer=void 0,this.defaultAxes=[],this.axes=[],this.calculateAxes(),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()},this.minMaxes=[],this.calculateMinMaxes(),this.style=R,this.texture="none",this.textureTransform={offset:new i(0,0),scale:1,rotation:0},this.textureRepeat="repeat"}calculateAxes(){let e=Math.cos(Math.PI/to);this.defaultAxes=this.normals.map(t=>new i(t.x,Math.abs(t.y)));for(let t=this.defaultAxes.length-2;t>=0;t-=1)for(let s=this.defaultAxes.length-1;s>t;s-=1){let o=this.defaultAxes[s],a=this.defaultAxes[t];Math.abs(i.dot(o,a))>e&&(this.defaultAxes.splice(s,1),this.defaultAxes[t]=o)}this.axes=this.defaultAxes.map(t=>t.copy)}calculateMinMaxes(){this.minMaxes=this.axes.map(e=>this.shape.getMinMaxInDirection(e))}get normals(){if(this.shape.r!==0)return[new i(0,1)];let e=this.shape.points.map((t,s)=>i.sub(this.shape.points[(s+1)%this.shape.points.length],t));return e.forEach(t=>{t.rotate270(),t.normalize()}),e}move(e){this.shape.move(e),this.pos.add(e),this.boundingBox.x.max+=e.x,this.boundingBox.x.min+=e.x,this.boundingBox.y.max+=e.y,this.boundingBox.y.min+=e.y}rotate(e){this.rotation+=e,this.shape.r===0&&this.shape.rotateAround(this.pos,e),i.rotateArr(this.axes,e),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()}}rotateAround(e,t){this.rotation+=t,this.shape.rotateAround(e,t),this.pos.rotateAround(e,t),i.rotateArr(this.axes,t),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()}}velInPlace(e){let t=i.sub(e,this.pos);return t.rotate90(),t.mult(this.ang),t.add(this.vel),t}containsPoint(e){return this.shape.containsPoint(e)}get density(){return this.m/this.shape.getGeometricalData().area}set density(e){if(e<0||!Number.isFinite(e))return;let t=this.shape.getGeometricalData();this.m=t.area*e,this.am=t.secondArea*e}fixDown(){this.m=0}scaleAround(e,t){t!==0&&(this.pos.scaleAround(e,t),this.shape.points.forEach(s=>s.scaleAround(e,t)),this.shape.r=Math.abs(this.shape.r*t),this.m*=t**2,this.am*=t**4)}scaleAroundX(e,t){if(t===0)return;let{density:s}=this;this.shape.points.forEach(a=>a.scaleAroundX(e,t)),this.shape.r=Math.abs(this.shape.r*t);let o=this.shape.getGeometricalData();this.m=o.area*s,this.pos=o.center,this.am=o.secondArea*s,this.calculateAxes(),this.calculateMinMaxes()}scaleAroundY(e,t){if(t===0)return;let{density:s}=this;this.shape.points.forEach(a=>a.scaleAroundY(e,t)),this.shape.r=Math.abs(this.shape.r*t);let o=this.shape.getGeometricalData();this.m=o.area*s,this.pos=o.center,this.am=o.secondArea*s,this.calculateAxes(),this.calculateMinMaxes()}applyImpulse(e,t){if(this.m===0)return;let s=i.sub(e,this.pos);this.vel.add(i.div(t,this.m)),this.ang+=i.cross(s,t)/this.am}static detectCollision(e,t){let s=e,o=t;{let v=We(s.boundingBox.x,o.boundingBox.x);if(v.max<v.min)return!1;let M=We(s.boundingBox.y,o.boundingBox.y);if(M.max<M.min)return!1}let a=e.axes,r=t.axes;if(s.shape.r!==0){let v=o.shape.getClosestPoint(s.pos),M=i.sub(v,s.pos);M.normalize(),a=[M],s.minMaxes=[s.shape.getMinMaxInDirection(M)]}if(o.shape.r!==0){let v=s.shape.getClosestPoint(o.pos),M=i.sub(v,o.pos);M.normalize(),r=[M],o.minMaxes=[o.shape.getMinMaxInDirection(M)]}let l=[...a,...r],c=v=>s.shape.getMinMaxInDirection(v),f=v=>o.shape.getMinMaxInDirection(v),u=[];if(l.some((v,M)=>{let F;M<a.length?F=e.minMaxes[M]:F=c(v);let V;M>=a.length?V=t.minMaxes[M-a.length]:V=f(v);let k=We(F,V);return k.max<k.min?!0:(u.push(k),!1)}))return!1;let d=u.map(v=>v.size()),p=d[0],g=0;for(let v=1;v<d.length;v+=1)p>d[v]&&(p=d[v],g=v);let x=l[g].copy;i.dot(x,i.sub(s.pos,o.pos))>0&&x.mult(-1);let b;if(g<a.length){let v=o.shape.points.map(M=>i.dot(M,x));b=o.shape.points[v.indexOf(Math.min(...v))].copy,o.shape.r!==0&&b.sub(i.mult(x,o.shape.r))}else{let v=s.shape.points.map(M=>i.dot(M,x));b=s.shape.points[v.indexOf(Math.max(...v))].copy,s.shape.r!==0&&b.add(i.mult(x,s.shape.r))}return{normal:x,overlap:p,contactPoint:b}}static fromObject(e){let t=Object.create(Be.prototype);return t.am=e.am,t.ang=e.ang,t.axes=e.axes.map(s=>i.fromObject(s)),t.boundingBox={x:new L(e.boundingBox.x.min,e.boundingBox.x.max),y:new L(e.boundingBox.y.min,e.boundingBox.y.max)},t.defaultAxes=e.defaultAxes.map(s=>i.fromObject(s)),t.fc=e.fc,t.k=e.k,t.layer=e.layer,t.m=e.m,t.pos=i.fromObject(e.pos),t.rotation=e.rotation,t.shape=P.fromObject(e.shape),t.style=e.style,t.vel=i.fromObject(e.vel),t.minMaxes=[],t.calculateMinMaxes(),t}get copy(){let e=Object.create(Be.prototype);return e.am=this.am,e.ang=this.ang,e.axes=this.axes.map(t=>t.copy),e.boundingBox={x:this.boundingBox.x.copy,y:this.boundingBox.y.copy},e.defaultAxes=this.defaultAxes.map(t=>t.copy),e.fc=this.fc,e.k=this.k,e.layer=this.layer,e.m=this.m,e.pos=this.pos.copy,e.rotation=this.rotation,e.shape=this.shape.copy,e.style=this.style,e.vel=this.vel.copy,e.minMaxes=this.minMaxes.map(t=>t.copy),e.texture=this.texture,e.textureRepeat=this.textureRepeat,e.textureTransform={offset:this.textureTransform.offset.copy,rotation:this.textureTransform.rotation,scale:this.textureTransform.scale},e}},y=Be;var Ue=class{constructor(e,t){this.length=e,this.springConstant=t,this.pinned=!1,this.objects=[],this.rotationLocked=!1,this.initialHeading=0,this.initialOrientations=[0,0],this.attachPoints=[],this.attachRotations=[],this.attachPositions=[]}get copy(){let e=Object.create(Ue.prototype);return e.length=this.length,e.springConstant=this.springConstant,typeof this.pinned=="boolean"?e.pinned=this.pinned:e.pinned={x:this.pinned.x,y:this.pinned.y},e.objects=this.objects,e.rotationLocked=this.rotationLocked,e.initialHeading=this.initialHeading,e.initialOrientations=[...this.initialOrientations],e.attachPoints=this.attachPoints.map(t=>t.copy),e.attachRotations=[...this.attachRotations],e.attachPositions=this.attachPositions.map(t=>t.copy),e}pinHere(e,t){this.pinned={x:e,y:t}}unpin(){this.pinned=!1}attachObject(e,t=void 0){let s=this.objects;s.push(e),t?this.attachPoints.push(t.copy):this.attachPoints.push(e.pos.copy),this.attachPositions.push(e.pos.copy),this.attachRotations.push(e.rotation),s.length===2&&(this.pinned=!1),s.length>=3&&(s=[s[s.length-2],s[s.length-1]],this.attachPoints=[this.attachPoints[this.attachPoints.length-2],this.attachPoints[this.attachPoints.length-1]],this.attachPositions=[this.attachPositions[this.attachPositions.length-2],this.attachPositions[this.attachPositions.length-1]],this.attachRotations=[this.attachRotations[this.attachRotations.length-2],this.attachRotations[this.attachRotations.length-1]])}updateAttachPoint0(e,t=0){let s=this.rotationLocked;s&&this.unlockRotation(),this.attachPoints[0]=e.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=t&&(this.attachPoints[0]=this.attachPositions[0].copy),s&&this.lockRotation()}updateAttachPoint1(e,t=0){let s=this.rotationLocked;s&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=e.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=t&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=e.copy),s&&this.lockRotation()}get points(){let e=this.objects.map((t,s)=>{let o=i.sub(this.attachPoints[s],this.attachPositions[s]);return o.rotate(t.rotation-this.attachRotations[s]),i.add(o,t.pos)});return typeof this.pinned!="boolean"&&e.push(i.fromObject(this.pinned)),e}lockRotation(){this.rotationLocked=!0,this.initialOrientations=this.objects.map(t=>t.rotation);let e=this.points;this.initialHeading=i.sub(e[1],e[0]).heading}unlockRotation(){this.rotationLocked=!1}arrangeOrientations(){let e=this.points,s=i.sub(e[1],e[0]).heading-this.initialHeading;this.objects.forEach((o,a)=>{let r=this.initialOrientations[a]+s;o.rotate(r-o.rotation)})}getAsSegment(){let e=this.points;return new O(e[0],e[1])}update(e){this.rotationLocked&&this.arrangeOrientations();let t,s;if(this.pinned instanceof Object&&this.objects[0]){[s,t]=[this.pinned,this.objects[0]];let o=this.points,a=new i(o[1].x-o[0].x,o[1].y-o[0].y),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*e),t.applyImpulse(o[1],a);let l=t.vel;if(l.rotate(-a.heading),this.rotationLocked&&t.m!==0){let c=new i(s.x,s.y),u=i.sub(t.pos,c).length,d=u*u*t.m+t.am,p=(t.am*t.ang-u*t.m*l.y)/d;l.y=-p*u,t.ang=p}l.rotate(a.heading)}else if(this.objects[0]&&this.objects[1]){[t,s]=[this.objects[0],this.objects[1]];let o=this.points,a=i.sub(o[0],o[1]),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*e),s.applyImpulse(o[1],a),a.mult(-1),t.applyImpulse(o[0],a),a=i.sub(t.pos,s.pos);let l=t.vel,c=s.vel;if(l.rotate(-a.heading),c.rotate(-a.heading),this.rotationLocked&&t.m!==0&&s.m!==0){let f=new i(t.pos.x*t.m+s.pos.x*s.m,t.pos.y*t.m+s.pos.y*s.m);f.div(t.m+s.m);let u=i.sub(t.pos,f),d=i.sub(s.pos,f),p=u.length,g=d.length,x=p*p*t.m+t.am+g*g*s.m+s.am,b=(l.y-c.y)*g/(p+g)+c.y,v=(t.am*t.ang+s.am*s.ang+p*t.m*(l.y-b)-g*s.m*(c.y-b))/x;l.y=v*p+b,c.y=-v*g+b,t.ang=v,s.ang=v}l.rotate(a.heading),c.rotate(a.heading)}}rotateAround(e,t){if(typeof this.pinned=="boolean")return;let s=i.fromObject(this.pinned);s.rotateAround(e,t),this.pinned.x=s.x,this.pinned.y=s.y}scaleAround(e,t){if(typeof this.pinned=="boolean")return;let s=i.fromObject(this.pinned);s.scaleAround(e,t),this.pinned.x=s.x,this.pinned.y=s.y}getMinMaxX(){let e=[...this.objects.map(t=>t.pos.x)];return typeof this.pinned!="boolean"&&e.push(this.pinned.x),L.fromPoints(...e)}getMinMaxY(){let e=[...this.objects.map(t=>t.pos.y)];return typeof this.pinned!="boolean"&&e.push(this.pinned.y),L.fromPoints(...e)}},B=Ue;var Ge=class extends B{constructor(e){super(e,0);this.springConstant=0}get copy(){let e=Object.create(Ge.prototype);return e.length=this.length,e.springConstant=this.springConstant,typeof this.pinned=="boolean"?e.pinned=this.pinned:e.pinned={x:this.pinned.x,y:this.pinned.y},e.objects=this.objects,e.rotationLocked=this.rotationLocked,e.initialHeading=this.initialHeading,e.initialOrientations=[...this.initialOrientations],e.attachPoints=this.attachPoints.map(t=>t.copy),e.attachRotations=[...this.attachRotations],e.attachPositions=this.attachPositions.map(t=>t.copy),e}updateAttachPoint0(e,t=0){let s=this.rotationLocked;s&&this.unlockRotation(),this.attachPoints[0]=e.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=t&&(this.attachPoints[0]=this.attachPositions[0].copy),this.length=this.getAsSegment().length,s&&this.lockRotation()}updateAttachPoint1(e,t=0){let s=this.rotationLocked;s&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=e.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=t&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=e.copy),this.length=this.getAsSegment().length,s&&this.lockRotation()}update(){this.rotationLocked&&this.arrangeOrientations();let e,t;if(this.pinned instanceof Object&&"x"in this.pinned&&this.objects[0]){if([t,e]=[this.pinned,this.objects[0]],e.m===0)return;let s=this.points,o=new i(s[1].x-s[0].x,s[1].y-s[0].y);o.setMag(o.length-this.length),e.move(o),o=new i(s[1].x-s[0].x,s[1].y-s[0].y),o.normalize();let a=s[0],r=o,l=e,c=i.sub(a,l.pos),f=i.mult(l.velInPlace(a),-1),u=1/l.m;u+=i.dot(i.crossScalarFirst(i.cross(c,r)/l.am,c),r),u=-i.dot(f,r)/u;let d=i.sub(l.vel,i.mult(r,u/l.m)),p=l.ang-u*i.cross(c,r)/l.am;e.vel=d,e.ang=p;let g=e.vel;if(g.rotate(-o.heading),this.rotationLocked&&e.m!==0){let x=new i(t.x,t.y),v=i.sub(e.pos,x).length,M=v*v*e.m+e.am,F=(e.am*e.ang+v*e.m*g.y)/M;g.y=F*v,e.ang=F}g.rotate(o.heading)}else if(this.objects[0]&&this.objects[1]){[e,t]=[this.objects[0],this.objects[1]];let s=this.points,o=i.sub(s[0],s[1]),a=this.length-o.length;o.setMag(1);let r=e,l=t,c=r.m===0?Infinity:r.m,f=l.m===0?Infinity:l.m,u,d;if(c!==Infinity&&f!==Infinity)u=i.mult(o,a*f/(c+f)),d=i.mult(o,-a*c/(c+f));else if(c===Infinity&&f!==Infinity)u=new i(0,0),d=i.mult(o,-a);else if(c!==Infinity&&f===Infinity)d=new i(0,0),u=i.mult(o,a);else return;e.move(u),t.move(d),s=this.points,o=i.sub(s[1],s[0]),o.normalize();let p=o,g=s[0],x=s[1],b=r.ang,v=l.ang,M=i.sub(g,r.pos),F=i.sub(x,l.pos),V=r.m===0?Infinity:r.am,k=l.m===0?Infinity:l.am,_=r.velInPlace(g),K=l.velInPlace(x),z=i.sub(K,_),Y=1/c+1/f;Y+=i.dot(i.crossScalarFirst(i.cross(M,p)/V,M),p),Y+=i.dot(i.crossScalarFirst(i.cross(F,p)/k,F),p),Y=-i.dot(z,p)/Y;let re=i.sub(r.vel,i.mult(p,Y/c)),Pe=i.add(l.vel,i.mult(p,Y/f)),Ie=b-Y*i.cross(M,p)/V,j=v+Y*i.cross(F,p)/k;e.m!==0&&(e.vel=re,e.ang=Ie),t.m!==0&&(t.vel=Pe,t.ang=j);let q=e.vel,W=t.vel;if(q.rotate(-o.heading),W.rotate(-o.heading),this.rotationLocked&&e.m!==0&&t.m!==0){let lt=new i(e.pos.x*e.m+t.pos.x*t.m,e.pos.y*e.m+t.pos.y*t.m);lt.div(e.m+t.m);let Ce=i.sub(e.pos,lt).length,fe=i.sub(t.pos,lt).length,eo=Ce*Ce*e.m+e.am+fe*fe*t.m+t.am,He=(q.y-W.y)*fe/(Ce+fe)+W.y,Ve=(e.am*e.ang+t.am*t.ang+Ce*e.m*(q.y-He)-fe*t.m*(W.y-He))/eo;q.y=Ve*Ce+He,W.y=-Ve*fe+He,e.ang=Ve,t.ang=Ve}q.rotate(o.heading),W.rotate(o.heading)}}},E=Ge;function no(n,e,t,s){let o=s,a=t,r=n,l=e,c=r.vel,f=l.vel,u=r.ang,d=l.ang,p=i.sub(a,r.pos),g=i.sub(a,l.pos),x=r.am,b=l.am,v=r.m,M=l.m,F=(r.k+l.k)/2,V=(r.fc+l.fc)/2,k=r.velInPlace(a),_=l.velInPlace(a),K=i.sub(_,k),z=1/v+1/M;z+=i.dot(i.crossScalarFirst(i.cross(p,o)/x,p),o),z+=i.dot(i.crossScalarFirst(i.cross(g,o)/b,g),o),z=-((1+F)*i.dot(K,o))/z;let Y=i.sub(c,i.mult(o,z/v)),re=i.add(f,i.mult(o,z/M)),Pe=u-z*i.cross(p,o)/x,Ie=d+z*i.cross(g,o)/b,j=K.copy;if(j.sub(i.mult(o,i.dot(K,o))),j.setMag(1),i.dot(o,j)**2>.5)return[{dVel:i.sub(Y,r.vel),dAng:Pe-r.ang},{dVel:i.sub(re,l.vel),dAng:Ie-l.ang}];let q=1/v+1/M;q+=i.dot(i.crossScalarFirst(i.cross(p,j)/x,p),j),q+=i.dot(i.crossScalarFirst(i.cross(g,j)/b,g),j),q=-i.dot(K,j)/q;let W=Math.sign(q)*z*V;return Math.abs(W)>Math.abs(q)&&(W=q),Y=i.sub(Y,i.mult(j,W/v)),re=i.add(re,i.mult(j,W/M)),Pe-=W*i.cross(p,j)/x,Ie+=W*i.cross(g,j)/b,[{dVel:i.sub(Y,r.vel),dAng:Pe-r.ang},{dVel:i.sub(re,l.vel),dAng:Ie-l.ang}]}function wn(n,e,t){let s=e,o=t,a=n,r=i.sub(s,a.pos),{am:l,m:c}=a,f=i.mult(a.velInPlace(s),-1),u=1/c;u+=i.dot(i.crossScalarFirst(i.cross(r,o)/l,r),o),u=-((1+a.k)*i.dot(f,o))/u;let d=i.sub(a.vel,i.mult(o,u/c)),p=a.ang-u*i.cross(r,o)/l,g=f.copy;if(g.sub(i.mult(o,i.dot(f,o))),g.setMag(1),i.dot(o,g)**2>.5)return{dVel:i.sub(d,a.vel),dAng:p-a.ang};let x=1/c;x+=i.dot(i.crossScalarFirst(i.cross(r,g)/l,r),g),x=-i.dot(f,g)/x;let b=Math.sign(x)*u*a.fc;return Math.abs(b)>Math.abs(x)&&(b=x),d=i.sub(d,i.mult(g,b/c)),p-=b*i.cross(r,g)/l,{dVel:i.sub(d,a.vel),dAng:p-a.ang}}function kn(n){let e=[],t=n.length,s=Array(t).fill(0),o=Array(t).fill(0),a=Array(t).fill(0),r=Array(t).fill(0),l=Array(t).fill(0),c=Array(t).fill(0);n.forEach(f=>f.calculateMinMaxes());for(let f=0;f<t-1;f+=1)for(let u=f+1;u<t;u+=1){let d=n[f],p=n[u];if(d.m===0&&p.m===0||Number.isFinite(d.layer)&&Number.isFinite(p.layer)&&d.layer===p.layer)continue;let g=y.detectCollision(d,p);if(g&&typeof g!="boolean"){let x=i.dot(d.velInPlace(g.contactPoint),g.normal),b=i.dot(p.velInPlace(g.contactPoint),g.normal);e.push({n:g.normal,cp:g.contactPoint});let v=-g.overlap,M=g.overlap;if(d.m===0){v=0;let k=wn(p,g.contactPoint,i.mult(g.normal,-1));r[u]+=k.dVel.x,l[u]+=k.dVel.y,c[u]+=k.dAng,a[u]+=1}else if(p.m===0){M=0;let k=wn(d,g.contactPoint,i.mult(g.normal,1));r[f]+=k.dVel.x,l[f]+=k.dVel.y,c[f]+=k.dAng,a[f]+=1}else{v*=p.m/(d.m+p.m),M*=d.m/(d.m+p.m);let[k,_]=no(d,p,g.contactPoint,i.mult(g.normal,1));x>=b&&(r[f]+=k.dVel.x,l[f]+=k.dVel.y,c[f]+=k.dAng,r[u]+=_.dVel.x,l[u]+=_.dVel.y,c[u]+=_.dAng)}let F=i.mult(g.normal,v),V=i.mult(g.normal,M);s[f]+=F.x,s[u]+=V.x,o[f]+=F.y,o[u]+=V.y}}for(let f=0;f<t;f+=1){let u=n[f];if(u.m===0)continue;let d=Math.max(a[f],1);u.move(new i(s[f],o[f])),u.vel.add(new i(r[f]/d,l[f]/d)),u.ang+=c[f]/d}return e}var Ee=class{constructor(){this.bodies=[],this.springs=[],this.airFriction=1,this.gravity=new i(0,0)}update(e){let t=[];for(let s=0;s<this.bodies.length;s+=1)this.bodies[s].move(new i(this.bodies[s].vel.x*e,this.bodies[s].vel.y*e)),this.bodies[s].rotate(this.bodies[s].ang*e);this.springs.forEach((s,o,a)=>{a[a.length-1-o].update(e/2),s.update(e/2)});for(let s=0;s<this.bodies.length;s+=1)this.bodies[s].m!==0&&this.bodies[s].vel.add(new i(this.gravity.x*e,this.gravity.y*e));return t=kn(this.bodies),this.bodies.forEach(s=>{let o=s;s.m!==0&&(o.vel.mult(this.airFriction**e),o.ang*=this.airFriction**e)}),t}get copy(){let e=new Ee;return e.airFriction=this.airFriction,e.gravity=this.gravity.copy,e.bodies=this.bodies.map(t=>t.copy),e.springs=this.springs.map(t=>{let s=t.objects.map(a=>this.bodies.indexOf(a)).map(a=>e.bodies[a]),o=t.copy;return o.objects=s,o}),e}getFreeLayer(){let e=new Set;return this.bodies.forEach(t=>{typeof t.layer=="number"&&e.add(t.layer)}),Math.max(...e)+1}setAirFriction(e){!Number.isFinite(e)||(this.airFriction=e,this.airFriction<0&&(this.airFriction=0),this.airFriction>1&&(this.airFriction=1))}setGravity(e){this.gravity=e.copy}addBody(e){this.bodies.push(e)}addSoftSquare(e,t,s,o,a=24,r=1){let l={sides:[],points:[]},c=Math.sqrt(t*t/Math.PI);l.points=[...new Array(a).keys()].map(p=>2*p*Math.PI/a).map(p=>i.add(i.mult(i.fromAngle(p),c),e)).map(p=>new y(P.Circle(Math.PI*c/a,p),1,.2,s));let f=this.getFreeLayer();l.points.forEach(p=>{p.layer=f}),l.sides=l.points.map((p,g)=>{let x=new E(1);return x.attachObject(p),x.attachObject(l.points[(g+1)%l.points.length]),x.lockRotation(),x}),l.sides.forEach(p=>{let g=p;g.length=.96*4*t/a}),l.points.forEach(p=>{let g=p;g.vel=o.copy}),this.bodies.push(...l.points),this.springs.push(...l.sides);let u=t*t*200*r,d=new B(Math.sqrt(c*c*Math.PI*1.1),u/2);d.attachObject(l.points[0]),d.attachObject(l.points[a/2]),this.springs.push(d),d=new B(Math.sqrt(c*c*Math.PI*1.1),u/2),d.attachObject(l.points[a/4]),d.attachObject(l.points[3*a/4]),this.springs.push(d),d=new B(Math.sqrt(2*c*c*Math.PI*1.1),u),d.attachObject(l.points[a/8]),d.attachObject(l.points[5*a/8]),this.springs.push(d),d=new B(Math.sqrt(2*c*c*Math.PI*1.1),u),d.attachObject(l.points[3*a/8]),d.attachObject(l.points[7*a/8]),this.springs.push(d)}addRectWall(e,t,s,o){let a=[];a.push(new i(e-s/2,t-o/2)),a.push(new i(e+s/2,t-o/2)),a.push(new i(e+s/2,t+o/2)),a.push(new i(e-s/2,t+o/2)),this.bodies.push(new y(P.Polygon(a),0))}addRectBody(e,t,s,o,a,r,l=R){let c=[];c.push(new i(e-s/2,t-o/2)),c.push(new i(e+s/2,t-o/2)),c.push(new i(e+s/2,t+o/2)),c.push(new i(e-s/2,t+o/2));let f=new y(P.Polygon(c),1,r,a);f.style=l,this.bodies.push(f)}addFixedBall(e,t,s){this.bodies.push(new y(P.Circle(s,new i(e,t)),0)),this.bodies[this.bodies.length-1].style=w.Beige}addSpring(e){this.springs.push(e)}getSpringsWithBody(e){return this.springs.filter(t=>t.objects.includes(e))}setBounds(e,t,s,o){let a=(r,l,c,f)=>{let u=[];return u.push(new i(r-c/2,l-f/2)),u.push(new i(r+c/2,l-f/2)),u.push(new i(r+c/2,l+f/2)),u.push(new i(r-c/2,l+f/2)),new y(P.Polygon(u),0)};this.bodies[0]=a(e-s,t,2*s,4*o),this.bodies[1]=a(e+2*s,t,2*s,4*o),this.bodies[2]=a(e,t-o,4*s,o*2),this.bodies[3]=a(e+s/2,t+2*o,5*s,2*o);for(let r=0;r<4;r+=1)this.bodies[r].style=w.Beige}getObjectAtCoordinates(e,t,s=0){let o=!1,a=new i(e,t);return this.bodies.some((r,l)=>r.containsPoint(a)&&l>=s?(o=r,!0):!1),o}removeObjFromSystem(e){let t=-1;if(e instanceof y&&(t=this.bodies.indexOf(e)),t!==-1){let s=this.getSpringsWithBody(this.bodies[t]);this.bodies.splice(t,1),s.forEach(o=>{this.removeObjFromSystem(o)});return}(e instanceof E||e instanceof B)&&(t=this.springs.indexOf(e)),t!==-1&&this.springs.splice(t,1)}getObjectIdentifier(e){return e instanceof y?{type:"body",index:this.bodies.indexOf(e)}:{type:"nothing",index:-1}}toJSON(){let e={};return e.airFriction=this.airFriction,e.gravity=this.gravity.toJSON(),e.bodies=this.bodies.map(t=>t.copy),e.springs=this.springs.map(t=>{let s={};return s.length=t.length,s.pinned=t.pinned,s.rotationLocked=t.rotationLocked,s.springConstant=t.springConstant,t instanceof B?s.type="spring":t instanceof E&&(s.type="stick"),s.objects=t.objects.map(o=>this.getObjectIdentifier(o)),s}),e}stickOrSpringFromObject(e){let t={};return e.type==="spring"?t=new B(e.length,e.springConstant):e.type==="stick"&&(t=new E(e.length)),t.pinned=e.pinned,t.rotationLocked=e.rotationLocked,t.objects=e.objects.map(s=>this.bodies[s.index]),t}static fromObject(e){let t=new Ee;return t.bodies=e.bodies.map(s=>y.fromObject(s)),t.airFriction=e.airFriction,t.gravity=i.fromObject(e.gravity),t.springs=e.springs.map(s=>t.stickOrSpringFromObject(s)),t}};var mt=Ee;var _e=class{constructor(){this.bodies=[],this.springs=[]}addBody(e){this.bodies.push(e)}addSpring(e){this.springs.push(e)}move(e){this.bodies.forEach(t=>t.move(e)),this.springs.forEach(t=>{if(typeof t.pinned!="boolean"){let s=t.pinned;s.x+=e.x,s.y+=e.y}})}scaleAround(e,t){this.bodies.forEach(s=>{s.scaleAround(e,t),s.texture!=="none"&&(s.textureTransform.scale*=t,s.textureTransform.offset.mult(t))}),this.springs.forEach(s=>s.scaleAround(e,t))}rotateAround(e,t){this.bodies.forEach(s=>s.rotateAround(e,t)),this.springs.forEach(s=>s.rotateAround(e,t))}get boundingBox(){let e;this.bodies.length!==0?(e=this.bodies[0].shape.getMinMaxX(),this.bodies.forEach(s=>e.add(s.boundingBox.x)),this.springs.forEach(s=>e.add(s.getMinMaxX()))):this.springs.length!==0?(e=this.springs[0].getMinMaxX(),this.springs.forEach(s=>e.add(s.getMinMaxX()))):e=new L(0,0);let t;return this.bodies.length!==0?(t=this.bodies[0].shape.getMinMaxY(),this.bodies.forEach(s=>t.add(s.boundingBox.y)),this.springs.forEach(s=>t.add(s.getMinMaxY()))):this.springs.length!==0?(t=this.springs[0].getMinMaxY(),this.springs.forEach(s=>t.add(s.getMinMaxY()))):t=new L(0,0),{x:e,y:t}}removeUnusedSprings(){for(let e=this.springs.length-1;e>=0;e-=1)this.springs[e].objects.some(s=>!this.bodies.includes(s))&&this.springs.splice(e,1)}get copy(){let e=Object.create(_e.prototype);return this.removeUnusedSprings(),e.bodies=this.bodies.map(t=>t.copy),e.springs=this.springs.map(t=>[...t.objects.map(s=>this.bodies.indexOf(s))]).map((t,s)=>{let o=this.springs[s].copy;return o.objects=t.map(a=>e.bodies[a]),o}),e}},ut=_e;function so(n,e="none"){let t=n.copy;return t.texture=e,t}function oo(n,e){let t={};return t.length=n.length,t.springConstant=n.springConstant,typeof n.pinned=="boolean"?t.pinned=n.pinned:t.pinned={x:n.pinned.x,y:n.pinned.y},t.rotationLocked=n.rotationLocked,t.initialHeading=n.initialHeading,t.initialOrientations=[...n.initialOrientations],t.attachPoints=n.attachPoints.map(s=>s.copy),t.attachRotations=[...n.attachRotations],t.attachPositions=n.attachPositions.map(s=>s.copy),t.objects=[...n.objects.map(s=>e.bodies.indexOf(s))],n instanceof E?t.type="stick":t.type="spring",t}function io(n){let e=document.createElement("cnv");return e.width=n.width,e.height=n.height,e.getContext("2d").drawImage(n,0,0,n.width,n.height),e.toDataURL()}function ao(n){let e={};n.removeUnusedSprings();let t=n.bodies.map(c=>c.texture),s=[...new Set(t)],o=n.bodies.map(c=>s.indexOf(c.texture)),a=s.map(c=>typeof c=="string"?c:io(c)),r=[...new Set(a)],l=o.map(c=>r.indexOf(a[c]));return e.textureSet=r,e.bodies=n.bodies.map((c,f)=>so(c,l[f])),e.springs=n.springs.map(c=>oo(c,n)),e}function Mn(n){return JSON.stringify(ao(n))}var ro="user-content",Je="creations",Sn="worlds",Te=window.indexedDB.open(ro,1),ce;Te.onupgradeneeded=()=>{ce=Te.result,ce.objectStoreNames.contains(Je)||ce.createObjectStore(Je,{keyPath:"name"}).createIndex("description","description"),ce.objectStoreNames.contains(Sn)||ce.createObjectStore(Sn,{keyPath:"name"}).createIndex("description","description")};Te.onerror=()=>{throw new Error("Could not open database")};Te.onsuccess=()=>{ce=Te.result};function Pn(n){let e={name:n.name,description:n.description,thumbnail:n.thumbnail,content:Mn(n.content)},o=ce.transaction(Je,"readwrite").objectStore(Je).put(e);o.onerror=()=>{console.log("storing failed")},o.onsuccess=()=>{console.log("storing completed")}}var Qe,In,Re;function Fe(n){In=n,n?Re.classList.add("bg-pink-darker"):Re.classList.remove("bg-pink-darker")}function ft(n){Qe=n.getPhysics().copy,Re=document.getElementById("set start"),Fe(!1);let e=document.getElementById("pause");e&&(e.onclick=()=>{n.getTimeMultiplier()!==0?n.setTimeMultiplier(0):(n.setTimeMultiplier(1),In===!0&&(Qe=n.getPhysics().copy),Fe(!1))});let t=document.getElementById("revert");t&&(t.onclick=()=>{n.setTimeMultiplier(0),n.setPhysics(Qe.copy),Fe(!0)});let s=document.getElementById("clear all");s&&(s.onclick=()=>{Fe(!0);let a=n.getPhysics();a.springs=[],a.bodies=[]}),Re&&(Re.onclick=()=>{Qe=n.getPhysics().copy,Fe(!0),n.setTimeMultiplier(0)});let o=!1;document.addEventListener("visibilitychange",()=>{document.hidden?n.getTimeMultiplier()!==0?(n.setTimeMultiplier(0),o=!0):o=!1:o&&n.setTimeMultiplier(1)})}function h(n,e,...t){let s=document.createElement(n);return e&&Object.entries(e).forEach(([o,a])=>{s[o]=a}),t&&t.forEach(o=>{typeof o=="string"?s.appendChild(document.createTextNode(o)):o instanceof HTMLElement&&s.appendChild(o)}),s}var Cn=document.createElement("template");Cn.innerHTML=`
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
`;var Bn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Cn.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",{className:"number-label"},h("span",null,h("slot",null)),h("span",{id:"numberPlace"})))}set value(e){this.shadowRoot.querySelector("#numberPlace").innerText=e}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}};window.customElements.define("number-display",Bn);var En=document.createElement("template");En.innerHTML=`
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
`;var Tn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(En.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",{className:"cursor-pointer"},h("label",{htmlFor:"cbIdentifier",className:"checkbox-label"},h("input",{type:"checkbox",className:"ch-box",id:"cbIdentifier"}),h("div",{className:"checkbox-display"}),h("div",{className:"label-text"},h("slot",null))))),this.shadowRoot.querySelector(".checkbox-display").innerHTML='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.877px" height="101.052px" viewBox="0 0 122.877 101.052" id="checkmark-svg" enable-background="new 0 0 122.877 101.052" xml:space="preserve"><g><path d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"/></g></svg>',this.shadowRoot.querySelector("#checkmark-svg").classList.add("checkmark")}get checkbox(){return this.shadowRoot.querySelector("#cbIdentifier")}set checked(e){this.checkbox.checked=e}set onChange(e){this.checkbox.onchange=t=>e(t.target.checked)}};window.customElements.define("check-box",Tn);var ne={spring:!0,body:!0},co=7,Rn=document.createElement("div");function Fn(n){if(!ne.spring)return!1;let e=new i(n.mouseX,n.mouseY),t=n.physics.springs.find(s=>s.getAsSegment().distFromPoint(e)<=co);return typeof t=="undefined"?!1:t}var lo={name:"Delete",description:"",element:Rn,drawFunc(n,e){let t=ne.body&&n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY,4);if(typeof t!="boolean"){let o=n.cnv.getContext("2d");o.save(),o.fillStyle="#00000000",o.strokeStyle=w["Imperial Red"],o.lineWidth=3,n.renderer.renderBody(t,o),o.restore();return}let s=Fn(n);if(s){let o=n.cnv.getContext("2d");o.save(),o.fillStyle="#00000000",o.strokeStyle=w["Imperial Red"],o.lineWidth=3,s instanceof E?n.renderer.renderStick(s,o):n.renderer.renderSpring(s,o),o.restore()}},startInteractionFunc(n){let e=Fn(n);n.choosed&&n.choosed instanceof y&&ne.body?n.physics.removeObjFromSystem(n.choosed):ne.spring&&e&&n.physics.removeObjFromSystem(e)}};Rn.append(h("number-display",null,"Deletable types:"),h("check-box",{checked:ne.body,onChange:n=>{ne.body=n}},"Body"),h("check-box",{checked:ne.spring,onChange:n=>{ne.spring=n}},"Stick/Spring"));var On=lo;var ho=document.createElement("div"),mo={name:"Move",description:"",element:ho,drawFunc(n,e){let{choosed:t}=n,s=new i(n.mouseX,n.mouseY),o=t||n.physics.getObjectAtCoordinates(s.x,s.y,4);if(o instanceof y){let a=n.cnv.getContext("2d");a.save(),a.lineWidth=3,a.globalAlpha=.6,a.strokeStyle="#FFFFFF",a.fillStyle="#00000000",n.renderer.renderBody(o,a),a.restore()}if(t instanceof y&&t.m!==0){let a=new i(n.oldMouseX,n.oldMouseY),r=i.sub(s,a);e===0?(t.vel.x=0,t.vel.y=0,t.move(r)):(s.x<t.boundingBox.x.min?t.move(new i(s.x-t.boundingBox.x.min,0)):s.x>t.boundingBox.x.max&&t.move(new i(s.x-t.boundingBox.x.max,0)),s.y<t.boundingBox.y.min?t.move(new i(0,s.y-t.boundingBox.y.min)):s.y>t.boundingBox.y.max&&t.move(new i(0,s.y-t.boundingBox.y.max)),t.vel.x=r.x/e,t.vel.y=r.y/e),t.ang=0}},startInteractionFunc(n){let{choosed:e}=n;if(e instanceof y&&e.m!==0){let t=n;t.cnv.style.cursor="grabbing"}},endInteractionFunc(n){let{choosed:e}=n;if(e instanceof y&&e.m!==0){let t=n;t.cnv.style.cursor="grab"}},activated(n){let e=n;e.cnv.style.cursor="grab"},deactivated(n){let e=n;e.cnv.style.cursor="default"}},Xn=mo;var Yn=document.createElement("template");Yn.innerHTML=`
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
`;var Ln=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Yn.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",{id:"btn"},h("slot",null))),this.hidden=!1}set bgColor(e){this.btn.style.backgroundColor=e}set textColor(e){this.btn.style.color=e}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(e){this.btn.onclick=e}set onEnter(e){this.btn.onpointerenter=e}set onLeave(e){this.btn.onpointerleave=e}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}asUpper(){this.btn.classList.add("upper")}asMiddle(){this.btn.classList.remove("upper"),this.btn.classList.remove("last")}asLast(){this.btn.classList.add("last")}};window.customElements.define("hover-detector-btn",Ln);var Dn=document.createElement("template");Dn.innerHTML=`
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
`;var zn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Dn.content.cloneNode(!0)),this.customHeightDiv=h("div",null),this.customHeightDiv.style.height="1rem",this.shadowRoot.appendChild(this.customHeightDiv)}set height(e){this.customHeightDiv.style.height=`${e}rem`}};window.customElements.define("space-height",zn);var Nn=document.createElement("template");Nn.innerHTML=`
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
`;var jn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Nn.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",null,h("p",{className:"slider-label"},h("slot",null)),h("input",{id:"slider",type:"range",className:"slider"})))}get slider(){return this.shadowRoot.querySelector("#slider")}set min(e){this.slider.min=e}set max(e){this.slider.max=e}set step(e){this.slider.step=e}set value(e){this.slider.value=e}set onChange(e){this.slider.onchange=t=>e(t.target.valueAsNumber),this.slider.oninput=t=>e(t.target.valueAsNumber)}};window.customElements.define("range-slider",jn);var Hn=document.createElement("template");Hn.innerHTML=`
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
`;var Vn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Hn.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",null,h("label",{htmlFor:"colorWell",className:"picker-label"},h("div",null,h("slot",null)),h("input",{type:"color",id:"colorWell"}))))}get picker(){return this.shadowRoot.querySelector("#colorWell")}set value(e){this.picker.value=e,this.picker.style["background-color"]=e}set onChange(e){let t=s=>{e(s.target.value),this.picker.style["background-color"]=s.target.value};this.picker.onchange=t,this.picker.oninput=t}};window.customElements.define("color-picker",Vn);var Oe=35,pt=.5,gt=1.5,bt=vn,qn=document.createElement("div"),uo={name:"Ball",description:"",element:qn,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black",n.mouseDown?(t.beginPath(),t.arc(n.lastX,n.lastY,Oe,0,2*Math.PI),t.stroke()):(t.beginPath(),t.arc(n.mouseX,n.mouseY,Oe,0,2*Math.PI),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new y(P.Circle(Oe,new i(n.lastX,n.lastY)),1,pt,gt);e.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),e.style=bt,Number.isFinite(e.pos.x)&&Number.isFinite(e.pos.y)&&Number.isFinite(e.vel.x)&&Number.isFinite(e.vel.y)||(e.vel.x=0,e.vel.y=0),n.physics.addBody(e)}}};qn.append(h("range-slider",{min:5,max:120,step:1,value:Oe,onChange:n=>{Oe=n}},"Size"),h("range-slider",{min:0,max:1,step:.02,value:pt,onChange:n=>{pt=n}},"Bounciness"),h("range-slider",{min:0,max:2,step:.1,value:gt,onChange:n=>{gt=n}},"Coefficient of friction"),h("color-picker",{value:bt,onChange:n=>{bt=n}},"Color:"));var Wn=uo;var fo=document.createElement("div"),po={name:"Rectangle wall",description:"",element:fo,drawFunc(n,e){if(n.lastX!==0&&n.lastY!==0){let t=n.cnv.getContext("2d");t.strokeStyle="black",t.strokeRect(n.mouseX,n.mouseY,n.lastX-n.mouseX,n.lastY-n.mouseY)}},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){if(Math.abs(n.lastX-n.mouseX)<5&&Math.abs(n.lastY-n.mouseY)<5)return;n.physics.addRectWall(n.lastX/2+n.mouseX/2,n.lastY/2+n.mouseY/2,2*Math.abs(n.lastX/2-n.mouseX/2),2*Math.abs(n.lastY/2-n.mouseY/2));let e=n;e.physics.bodies[e.physics.bodies.length-1].style=w.Beige}}},Un=po;var yt=.2,xt=.5,vt=R,Gn=document.createElement("div"),go={name:"Rectangle body",description:"",element:Gn,drawFunc(n,e){let t=n.cnv.getContext("2d");n.lastX!==0&&n.lastY!==0&&(t.strokeStyle="black",t.strokeRect(n.mouseX,n.mouseY,n.lastX-n.mouseX,n.lastY-n.mouseY))},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=Math.abs(n.mouseX-n.lastX),t=Math.abs(n.mouseY-n.lastY);if(e/t>50||t/e>50||t===0||e===0)return;n.physics.addRectBody(n.lastX/2+n.mouseX/2,n.lastY/2+n.mouseY/2,2*Math.abs(n.lastX/2-n.mouseX/2),2*Math.abs(n.lastY/2-n.mouseY/2),xt,yt,vt)}},keyGotUpFunc(n){},keyGotDownFunc(n){}};Gn.append(h("range-slider",{min:0,max:.6,step:.02,value:yt,onChange:n=>{yt=n}},"Bounciness"),h("range-slider",{min:0,max:2,step:.1,value:xt,onChange:n=>{xt=n}},"Coefficient of friction"),h("color-picker",{value:vt,onChange:n=>{vt=n}},"Color:"));var _n=go;var $e=35,wt=.5,kt=.5,Ke=4,Ze=24,Mt=R,Jn=document.createElement("div");function Qn(n=24,e=4){return[...new Array(n).keys()].map(t=>i.fromAnglePNorm(Math.PI*2*t/n,e))}var bo={name:"Squircle",description:"",element:Jn,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=Qn(Ze,Ke);if(s.forEach(o=>o.mult($e)),n.mouseDown){t.beginPath(),t.moveTo(n.lastX+s[0].x,n.lastY+s[0].y);for(let o=1;o<s.length;o+=1)t.lineTo(n.lastX+s[o].x,n.lastY+s[o].y);t.closePath(),t.stroke()}else{t.beginPath(),t.moveTo(n.mouseX+s[0].x,n.mouseY+s[0].y);for(let o=1;o<s.length;o+=1)t.lineTo(n.mouseX+s[o].x,n.mouseY+s[o].y);t.closePath(),t.stroke()}n.mouseDown&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){let e=Qn(Ze,Ke),t=new i(n.lastX,n.lastY);if(e.forEach(s=>{s.mult($e),s.add(t)}),n.lastX!==0&&n.lastY!==0){let s=new y(P.Polygon(e),1,wt,kt);s.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),s.style=Mt,n.physics.addBody(s)}}};Jn.append(h("range-slider",{min:5,max:120,step:1,value:$e,onChange:n=>{$e=n}},"Size"),h("range-slider",{min:2,max:7,step:1,value:9-Ke,onChange:n=>{Ke=9-n}},"Roundness"),h("range-slider",{min:12,max:36,step:1,value:Ze,onChange:n=>{Ze=n}},"Resolution"),h("range-slider",{min:0,max:.9,step:.02,value:wt,onChange:n=>{wt=n}},"Bounciness"),h("range-slider",{min:0,max:2,step:.1,value:kt,onChange:n=>{kt=n}},"Coefficient of friction"),h("color-picker",{value:Mt,onChange:n=>{Mt=n}},"Color:"));var $n=bo;var Q=35;var St=1.5,Pt=24,It=1,Kn=document.createElement("div"),yo={name:"Soft square",description:"",element:Kn,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black",n.mouseDown?t.strokeRect(n.lastX-Q,n.lastY-Q,Q*2,Q*2):t.strokeRect(n.mouseX-Q,n.mouseY-Q,Q*2,Q*2),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){n.lastX!==0&&n.lastY!==0&&n.physics.addSoftSquare(new i(n.lastX,n.lastY),Q*2,St,new i(n.lastX-n.mouseX,n.lastY-n.mouseY),Pt,It)}};Kn.append(h("range-slider",{min:5,max:100,step:1,value:Q,onChange:n=>{Q=n}},"Size"),h("range-slider",{min:.4,max:3,step:.1,value:It,onChange:n=>{It=n}},"Pressure"),h("range-slider",{min:0,max:2,step:.1,value:St,onChange:n=>{St=n}},"Coefficient of friction"),h("range-slider",{min:16,max:48,step:8,value:Pt,onChange:n=>{Pt=n}},"Resolution"));var Zn=yo;var Ae=20,An=document.createElement("div"),xo={name:"Wall drawer",description:"",element:An,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black",t.beginPath(),t.arc(n.mouseX,n.mouseY,Ae,0,2*Math.PI),t.stroke(),n.lastX!==0&&n.lastY!==0&&n.physics.addFixedBall(n.mouseX,n.mouseY,Ae)}};An.append(h("range-slider",{min:5,max:70,step:1,value:Ae,onChange:n=>{Ae=n}},"Size"));var es=xo;var Ct=45,Bt=.2,Et=1.5,Tt=R,ts=document.createElement("div");function Rt(n){let e=n;return n===void 0&&(e=new i(0,0)),P.Polygon([...new Array(3).keys()].map(t=>{let s=2*Math.PI*t/3,o=i.fromAngle(s);return o.rotate(-(Math.PI*7)/6),o.mult(Ct),o.add(e),o}))}var vo={name:"Triangle",description:"",element:ts,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),Rt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),Rt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y(Rt(e),1,Bt,Et);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=Tt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};ts.append(h("range-slider",{min:5,max:120,step:1,value:Ct,onChange:n=>{Ct=n}},"Size"),h("range-slider",{min:0,max:.35,step:.02,value:Bt,onChange:n=>{Bt=n}},"Bounciness"),h("range-slider",{min:0,max:2,step:.1,value:Et,onChange:n=>{Et=n}},"Coefficient of friction"),h("color-picker",{value:Tt,onChange:n=>{Tt=n}},"Color:"));var ns=vo;var Ft=45,Ot=.2,Xt=1.5,Yt=R,ss=document.createElement("div");function Lt(n){let e=n;return n===void 0&&(e=new i(0,0)),P.Polygon([...new Array(5).keys()].map(t=>{let s=2*Math.PI*t/5,o=i.fromAngle(s);return o.rotate(-Math.PI/10),o.mult(Ft),o.add(e),o}))}var wo={name:"Pentagon",description:"",element:ss,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),Lt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),Lt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y(Lt(e),1,Ot,Xt);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=Yt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};ss.append(h("range-slider",{min:5,max:120,step:1,value:Ft,onChange:n=>{Ft=n}},"Size"),h("range-slider",{min:0,max:1,step:.02,value:Ot,onChange:n=>{Ot=n}},"Bounciness"),h("range-slider",{min:0,max:2,step:.1,value:Xt,onChange:n=>{Xt=n}},"Coefficient of friction"),h("color-picker",{value:Yt,onChange:n=>{Yt=n}},"Color:"));var os=wo;var Dt=45,zt=.2,Nt=1.5,jt=R,is=document.createElement("div");function Ht(n){let e=n;return n===void 0&&(e=new i(0,0)),P.Polygon([...new Array(6).keys()].map(t=>{let s=2*Math.PI*t/6,o=i.fromAngle(s);return o.mult(Dt),o.add(e),o}))}var ko={name:"Hexagon",description:"",element:is,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),Ht(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),Ht(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y(Ht(e),1,zt,Nt);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=jt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};is.append(h("range-slider",{min:5,max:120,step:1,value:Dt,onChange:n=>{Dt=n}},"Size"),h("range-slider",{min:0,max:1,step:.02,value:zt,onChange:n=>{zt=n}},"Bounciness"),h("range-slider",{min:0,max:2,step:.1,value:Nt,onChange:n=>{Nt=n}},"Coefficient of friction"),h("color-picker",{value:jt,onChange:n=>{jt=n}},"Color:"));var as=ko;var Vt=45,qt=.2,Wt=1.5,Ut=R,rs=document.createElement("div");function Gt(n){let e=n;return n===void 0&&(e=new i(0,0)),P.Polygon([...new Array(8).keys()].map(t=>{let s=2*Math.PI*t/8,o=i.fromAngle(s);return o.mult(Vt),o.add(e),o}))}var Mo={name:"Octagon",description:"",element:rs,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),Gt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),Gt(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y(Gt(e),1,qt,Wt);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=Ut,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};rs.append(h("range-slider",{min:5,max:120,step:1,value:Vt,onChange:n=>{Vt=n}},"Size"),h("range-slider",{min:0,max:1,step:.02,value:qt,onChange:n=>{qt=n}},"Bounciness"),h("range-slider",{min:0,max:2,step:.1,value:Wt,onChange:n=>{Wt=n}},"Coefficient of friction"),h("color-picker",{value:Ut,onChange:n=>{Ut=n}},"Color:"));var cs=Mo;var et=45,_t=.2,Jt=1.5,Qt=R,ls=document.createElement("div");function $t(n){let e=n;n===void 0&&(e=new i(0,0));let t=P.Polygon([...new Array(11).keys()].map(s=>{let o=Math.PI*s/11,a=i.fromAngle(o);return a.mult(et),a.add(e),a}));return t.points.push(new i(-et+e.x,e.y)),t}var So={name:"Half circle",description:"",element:ls,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown?(s.x=n.lastX,s.y=n.lastY,t.beginPath(),$t(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()):(t.beginPath(),$t(s).points.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()),n.lastX!==0&&n.lastY!==0&&(t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(n.lastX,n.lastY),t.stroke())},startInteractionFunc(n){},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=new i(n.lastX,n.lastY),t=new y($t(e),1,_t,Jt);t.vel=new i(n.lastX-n.mouseX,n.lastY-n.mouseY),t.style=Qt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),n.physics.addBody(t)}}};ls.append(h("range-slider",{min:5,max:120,step:1,value:et,onChange:n=>{et=n}},"Size"),h("range-slider",{min:0,max:1,step:.02,value:_t,onChange:n=>{_t=n}},"Bounciness"),h("range-slider",{min:0,max:2,step:.1,value:Jt,onChange:n=>{Jt=n}},"Coefficient of friction"),h("color-picker",{value:Qt,onChange:n=>{Qt=n}},"Color:"));var hs=So;var Kt=.2,Zt=1.5,At=R,ds=document.createElement("div"),U=[],Po={name:"Draw convex shape",description:"",element:ds,drawFunc(n,e){let t=n.cnv.getContext("2d");t.strokeStyle="black";let s=new i(n.mouseX,n.mouseY);n.mouseDown&&(U.some(o=>o.x===s.x&&o.y===s.y)||U.push(s),U.length>3&&(U=P.Polygon(U).getConvexHull().points)),t.beginPath(),U.forEach((o,a)=>{a===0?t.moveTo(o.x,o.y):t.lineTo(o.x,o.y)}),t.closePath(),t.stroke()},startInteractionFunc(n){},endInteractionFunc(n){if(U.length>3)U=P.Polygon(U).getConvexHull().points;else{U=[];return}if(n.lastX!==0&&n.lastY!==0){let e=new y(P.Polygon(U),1,Kt,Zt),s=[...new Array(100).keys()].map(o=>i.fromAngle(2*Math.PI*o/100)).map(o=>e.shape.getMinMaxInDirection(o).size());if(Math.max(...s)/Math.min(...s)>15){U=[];return}e.style=At,Number.isFinite(e.pos.x)&&Number.isFinite(e.pos.y)&&Number.isFinite(e.vel.x)&&Number.isFinite(e.vel.y)||(e.vel.x=0,e.vel.y=0),n.physics.addBody(e)}U=[]}};ds.append(h("range-slider",{min:0,max:.35,step:.02,value:Kt,onChange:n=>{Kt=n}},"Bounciness"),h("range-slider",{min:0,max:2,step:.1,value:Zt,onChange:n=>{Zt=n}},"Coefficient of friction"),h("color-picker",{value:At,onChange:n=>{At=n}},"Color:"));var ms=Po;var pe=[Wn,_n,Un,es,ms,$n,Zn,hs,ns,os,as,cs],H=pe[0],us=document.createElement("div"),en=h("div",{className:"full-width"}),fs;function Io(){return pe.indexOf(H)}function ps(n,e){var s;let t=e;(s=H.deactivated)==null||s.call(H,fs),t[Io()].bgColor=w.Independence,t[n].bgColor=w.pinkDarker,en.innerHTML="",en.appendChild(pe[n].element),H=pe[n]}var Xe=pe.map((n,e)=>h("hover-detector-btn",{onClick:()=>{ps(e,Xe)}},n.name)),Co={name:"Shapes",description:"",element:us,drawFunc(n,e){var t;(t=H.drawFunc)==null||t.call(H,n,e)},startInteractionFunc(n){var e;(e=H.startInteractionFunc)==null||e.call(H,n)},endInteractionFunc(n){var e;(e=H.endInteractionFunc)==null||e.call(H,n)},init(n){fs=n,pe.forEach(e=>{var t;return(t=e.init)==null?void 0:t.call(e,n)}),Xe.forEach((e,t)=>{t===0&&e.asUpper(),t===Xe.length-1&&e.asLast()})}};us.append(h("space-height",{height:1}),...Xe,en);ps(0,Xe);var gs=Co;var tn=!1,Ye=!0,nn=new i(0,0),sn=0,le=1e4,he=new B(1,le);he.attachObject(new y(P.Circle(1,new i(0,0))));var bs=document.createElement("div");function ys(n){let{choosed:e}=n,t=new i(n.lastX,n.lastY);if(n.lastX!==0&&n.lastY!==0&&e instanceof y){let s=i.sub(t,nn);return s.rotate(e.rotation-sn),Ye&&(s.x=0,s.y=0),s.add(e.pos),s}return t}function Bo(n,e){return he.length=n.dist(e),he.springConstant=le,he.objects[0].pos=n,he.objects[0].shape.points[0]=n,he.pinHere(e.x,e.y),he}var Eo={name:"Spring creator",description:"",element:bs,drawFunc(n,e){let t=n.cnv.getContext("2d");if(t.save(),n.lastX!==0&&n.lastY!==0){t.fillStyle="#00000000",t.strokeStyle="#FFFFFF";let o=ys(n),a=new i(n.mouseX,n.mouseY),r=Bo(o,a);n.renderer.renderSpring(r,t)}let s=n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY);s instanceof y&&(t.globalAlpha=.6,t.fillStyle="#00000000",t.strokeStyle="#FFFFFF",t.lineWidth=3,n.renderer.renderBody(s,t)),t.restore()},startInteractionFunc(n){n.choosed instanceof y?(nn=n.choosed.pos.copy,sn=n.choosed.rotation):typeof n.choosed!="boolean"&&(nn=new i(n.choosed.x,n.choosed.y),sn=0)},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY),t,s=ys(n),o=new i(n.mouseX,n.mouseY);n.choosed instanceof y&&Ye&&(s=n.choosed.pos.copy),e instanceof y&&Ye&&(o=e.pos.copy);let a=B;if(typeof e=="boolean"&&(e={x:n.mouseX,y:n.mouseY,pinPoint:!0}),n.choosed===e||n.choosed===void 0&&e===void 0||n.choosed instanceof Object&&e instanceof Object&&"pinPoint"in n.choosed&&"pinPoint"in e||(n.choosed instanceof Object&&e instanceof Object&&"pinPoint"in n.choosed&&"pos"in e?(t=new a(Math.sqrt((n.choosed.x-e.pos.x)**2+(n.choosed.y-e.pos.y)**2),le),t.attachObject(e,o),t.pinHere(n.choosed.x,n.choosed.y)):e instanceof Object&&n.choosed instanceof Object&&"pos"in n.choosed&&"pinPoint"in e?(t=new a(Math.sqrt((n.choosed.pos.x-e.x)**2+(n.choosed.pos.y-e.y)**2),le),t.attachObject(n.choosed,s),t.pinHere(e.x,e.y)):n.choosed instanceof Object&&e instanceof Object&&"pos"in n.choosed&&"pos"in e&&(t=new a(Math.sqrt((n.choosed.pos.x-e.pos.x)**2+(n.choosed.pos.y-e.pos.y)**2),le),t.attachObject(n.choosed,s),t.attachObject(e,o)),typeof t=="undefined"))return;n.physics.addSpring(t),tn&&t.lockRotation()}}};bs.append(h("check-box",{checked:tn,onChange:n=>{tn=n}},"Lock rotation"),h("check-box",{checked:Ye,onChange:n=>{Ye=n}},"Snap to center"),h("range-slider",{min:2e3,max:1e5,value:le,step:200,onChange:n=>{le=n}},"Spring stiffness"));var xs=Eo;var on=!1,Le=!0,an=new i(0,0),rn=0,ge=new E(1);ge.attachObject(new y(P.Circle(1,new i(0,0))));var cn=document.createElement("div");function vs(n){let{choosed:e}=n,t=new i(n.lastX,n.lastY);if(n.lastX!==0&&n.lastY!==0&&e instanceof y){let s=i.sub(t,an);return s.rotate(e.rotation-rn),Le&&(s.x=0,s.y=0),s.add(e.pos),s}return t}function To(n,e){return ge.length=n.dist(e),ge.objects[0].pos=n,ge.objects[0].shape.points[0]=n,ge.pinHere(e.x,e.y),ge}var Ro={name:"Stick creator",description:"",element:cn,drawFunc(n,e){let t=n.cnv.getContext("2d");if(t.save(),n.lastX!==0&&n.lastY!==0){t.fillStyle="#00000000",t.strokeStyle="#FFFFFF";let o=vs(n),a=new i(n.mouseX,n.mouseY),r=To(o,a);n.renderer.renderStick(r,t)}let s=n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY);s instanceof y&&(t.globalAlpha=.6,t.fillStyle="#00000000",t.strokeStyle="#FFFFFF",t.lineWidth=3,n.renderer.renderBody(s,t)),t.restore()},startInteractionFunc(n){n.choosed instanceof y?(an=n.choosed.pos.copy,rn=n.choosed.rotation):typeof n.choosed!="boolean"&&(an=new i(n.choosed.x,n.choosed.y),rn=0)},endInteractionFunc(n){if(n.lastX!==0&&n.lastY!==0){let e=n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY),t,s=vs(n),o=new i(n.mouseX,n.mouseY);n.choosed instanceof y&&Le&&(s=n.choosed.pos.copy),e instanceof y&&Le&&(o=e.pos.copy);let a=E;if(typeof e=="boolean"&&(e={x:n.mouseX,y:n.mouseY,pinPoint:!0}),typeof n.choosed=="boolean"||n.choosed===e||n.choosed===void 0&&e===void 0||"pinPoint"in n.choosed&&"pinPoint"in e||("pinPoint"in n.choosed&&"pos"in e?(t=new a(Math.sqrt((n.choosed.x-e.pos.x)**2+(n.choosed.y-e.pos.y)**2)),t.attachObject(e,o),t.pinHere(n.choosed.x,n.choosed.y)):"pinPoint"in e&&"pos"in n.choosed?(t=new a(Math.sqrt((n.choosed.pos.x-e.x)**2+(n.choosed.pos.y-e.y)**2)),t.attachObject(n.choosed,s),t.pinHere(e.x,e.y)):"pos"in n.choosed&&"pos"in e&&(t=new a(Math.sqrt((n.choosed.pos.x-e.pos.x)**2+(n.choosed.pos.y-e.pos.y)**2)),t.attachObject(n.choosed,s),t.attachObject(e,o)),typeof t=="undefined"))return;n.physics.addSpring(t),on&&t.lockRotation()}},keyGotUpFunc(n){},keyGotDownFunc(n){}};[h("check-box",{checked:on,onChange:n=>{on=n}},"Lock rotation"),h("check-box",{checked:Le,onChange:n=>{Le=n}},"Snap to center")].forEach(cn.appendChild.bind(cn));var ws=Ro;var ks=document.createElement("template");ks.innerHTML=`
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
`;var Ms=class extends HTMLElement{constructor(){super();this.minNum=0,this.maxNum=0,this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ks.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",{id:"mainContainer"},h("p",{className:"slider-label"},h("slot",null)),h("input",{id:"slider",type:"range",className:"slider"}),h("input",{id:"number-input",type:"number",className:"number"})))}get slider(){return this.shadowRoot.querySelector("#slider")}get numInput(){return this.shadowRoot.querySelector("#number-input")}set min(e){this.slider.min=e,this.numInput.min=e,this.minNum=e}set max(e){this.slider.max=e,this.numInput.max=e,this.maxNum=e}set step(e){this.slider.step=e,this.numInput.step=e}set value(e){this.slider.value=e,this.numInput.value=e}normalizeValue(e){return Math.min(Math.max(this.minNum,e),this.maxNum)}disable(){this.shadowRoot.querySelector("#mainContainer").classList.add("disabled")}enable(){this.shadowRoot.querySelector("#mainContainer").classList.remove("disabled")}set onChange(e){this.slider.onchange=t=>{let s=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(s)),this.value=s},this.slider.oninput=t=>{let s=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(s)),this.value=s},this.numInput.onchange=t=>{let s=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(s)),this.value=s}}};window.customElements.define("range-slider-number",Ms);var Fo=document.createElement("div"),Oo={name:"World settings",description:"",element:Fo,init(n){let e=n;this.element.append(h("range-slider",{min:0,max:5e3,step:200,value:e.physics.gravity.y,onChange:t=>{e.physics.gravity.y=t}},"Gravity"),h("range-slider",{min:-5e3,max:5e3,step:1e3,value:e.physics.gravity.x,onChange:t=>{e.physics.gravity.x=t}},"Gravity in X direction"),h("range-slider",{min:0,max:.99,step:.01,value:1-e.physics.airFriction,onChange:t=>{e.physics.setAirFriction(1-t)}},"Air friction"),h("range-slider-number",{min:700,max:1e4,step:10,value:e.worldSize.width,onChange:t=>{e.setWorldSize({width:t,height:e.worldSize.height})}},"World width"),h("range-slider-number",{min:700,max:5e3,step:10,value:e.worldSize.height,onChange:t=>{e.setWorldSize({width:e.worldSize.width,height:t})}},"World height"),h("check-box",{checked:e.drawCollisions,onChange:t=>{e.drawCollisions=t}},"Show collision data"),h("check-box",{checked:e.showAxes,onChange:t=>{e.showAxes=t}},"Show body axes"),h("check-box",{checked:e.showBoundingBoxes,onChange:t=>{e.showBoundingBoxes=t}},"Show boounding boxes"),h("check-box",{checked:e.showVelocities,onChange:t=>{e.showVelocities=t}},"Show velocities"))}},Ss=Oo;var Ps=document.createElement("template");Ps.innerHTML=`
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
`;var Is=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Ps.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",{className:"number-label"},h("span",null,h("slot",null)),h("div",{id:"indicatorContainer"},h("hr",{id:"rotationIndicator"})),h("span",null,"\xA0"),h("span",{id:"numberPlace"}),h("span",{id:"symbolPlace"},"\xB0")))}set value(e){let t=e*180/Math.PI%360;this.shadowRoot.querySelector("#numberPlace").innerText=Math.abs(t).toFixed(),this.shadowRoot.querySelector("#rotationIndicator").style.transform=`translateY(-0.1em) rotate(${t}deg)`}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}hideNumber(){this.shadowRoot.querySelector("#numberPlace").classList.add("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.add("hidden")}showNumber(){this.shadowRoot.querySelector("#numberPlace").classList.remove("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.remove("hidden")}};window.customElements.define("angle-display",Is);var Cs=document.createElement("template");Cs.innerHTML=`
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
`;var Bs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Cs.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",{id:"btn"},h("slot",null))),this.hidden=!1}set bgColor(e){this.btn.style.backgroundColor=e}set textColor(e){this.btn.style.color=e}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(e){this.btn.onclick=e}smallMargin(){this.btn.style.marginTop="0.2em"}set decreasedMargin(e){e&&(this.btn.style.marginTop="0.2em")}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}};window.customElements.define("button-btn",Bs);var Es=document.createElement("template");Es.innerHTML=`
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
`;var Ts=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Es.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",null,h("input",{type:"file",id:"inputEl",name:"inputEl"}),h("label",{id:"inputLabel",htmlFor:"inputEl"},h("slot",null))))}get input(){return this.shadowRoot.getElementById("inputEl")}set accept(e){this.input.accept=e}set onFile(e){let t=s=>{s.target.files.length!==0&&e(s.target.files[0])};this.input.onchange=t}};window.customElements.define("file-input",Ts);var Rs=document.createElement("template");Rs.innerHTML=`
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
`;var Fs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Rs.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",{id:"container"},h("div",{id:"apply",className:"btn"},"Apply"),h("div",{id:"cancel",className:"btn"}," Cancel")))}set visible(e){if(e){let t=this.containerElement;t.style.display!=="flex"&&(t.style.display="flex")}else{let t=this.containerElement;t.style.display!=="none"&&(t.style.display="none")}}get containerElement(){return this.shadowRoot.getElementById("container")}get applyBtn(){return this.shadowRoot.getElementById("apply")}get cancelBtn(){return this.shadowRoot.getElementById("cancel")}set onApply(e){this.applyBtn.onclick=e}set onCancel(e){this.cancelBtn.onclick=e}set applyText(e){this.applyBtn.innerText=e}set cancelText(e){this.cancelBtn.innerText=e}set width(e){this.containerElement.style.width=e}};window.customElements.define("apply-cancel",Fs);var Os=document.createElement("template");Os.innerHTML=`
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
`;var Xs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Os.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",null,h("span",null,h("slot",null)),h("ul",{id:"listHolder",className:"dropdown"})))}set entries(e){this.entryList=e;let{listHolder:t}=this;t.innerHTML="",t.append(...this.entryList.map(s=>h("li",{innerText:s})))}set value(e){this.listHolder.childNodes.forEach(t=>{"classList"in t&&(t.innerText===e?t.classList.add("chosen"):t.classList.remove("chosen"))})}get listHolder(){return this.shadowRoot.getElementById("listHolder")}set onChoice(e){let t=o=>{e(o.target.innerText),this.listHolder.classList.add("hidden"),this.listHolder.childNodes.forEach(a=>{"classList"in a&&(a.innerText===o.target.innerText?a.classList.add("chosen"):a.classList.remove("chosen"))}),setTimeout(()=>{this.listHolder.classList.remove("hidden")},20)},s=this.listHolder;this.listHolder.childNodes.forEach(o=>{let a=o.cloneNode(!0);a.addEventListener("click",t),s.replaceChild(a,o)})}};window.customElements.define("drop-down",Xs);var Ys=document.createElement("template");Ys.innerHTML=`
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
`;var Ls=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Ys.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",{className:"container"},h("input",{id:"collapsible",className:"toggle",type:"checkbox",checked:!0}),h("label",{htmlFor:"collapsible",className:"toggle",id:"toggleEl"},"More"),h("div",{className:"toClose"},h("slot",null))))}get input(){return this.shadowRoot.getElementById("collapsible")}set title(e){this.shadowRoot.querySelector("#toggleEl").innerText=e}collapse(){this.input.checked=!1}open(){this.input.checked=!0}set closed(e){this.input.checked=!e}};window.customElements.define("collapsible-element",Ls);var Xo="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAyklEQVQ4T6XST0qCQRjH8Y8JBnoCr9DGjXQBEbqDm6QQgvZeoX0bQVy7cRtBeIPcewi3bYLKeF6mmAZBeZvN8Pz5PvOb53ka/p4mHnGDVgp9YIVrvCdft5FxV3guCpXmBD1sfsAhXrKseOUVcV/ivKgwDvAMn1ngFosisVRTgQ+YpsQ7zA7IjX/fZ/4KfEMHX4jmlKePUeFcBrhPzi0ujjTnN/wv8JjUXMQO7fjWqc0JeIB1qvJUdxydOgtQjazOys1Dbg6GfeqS+wZwAS6Pac4meQAAAABJRU5ErkJggg==') 6.5 6.5, auto",De=Xo;var se=7,oe=6.5,ln=8,hn=25,be=7,Ds=8,tt=7,zs=7,dn=23,ye=30,Ns=4,m=!1,xe=!1,ve=!1,S=!1,de=!1,ie=!1,me=document.createElement("div"),N,G=!1,ue=1,I=new i(0,0),we=0,ze="repeat",$=0,X=1,ke={body:!0,spring:!0};function nt(n){me.innerHTML="",G=!1;let e=h("collapsible-element",{title:"Bodies",closed:!0}),t=[];for(let a=Ns;a<n.physics.bodies.length;a+=1){let r=n.physics.bodies[a],l=a-Ns,c=h("hover-detector-btn",{bgColor:w.pinkDarker},`Body #${l}`);c.onClick=()=>{xe=r,ve=!1},c.onEnter=()=>{ve=r},c.onLeave=()=>{ve===r&&(ve=!1)},a===n.physics.bodies.length-1&&c.asLast(),t.push(c)}e.append(...t);let s=h("collapsible-element",{title:"Sticks/Springs",closed:!0}),o=[];for(let a=0;a<n.physics.springs.length;a+=1){let r=n.physics.springs[a],l=r instanceof E?"Stick":"Spring",c=h("hover-detector-btn",{bgColor:w.pinkDarker},`${l} #${a}`);c.onClick=()=>{de=r,ie=!1},c.onEnter=()=>{ie=r},c.onLeave=()=>{ie===r&&(ie=!1)},a===n.physics.bodies.length-1&&c.asLast(),o.push(c)}s.append(...o),me.append(h("number-display",{value:""},"Selectable types:"),h("check-box",{checked:ke.body,onChange:a=>{ke.body=a}},"Body"),h("check-box",{checked:ke.spring,onChange:a=>{ke.spring=a}},"Stick/Spring"),e,s)}var D="none";function js(n){if(xe instanceof y){let e=xe;return xe=!1,e}return de instanceof B||!ke.body?!1:n.physics.getObjectAtCoordinates(n.mouseX,n.mouseY,4)}function st(n){if(xe instanceof y||de instanceof B)return"none";if(typeof G!="boolean"){let e=new i(n.mouseX,n.mouseY);return I.dist(e)<=Ds?"move-texture":new i(I.x,I.y-dn).dist(e)<=tt?"rotate-texture":new i(I.x+ye,I.y+ye).dist(e)<=zs?"scale-texture-xy":"choose-texture"}if(n.timeMultiplier!==0&&!(m instanceof y&&m.m===0))return"none";if(m instanceof y){let e=m.boundingBox,t=new i(e.x.min,e.y.min),s=new i(e.x.max,e.y.min),o=new i(e.x.min,e.y.max),a=new i(e.x.max,e.y.max),r=i.add(i.lerp(s,t,.5),new i(0,-hn)),l=new i(n.mouseX,n.mouseY);if(i.dist(r,l)<=ln)return"rotate";if(i.dist(o,l)<=se)return"resize-bl";if(i.dist(a,l)<=se)return"resize-br";if(i.dist(t,l)<=se)return"resize-tl";if(i.dist(s,l)<=se)return"resize-tr";if(i.dist(i.lerp(s,t,.5),l)<=oe)return"resize-t";if(i.dist(i.lerp(a,o,.5),l)<=oe)return"resize-b";if(i.dist(i.lerp(t,o,.5),l)<=oe)return"resize-l";if(i.dist(i.lerp(s,a,.5),l)<=oe)return"resize-r";if(l.x>=t.x&&l.y>=t.y&&l.x<=a.x&&l.y<=a.y)return"move"}else if(typeof S!="boolean"){let e=S.points,t=new i(n.mouseX,n.mouseY);if(e[0].dist(t)<=be)return"move-spring0";if(e[1].dist(t)<=be)return"move-spring1"}return"none"}function Yo(n){if(!(m instanceof y))return;let e=m.boundingBox,t=new i(e.x.min,e.y.min),s=new i(e.x.max,e.y.min),o=new i(e.x.min,e.y.max),a=new i(e.x.max,e.y.max);X=1,n==="rotate"&&($=m.rotation),n==="resize-bl"&&($=i.sub(o,s).heading),n==="resize-br"&&($=i.sub(a,t).heading),n==="resize-tl"&&($=i.sub(t,a).heading),n==="resize-tr"&&($=i.sub(s,o).heading),n==="resize-t"&&($=new i(0,-1).heading),n==="resize-b"&&($=new i(0,1).heading),n==="resize-l"&&($=new i(-1,0).heading),n==="resize-r"&&($=new i(1,0).heading),n==="rotate-texture"&&($=Math.PI)}function mn(n){if(typeof m!="boolean"){let e=new i(n.mouseX,n.mouseY),t=new i(n.oldMouseX,n.oldMouseY),s=i.sub(t,m.pos),o=i.sub(e,m.pos),a=m.boundingBox,r=new i(a.x.min,a.y.min),l=new i(a.x.max,a.y.min),c=new i(a.x.min,a.y.max),f=new i(a.x.max,a.y.max),u=i.lerp(r,l,.5),d=i.lerp(c,f,.5),p=i.lerp(f,l,.5),g=i.lerp(c,r,.5),x=i.fromAngle($),b=1;switch(D){case"move":m.move(new i(n.mouseX-n.oldMouseX,n.mouseY-n.oldMouseY));break;case"rotate":m.rotate(o.heading-s.heading);break;case"resize-bl":b=i.dot(x,i.sub(e,l))/i.dot(x,i.sub(t,l)),b*X>=.03?(m.scaleAround(l,b),m.textureTransform.offset.mult(b),m.textureTransform.scale*=b,X*=b):D="none";break;case"resize-br":b=i.dot(x,i.sub(e,r))/i.dot(x,i.sub(t,r)),b*X>=.03?(m.scaleAround(r,b),m.textureTransform.offset.mult(b),m.textureTransform.scale*=b,X*=b):D="none";break;case"resize-tl":b=i.dot(x,i.sub(e,f))/i.dot(x,i.sub(t,f)),b*X>=.03?(m.scaleAround(f,b),m.textureTransform.offset.mult(b),m.textureTransform.scale*=b,X*=b):D="none";break;case"resize-tr":b=i.dot(x,i.sub(e,c))/i.dot(x,i.sub(t,c)),b*X>=.03?(m.scaleAround(c,b),m.textureTransform.offset.mult(b),m.textureTransform.scale*=b,X*=b):D="none";break;case"resize-t":b=i.dot(x,i.sub(e,d))/i.dot(x,i.sub(t,d)),b*X>=.1?(m.scaleAroundY(d,b),X*=b):D="none";break;case"resize-b":b=i.dot(x,i.sub(e,u))/i.dot(x,i.sub(t,u)),b*X>=.1?(m.scaleAroundY(u,b),X*=b):D="none";break;case"resize-l":b=i.dot(x,i.sub(e,p))/i.dot(x,i.sub(t,p)),b*X>=.1?(m.scaleAroundX(p,b),X*=b):D="none";break;case"resize-r":b=i.dot(x,i.sub(e,g))/i.dot(x,i.sub(t,g)),b*X>=.1?(m.scaleAroundX(g,b),X*=b):D="none";break;default:break}}else if(typeof S!="boolean"){let e=new i(n.mouseX,n.mouseY);switch(D){case"move-spring0":S.updateAttachPoint0(e,be);break;case"move-spring1":S.updateAttachPoint1(e,be);break;default:break}}if(typeof G!="boolean"&&typeof m!="boolean"){let e=new i(n.mouseX,n.mouseY),t=new i(n.oldMouseX,n.oldMouseY),s=i.sub(e,I),o=i.sub(t,I),a=new i(1,1);switch(D){case"move-texture":I.x=n.mouseX,I.y=n.mouseY;break;case"scale-texture-xy":ue*=i.dot(s,a)/i.dot(o,a),ue*=i.dot(s,a)/i.dot(o,a);break;case"rotate-texture":we+=s.heading-o.heading;break;default:break}}}var un={none:"default",move:"move",rotate:De,"resize-bl":"nesw-resize","resize-br":"nwse-resize","resize-tl":"nwse-resize","resize-tr":"nesw-resize","resize-t":"ns-resize","resize-b":"ns-resize","resize-l":"ew-resize","resize-r":"ew-resize","move-spring0":"move","move-spring1":"move","move-texture":"move","rotate-texture":De,"scale-texture-xy":"nwse-resize","choose-texture":"default"};function Hs(n){if(de instanceof B){let s=de;return de=!1,s}if(!ke.spring)return!1;let e=new i(n.mouseX,n.mouseY),t=n.physics.springs.find(s=>s.getAsSegment().distFromPoint(e)<=be);return typeof t=="undefined"?!1:t}function Lo(n,e){if(m instanceof y)if(D!=="rotate"){n.strokeStyle=w["Roman Silver"],n.setLineDash([5,3.5]),n.strokeRect(m.boundingBox.x.min,m.boundingBox.y.min,m.boundingBox.x.max-m.boundingBox.x.min,m.boundingBox.y.max-m.boundingBox.y.min),n.beginPath(),n.moveTo(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.min),n.lineTo(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.min-hn),n.stroke(),n.fillStyle=w.blue,n.beginPath(),n.arc(m.boundingBox.x.min,m.boundingBox.y.min,se,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.min,m.boundingBox.y.max,se,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max,m.boundingBox.y.min,se,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max,m.boundingBox.y.max,se,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.min,m.boundingBox.y.min/2+m.boundingBox.y.max/2,oe,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max,m.boundingBox.y.min/2+m.boundingBox.y.max/2,oe,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.max,oe,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.min,oe,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(m.boundingBox.x.max/2+m.boundingBox.x.min/2,m.boundingBox.y.min-hn,ln,0,Math.PI*2),n.fill();let t=st(e),s=un[t],o=e.cnv.style;o.cursor!==s&&(o.cursor=s)}else n.strokeStyle=w["Roman Silver"],n.setLineDash([5,3.5]),n.beginPath(),n.moveTo(m.pos.x,m.pos.y),n.lineTo(e.mouseX,e.mouseY),n.stroke(),n.fillStyle=w.blue,n.beginPath(),n.arc(e.mouseX,e.mouseY,ln,0,Math.PI*2),n.fill()}function Do(n,e){if(typeof S!="boolean"){let t=S.points;n.fillStyle=w.blue,n.beginPath(),t.forEach(r=>{n.arc(r.x,r.y,be,0,Math.PI*2)}),n.fill();let s=st(e),o=un[s],a=e.cnv.style;a.cursor!==o&&(a.cursor=o)}}function zo(n){let e=Hs(n);if(typeof e!="boolean"){me.innerHTML="",S=e;let t=h("number-display",{value:S.getAsSegment().length.toFixed(1)},"Length:\xA0"),s=h("range-slider-number",{min:15,max:Math.max(n.worldSize.width,n.worldSize.height),step:1,value:S.length.toFixed(1),onChange:r=>{typeof S!="boolean"&&(S.length=r)}},"Start length"),o;S instanceof B&&!(S instanceof E)?o=h("range-slider-number",{min:2e3,max:1e5,value:S.springConstant,step:200,onChange:r=>{S instanceof B&&(S.springConstant=r)}},"Spring stiffness"):o=h("div",null);let a=h("angle-display",{value:0},"Orientation:\xA0");a.hideNumber(),me.append(h("number-display",{value:S instanceof E?"stick":"spring"},"Type:\xA0"),t,a,s,o,h("check-box",{checked:S.rotationLocked,onChange:r=>{typeof S!="boolean"&&(r?S.lockRotation():S.unlockRotation())}},"Locked"),h("button-btn",{bgColor:w["Imperial Red"],textColor:"white",onClick:()=>{typeof S!="boolean"&&(n.physics.removeObjFromSystem(S),nt(n),N=()=>{},m=!1,S=!1)}},"Delete")),N=()=>{if(typeof S=="boolean")return;t.value=S.getAsSegment().length.toFixed(1);let r=S.getAsSegment();a.value=i.sub(r.b,r.a).heading}}else S=!1,nt(n)}function No(n,e){if(n.strokeStyle=w["Roman Silver"],n.setLineDash([5,3.5]),D==="rotate-texture"){let t=new i(e.mouseX,e.mouseY);n.beginPath(),n.moveTo(I.x,I.y),n.lineTo(t.x,t.y),n.stroke(),n.fillStyle=w.blue,n.setLineDash([]),n.beginPath(),n.arc(I.x,I.y,tt,0,Math.PI*2),n.closePath(),n.fill(),n.beginPath(),n.arc(t.x,t.y,tt,0,Math.PI*2),n.closePath(),n.fill();return}n.beginPath(),n.moveTo(I.x,I.y-dn),n.lineTo(I.x,I.y),n.stroke(),n.beginPath(),n.moveTo(I.x,I.y),n.lineTo(I.x+ye,I.y+ye),n.stroke(),n.setLineDash([]),n.fillStyle=w.blue,n.beginPath(),n.arc(I.x,I.y,Ds,0,Math.PI*2),n.closePath(),n.fill(),n.beginPath(),n.arc(I.x,I.y-dn,tt,0,Math.PI*2),n.closePath(),n.fill(),n.beginPath(),n.arc(I.x+ye,I.y+ye,zs,0,Math.PI*2),n.closePath(),n.fill()}var jo={name:"Select",description:"",element:me,drawFunc(n,e){var a,r;xe instanceof y&&((a=this.startInteractionFunc)==null||a.call(this,n)),de instanceof B&&((r=this.startInteractionFunc)==null||r.call(this,n));let t=js(n),s=Hs(n),o=n.cnv.getContext("2d");if(o.save(),o.strokeStyle="orange",o.fillStyle="#00000000",o.setLineDash([]),o.lineWidth=4,typeof m!="boolean")if(n.renderer.renderBody(m,o),o.globalAlpha=.6,n.physics.getSpringsWithBody(m).forEach(l=>{o.fillStyle="#00000000",o.strokeStyle="#FFFFFF",l instanceof E?n.renderer.renderStick(l,o):l instanceof B&&n.renderer.renderSpring(l,o)}),o.globalAlpha=1,typeof G!="boolean"){let l=o.createPattern(G,ze);we%=Math.PI*2;let c=new DOMMatrix([ue,0,0,ue,I.x,I.y]);c.rotateSelf(0,0,we*180/Math.PI),l.setTransform(c),o.fillStyle=l,o.strokeStyle="#00000000",n.renderer.renderBody(m,o),No(o,n),mn(n);let f=st(n),u=un[f],d=n.cnv.style;d.cursor!==u&&(d.cursor=u)}else(m.m===0||n.timeMultiplier===0)&&(mn(n),Lo(o,n));else{let l=n.cnv.style;l.cursor!=="default"&&(l.cursor="default")}if(typeof S!="boolean")o.fillStyle="#00000000",S instanceof E?n.renderer.renderStick(S,o):S instanceof B&&n.renderer.renderSpring(S,o),o.globalAlpha=.6,o.strokeStyle="#FFFFFF",S.objects.forEach(l=>n.renderer.renderBody(l,o)),o.globalAlpha=1,n.timeMultiplier===0&&(mn(n),Do(o,n));else if(typeof m=="boolean"){let l=n.cnv.style;l.cursor!=="default"&&(l.cursor="default")}ve instanceof y&&(o.strokeStyle="yellow",o.fillStyle="#00000000",o.setLineDash([3,5]),n.renderer.renderBody(ve,o)),ie instanceof B&&(o.strokeStyle="yellow",o.fillStyle="#00000000",o.setLineDash([3,5]),ie instanceof E?n.renderer.renderStick(ie,o):n.renderer.renderSpring(ie,o)),o.strokeStyle="yellow",o.fillStyle="#00000000",o.setLineDash([3,5]),typeof t!="boolean"?n.renderer.renderBody(t,o):typeof s!="boolean"&&(o.fillStyle="#00000000",s instanceof E?n.renderer.renderStick(s,o):n.renderer.renderSpring(s,o)),o.restore(),N==null||N()},startInteractionFunc(n){let e=st(n);if(e!=="none"){D=e,Yo(e);return}D="none";let t=js(n);if(t instanceof y&&m!==t&&e==="none"){me.innerHTML="",m=t,S=!1;let s=h("range-slider-number",{min:.1,max:25,step:.05,value:Number.parseFloat(m.density.toFixed(2)),onChange:k=>{m instanceof y&&(m.density=k),N==null||N()}},"Density");m.m===0&&s.disable();let o=h("check-box",{checked:m.m===0,onChange:k=>{m instanceof y&&(k?(s.disable(),m.density=0,m.vel=new i(0,0),m.ang=0,s.value=0):(s.enable(),m.density=1,s.value=m.density),N==null||N())}},"Fixed down"),a=h("number-display",{value:m.shape.r!==0?"circle":"polygon"},"Type:\xA0"),r=h("number-display",{value:m.m.toFixed(2)},"Mass:\xA0"),l=h("number-display",{value:m.pos.x.toFixed(2)},"X coord:\xA0"),c=h("number-display",{value:m.pos.y.toFixed(2)},"Y coord:\xA0"),f=h("number-display",{value:m.vel.x.toFixed(2)},"X vel:\xA0"),u=h("number-display",{value:m.vel.y.toFixed(2)},"Y vel:\xA0"),d=h("button-btn",{onClick:()=>{m instanceof y&&(m.vel.x=0,m.vel.y=0,m.ang=0)}},"Reset motion");d.smallMargin();let p=h("angle-display",{value:m.rotation.toFixed(2)},"Rotation:\xA0"),g=h("number-display",{value:m.texture==="none"?"none":"set"},"Texture:\xA0"),x=h("file-input",{accept:"image/*",onFile:k=>{if(k.type.includes("image")){let _=new FileReader;_.readAsDataURL(k),_.onload=()=>{if(typeof _.result!="string")return;let K=new Image;K.onload=()=>{createImageBitmap(K).then(z=>{var Y;m instanceof y?(n.timeMultiplier!==0&&((Y=document.getElementById("pause"))==null||Y.click()),G=z,ue=Math.max(m.boundingBox.x.size()/z.width,m.boundingBox.y.size()/z.height),I.x=m.boundingBox.x.min,I.y=m.boundingBox.y.min,we=0,m.texture="none"):G=!1})},K.src=_.result}}}},"Select image"),b=h("apply-cancel",{visible:!0,onApply:()=>{if(typeof m=="boolean"||typeof G=="boolean")return;let k=i.sub(I,m.pos);k.rotate(-m.rotation),m.textureTransform={scale:ue,rotation:we-m.rotation,offset:k},m.texture=G,m.textureRepeat=ze,G=!1},onCancel:()=>{G=!1}}),v=h("button-btn",{textColor:"white",onClick:()=>{if(typeof m!="boolean"&&m.texture!=="none"){G=m.texture,m.texture="none",ue=m.textureTransform.scale,we=m.textureTransform.rotation+m.rotation;let k=m.textureTransform.offset.copy;k.rotate(m.rotation),k.add(m.pos),I.x=k.x,I.y=k.y}}},"Edit texture");v.smallMargin(),m.texture!=="none"?v.show():v.hide();let M=h("button-btn",{bgColor:w["Imperial Red"],textColor:"white",onClick:()=>{typeof m!="boolean"&&(m.texture="none")}},"Remove texture");M.smallMargin(),m.texture!=="none"?M.show():M.hide();let F=["repeat","repeat-x","repeat-y","no-repeat"];ze=m.textureRepeat;let V=h("drop-down",{entries:F,value:ze,onChoice:k=>{F.includes(k)&&(ze=k,typeof m!="boolean"&&(m.textureRepeat=k))}},"\u25BC\xA0Texture mode");N=()=>{m instanceof y&&(l.value!=m.pos.x&&(l.value=m.pos.x.toFixed(2)),c.value!=m.pos.y&&(c.value=m.pos.y.toFixed(2)),f.value!=m.vel.x&&(f.value=m.vel.x.toFixed(2)),u.value!=m.vel.y&&(u.value=m.vel.y.toFixed(2)),r.value!=m.m&&(r.value=m.m.toFixed(2)),p.value=m.rotation.toFixed(2),g.value!==m.texture&&(g.value=m.texture==="none"?"none":"set"),typeof G!="boolean"?b.visible=!0:b.visible=!1,m.texture!=="none"?M.hidden&&M.show():M.hidden||M.hide(),m.texture!=="none"?v.hidden&&v.show():v.hidden||v.hide())},me.append(a,r,p,l,c,f,u,d,o,s,h("range-slider-number",{min:0,max:.98,step:.02,value:m.k,onChange:k=>{m instanceof y&&(m.k=k)}},"Bounciness"),h("range-slider-number",{min:0,max:2,step:.1,value:m.fc,onChange:k=>{m instanceof y&&(m.fc=k)}},"Coefficient of friction"),h("color-picker",{value:m.style,onChange:k=>{m instanceof y&&(m.style=k)}},"Color:"),g,V,x,b,v,M,h("button-btn",{bgColor:w["Imperial Red"],textColor:"white",onClick:()=>{typeof m!="boolean"&&(n.physics.removeObjFromSystem(m),nt(n),N=()=>{},m=!1,S=!1)}},"Delete"))}else typeof t=="boolean"&&e==="none"&&(m=t,N=()=>{},zo(n))},endInteractionFunc(n){D="none"},deactivated(){m=!1,S=!1,N=()=>{}},activated(n){nt(n)}},Vs=jo;var qs=document.createElement("template");qs.innerHTML=`
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
`;var Ws=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(qs.content.cloneNode(!0)),this.shadowRoot.appendChild(h("div",{className:"container"},h("label",{htmlFor:"textInput",className:"inputLabel"},h("slot",null)),h("input",{type:"text",className:"inputText",id:"textInput",placeholder:this.slot,autoComplete:"off"})))}get textInput(){return this.shadowRoot.getElementById("textInput")}get inputValue(){return this.textInput.value}set onChange(e){let t=s=>{e(s.target.value)};this.picker.onchange=t}};window.customElements.define("text-input",Ws);var Us=class{constructor(){this.textures=[]}renderBody(e,t){if(e.shape.r!==0)t.beginPath(),t.arc(e.pos.x,e.pos.y,e.shape.r,0,Math.PI*2),t.stroke(),t.fill();else{t.beginPath(),t.moveTo(e.shape.points[0].x,e.shape.points[0].y);for(let s=1;s<e.shape.points.length;s+=1)t.lineTo(e.shape.points[s].x,e.shape.points[s].y);t.closePath(),t.stroke(),t.fill()}}renderSpring(e,t){let s=e.points,o=s[0].x,a=s[0].y,r=s[1].x,l=s[1].y,c=new i(r-o,l-a),f=c.copy;c.rotate(Math.PI/2),c.setMag(5);let u=new i(o,a),d=Math.floor(e.length/10);for(let p=1;p<=d;p+=1)p===d&&(c=new i(0,0)),t.beginPath(),t.moveTo(u.x,u.y),t.lineTo(o+p/d*f.x+c.x,a+p/d*f.y+c.y),t.stroke(),u=new i(o+p/d*f.x+c.x,a+p/d*f.y+c.y),c.mult(-1);t.strokeStyle="black",e.points.forEach(p=>{t.beginPath(),t.arc(p.x,p.y,2.5,0,Math.PI*2),t.fill(),t.stroke()})}renderStick(e,t){let s=e.points;t.beginPath(),t.moveTo(s[0].x,s[0].y),t.lineTo(s[1].x,s[1].y),t.stroke(),t.strokeStyle="black",e.points.forEach(o=>{t.beginPath(),t.arc(o.x,o.y,2.5,0,Math.PI*2),t.fill(),t.stroke()})}},ot=Us;var Ne=400,je=300,Ho=1.2,Gs=class{constructor(e,t,s){this.name=e,this.description=t,this.content=s.copy;let o=this.content.boundingBox;this.content.move(new i(-o.x.min-o.x.size()/2,-o.y.min-o.y.size()/2)),this.thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",this.generateThumbnail()}generateThumbnail(){let e=document.createElement("canvas");e.width=Ne,e.height=je;let t=this.content.boundingBox,s=Ne/je,o;s>t.x.size()/t.y.size()?o=t.y.size()/je:o=t.x.size()/Ne,o=1/o/Ho;let a=new ot,r=e.getContext("2d");r.fillStyle=w.Independence,r.fillRect(0,0,Ne,je),r.translate(Ne/2,je/2),r.scale(o,o);let l=c=>{if(c.m===0&&(r.strokeStyle="#00000000"),c.shape.r!==0){let f=c;r.beginPath(),r.arc(f.pos.x,f.pos.y,f.shape.r,0,2*Math.PI),r.stroke(),r.fill(),c.m!==0&&(r.beginPath(),r.moveTo(f.pos.x,f.pos.y),r.lineTo(f.pos.x+f.shape.r*Math.cos(f.rotation),f.pos.y+f.shape.r*Math.sin(f.rotation)),r.stroke())}else r.beginPath(),r.moveTo(c.shape.points[c.shape.points.length-1].x,c.shape.points[c.shape.points.length-1].y),c.shape.points.forEach(f=>{r.lineTo(f.x,f.y)}),r.stroke(),r.fill(),c.m!==0&&(r.beginPath(),r.arc(c.pos.x,c.pos.y,1.5,0,Math.PI*2),r.stroke())};this.content.bodies.forEach(c=>{r.fillStyle=c.style,r.strokeStyle="black",l(c)}),this.content.bodies.forEach(c=>{if(c.texture==="none")return;let f=c.textureTransform,u=f.offset.copy;u.rotate(c.rotation),u.add(c.pos);let d=new DOMMatrix([f.scale,0,0,f.scale,u.x,u.y]);d.rotateSelf(0,0,(f.rotation+c.rotation)*180/Math.PI);let p=r.createPattern(c.texture,c.textureRepeat);p.setTransform(d),r.fillStyle=p,r.strokeStyle="#00000000",l(c)}),r.lineWidth=2,this.content.springs.forEach(c=>{c instanceof B&&!(c instanceof E)?(r.strokeStyle=w.blue,r.fillStyle=w.blue,a.renderSpring(c,r)):(r.strokeStyle=w.blue,r.fillStyle=w.blue,a.renderStick(c,r))}),this.thumbnail=e.toDataURL()}},_s=Gs;function Js(n,e){let t=document.getElementById("creation-modal");if(t){t.innerHTML="",t.append(...n);let s=document.getElementById("modal-bg");s&&s.classList.add("showModal");let o=document.getElementById("close-button");o&&(o.onclick=null,o.onclick=()=>{s&&s.classList.remove("showModal"),e()})}}function it(){let n=document.getElementById("creation-modal");n&&(n.innerHTML="")}function fn(){let n=document.getElementById("modal-bg");n&&n.classList.remove("showModal")}var J;(function(n){n.Select="SELECT",n.Resize="RESIZE"})(J||(J={}));var pn=35,ae=8,at=9,Vo=7,C=new ut,gn=J.Select,bn=document.createElement("div"),Me=Object.create({});function Qs(n){let e=new i(n.mouseX,n.mouseY),t=n.physics.springs.find(s=>s.getAsSegment().distFromPoint(e)<=Vo);return typeof t=="undefined"?!1:t}function Se(n){bn.innerHTML="",gn=n;let e=Me[gn];e&&(bn.append(e.element),e.activated())}function rt(){return Me[gn]}function qo(n){return new Promise((e,t)=>{let s=h("div",null,"You cannot leave the 'Name' field empty!");s.style.color=w["Imperial Red"],s.style.fontSize="small",s.style.marginLeft="auto",s.style.marginRight="auto",s.style.width="100%",s.style.display="none",s.style.textAlign="center";let o=h("text-input",null,"Name of creation"),a=h("text-input",null,"Description"),r=h("apply-cancel",{applyText:"Save",cancelText:"Cancel",onCancel:()=>{fn(),setTimeout(it,450),t(new Error("Canceled"))},onApply:()=>{if(o.inputValue==="")s.style.display="block";else{let c={name:o.inputValue,description:a.inputValue};fn(),setTimeout(it,450),e(c)}}});r.width="35%";let l=r.containerElement;l.style.marginLeft="auto",l.style.marginRight="auto",l.style.marginBottom="0.7em",l.style.height="1.5em",l.style.fontSize="large",Js([n,s,o,a,r],()=>{setTimeout(it,450),t(new Error("Canceled"))})})}async function Wo(){let n=new Image;n.className="creation-image-modal";let e=new _s("","",C);n.src=e.thumbnail;try{let t=await qo(n);e.name=t.name,e.description=t.description,Pn(e)}catch(t){}}Me[J.Select]={update(n,e,t){let{boundingBox:s}=C;s.x.size()!==0&&(t.lineWidth=3,t.setLineDash([3,5]),t.strokeStyle="#FFFFFF55",t.strokeRect(s.x.min,s.y.min,s.x.size(),s.y.size()))},startInteraction(n){let e=new i(n.mouseX,n.mouseY),t=n.physics.getObjectAtCoordinates(e.x,e.y,4);if(t instanceof y){C.bodies.includes(t)?C.bodies.splice(C.bodies.indexOf(t),1):C.addBody(t);return}let s=Qs(n);s instanceof B&&(C.springs.includes(s)?C.springs.splice(C.springs.indexOf(s),1):C.addSpring(s))},endInteraction(){C.bodies.length===0?this.editBtn.hide():this.editBtn.show()},init(){this.editBtn.smallMargin(),C.bodies.length===0?this.editBtn.hide():this.editBtn.show()},activated(){C.bodies.length===0?this.editBtn.hide():this.editBtn.show()},get editBtn(){return this.element.querySelector("#editBtn")},element:h("div",null,h("number-display",null,"Select/deselect anything"),h("button-btn",{id:"editBtn",onClick:()=>{Se(J.Resize)}},"Edit selection"))};Me[J.Resize]={update(n,e,t){var a;this.toDelete&&(this.toDelete=!1,C.bodies.forEach(r=>{n.physics.removeObjFromSystem(r)}),C.bodies=[],C.springs=[],Se(J.Select)),n.timeMultiplier!==0&&((a=document.getElementById("pause"))==null||a.click()),t.lineWidth=3,t.setLineDash([5,3.5]),t.strokeStyle=w["Roman Silver"];let{boundingBox:s}=C,o=s;if(this.command!=="rotate"?(t.strokeRect(s.x.min,s.y.min,s.x.max-s.x.min,s.y.max-s.y.min),t.beginPath(),t.moveTo(s.x.max/2+s.x.min/2,s.y.min),t.lineTo(s.x.max/2+s.x.min/2,s.y.min-pn),t.stroke(),t.fillStyle=w.blue,t.beginPath(),t.arc(o.x.min,o.y.min,ae,0,2*Math.PI),t.fill(),t.beginPath(),t.arc(o.x.max,o.y.min,ae,0,2*Math.PI),t.fill(),t.beginPath(),t.arc(o.x.max,o.y.max,ae,0,2*Math.PI),t.fill(),t.beginPath(),t.arc(o.x.min,o.y.max,ae,0,2*Math.PI),t.fill(),t.beginPath(),t.arc((o.x.min+o.x.max)/2,o.y.min-pn,at,0,2*Math.PI),t.fill()):(t.fillStyle=w.blue,t.beginPath(),t.moveTo(n.mouseX,n.mouseY),t.lineTo(this.rotateCenter.x,this.rotateCenter.y),t.stroke(),t.beginPath(),t.arc(n.mouseX,n.mouseY,at,0,2*Math.PI),t.fill(),t.beginPath(),t.arc(this.rotateCenter.x,this.rotateCenter.y,at,0,2*Math.PI),t.fill()),this.command==="none"){let r=this.findCommand(n.mouseX,n.mouseY),l=n;l.cnv.style.cursor!==this.cursors[r]&&(l.cnv.style.cursor=this.cursors[r])}this.updateCommand(n)},startInteraction(n){if(this.command=this.findCommand(n.mouseX,n.mouseY),this.command==="rotate"){let e=C.boundingBox,t=new i(e.x.max,e.y.max),s=new i(e.x.min,e.y.min);this.rotateCenter=i.add(s,t),this.rotateCenter.div(2)}},endInteraction(n){let e=n;e.cnv.style.cursor="default",this.command="none"},updateCommand(n){if(this.command==="none")return;let e=new i(n.mouseX,n.mouseY),t=new i(n.oldMouseX,n.oldMouseY),s=i.sub(e,t),o=C.boundingBox,a=new i(o.x.min,o.y.min),r=new i(o.x.max,o.y.min),l=new i(o.x.min,o.y.max),c=new i(o.x.max,o.y.max),f=i.add(a,c);f.div(2);let u=i.sub(e,f).heading-i.sub(t,f).heading,d=i.sub(a,c),p=i.sub(r,l);switch(this.command){case"move":C.move(s);break;case"rotate":C.rotateAround(this.rotateCenter,u);break;case"resize-br":C.scaleAround(a,i.dot(i.sub(e,a),d)/i.dot(i.sub(t,a),d));break;case"resize-bl":C.scaleAround(r,i.dot(i.sub(e,r),p)/i.dot(i.sub(t,r),p));break;case"resize-tr":C.scaleAround(l,i.dot(i.sub(e,l),p)/i.dot(i.sub(t,l),p));break;case"resize-tl":C.scaleAround(c,i.dot(i.sub(e,c),d)/i.dot(i.sub(t,c),d));break;default:break}},findCommand(n,e){let t=new i(n,e),s=C.boundingBox;if(t.dist(new i(s.x.min,s.y.min))<=ae)return"resize-tl";if(t.dist(new i(s.x.max,s.y.min))<=ae)return"resize-tr";if(t.dist(new i(s.x.min,s.y.max))<=ae)return"resize-bl";if(t.dist(new i(s.x.max,s.y.max))<=ae)return"resize-br";if(t.x>=s.x.min&&t.x<=s.x.max&&t.y>=s.y.min&&t.y<=s.y.max)return"move";let o=new i((s.x.min+s.x.max)/2,s.y.min-pn);return t.dist(o)<=at?"rotate":"none"},command:"none",cursors:{none:"default",rotate:De,move:"move","resize-bl":"nesw-resize","resize-br":"nwse-resize","resize-tl":"nwse-resize","resize-tr":"nesw-resize"},rotateCenter:new i(0,0),init(){C.removeUnusedSprings(),C.bodies.length===0&&Se(J.Select)},activated(){this.command="none"},element:h("div",null,h("number-display",null,"Move, resize, scale or export creation"),h("button-btn",{bgColor:w["Imperial Red"],onClick:()=>{let n=Me[J.Resize];n&&(n.toDelete=!0)},decreasedMargin:!0},"Delete"),h("button-btn",{onClick:()=>Wo(),decreasedMargin:!0},"Save as creation"),h("button-btn",{onClick:()=>Se(J.Select),decreasedMargin:!0},"Stop editing")),toDelete:!1};var Uo={name:"Select multiple",description:"",element:bn,drawFunc(n,e){var r,l;let{cnv:t}=n,s=t.getContext("2d");s.save();let o=new i(n.mouseX,n.mouseY);s.lineWidth=4,s.fillStyle="#00000000",s.setLineDash([]),s.strokeStyle="orange",C.bodies.forEach(c=>{n.renderer.renderBody(c,s)}),C.springs.forEach(c=>{s.strokeStyle="orange",c instanceof E?n.renderer.renderStick(c,s):n.renderer.renderSpring(c,s)}),s.strokeStyle="yellow",s.setLineDash([3,5]);let a=n.physics.getObjectAtCoordinates(o.x,o.y,4);if(a instanceof y)n.renderer.renderBody(a,s);else{let c=Qs(n);c instanceof B&&(c instanceof E?n.renderer.renderStick(c,s):n.renderer.renderSpring(c,s))}(l=(r=rt())==null?void 0:r.update)==null||l.call(r,n,e,s),s.restore()},startInteractionFunc(n){var e,t;(t=(e=rt())==null?void 0:e.startInteraction)==null||t.call(e,n)},endInteractionFunc(n){var e,t;(t=(e=rt())==null?void 0:e.endInteraction)==null||t.call(e,n)},deactivated(n){C.bodies=[],C.springs=[];let e=n;e.cnv.style.cursor="default",Se(J.Select)},activated(){var n;(n=rt())==null||n.activated()}};Se(J.Select);Object.values(Me).forEach(n=>{n&&n.init()});var $s=Uo;var Ks=[gs,Vs,$s,ws,xs,Xn,On,Ss];var A=Ks,ct=A.map(n=>n.name),Zs=class{constructor(){this.resizeCanvas=()=>{let e=this.canvasHolder.getBoundingClientRect();this.cnv.width=e.width,this.cnv.height=window.innerHeight-e.top;let t=window.devicePixelRatio||1,s=e;this.cnv.width=s.width*t,this.cnv.height=s.height*t,this.cnv.style.width=`${s.width}px`,this.cnv.style.height=`${s.height}px`,this.scaling=this.cnv.height/this.worldSize.height,this.scaling/=t,this.scaling*=.9,this.viewOffsetX=.01*this.cnv.width,this.viewOffsetY=.03*this.cnv.height;let o=this.cnv.getContext("2d");o&&(o.scale(t,t),o.lineWidth=t),this.defaultSize=(this.cnv.width+this.cnv.height)/80};this.drawFunction=()=>{var o,a;Number.isFinite(this.lastFrameTime)||(this.lastFrameTime=performance.now());let e=performance.now()-this.lastFrameTime;Number.isFinite(e)||(e=0),e/=1e3,e=Math.min(e,.04166666666);let t=this.cnv.getContext("2d");t.fillStyle=w.Beige,t.fillRect(0,0,this.cnv.width,this.cnv.height),t.save(),t.translate(this.viewOffsetX,this.viewOffsetY),t.scale(this.scaling,this.scaling),this.physicsDraw(),(a=(o=A[this.mode]).drawFunc)==null||a.call(o,this,e*this.timeMultiplier),t.restore(),this.collisionData=[],e*=this.timeMultiplier;let s=this.physics.bodies.find(r=>r.m!==0);s&&(this.right&&(s.ang=Math.min(s.ang+300*e,15)),this.left&&(s.ang=Math.max(s.ang-300*e,-15))),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.lastFrameTime=performance.now(),requestAnimationFrame(this.drawFunction),this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY};this.startInteraction=(e,t)=>{var s,o;this.mouseX=e/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=t/this.scaling-this.viewOffsetY/this.scaling,this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY,this.choosed=this.physics.getObjectAtCoordinates(this.mouseX,this.mouseY,4),!this.choosed&&typeof this.choosed=="boolean"&&(this.choosed={x:this.mouseX,y:this.mouseY,pinPoint:!0}),this.lastX=this.mouseX,this.lastY=this.mouseY,this.mouseDown=!0,(o=(s=A[this.mode]).startInteractionFunc)==null||o.call(s,this)};this.endInteraction=(e,t)=>{var s,o;this.mouseX=e/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=t/this.scaling-this.viewOffsetY/this.scaling,(o=(s=A[this.mode]).endInteractionFunc)==null||o.call(s,this),this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.discardInteraction=()=>{this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.keyGotDown=e=>{let t=e.key;t==="s"&&this.spawnNewtonsCradle(this.cnv.width/2,this.cnv.height/2,.5,this.physics),t==="a"&&(this.scaling+=.01),t==="d"&&(this.scaling-=.01),t==="j"&&(this.viewOffsetX-=10),t==="l"&&(this.viewOffsetX+=10),t==="k"&&(this.viewOffsetY-=10),t==="i"&&(this.viewOffsetY+=10),t==="ArrowRight"&&(this.right=!0),t==="ArrowLeft"&&(this.left=!0)};this.keyGotUp=e=>{let t=e.key;t==="ArrowRight"&&(this.right=!1),t==="ArrowLeft"&&(this.left=!1)};this.startTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();return e.touches.length>1?(this.discardInteraction(),e.touches.length===2&&(this.touchIDs.push(e.touches[0].identifier),this.touchIDs.push(e.touches[1].identifier),this.touchCoords.push(new i(e.touches[0].clientX-t.left,e.touches[0].clientY-t.top)),this.touchCoords.push(new i(e.touches[1].clientX-t.left,e.touches[1].clientY-t.top))),e.touches.length>2&&(this.touchIDs=[],this.touchCoords=[]),!1):(this.startInteraction(e.changedTouches[0].clientX-t.left,e.changedTouches[0].clientY-t.top),!1)};this.endTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();return e.touches.length<=1&&(this.touchIDs=[],this.touchCoords=[]),this.endInteraction(e.changedTouches[0].clientX-t.left,e.changedTouches[0].clientY-t.top),!1};this.moveTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();if(e.touches.length===2){let s=[];return e.touches.item(0).identifier===this.touchIDs[0]?(s.push(e.touches.item(0)),s.push(e.touches.item(1))):(s.push(e.touches.item(1)),s.push(e.touches.item(0))),s=s.map(o=>new i(o.clientX-t.left,o.clientY-t.top)),this.processMultiTouchGesture(this.touchCoords,s),this.touchCoords=s,!1}return e.touches.length>2||(this.mouseX=e.changedTouches[0].clientX-t.left,this.mouseY=e.changedTouches[0].clientY-t.top,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling),!1};this.processMultiTouchGesture=(e,t)=>{let s=i.add(e[1],e[0]);s.mult(.5);let o=i.add(t[1],t[0]);o.mult(.5);let a=i.dist(e[1],e[0]),r=i.dist(t[1],t[0]),l=Math.sqrt(r/a),c=i.add(s,o);c.mult(.5);let f=i.sub(o,s);f.mult(l),this.scaleAround(c,l),this.viewOffsetX+=f.x,this.viewOffsetY+=f.y};this.scaleAround=(e,t)=>{this.viewOffsetX=e.x-(e.x-this.viewOffsetX)*t,this.viewOffsetY=e.y-(e.y-this.viewOffsetY)*t,this.scaling*=t};this.startMouse=e=>(e.button===0&&this.startInteraction(e.offsetX,e.offsetY),e.button===2&&(this.rightButtonDown=new i(e.offsetX,e.offsetY),this.cnv.style.cursor="all-scroll"),!1);this.endMouse=e=>(e.button===0&&this.endInteraction(e.offsetX,e.offsetY),e.button===2&&(this.rightButtonDown=!1,this.cnv.style.cursor="default"),!1);this.handleMouseMovement=e=>{if(this.mouseX=e.offsetX,this.mouseY=e.offsetY,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling,this.rightButtonDown){let t=new i(e.offsetX,e.offsetY),s=i.sub(t,this.rightButtonDown);this.viewOffsetX+=s.x,this.viewOffsetY+=s.y,this.rightButtonDown=t}};this.handleMouseWheel=e=>{e.preventDefault();let t=new i(e.offsetX,e.offsetY),s=5e-4;e.deltaMode===WheelEvent.DOM_DELTA_LINE&&(s/=16);let o=1-e.deltaY*s;this.scaleAround(t,o)};this.convertToPhysicsSpace=e=>new i(e.x/this.scaling-this.viewOffsetX/this.scaling,e.y/this.scaling-this.viewOffsetY/this.scaling);this.convertToCanvasSpace=e=>new i(e.x*this.scaling+this.viewOffsetX,e.y*this.scaling+this.viewOffsetY);this.physicsDraw=()=>{let e=this.cnv.getContext("2d");if(e){e.fillStyle=w.Independence,e.fillRect(0,0,this.worldSize.width,this.worldSize.height);let t=o=>{if(o.m===0&&(e.strokeStyle="#00000000"),o.shape.r!==0){let a=o;e.beginPath(),e.arc(a.pos.x,a.pos.y,a.shape.r,0,2*Math.PI),e.stroke(),e.fill(),o.m!==0&&(e.beginPath(),e.moveTo(a.pos.x,a.pos.y),e.lineTo(a.pos.x+a.shape.r*Math.cos(a.rotation),a.pos.y+a.shape.r*Math.sin(a.rotation)),e.stroke())}else e.beginPath(),e.moveTo(o.shape.points[o.shape.points.length-1].x,o.shape.points[o.shape.points.length-1].y),o.shape.points.forEach(a=>{e.lineTo(a.x,a.y)}),e.stroke(),e.fill(),o.m!==0&&(e.beginPath(),e.arc(o.pos.x,o.pos.y,1.5,0,Math.PI*2),e.stroke()),this.showAxes&&(e.strokeStyle="black",o.axes.forEach(a=>{e.beginPath(),e.moveTo(o.pos.x,o.pos.y),e.lineTo(o.pos.x+a.x*30,o.pos.y+a.y*30),e.stroke()}))};if(this.physics.bodies.forEach(o=>{e.fillStyle=o.style,e.strokeStyle="black",t(o)}),this.physics.bodies.forEach(o=>{if(o.texture==="none")return;let a=o.textureTransform,r=a.offset.copy;r.rotate(o.rotation),r.add(o.pos);let l=new DOMMatrix([a.scale,0,0,a.scale,r.x,r.y]);l.rotateSelf(0,0,(a.rotation+o.rotation)*180/Math.PI);let c=e.createPattern(o.texture,o.textureRepeat);c.setTransform(l),e.fillStyle=c,e.strokeStyle="#00000000",t(o)}),e.save(),e.lineWidth=2,this.physics.springs.forEach(o=>{o instanceof B&&!(o instanceof E)?(e.strokeStyle=w.blue,e.fillStyle=w.blue,this.renderer.renderSpring(o,e)):(e.strokeStyle=w.blue,e.fillStyle=w.blue,this.renderer.renderStick(o,e))}),e.restore(),e.strokeStyle="rgba(255, 255, 255, 0.2)",this.showBoundingBoxes&&this.physics.bodies.forEach(o=>{e.strokeRect(o.boundingBox.x.min,o.boundingBox.y.min,o.boundingBox.x.max-o.boundingBox.x.min,o.boundingBox.y.max-o.boundingBox.y.min)}),this.showVelocities){let o=e.lineWidth;e.strokeStyle=w.pink,e.fillStyle=w.pink,e.lineWidth=3.5;let a=.05;this.physics.bodies.forEach(r=>{let l=r.pos.copy,c=i.add(l,i.mult(r.vel,a));e.beginPath(),e.moveTo(l.x,l.y),e.lineTo(c.x,c.y),e.stroke();let f=Math.min(r.vel.length/5,15),u=r.vel.copy;u.normalize(),u.setMag(f);let d=i.add(c,u);u.rotate90(),u.div(3),e.beginPath(),e.moveTo(d.x,d.y),e.lineTo(c.x+u.x,c.y+u.y),e.lineTo(c.x-u.x,c.y-u.y),e.closePath(),e.fill()}),e.lineWidth=o}e.fillStyle=w["Maximum Yellow Red"],e.strokeStyle=w["Maximum Yellow Red"];let s=e.lineWidth;e.lineWidth=4,this.drawCollisions&&this.collisionData.forEach(o=>{e.beginPath(),e.moveTo(o.cp.x,o.cp.y),e.lineTo(o.cp.x+o.n.x*30,o.cp.y+o.n.y*30),e.stroke(),e.beginPath(),e.arc(o.cp.x,o.cp.y,4,0,Math.PI*2),e.fill()}),e.lineWidth=s}};this.spawnNewtonsCradle=(e,t,s,o)=>{let a=[],r=25,l=250,c=8;a.push(new y(P.Circle(s*r,new i(e,t)),1,1,0));let f=1;for(let u=0;u<c-1;u+=1)a.push(new y(P.Circle(s*r,new i(e+f*s*r*1.01*2,t)),1,1,0)),f*=-1,f>0&&(f+=1),u===c-2&&(a[a.length-1].vel.x=-Math.sign(f)*s*r*8);a.forEach(u=>{o.addBody(u);let d=new E(l);d.attachObject(u),d.pinHere(u.pos.x,u.pos.y-l),o.addSpring(d),d.lockRotation()})};this.modeButtonClicked=e=>{let t=e.target.id.replace("-btn",""),s=ct.indexOf(t);this.switchToMode(s)};this.switchToMode=e=>{var o,a,r,l;let t=document.getElementById(`${ct[this.mode]}-btn`);t&&t.classList.remove("bg-pink-darker"),this.sidebar.innerHTML="",(a=(o=A[this.mode]).deactivated)==null||a.call(o,this),(l=(r=A[e]).activated)==null||l.call(r,this);let s=document.getElementById(`${ct[e]}-btn`);s&&s.classList.add("bg-pink-darker"),this.modeTitleHolder.innerText=A[e].name,this.mode=e,this.sidebar.appendChild(A[this.mode].element)};this.setupModes=()=>{let e=document.getElementById("button-holder");ct.forEach((t,s)=>{var a,r;let o=document.createElement("div");o.classList.add("big-button"),o.id=`${t}-btn`,o.textContent=A[s].name,(r=(a=A[s]).init)==null||r.call(a,this),o.onclick=this.modeButtonClicked,e&&e.appendChild(o)}),this.switchToMode(this.mode)};this.setTimeMultiplier=e=>{Number.isFinite(e)&&e>=0&&(this.timeMultiplier=e,e===0?this.pauseBtn.classList.add("bg-pink-darker"):this.pauseBtn.classList.remove("bg-pink-darker"))};this.getTimeMultiplier=()=>this.timeMultiplier;this.setPhysics=e=>{e instanceof mt&&(this.physics=e)};this.getPhysics=()=>this.physics;this.physics=new mt,this.mouseX=0,this.mouseY=0,this.oldMouseX=0,this.oldMouseY=0,this.mouseDown=!1,this.defaultSize=30,this.k=.5,this.fc=2,this.springConstant=2e3,this.scaling=1,this.viewOffsetX=0,this.viewOffsetY=0,this.mode=0,this.lastX=0,this.lastY=0,this.touchIDs=[],this.touchCoords=[],this.rightButtonDown=!1,this.timeMultiplier=1,this.lastFrameTime=performance.now(),this.choosed=!1,this.drawCollisions=!1,this.showAxes=!1,this.worldSize={width:0,height:0},this.collisionData=[],this.showBoundingBoxes=!1,this.showVelocities=!1,this.renderer=new ot,this.left=!1,this.right=!1,this.cnv=document.getElementById("defaulCanvas0"),this.canvasHolder=document.getElementById("canvas-holder"),this.sidebar=document.getElementById("sidebar"),this.modeTitleHolder=document.getElementById("mode-title-text"),this.pauseBtn=document.getElementById("pause"),this.setWorldSize({width:2e3,height:1e3}),this.physics.setGravity(new i(0,1e3)),this.physics.setAirFriction(.9),this.cnv.addEventListener("touchstart",this.startTouch,!1),this.cnv.addEventListener("touchend",this.endTouch,!1),this.cnv.addEventListener("touchmove",this.moveTouch,!1),this.cnv.addEventListener("mousedown",this.startMouse,!1),this.cnv.addEventListener("mouseup",this.endMouse,!1),this.cnv.addEventListener("mousemove",this.handleMouseMovement,!1),this.cnv.addEventListener("wheel",this.handleMouseWheel),this.cnv.addEventListener("contextmenu",e=>e.preventDefault()),this.cnv.addEventListener("keydown",this.keyGotDown,!1),this.cnv.addEventListener("keyup",this.keyGotUp,!1),window.addEventListener("resize",this.resizeCanvas,!1),this.resizeCanvas(),this.setupModes(),ft(this),requestAnimationFrame(this.drawFunction)}setWorldSize(e){this.physics.setBounds(0,0,e.width,e.height),this.worldSize=e}},As=Zs;window.onload=()=>{window.editorApp=new As,"serviceWorker"in navigator&&navigator.serviceWorker.register("serviceworker.js").then(()=>{},n=>{console.log("ServiceWorker registration failed: ",n)})};})();
