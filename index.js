(()=>{var B=class{constructor(e,t){this.x=e,this.y=t}get copy(){return new B(this.x,this.y)}setCoordinates(e,t){this.x=e,this.y=t}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get sqlength(){return this.x*this.x+this.y*this.y}get heading(){if(this.x===0&&this.y===0)return 0;if(this.x===0)return this.y>0?Math.PI/2:1.5*Math.PI;if(this.y===0)return this.x>0?0:Math.PI;let e=B.normalized(this);return this.x>0&&this.y>0?Math.asin(e.y):this.x<0&&this.y>0?Math.asin(-e.x)+Math.PI/2:this.x<0&&this.y<0?Math.asin(-e.y)+Math.PI:this.x>0&&this.y<0?Math.asin(e.x)+1.5*Math.PI:0}add(e){this.x+=e.x,this.y+=e.y}sub(e){this.x-=e.x,this.y-=e.y}mult(e){this.x*=e,this.y*=e}div(e){this.x/=e,this.y/=e}lerp(e,t){this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t}dist(e){return new B(this.x-e.x,this.y-e.y).length}pNorm(e){let t=e;return t<1&&(t=1),(Math.abs(this.x**t)+Math.abs(this.y**t))**(1/t)}setMag(e){this.length!==0&&this.mult(e/this.length)}normalize(){this.length!==0&&this.div(this.length)}scaleAround(e,t){this.x=e.x+(this.x-e.x)*t,this.y=e.y+(this.y-e.y)*t}scaleAroundX(e,t){this.x=e.x+(this.x-e.x)*t}scaleAroundY(e,t){this.y=e.y+(this.y-e.y)*t}rotate(e){let t=Math.cos(e),o=Math.sin(e);this.setCoordinates(this.x*t-this.y*o,this.x*o+this.y*t)}static rotateArr(e,t){let o=Math.cos(t),n=Math.sin(t);e.forEach(a=>{a.setCoordinates(a.x*o-a.y*n,a.x*n+a.y*o)})}rotate90(){let{x:e}=this;this.x=-this.y,this.y=e}rotate270(){let{x:e}=this;this.x=this.y,this.y=-e}static add(e,t){return new B(e.x+t.x,e.y+t.y)}static sub(e,t){return new B(e.x-t.x,e.y-t.y)}static mult(e,t){return new B(e.x*t,e.y*t)}static div(e,t){return new B(e.x/t,e.y/t)}static fromAngle(e){return new B(Math.cos(e),Math.sin(e))}static fromAnglePNorm(e,t){let o=new B(Math.cos(e),Math.sin(e));return o.div(o.pNorm(t)),o}static lerp(e,t,o){return B.add(e,B.mult(B.sub(t,e),o))}static dist(e,t){return B.sub(e,t).length}static dot(e,t){return e.x*t.x+e.y*t.y}static cross(e,t){return e.x*t.y-e.y*t.x}static crossScalarFirst(e,t){return new B(-t.y*e,t.x*e)}static crossScalarSecond(e,t){return new B(e.y*t,-e.x*t)}static angle(e,t){return Math.acos(Math.min(Math.max(B.dot(e,t)/Math.sqrt(e.sqlength*t.sqlength),1),-1))}static angleACW(e,t){let o=e.heading,a=t.heading-o;return a<0?2*Math.PI+a:a}static normalized(e){let t=e.length;return t===0?e:new B(e.x/t,e.y/t)}toJSON(){return{x:this.x,y:this.y}}static fromObject(e){return new B(e.x,e.y)}},i=B;var $t=class{constructor(e,t){this.a=e,this.b=t}get length(){return i.dist(this.a,this.b)}distFromPoint(e){let t=i.sub(this.b,this.a),o=t.length;t.normalize();let n=i.sub(e,this.a),a=i.dot(t,n),r=i.cross(t,n);return a>=0&&a<=o?Math.abs(r):Math.sqrt(Math.min(n.sqlength,i.sub(e,this.b).sqlength))}get nearestPointO(){let e=i.sub(this.b,this.a);if(i.dot(this.a,e)>=0)return this.a.copy;if(i.dot(this.b,e)<=0)return this.b.copy;e.normalize();let t=-i.dot(this.a,e);return i.add(this.a,i.mult(e,t))}static intersect(e,t){let o=i.sub(e.b,e.a),n=o.y/o.x,a=e.b.y-e.b.x*n,r=i.sub(t.b,t.a),c=r.y/r.x,h=t.b.y-t.b.x*c;if(o.x===0&&r.x!==0){if(e.a.x>=t.a.x&&e.a.x<=t.b.x||e.a.x<=t.a.x&&e.a.x>=t.b.x){let p=c*e.a.x+h;if(p>e.a.y&&p<e.b.y||p<e.a.y&&p>e.b.y)return new i(e.a.x,p)}return!1}if(r.x===0&&o.x!==0){if(t.a.x>=e.a.x&&t.a.x<=e.b.x||t.a.x<=e.a.x&&t.a.x>=e.b.x){let p=n*t.a.x+a;if(p>t.a.y&&p<t.b.y||p<t.a.y&&p>t.b.y)return new i(t.a.x,p)}return!1}if(o.x===0&&r.x===0){if(e.a.x===t.a.x){let p;e.a.y<e.b.y?p=[e.a.y,e.b.y]:p=[e.b.y,e.a.y];let x;t.a.y<t.b.y?x=[t.a.y,t.b.y]:x=[t.b.y,t.a.y];let b=[p[0]>x[0]?p[0]:x[0],p[1]<x[1]?p[1]:x[1]];if(b[0]<=b[1])return new i(e.a.x,(b[0]+b[1])/2)}return!1}let f;e.a.x<e.b.x?f=[e.a.x,e.b.x]:f=[e.b.x,e.a.x];let m;t.a.x<t.b.x?m=[t.a.x,t.b.x]:m=[t.b.x,t.a.x];let u=[f[0]>m[0]?f[0]:m[0],f[1]<m[1]?f[1]:m[1]];if(n===c&&a===h&&u[0]<=u[1])return new i((u[0]+u[1])/2,(u[0]+u[1])/2*n+a);let g=(h-a)/(n-c);return g>=u[0]&&g<=u[1]?new i(g,g*n+a):!1}},R=$t;var Kt=class extends R{get length(){return Number.POSITIVE_INFINITY}distFromPoint(e){let t=i.sub(this.a,this.b);t.setMag(1),t.rotate(Math.PI/2);let o=i.sub(e,this.a);return Math.abs(i.dot(o,t))}static intersect(e,t){let o=i.sub(e.b,e.a),n=o.y/o.x,a=e.b.y-e.b.x*n,r=i.sub(t.b,t.a),c=r.y/r.x,h=t.b.y-t.b.x*c;if(n===c)return e.distFromPoint(t.a)===0?new i((e.a.x+e.b.x+t.a.x+t.b.x)/4,(e.a.y+e.b.y+t.a.y+t.b.y)/4):!1;let f=(h-a)/(n-c);return new i(f,n*f+a)}static intersectWithLineSegment(e,t){let o=i.sub(e.b,e.a),n=o.y/o.x,a=e.b.y-e.b.x*n,r=i.sub(t.b,t.a),c=r.y/r.x,h=t.b.y-t.b.x*c;if(o.x===0){if(r.x===0)return e.a.x===t.a.x?new i((t.a.x+t.b.x)/2,(t.a.y+t.b.y)/2):!1;let u=e.a.x,g=c*u+h;return Math.min(t.a.x,t.b.x)<u&&u<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<g&&Math.max(t.a.y,t.b.y)>g?new i(u,g):!1}if(r.x===0){let u=t.a.x,g=n*u+a;return Math.min(t.a.x,t.b.x)<u&&u<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<g&&Math.max(t.a.y,t.b.y)>g?new i(u,g):!1}if(n===c)return e.distFromPoint(t.a)===0?new i((t.a.x+t.b.x)/2,(t.a.y+t.b.y)/2):!1;let f=(h-a)/(n-c),m=n*f+a;return Math.min(t.a.x,t.b.x)<f&&f<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<m&&Math.max(t.a.y,t.b.y)>m?new i(f,m):!1}},K=Kt;var Z=class{constructor(e,t){this.min=e,this.max=t}size(){return this.max-this.min}get copy(){return new Z(this.min,this.max)}};function Xe(s){return new Z(Math.min(...s),Math.max(...s))}function Ye(s,e){return new Z(Math.max(s.min,e.min),Math.min(s.max,e.max))}var J=class{constructor(e){if(e.length<3)throw new Error("Not enough points in polygon (minimum required: 3)");this.points=e,this.makeAntiClockwise()}getSideVector(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),i.sub(this.points[(t+1)%this.points.length],this.points[t%this.points.length])}getSideSegment(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),new R(i.fromObject(this.points[(t+1)%this.points.length]),i.fromObject(this.points[t%this.points.length]))}getSideLine(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),new R(i.fromObject(this.points[(t+1)%this.points.length]),i.fromObject(this.points[t%this.points.length]))}get sides(){return this.points.length}makeAntiClockwise(){let e=0;for(let t=1;t<=this.sides;t+=1){let o=this.getSideVector(t),n=this.getSideVector(t-1);n.mult(-1),e+=i.angleACW(o,n)}this.sides===3?e>Math.PI*1.5&&this.reverseOrder():this.sides===4?i.angleACW(this.getSideVector(1),this.getSideVector(0))>=Math.PI&&this.reverseOrder():this.sides>4&&e-this.sides*Math.PI>0&&this.reverseOrder()}reverseOrder(){this.points=this.points.reverse()}isPointInside(e){let t=new i(e.x,e.y);if(i.dist(t,this.centerPoint)>this.boundRadius)return!1;let o=this.centerPoint.copy;o.add(i.mult(new i(1.1,.6),this.boundRadius));let n=new R(t,o),a=0;return[...Array(this.sides).keys()].map(r=>this.getSideSegment(r)).forEach(r=>{R.intersect(r,n)&&(a+=1)}),a%2==0?!1:a%2==1}get centerPoint(){let e=new i(0,0);return this.points.forEach(t=>{e.add(t)}),e.div(this.sides),e}get boundRadius(){let e=this.centerPoint;return Math.max(...this.points.map(t=>i.dist(t,e)))}get allSides(){return[...Array(this.sides).keys()].map(e=>this.getSideSegment(e))}static intersection(e,t){if(i.dist(e.centerPoint,t.centerPoint)>e.boundRadius+t.boundRadius)return;let o=[],n=e.allSides,a=t.allSides;if(n.forEach((u,g)=>{a.forEach((p,x)=>{let b=R.intersect(u,p);typeof b=="object"&&"x"in b&&(b.isIntersectionPoint=!0,o.push({intersectionPoint:b,sideNum1:g,sideNum2:x}))})}),o.length===0){if(e.isPointInside(t.points[0]))return new J(t.points.map(u=>i.fromObject(u)));if(t.isPointInside(e.points[0]))return new J(e.points.map(u=>i.fromObject(u)))}let r=new J(e.points);for(let u=r.points.length-1;u>=0;u-=1){let g=o.filter(p=>p.sideNum1===u);g.length>1&&g.sort((p,x)=>i.dist(r.points[u],p.intersectionPoint)-i.dist(r.points[u],x.intersectionPoint)),g.length>0&&r.points.splice(u+1,0,...g.map(p=>p.intersectionPoint))}let c=new J(t.points);for(let u=c.points.length-1;u>=0;u-=1){let g=o.filter(p=>p.sideNum2===u);g.length>1&&g.sort((p,x)=>i.dist(c.points[u],p.intersectionPoint)-i.dist(c.points[u],x.intersectionPoint)),g.length>0&&c.points.splice(u+1,0,...g.map(p=>p.intersectionPoint))}let h={polyNum:1,pointNum:0};for(let u=0;u<r.points.length;u+=1)if("isIntersectionPoint"in r.points[u]){h.pointNum=u;break}else if(c.isPointInside(r.points[u])){h.pointNum=u;break}let f=!1,m=[];for(;!f;){let u=h.polyNum===1?r:c,g=h.polyNum===1?c:r;if(m.push(i.fromObject(u.points[h.pointNum%u.points.length])),m.length>2&&m[0].x===m[m.length-1].x&&m[0].y===m[m.length-1].y){m.pop();break}if(m.length>r.points.length+c.points.length)break;"isIntersectionPoint"in u.points[h.pointNum%u.points.length]?"isIntersectionPoint"in u.points[(h.pointNum+1)%u.points.length]||g.isPointInside(u.points[(h.pointNum+1)%u.points.length])&&!("isIntersectionPoint"in u.points[(h.pointNum+1)%u.points.length])?h.pointNum+=1:(h.pointNum=g.points.indexOf(u.points[h.pointNum%u.points.length])+1,h.polyNum=h.polyNum===1?2:1):h.pointNum+=1}return new J(m)}static createCircle(e,t,o=25){let n=[...Array(o).keys()].map(a=>{let r=i.fromAngle(2*Math.PI*a/o);return r.setMag(e),r.add(t),r});return new J(n)}static fracture(e,t=500){return e.map((n,a)=>{let r=[];for(let h=0;h<e.length;h+=1)if(a!==h){let f=e[h],m=i.div(i.add(n,f),2),u=i.sub(n,f);u.rotate(Math.PI/2),r.push(new K(m,i.add(u,m)))}return r=r.filter((h,f)=>{let m=new R(h.a,n);for(let u=0;u<r.length;u+=1)if(f!==u&&K.intersectWithLineSegment(r[u],m))return!1;return!0}),r=r.sort((h,f)=>i.sub(h.a,h.b).heading-i.sub(f.a,f.b).heading),r.map((h,f)=>{let m=[];for(let g=0;g<r.length;g+=1)if(f!==g){let p=K.intersect(h,r[g]);p instanceof i&&m.push(p)}let u=i.sub(h.a,h.b);return m=m.filter(g=>{let p=i.sub(g,n);return u.setMag(1),i.dot(p,u)>0}),m.length===0&&m.push(i.add(i.mult(u,t*1.2),h.a)),m=m.sort((g,p)=>i.dist(g,n)-i.dist(p,n)),m[0]})}).filter(n=>n.length>=3).map(n=>new J(n))}},Qe=J;var A=class{constructor(){this.r=0,this.points=[new i(0,0)]}static Circle(e,t){let o=new A;return o.r=Math.abs(e),o.points[0]=t.copy,o}static Polygon(e){let t=new A;if(e.length<3)throw new Error("A polygon needs at least 3 points to be valid!");return t.points=new Qe(e).points.map(o=>i.fromObject(o)),t}getGeometricalData(){let e={center:this.points[0].copy,area:0,secondArea:0};if(this.r!==0)e.area=this.r*this.r*Math.PI,e.secondArea=.5*Math.PI*this.r**4;else{let t=[];for(let r=2;r<this.points.length;r+=1)t.push([this.points[0],this.points[r-1],this.points[r]]);let o=0,n=0,a=new i(0,0);t.forEach(r=>{let c=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),h=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),m=(c+h+f)/2,u=Math.sqrt(m*(m-c)*(m-h)*(m-f));o+=u,a.x+=u*(r[0].x+r[1].x+r[2].x)/3,a.y+=u*(r[0].y+r[1].y+r[2].y)/3}),a.div(o),e.center=a,e.area=o,t.forEach(r=>{let c=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),h=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),m=(c+h+f)/2,u=Math.sqrt(m*(m-c)*(m-h)*(m-f)),p=new K(r[1],r[2]).distFromPoint(r[0]),x=i.sub(r[2],r[1]);x.rotate90(),x.add(r[1]),c=new K(r[1],x).distFromPoint(r[0]);let v=(h*h*h*p-h*h*p*c+h*p*c*c+h*p*p*p)/36;v+=new i((r[0].x+r[1].x+r[2].x)/3,(r[0].y+r[1].y+r[2].y)/3).dist(e.center)**2*u,n+=v}),e.secondArea=n}return e}getMinMaxX(){let e=Xe(this.points.map(t=>t.x));return e.min-=this.r,e.max+=this.r,e}getMinMaxY(){let e=Xe(this.points.map(t=>t.y));return e.min-=this.r,e.max+=this.r,e}getMinMaxInDirection(e){let t=Xe(this.points.map(o=>i.dot(o,e)));return t.min-=this.r,t.max+=this.r,t}move(e){this.points.forEach(t=>t.add(e))}rotateAround(e,t){this.points.forEach(o=>{o.sub(e)}),i.rotateArr(this.points,t),this.points.forEach(o=>{o.add(e)})}containsPoint(e){if(this.r!==0)return i.sub(e,this.points[0]).sqlength<=this.r*this.r;if(this.points.length===4){let o=new i(this.getMinMaxX().max+10,this.getMinMaxY().max+10),n=new R(e,o),a=0;return this.sides.forEach(r=>{R.intersect(r,n)&&(a+=1)}),a%2==1}return this.points.map((o,n)=>{let a=i.sub(this.points[(n+1)%this.points.length],o);return a.rotate90(),a}).every((o,n)=>i.dot(o,i.sub(e,this.points[n]))>=0)}get sides(){return this.points.map((e,t)=>new R(e,this.points[(t+1)%this.points.length]))}getSide(e){return new R(this.points[e],this.points[(e+1)%this.points.length])}getSideLine(e){return new K(this.points[e],this.points[(e+1)%this.points.length])}getNormal(e){let t=i.sub(this.points[e],this.points[(e+1)%this.points.length]);return t.rotate90(),t.normalize(),t}getClosestPoint(e){let t=this.points.map(r=>i.sub(r,e).sqlength),o=t[0],n=0,a=t.length;for(let r=1;r<a;r+=1)t[r]<o&&(o=t[r],n=r);return this.points[n].copy}getConvexHull(){let e=this.points.map(a=>a),t=this.points[0],o=this.points[0];this.points.forEach(a=>{o.x<a.x&&(o=a),t.x>a.x&&(t=a)}),e.splice(e.indexOf(t),1),e.splice(e.indexOf(o),1);let n=new A;n.points=[t,o];for(let a=0;a<n.points.length;a+=1){if(e.length===0)return n;let r=n.getNormal(a),c=n.points[a],h=e[0],f=i.dot(i.sub(e[0],c),r);if(e.forEach((m,u)=>{if(u===0)return;let g=i.dot(i.sub(m,c),r);g>f&&(f=g,h=m)}),f>0){n.points.splice(a+1,0,h),e.splice(e.indexOf(h),1);for(let m=e.length-1;m>=0;m-=1)n.containsPoint(e[m])&&e.splice(m,1);a-=1}}return n}static fromObject(e){let t=new A;return t.r=e.r,t.points=e.points.map(o=>i.fromObject(o)),t}get copy(){let e=new A;return e.r=this.r,e.points=this.points.map(t=>t.copy),e}},C=A;var Je={white:"#faf3dd",green:"#02c39a",pink:"#e58c8a",pinkDarker:"#da5a58",pinkHover:"#de6a68",blue:"#3db2f1",black:"#363732",Beige:"#f2f3d9",Independence:"#38405f",Turquoise:"#5dd9c1","Rich Black FOGRA 29":"#0e131f","Independence 2":"#59546c","Roman Silver":"#8b939c","Imperial Red":"#ff0035","Hot Pink":"#fc6dab","Maximum Yellow Red":"#f5b841","Lavender Web":"#dcd6f7"},S=Je,Zt=Je.Turquoise,T=Je.Turquoise;var Cn=15,ke=class{constructor(e,t=1,o=.2,n=.5){this.shape=e,this.k=o,this.fc=n;let a=this.shape.getGeometricalData();this.m=a.area*t,this.pos=a.center,this.am=a.secondArea*t,this.rotation=0,this.ang=0,this.vel=new i(0,0),this.layer=void 0,this.defaultAxes=[],this.axes=[],this.calculateAxes(),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()},this.minMaxes=[],this.calculateMinMaxes(),this.style=T,this.texture="none",this.textureTransform={offset:new i(0,0),scale:1,rotation:0},this.textureRepeat="repeat"}calculateAxes(){let e=Math.cos(Math.PI/Cn);this.defaultAxes=this.normals.map(t=>new i(t.x,Math.abs(t.y)));for(let t=this.defaultAxes.length-2;t>=0;t-=1)for(let o=this.defaultAxes.length-1;o>t;o-=1){let n=this.defaultAxes[o],a=this.defaultAxes[t];Math.abs(i.dot(n,a))>e&&(this.defaultAxes.splice(o,1),this.defaultAxes[t]=n)}this.axes=this.defaultAxes.map(t=>t.copy)}calculateMinMaxes(){this.minMaxes=this.axes.map(e=>this.shape.getMinMaxInDirection(e))}get normals(){if(this.shape.r!==0)return[new i(0,1)];let e=this.shape.points.map((t,o)=>i.sub(this.shape.points[(o+1)%this.shape.points.length],t));return e.forEach(t=>{t.rotate270(),t.normalize()}),e}move(e){this.shape.move(e),this.pos.add(e),this.boundingBox.x.max+=e.x,this.boundingBox.x.min+=e.x,this.boundingBox.y.max+=e.y,this.boundingBox.y.min+=e.y}rotate(e){this.rotation+=e,this.shape.r===0&&this.shape.rotateAround(this.pos,e),i.rotateArr(this.axes,e),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()}}velInPlace(e){let t=i.sub(e,this.pos);return t.rotate90(),t.mult(this.ang),t.add(this.vel),t}containsPoint(e){return this.shape.containsPoint(e)}get density(){return this.m/this.shape.getGeometricalData().area}set density(e){if(e<0||!Number.isFinite(e))return;let t=this.shape.getGeometricalData();this.m=t.area*e,this.am=t.secondArea*e}fixDown(){this.m=0}scaleAround(e,t){t!==0&&(this.pos.scaleAround(e,t),this.shape.points.forEach(o=>o.scaleAround(e,t)),this.shape.r=Math.abs(this.shape.r*t),this.m*=t**2,this.am*=t**4)}scaleAroundX(e,t){if(t===0)return;let{density:o}=this;this.shape.points.forEach(a=>a.scaleAroundX(e,t)),this.shape.r=Math.abs(this.shape.r*t);let n=this.shape.getGeometricalData();this.m=n.area*o,this.pos=n.center,this.am=n.secondArea*o,this.calculateAxes(),this.calculateMinMaxes()}scaleAroundY(e,t){if(t===0)return;let{density:o}=this;this.shape.points.forEach(a=>a.scaleAroundY(e,t)),this.shape.r=Math.abs(this.shape.r*t);let n=this.shape.getGeometricalData();this.m=n.area*o,this.pos=n.center,this.am=n.secondArea*o,this.calculateAxes(),this.calculateMinMaxes()}applyImpulse(e,t){if(this.m===0)return;let o=i.sub(e,this.pos);this.vel.add(i.div(t,this.m)),this.ang+=i.cross(o,t)/this.am}static detectCollision(e,t){let o=e,n=t;{let v=Ye(o.boundingBox.x,n.boundingBox.x);if(v.max<v.min)return!1;let k=Ye(o.boundingBox.y,n.boundingBox.y);if(k.max<k.min)return!1}let a=e.axes,r=t.axes;if(o.shape.r!==0){let v=n.shape.getClosestPoint(o.pos),k=i.sub(v,o.pos);k.normalize(),a=[k],o.minMaxes=[o.shape.getMinMaxInDirection(k)]}if(n.shape.r!==0){let v=o.shape.getClosestPoint(n.pos),k=i.sub(v,n.pos);k.normalize(),r=[k],n.minMaxes=[n.shape.getMinMaxInDirection(k)]}let c=[...a,...r],h=v=>o.shape.getMinMaxInDirection(v),f=v=>n.shape.getMinMaxInDirection(v),m=[];if(c.some((v,k)=>{let F;k<a.length?F=e.minMaxes[k]:F=h(v);let H;k>=a.length?H=t.minMaxes[k-a.length]:H=f(v);let w=Ye(F,H);return w.max<w.min?!0:(m.push(w),!1)}))return!1;let u=m.map(v=>v.size()),g=u[0],p=0;for(let v=1;v<u.length;v+=1)g>u[v]&&(g=u[v],p=v);let x=c[p].copy;i.dot(x,i.sub(o.pos,n.pos))>0&&x.mult(-1);let b;if(p<a.length){let v=n.shape.points.map(k=>i.dot(k,x));b=n.shape.points[v.indexOf(Math.min(...v))].copy,n.shape.r!==0&&b.sub(i.mult(x,n.shape.r))}else{let v=o.shape.points.map(k=>i.dot(k,x));b=o.shape.points[v.indexOf(Math.max(...v))].copy,o.shape.r!==0&&b.add(i.mult(x,o.shape.r))}return{normal:x,overlap:g,contactPoint:b}}static fromObject(e){let t=Object.create(ke.prototype);return t.am=e.am,t.ang=e.ang,t.axes=e.axes.map(o=>i.fromObject(o)),t.boundingBox={x:new Z(e.boundingBox.x.min,e.boundingBox.x.max),y:new Z(e.boundingBox.y.min,e.boundingBox.y.max)},t.defaultAxes=e.defaultAxes.map(o=>i.fromObject(o)),t.fc=e.fc,t.k=e.k,t.layer=e.layer,t.m=e.m,t.pos=i.fromObject(e.pos),t.rotation=e.rotation,t.shape=C.fromObject(e.shape),t.style=e.style,t.vel=i.fromObject(e.vel),t.minMaxes=[],t.calculateMinMaxes(),t}get copy(){let e=Object.create(ke.prototype);return e.am=this.am,e.ang=this.ang,e.axes=this.axes.map(t=>t.copy),e.boundingBox={x:this.boundingBox.x.copy,y:this.boundingBox.y.copy},e.defaultAxes=this.defaultAxes.map(t=>t.copy),e.fc=this.fc,e.k=this.k,e.layer=this.layer,e.m=this.m,e.pos=this.pos.copy,e.rotation=this.rotation,e.shape=this.shape.copy,e.style=this.style,e.vel=this.vel.copy,e.minMaxes=this.minMaxes.map(t=>t.copy),e.texture=this.texture,e.textureRepeat=this.textureRepeat,e.textureTransform={offset:this.textureTransform.offset.copy,rotation:this.textureTransform.rotation,scale:this.textureTransform.scale},e}},y=ke;var Le=class{constructor(e,t){this.length=e,this.springConstant=t,this.pinned=!1,this.objects=[],this.rotationLocked=!1,this.initialHeading=0,this.initialOrientations=[0,0],this.attachPoints=[],this.attachRotations=[],this.attachPositions=[]}get copy(){let e=Object.create(Le.prototype);return e.length=this.length,e.springConstant=this.springConstant,typeof this.pinned=="boolean"?e.pinned=this.pinned:e.pinned={x:this.pinned.x,y:this.pinned.y},e.objects=this.objects,e.rotationLocked=this.rotationLocked,e.initialHeading=this.initialHeading,e.initialOrientations=[...this.initialOrientations],e.attachPoints=this.attachPoints.map(t=>t.copy),e.attachRotations=[...this.attachRotations],e.attachPositions=this.attachPositions.map(t=>t.copy),e}pinHere(e,t){this.pinned={x:e,y:t}}unpin(){this.pinned=!1}attachObject(e,t=void 0){let o=this.objects;o.push(e),t?this.attachPoints.push(t.copy):this.attachPoints.push(e.pos.copy),this.attachPositions.push(e.pos.copy),this.attachRotations.push(e.rotation),o.length===2&&(this.pinned=!1),o.length>=3&&(o=[o[o.length-2],o[o.length-1]],this.attachPoints=[this.attachPoints[this.attachPoints.length-2],this.attachPoints[this.attachPoints.length-1]],this.attachPositions=[this.attachPositions[this.attachPositions.length-2],this.attachPositions[this.attachPositions.length-1]],this.attachRotations=[this.attachRotations[this.attachRotations.length-2],this.attachRotations[this.attachRotations.length-1]])}updateAttachPoint0(e,t=0){let o=this.rotationLocked;o&&this.unlockRotation(),this.attachPoints[0]=e.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=t&&(this.attachPoints[0]=this.attachPositions[0].copy),o&&this.lockRotation()}updateAttachPoint1(e,t=0){let o=this.rotationLocked;o&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=e.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=t&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=e.copy),o&&this.lockRotation()}get points(){let e=this.objects.map((t,o)=>{let n=i.sub(this.attachPoints[o],this.attachPositions[o]);return n.rotate(t.rotation-this.attachRotations[o]),i.add(n,t.pos)});return typeof this.pinned!="boolean"&&e.push(i.fromObject(this.pinned)),e}lockRotation(){this.rotationLocked=!0,this.initialOrientations=this.objects.map(t=>t.rotation);let e=this.points;this.initialHeading=i.sub(e[1],e[0]).heading}unlockRotation(){this.rotationLocked=!1}arrangeOrientations(){let e=this.points,o=i.sub(e[1],e[0]).heading-this.initialHeading;this.objects.forEach((n,a)=>{let r=this.initialOrientations[a]+o;n.rotate(r-n.rotation)})}getAsSegment(){let e=this.points;return new R(e[0],e[1])}update(e){this.rotationLocked&&this.arrangeOrientations();let t,o;if(this.pinned instanceof Object&&this.objects[0]){[o,t]=[this.pinned,this.objects[0]];let n=this.points,a=new i(n[1].x-n[0].x,n[1].y-n[0].y),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*e),t.applyImpulse(n[1],a);let c=t.vel;if(c.rotate(-a.heading),this.rotationLocked&&t.m!==0){let h=new i(o.x,o.y),m=i.sub(t.pos,h).length,u=m*m*t.m+t.am,g=(t.am*t.ang-m*t.m*c.y)/u;c.y=-g*m,t.ang=g}c.rotate(a.heading)}else if(this.objects[0]&&this.objects[1]){[t,o]=[this.objects[0],this.objects[1]];let n=this.points,a=i.sub(n[0],n[1]),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*e),o.applyImpulse(n[1],a),a.mult(-1),t.applyImpulse(n[0],a),a=i.sub(t.pos,o.pos);let c=t.vel,h=o.vel;if(c.rotate(-a.heading),h.rotate(-a.heading),this.rotationLocked&&t.m!==0&&o.m!==0){let f=new i(t.pos.x*t.m+o.pos.x*o.m,t.pos.y*t.m+o.pos.y*o.m);f.div(t.m+o.m);let m=i.sub(t.pos,f),u=i.sub(o.pos,f),g=m.length,p=u.length,x=g*g*t.m+t.am+p*p*o.m+o.am,b=(c.y-h.y)*p/(g+p)+h.y,v=(t.am*t.ang+o.am*o.ang+g*t.m*(c.y-b)-p*o.m*(h.y-b))/x;c.y=v*g+b,h.y=-v*p+b,t.ang=v,o.ang=v}c.rotate(a.heading),h.rotate(a.heading)}}},I=Le;var Oe=class extends I{constructor(e){super(e,0);this.springConstant=0}get copy(){let e=Object.create(Oe.prototype);return e.length=this.length,e.springConstant=this.springConstant,typeof this.pinned=="boolean"?e.pinned=this.pinned:e.pinned={x:this.pinned.x,y:this.pinned.y},e.objects=this.objects,e.rotationLocked=this.rotationLocked,e.initialHeading=this.initialHeading,e.initialOrientations=[...this.initialOrientations],e.attachPoints=this.attachPoints.map(t=>t.copy),e.attachRotations=[...this.attachRotations],e.attachPositions=this.attachPositions.map(t=>t.copy),e}updateAttachPoint0(e,t=0){let o=this.rotationLocked;o&&this.unlockRotation(),this.attachPoints[0]=e.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=t&&(this.attachPoints[0]=this.attachPositions[0].copy),this.length=this.getAsSegment().length,o&&this.lockRotation()}updateAttachPoint1(e,t=0){let o=this.rotationLocked;o&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=e.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=t&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=e.copy),this.length=this.getAsSegment().length,o&&this.lockRotation()}update(){this.rotationLocked&&this.arrangeOrientations();let e,t;if(this.pinned instanceof Object&&"x"in this.pinned&&this.objects[0]){if([t,e]=[this.pinned,this.objects[0]],e.m===0)return;let o=this.points,n=new i(o[1].x-o[0].x,o[1].y-o[0].y);n.setMag(n.length-this.length),e.move(n),n=new i(o[1].x-o[0].x,o[1].y-o[0].y),n.normalize();let a=o[0],r=n,c=e,h=i.sub(a,c.pos),f=i.mult(c.velInPlace(a),-1),m=1/c.m;m+=i.dot(i.crossScalarFirst(i.cross(h,r)/c.am,h),r),m=-i.dot(f,r)/m;let u=i.sub(c.vel,i.mult(r,m/c.m)),g=c.ang-m*i.cross(h,r)/c.am;e.vel=u,e.ang=g;let p=e.vel;if(p.rotate(-n.heading),this.rotationLocked&&e.m!==0){let x=new i(t.x,t.y),v=i.sub(e.pos,x).length,k=v*v*e.m+e.am,F=(e.am*e.ang+v*e.m*p.y)/k;p.y=F*v,e.ang=F}p.rotate(n.heading)}else if(this.objects[0]&&this.objects[1]){[e,t]=[this.objects[0],this.objects[1]];let o=this.points,n=i.sub(o[0],o[1]),a=this.length-n.length;n.setMag(1);let r=e,c=t,h=r.m===0?Infinity:r.m,f=c.m===0?Infinity:c.m,m,u;if(h!==Infinity&&f!==Infinity)m=i.mult(n,a*f/(h+f)),u=i.mult(n,-a*h/(h+f));else if(h===Infinity&&f!==Infinity)m=new i(0,0),u=i.mult(n,-a);else if(h!==Infinity&&f===Infinity)u=new i(0,0),m=i.mult(n,a);else return;e.move(m),t.move(u),o=this.points,n=i.sub(o[1],o[0]),n.normalize();let g=n,p=o[0],x=o[1],b=r.ang,v=c.ang,k=i.sub(p,r.pos),F=i.sub(x,c.pos),H=r.m===0?Infinity:r.am,w=c.m===0?Infinity:c.am,G=r.velInPlace(p),Q=c.velInPlace(x),O=i.sub(Q,G),Y=1/h+1/f;Y+=i.dot(i.crossScalarFirst(i.cross(k,g)/H,k),g),Y+=i.dot(i.crossScalarFirst(i.cross(F,g)/w,F),g),Y=-i.dot(O,g)/Y;let oe=i.sub(r.vel,i.mult(g,Y/h)),xe=i.add(c.vel,i.mult(g,Y/f)),ve=b-Y*i.cross(k,g)/H,z=v+Y*i.cross(F,g)/w;e.m!==0&&(e.vel=oe,e.ang=ve),t.m!==0&&(t.vel=xe,t.ang=z);let j=e.vel,V=t.vel;if(j.rotate(-n.heading),V.rotate(-n.heading),this.rotationLocked&&e.m!==0&&t.m!==0){let _e=new i(e.pos.x*e.m+t.pos.x*t.m,e.pos.y*e.m+t.pos.y*t.m);_e.div(e.m+t.m);let we=i.sub(e.pos,_e).length,he=i.sub(t.pos,_e).length,Pn=we*we*e.m+e.am+he*he*t.m+t.am,Fe=(j.y-V.y)*he/(we+he)+V.y,Re=(e.am*e.ang+t.am*t.ang+we*e.m*(j.y-Fe)-he*t.m*(V.y-Fe))/Pn;j.y=Re*we+Fe,V.y=-Re*he+Fe,e.ang=Re,t.ang=Re}j.rotate(n.heading),V.rotate(n.heading)}}},E=Oe;function In(s,e,t,o){let n=o,a=t,r=s,c=e,h=r.vel,f=c.vel,m=r.ang,u=c.ang,g=i.sub(a,r.pos),p=i.sub(a,c.pos),x=r.am,b=c.am,v=r.m,k=c.m,F=(r.k+c.k)/2,H=(r.fc+c.fc)/2,w=r.velInPlace(a),G=c.velInPlace(a),Q=i.sub(G,w),O=1/v+1/k;O+=i.dot(i.crossScalarFirst(i.cross(g,n)/x,g),n),O+=i.dot(i.crossScalarFirst(i.cross(p,n)/b,p),n),O=-((1+F)*i.dot(Q,n))/O;let Y=i.sub(h,i.mult(n,O/v)),oe=i.add(f,i.mult(n,O/k)),xe=m-O*i.cross(g,n)/x,ve=u+O*i.cross(p,n)/b,z=Q.copy;if(z.sub(i.mult(n,i.dot(Q,n))),z.setMag(1),i.dot(n,z)**2>.5)return[{dVel:i.sub(Y,r.vel),dAng:xe-r.ang},{dVel:i.sub(oe,c.vel),dAng:ve-c.ang}];let j=1/v+1/k;j+=i.dot(i.crossScalarFirst(i.cross(g,z)/x,g),z),j+=i.dot(i.crossScalarFirst(i.cross(p,z)/b,p),z),j=-i.dot(Q,z)/j;let V=Math.sign(j)*O*H;return Math.abs(V)>Math.abs(j)&&(V=j),Y=i.sub(Y,i.mult(z,V/v)),oe=i.add(oe,i.mult(z,V/k)),xe-=V*i.cross(g,z)/x,ve+=V*i.cross(p,z)/b,[{dVel:i.sub(Y,r.vel),dAng:xe-r.ang},{dVel:i.sub(oe,c.vel),dAng:ve-c.ang}]}function At(s,e,t){let o=e,n=t,a=s,r=i.sub(o,a.pos),{am:c,m:h}=a,f=i.mult(a.velInPlace(o),-1),m=1/h;m+=i.dot(i.crossScalarFirst(i.cross(r,n)/c,r),n),m=-((1+a.k)*i.dot(f,n))/m;let u=i.sub(a.vel,i.mult(n,m/h)),g=a.ang-m*i.cross(r,n)/c,p=f.copy;if(p.sub(i.mult(n,i.dot(f,n))),p.setMag(1),i.dot(n,p)**2>.5)return{dVel:i.sub(u,a.vel),dAng:g-a.ang};let x=1/h;x+=i.dot(i.crossScalarFirst(i.cross(r,p)/c,r),p),x=-i.dot(f,p)/x;let b=Math.sign(x)*m*a.fc;return Math.abs(b)>Math.abs(x)&&(b=x),u=i.sub(u,i.mult(p,b/h)),g-=b*i.cross(r,p)/c,{dVel:i.sub(u,a.vel),dAng:g-a.ang}}function es(s){let e=[],t=s.length,o=Array(t).fill(0),n=Array(t).fill(0),a=Array(t).fill(0),r=Array(t).fill(0),c=Array(t).fill(0),h=Array(t).fill(0);s.forEach(f=>f.calculateMinMaxes());for(let f=0;f<t-1;f+=1)for(let m=f+1;m<t;m+=1){let u=s[f],g=s[m];if(u.m===0&&g.m===0)continue;let p=y.detectCollision(u,g);if(p&&typeof p!="boolean"){let x=i.dot(u.velInPlace(p.contactPoint),p.normal),b=i.dot(g.velInPlace(p.contactPoint),p.normal);e.push({n:p.normal,cp:p.contactPoint});let v=-p.overlap,k=p.overlap;if(u.m===0){v=0;let w=At(g,p.contactPoint,i.mult(p.normal,-1));r[m]+=w.dVel.x,c[m]+=w.dVel.y,h[m]+=w.dAng,a[m]+=1}else if(g.m===0){k=0;let w=At(u,p.contactPoint,i.mult(p.normal,1));r[f]+=w.dVel.x,c[f]+=w.dVel.y,h[f]+=w.dAng,a[f]+=1}else{v*=g.m/(u.m+g.m),k*=u.m/(u.m+g.m);let[w,G]=In(u,g,p.contactPoint,i.mult(p.normal,1));x>=b&&(r[f]+=w.dVel.x,c[f]+=w.dVel.y,h[f]+=w.dAng,r[m]+=G.dVel.x,c[m]+=G.dVel.y,h[m]+=G.dAng)}let F=i.mult(p.normal,v),H=i.mult(p.normal,k);o[f]+=F.x,o[m]+=H.x,n[f]+=F.y,n[m]+=H.y}}for(let f=0;f<t;f+=1){let m=s[f];if(m.m===0)continue;let u=Math.max(a[f],1);m.move(new i(o[f],n[f])),m.vel.add(new i(r[f]/u,c[f]/u)),m.ang+=h[f]/u}return e}var Me=class{constructor(){this.bodies=[],this.springs=[],this.airFriction=1,this.gravity=new i(0,0)}update(e){let t=[];for(let o=0;o<this.bodies.length;o+=1)this.bodies[o].move(new i(this.bodies[o].vel.x*e,this.bodies[o].vel.y*e)),this.bodies[o].rotate(this.bodies[o].ang*e);for(let o=0;o<3;o+=1)this.springs.forEach(n=>{n.update(e/3/2)});for(let o=0;o<this.bodies.length;o+=1)this.bodies[o].m!==0&&this.bodies[o].vel.add(new i(this.gravity.x*e,this.gravity.y*e));t=es(this.bodies);for(let o=0;o<3;o+=1)this.springs.forEach(n=>{n.update(e/3/2)});return this.bodies.forEach(o=>{let n=o;o.m!==0&&(n.vel.mult(this.airFriction**e),n.ang*=this.airFriction**e)}),t}get copy(){let e=new Me;return e.airFriction=this.airFriction,e.gravity=this.gravity.copy,e.bodies=this.bodies.map(t=>t.copy),e.springs=this.springs.map(t=>{let o=t.objects.map(a=>this.bodies.indexOf(a)).map(a=>e.bodies[a]),n=t.copy;return n.objects=o,n}),e}setAirFriction(e){!Number.isFinite(e)||(this.airFriction=e,this.airFriction<0&&(this.airFriction=0),this.airFriction>1&&(this.airFriction=1))}setGravity(e){this.gravity=e.copy}addBody(e){this.bodies.push(e)}addSoftSquare(e,t,o,n,a=24,r=1){let c={sides:[],points:[]},h=Math.sqrt(t*t/Math.PI);c.points=[...new Array(a).keys()].map(u=>2*u*Math.PI/a).map(u=>i.add(i.mult(i.fromAngle(u),h),e)).map(u=>new y(C.Circle(Math.PI*h/a,u),1,.2,o)),c.sides=c.points.map((u,g)=>{let p=new E(1);return p.attachObject(u),p.attachObject(c.points[(g+1)%c.points.length]),g%2==0&&p.lockRotation(),p}),c.sides.forEach(u=>{let g=u;g.length=.96*4*t/a}),c.points.forEach(u=>{let g=u;g.vel=n.copy}),this.bodies.push(...c.points),this.springs.push(...c.sides);let f=t*t*200*r,m=new I(Math.sqrt(h*h*Math.PI),f/2);m.attachObject(c.points[0]),m.attachObject(c.points[a/2]),this.springs.push(m),m=new I(Math.sqrt(h*h*Math.PI),f/2),m.attachObject(c.points[a/4]),m.attachObject(c.points[3*a/4]),this.springs.push(m),m=new I(Math.sqrt(2*h*h*Math.PI),f),m.attachObject(c.points[a/8]),m.attachObject(c.points[5*a/8]),this.springs.push(m),m=new I(Math.sqrt(2*h*h*Math.PI),f),m.attachObject(c.points[3*a/8]),m.attachObject(c.points[7*a/8]),this.springs.push(m)}addRectWall(e,t,o,n){let a=[];a.push(new i(e-o/2,t-n/2)),a.push(new i(e+o/2,t-n/2)),a.push(new i(e+o/2,t+n/2)),a.push(new i(e-o/2,t+n/2)),this.bodies.push(new y(C.Polygon(a),0))}addRectBody(e,t,o,n,a,r,c=T){let h=[];h.push(new i(e-o/2,t-n/2)),h.push(new i(e+o/2,t-n/2)),h.push(new i(e+o/2,t+n/2)),h.push(new i(e-o/2,t+n/2));let f=new y(C.Polygon(h),1,r,a);f.style=c,this.bodies.push(f)}addFixedBall(e,t,o){this.bodies.push(new y(C.Circle(o,new i(e,t)),0)),this.bodies[this.bodies.length-1].style=S.Beige}addSpring(e){this.springs.push(e)}getSpringsWithBody(e){return this.springs.filter(t=>t.objects.includes(e))}setBounds(e,t,o,n){let a=(r,c,h,f)=>{let m=[];return m.push(new i(r-h/2,c-f/2)),m.push(new i(r+h/2,c-f/2)),m.push(new i(r+h/2,c+f/2)),m.push(new i(r-h/2,c+f/2)),new y(C.Polygon(m),0)};this.bodies[0]=a(e-o,t,2*o,4*n),this.bodies[1]=a(e+2*o,t,2*o,4*n),this.bodies[2]=a(e,t-n,4*o,n*2),this.bodies[3]=a(e+o/2,t+2*n,5*o,2*n);for(let r=0;r<4;r+=1)this.bodies[r].style=S.Beige}getObjectAtCoordinates(e,t,o=0){let n=!1,a=new i(e,t);return this.bodies.some((r,c)=>r.containsPoint(a)&&c>=o?(n=r,!0):!1),n}removeObjFromSystem(e){let t=-1;if(e instanceof y&&(t=this.bodies.indexOf(e)),t!==-1){let o=this.getSpringsWithBody(this.bodies[t]);this.bodies.splice(t,1),o.forEach(n=>{this.removeObjFromSystem(n)});return}(e instanceof E||e instanceof I)&&(t=this.springs.indexOf(e)),t!==-1&&this.springs.splice(t,1)}getObjectIdentifier(e){return e instanceof y?{type:"body",index:this.bodies.indexOf(e)}:{type:"nothing",index:-1}}toJSON(){let e={};return e.airFriction=this.airFriction,e.gravity=this.gravity.toJSON(),e.bodies=this.bodies.map(t=>t.copy),e.springs=this.springs.map(t=>{let o={};return o.length=t.length,o.pinned=t.pinned,o.rotationLocked=t.rotationLocked,o.springConstant=t.springConstant,t instanceof I?o.type="spring":t instanceof E&&(o.type="stick"),o.objects=t.objects.map(n=>this.getObjectIdentifier(n)),o}),e}stickOrSpringFromObject(e){let t={};return e.type==="spring"?t=new I(e.length,e.springConstant):e.type==="stick"&&(t=new E(e.length)),t.pinned=e.pinned,t.rotationLocked=e.rotationLocked,t.objects=e.objects.map(o=>this.bodies[o.index]),t}static fromObject(e){let t=new Me;return t.bodies=e.bodies.map(o=>y.fromObject(o)),t.airFriction=e.airFriction,t.gravity=i.fromObject(e.gravity),t.springs=e.springs.map(o=>t.stickOrSpringFromObject(o)),t}};var $e=Me;var De,ts,Se;function Pe(s){ts=s,s?Se.classList.add("bg-pink-darker"):Se.classList.remove("bg-pink-darker")}function Ke(s){De=s.getPhysics().copy,Se=document.getElementById("set start"),Pe(!1);let e=document.getElementById("pause");e&&(e.onclick=()=>{s.getTimeMultiplier()!==0?s.setTimeMultiplier(0):(s.setTimeMultiplier(1),ts===!0&&(De=s.getPhysics().copy),Pe(!1))});let t=document.getElementById("revert");t&&(t.onclick=()=>{s.setTimeMultiplier(0),s.setPhysics(De.copy),Pe(!0)});let o=document.getElementById("clear all");o&&(o.onclick=()=>{Pe(!0);let a=s.getPhysics();a.springs=[],a.bodies=[]}),Se&&(Se.onclick=()=>{De=s.getPhysics().copy,Pe(!0),s.setTimeMultiplier(0)});let n=!1;document.addEventListener("visibilitychange",()=>{document.hidden?s.getTimeMultiplier()!==0?(s.setTimeMultiplier(0),n=!0):n=!1:n&&s.setTimeMultiplier(1)})}function l(s,e,...t){let o=document.createElement(s);return e&&Object.entries(e).forEach(([n,a])=>{o[n]=a}),t&&t.forEach(n=>{typeof n=="string"?o.appendChild(document.createTextNode(n)):n instanceof HTMLElement&&o.appendChild(n)}),o}var ss=document.createElement("template");ss.innerHTML=`
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
`;var ns=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ss.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"number-label"},l("span",null,l("slot",null)),l("span",{id:"numberPlace"})))}set value(e){this.shadowRoot.querySelector("#numberPlace").innerText=e}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}};window.customElements.define("number-display",ns);var os=document.createElement("template");os.innerHTML=`
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
`;var is=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(os.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"cursor-pointer"},l("label",{htmlFor:"cbIdentifier",className:"checkbox-label"},l("input",{type:"checkbox",className:"ch-box",id:"cbIdentifier"}),l("div",{className:"checkbox-display"}),l("div",{className:"label-text"},l("slot",null))))),this.shadowRoot.querySelector(".checkbox-display").innerHTML='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.877px" height="101.052px" viewBox="0 0 122.877 101.052" id="checkmark-svg" enable-background="new 0 0 122.877 101.052" xml:space="preserve"><g><path d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"/></g></svg>',this.shadowRoot.querySelector("#checkmark-svg").classList.add("checkmark")}get checkbox(){return this.shadowRoot.querySelector("#cbIdentifier")}set checked(e){this.checkbox.checked=e}set onChange(e){this.checkbox.onchange=t=>e(t.target.checked)}};window.customElements.define("check-box",is);var ee={spring:!0,body:!0},Bn=7,as=document.createElement("div");function rs(s){if(!ee.spring)return!1;let e=new i(s.mouseX,s.mouseY),t=s.physics.springs.find(o=>o.getAsSegment().distFromPoint(e)<=Bn);return typeof t=="undefined"?!1:t}var En={name:"Delete",description:"",element:as,drawFunc(s,e){let t=ee.body&&s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY,4);if(typeof t!="boolean"){let n=s.cnv.getContext("2d");n.save(),n.fillStyle="#00000000",n.strokeStyle=S["Imperial Red"],n.lineWidth=3,s.renderer.renderBody(t,n),n.restore();return}let o=rs(s);if(o){let n=s.cnv.getContext("2d");n.save(),n.fillStyle="#00000000",n.strokeStyle=S["Imperial Red"],n.lineWidth=3,o instanceof E?s.renderer.renderStick(o,n):s.renderer.renderSpring(o,n),n.restore()}},startInteractionFunc(s){let e=rs(s);s.choosed&&s.choosed instanceof y&&ee.body?s.physics.removeObjFromSystem(s.choosed):ee.spring&&e&&s.physics.removeObjFromSystem(e)}};as.append(l("number-display",null,"Deletable types:"),l("check-box",{checked:ee.body,onChange:s=>{ee.body=s}},"Body"),l("check-box",{checked:ee.spring,onChange:s=>{ee.spring=s}},"Stick/Spring"));var cs=En;var Tn=document.createElement("div"),Fn={name:"Move",description:"",element:Tn,drawFunc(s,e){let{choosed:t}=s,o=new i(s.mouseX,s.mouseY),n=t||s.physics.getObjectAtCoordinates(o.x,o.y,4);if(n instanceof y){let a=s.cnv.getContext("2d");a.save(),a.lineWidth=3,a.globalAlpha=.6,a.strokeStyle="#FFFFFF",a.fillStyle="#00000000",s.renderer.renderBody(n,a),a.restore()}if(t instanceof y&&t.m!==0){let a=new i(s.oldMouseX,s.oldMouseY),r=i.sub(o,a);e===0?(t.vel.x=0,t.vel.y=0,t.move(r)):(o.x<t.boundingBox.x.min?t.move(new i(o.x-t.boundingBox.x.min,0)):o.x>t.boundingBox.x.max&&t.move(new i(o.x-t.boundingBox.x.max,0)),o.y<t.boundingBox.y.min?t.move(new i(0,o.y-t.boundingBox.y.min)):o.y>t.boundingBox.y.max&&t.move(new i(0,o.y-t.boundingBox.y.max)),t.vel.x=r.x/e,t.vel.y=r.y/e),t.ang=0}},startInteractionFunc(s){let{choosed:e}=s;if(e instanceof y&&e.m!==0){let t=s;t.cnv.style.cursor="grabbing"}},endInteractionFunc(s){let{choosed:e}=s;if(e instanceof y&&e.m!==0){let t=s;t.cnv.style.cursor="grab"}},activated(s){let e=s;e.cnv.style.cursor="grab"},deactivated(s){let e=s;e.cnv.style.cursor="default"}},ls=Fn;var hs=document.createElement("template");hs.innerHTML=`
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
`;var ds=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(hs.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{id:"btn"},l("slot",null))),this.hidden=!1}set bgColor(e){this.btn.style.backgroundColor=e}set textColor(e){this.btn.style.color=e}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(e){this.btn.onclick=e}set onEnter(e){this.btn.onpointerenter=e}set onLeave(e){this.btn.onpointerleave=e}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}asUpper(){this.btn.classList.add("upper")}asMiddle(){this.btn.classList.remove("upper"),this.btn.classList.remove("last")}asLast(){this.btn.classList.add("last")}};window.customElements.define("hover-detector-btn",ds);var ms=document.createElement("template");ms.innerHTML=`
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
`;var us=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ms.content.cloneNode(!0)),this.customHeightDiv=l("div",null),this.customHeightDiv.style.height="1rem",this.shadowRoot.appendChild(this.customHeightDiv)}set height(e){this.customHeightDiv.style.height=`${e}rem`}};window.customElements.define("space-height",us);var fs=document.createElement("template");fs.innerHTML=`
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
`;var ps=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(fs.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",null,l("p",{className:"slider-label"},l("slot",null)),l("input",{id:"slider",type:"range",className:"slider"})))}get slider(){return this.shadowRoot.querySelector("#slider")}set min(e){this.slider.min=e}set max(e){this.slider.max=e}set step(e){this.slider.step=e}set value(e){this.slider.value=e}set onChange(e){this.slider.onchange=t=>e(t.target.valueAsNumber),this.slider.oninput=t=>e(t.target.valueAsNumber)}};window.customElements.define("range-slider",ps);var gs=document.createElement("template");gs.innerHTML=`
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
`;var bs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(gs.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",null,l("label",{htmlFor:"colorWell",className:"picker-label"},l("div",null,l("slot",null)),l("input",{type:"color",id:"colorWell"}))))}get picker(){return this.shadowRoot.querySelector("#colorWell")}set value(e){this.picker.value=e,this.picker.style["background-color"]=e}set onChange(e){let t=o=>{e(o.target.value),this.picker.style["background-color"]=o.target.value};this.picker.onchange=t,this.picker.oninput=t}};window.customElements.define("color-picker",bs);var Ce=35,Ze=.5,Ae=1.5,et=Zt,ys=document.createElement("div"),Rn={name:"Ball",description:"",element:ys,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black",s.mouseDown?(t.beginPath(),t.arc(s.lastX,s.lastY,Ce,0,2*Math.PI),t.stroke()):(t.beginPath(),t.arc(s.mouseX,s.mouseY,Ce,0,2*Math.PI),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new y(C.Circle(Ce,new i(s.lastX,s.lastY)),1,Ze,Ae);e.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),e.style=et,Number.isFinite(e.pos.x)&&Number.isFinite(e.pos.y)&&Number.isFinite(e.vel.x)&&Number.isFinite(e.vel.y)||(e.vel.x=0,e.vel.y=0),s.physics.addBody(e)}}};ys.append(l("range-slider",{min:5,max:120,step:1,value:Ce,onChange:s=>{Ce=s}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:Ze,onChange:s=>{Ze=s}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:Ae,onChange:s=>{Ae=s}},"Coefficient of friction"),l("color-picker",{value:et,onChange:s=>{et=s}},"Color:"));var xs=Rn;var Xn=document.createElement("div"),Yn={name:"Rectangle wall",description:"",element:Xn,drawFunc(s,e){if(s.lastX!==0&&s.lastY!==0){let t=s.cnv.getContext("2d");t.strokeStyle="black",t.strokeRect(s.mouseX,s.mouseY,s.lastX-s.mouseX,s.lastY-s.mouseY)}},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){if(Math.abs(s.lastX-s.mouseX)<5&&Math.abs(s.lastY-s.mouseY)<5)return;s.physics.addRectWall(s.lastX/2+s.mouseX/2,s.lastY/2+s.mouseY/2,2*Math.abs(s.lastX/2-s.mouseX/2),2*Math.abs(s.lastY/2-s.mouseY/2));let e=s;e.physics.bodies[e.physics.bodies.length-1].style=S.Beige}}},vs=Yn;var tt=.2,st=.5,nt=T,ws=document.createElement("div"),Ln={name:"Rectangle body",description:"",element:ws,drawFunc(s,e){let t=s.cnv.getContext("2d");s.lastX!==0&&s.lastY!==0&&(t.strokeStyle="black",t.strokeRect(s.mouseX,s.mouseY,s.lastX-s.mouseX,s.lastY-s.mouseY))},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=Math.abs(s.mouseX-s.lastX),t=Math.abs(s.mouseY-s.lastY);if(e/t>50||t/e>50||t===0||e===0)return;s.physics.addRectBody(s.lastX/2+s.mouseX/2,s.lastY/2+s.mouseY/2,2*Math.abs(s.lastX/2-s.mouseX/2),2*Math.abs(s.lastY/2-s.mouseY/2),st,tt,nt)}},keyGotUpFunc(s){},keyGotDownFunc(s){}};ws.append(l("range-slider",{min:0,max:.6,step:.02,value:tt,onChange:s=>{tt=s}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:st,onChange:s=>{st=s}},"Coefficient of friction"),l("color-picker",{value:nt,onChange:s=>{nt=s}},"Color:"));var ks=Ln;var ze=35,ot=.5,it=.5,Ne=4,He=24,at=T,Ms=document.createElement("div");function Ss(s=24,e=4){return[...new Array(s).keys()].map(t=>i.fromAnglePNorm(Math.PI*2*t/s,e))}var On={name:"Squircle",description:"",element:Ms,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=Ss(He,Ne);if(o.forEach(n=>n.mult(ze)),s.mouseDown){t.beginPath(),t.moveTo(s.lastX+o[0].x,s.lastY+o[0].y);for(let n=1;n<o.length;n+=1)t.lineTo(s.lastX+o[n].x,s.lastY+o[n].y);t.closePath(),t.stroke()}else{t.beginPath(),t.moveTo(s.mouseX+o[0].x,s.mouseY+o[0].y);for(let n=1;n<o.length;n+=1)t.lineTo(s.mouseX+o[n].x,s.mouseY+o[n].y);t.closePath(),t.stroke()}s.mouseDown&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){let e=Ss(He,Ne),t=new i(s.lastX,s.lastY);if(e.forEach(o=>{o.mult(ze),o.add(t)}),s.lastX!==0&&s.lastY!==0){let o=new y(C.Polygon(e),1,ot,it);o.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),o.style=at,s.physics.addBody(o)}}};Ms.append(l("range-slider",{min:5,max:120,step:1,value:ze,onChange:s=>{ze=s}},"Size"),l("range-slider",{min:2,max:7,step:1,value:9-Ne,onChange:s=>{Ne=9-s}},"Roundness"),l("range-slider",{min:12,max:36,step:1,value:He,onChange:s=>{He=s}},"Resolution"),l("range-slider",{min:0,max:.9,step:.02,value:ot,onChange:s=>{ot=s}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:it,onChange:s=>{it=s}},"Coefficient of friction"),l("color-picker",{value:at,onChange:s=>{at=s}},"Color:"));var Ps=On;var U=35;var rt=1.5,ct=24,lt=1,Cs=document.createElement("div"),Dn={name:"Soft square",description:"",element:Cs,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black",s.mouseDown?t.strokeRect(s.lastX-U,s.lastY-U,U*2,U*2):t.strokeRect(s.mouseX-U,s.mouseY-U,U*2,U*2),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){s.lastX!==0&&s.lastY!==0&&s.physics.addSoftSquare(new i(s.lastX,s.lastY),U*2,rt,new i(s.lastX-s.mouseX,s.lastY-s.mouseY),ct,lt)}};Cs.append(l("range-slider",{min:5,max:100,step:1,value:U,onChange:s=>{U=s}},"Size"),l("range-slider",{min:.4,max:3,step:.1,value:lt,onChange:s=>{lt=s}},"Pressure"),l("range-slider",{min:0,max:2,step:.1,value:rt,onChange:s=>{rt=s}},"Coefficient of friction"),l("range-slider",{min:16,max:48,step:8,value:ct,onChange:s=>{ct=s}},"Resolution"));var Is=Dn;var je=20,Bs=document.createElement("div"),zn={name:"Wall drawer",description:"",element:Bs,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black",t.beginPath(),t.arc(s.mouseX,s.mouseY,je,0,2*Math.PI),t.stroke(),s.lastX!==0&&s.lastY!==0&&s.physics.addFixedBall(s.mouseX,s.mouseY,je)}};Bs.append(l("range-slider",{min:5,max:70,step:1,value:je,onChange:s=>{je=s}},"Size"));var Es=zn;var ht=45,dt=.2,mt=1.5,ut=T,Ts=document.createElement("div");function ft(s){let e=s;return s===void 0&&(e=new i(0,0)),C.Polygon([...new Array(3).keys()].map(t=>{let o=2*Math.PI*t/3,n=i.fromAngle(o);return n.rotate(-(Math.PI*7)/6),n.mult(ht),n.add(e),n}))}var Nn={name:"Triangle",description:"",element:Ts,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),ft(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),ft(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new y(ft(e),1,dt,mt);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=ut,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Ts.append(l("range-slider",{min:5,max:120,step:1,value:ht,onChange:s=>{ht=s}},"Size"),l("range-slider",{min:0,max:.35,step:.02,value:dt,onChange:s=>{dt=s}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:mt,onChange:s=>{mt=s}},"Coefficient of friction"),l("color-picker",{value:ut,onChange:s=>{ut=s}},"Color:"));var Fs=Nn;var pt=45,gt=.2,bt=1.5,yt=T,Rs=document.createElement("div");function xt(s){let e=s;return s===void 0&&(e=new i(0,0)),C.Polygon([...new Array(5).keys()].map(t=>{let o=2*Math.PI*t/5,n=i.fromAngle(o);return n.rotate(-Math.PI/10),n.mult(pt),n.add(e),n}))}var Hn={name:"Pentagon",description:"",element:Rs,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),xt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),xt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new y(xt(e),1,gt,bt);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=yt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Rs.append(l("range-slider",{min:5,max:120,step:1,value:pt,onChange:s=>{pt=s}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:gt,onChange:s=>{gt=s}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:bt,onChange:s=>{bt=s}},"Coefficient of friction"),l("color-picker",{value:yt,onChange:s=>{yt=s}},"Color:"));var Xs=Hn;var vt=45,wt=.2,kt=1.5,Mt=T,Ys=document.createElement("div");function St(s){let e=s;return s===void 0&&(e=new i(0,0)),C.Polygon([...new Array(6).keys()].map(t=>{let o=2*Math.PI*t/6,n=i.fromAngle(o);return n.mult(vt),n.add(e),n}))}var jn={name:"Hexagon",description:"",element:Ys,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),St(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),St(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new y(St(e),1,wt,kt);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=Mt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Ys.append(l("range-slider",{min:5,max:120,step:1,value:vt,onChange:s=>{vt=s}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:wt,onChange:s=>{wt=s}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:kt,onChange:s=>{kt=s}},"Coefficient of friction"),l("color-picker",{value:Mt,onChange:s=>{Mt=s}},"Color:"));var Ls=jn;var Pt=45,Ct=.2,It=1.5,Bt=T,Os=document.createElement("div");function Et(s){let e=s;return s===void 0&&(e=new i(0,0)),C.Polygon([...new Array(8).keys()].map(t=>{let o=2*Math.PI*t/8,n=i.fromAngle(o);return n.mult(Pt),n.add(e),n}))}var Vn={name:"Octagon",description:"",element:Os,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),Et(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),Et(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new y(Et(e),1,Ct,It);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=Bt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Os.append(l("range-slider",{min:5,max:120,step:1,value:Pt,onChange:s=>{Pt=s}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:Ct,onChange:s=>{Ct=s}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:It,onChange:s=>{It=s}},"Coefficient of friction"),l("color-picker",{value:Bt,onChange:s=>{Bt=s}},"Color:"));var Ds=Vn;var Ve=45,Tt=.2,Ft=1.5,Rt=T,zs=document.createElement("div");function Xt(s){let e=s;s===void 0&&(e=new i(0,0));let t=C.Polygon([...new Array(11).keys()].map(o=>{let n=Math.PI*o/11,a=i.fromAngle(n);return a.mult(Ve),a.add(e),a}));return t.points.push(new i(-Ve+e.x,e.y)),t}var qn={name:"Half circle",description:"",element:zs,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),Xt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),Xt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new y(Xt(e),1,Tt,Ft);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=Rt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};zs.append(l("range-slider",{min:5,max:120,step:1,value:Ve,onChange:s=>{Ve=s}},"Size"),l("range-slider",{min:0,max:1,step:.02,value:Tt,onChange:s=>{Tt=s}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:Ft,onChange:s=>{Ft=s}},"Coefficient of friction"),l("color-picker",{value:Rt,onChange:s=>{Rt=s}},"Color:"));var Ns=qn;var Yt=.2,Lt=1.5,Ot=T,Hs=document.createElement("div"),q=[],Wn={name:"Draw convex shape",description:"",element:Hs,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown&&(q.some(n=>n.x===o.x&&n.y===o.y)||q.push(o),q.length>3&&(q=C.Polygon(q).getConvexHull().points)),t.beginPath(),q.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()},startInteractionFunc(s){},endInteractionFunc(s){if(q.length>3)q=C.Polygon(q).getConvexHull().points;else{q=[];return}if(s.lastX!==0&&s.lastY!==0){let e=new y(C.Polygon(q),1,Yt,Lt),o=[...new Array(100).keys()].map(n=>i.fromAngle(2*Math.PI*n/100)).map(n=>e.shape.getMinMaxInDirection(n).size());if(Math.max(...o)/Math.min(...o)>15){q=[];return}e.style=Ot,Number.isFinite(e.pos.x)&&Number.isFinite(e.pos.y)&&Number.isFinite(e.vel.x)&&Number.isFinite(e.vel.y)||(e.vel.x=0,e.vel.y=0),s.physics.addBody(e)}q=[]}};Hs.append(l("range-slider",{min:0,max:.35,step:.02,value:Yt,onChange:s=>{Yt=s}},"Bounciness"),l("range-slider",{min:0,max:2,step:.1,value:Lt,onChange:s=>{Lt=s}},"Coefficient of friction"),l("color-picker",{value:Ot,onChange:s=>{Ot=s}},"Color:"));var js=Wn;var de=[xs,ks,vs,Es,js,Ps,Is,Ns,Fs,Xs,Ls,Ds],N=de[0],Vs=document.createElement("div"),Dt=l("div",{className:"full-width"}),qs;function Gn(){return de.indexOf(N)}function Ws(s,e){var o;let t=e;(o=N.deactivated)==null||o.call(N,qs),t[Gn()].bgColor=S.Independence,t[s].bgColor=S.pinkDarker,Dt.innerHTML="",Dt.appendChild(de[s].element),N=de[s]}var Ie=de.map((s,e)=>l("hover-detector-btn",{onClick:()=>{Ws(e,Ie)}},s.name)),Un={name:"Shapes",description:"",element:Vs,drawFunc(s,e){var t;(t=N.drawFunc)==null||t.call(N,s,e)},startInteractionFunc(s){var e;(e=N.startInteractionFunc)==null||e.call(N,s)},endInteractionFunc(s){var e;(e=N.endInteractionFunc)==null||e.call(N,s)},init(s){qs=s,de.forEach(e=>{var t;return(t=e.init)==null?void 0:t.call(e,s)}),Ie.forEach((e,t)=>{t===0&&e.asUpper(),t===Ie.length-1&&e.asLast()})}};Vs.append(l("space-height",{height:1}),...Ie,Dt);Ws(0,Ie);var Gs=Un;var zt=!1,Be=!0,Nt=new i(0,0),Ht=0,ie=1e4,ae=new I(1,ie);ae.attachObject(new y(C.Circle(1,new i(0,0))));var Us=document.createElement("div");function _s(s){let{choosed:e}=s,t=new i(s.lastX,s.lastY);if(s.lastX!==0&&s.lastY!==0&&e instanceof y){let o=i.sub(t,Nt);return o.rotate(e.rotation-Ht),Be&&(o.x=0,o.y=0),o.add(e.pos),o}return t}function _n(s,e){return ae.length=s.dist(e),ae.springConstant=ie,ae.objects[0].pos=s,ae.objects[0].shape.points[0]=s,ae.pinHere(e.x,e.y),ae}var Qn={name:"Spring creator",description:"",element:Us,drawFunc(s,e){let t=s.cnv.getContext("2d");if(t.save(),s.lastX!==0&&s.lastY!==0){t.fillStyle="#00000000",t.strokeStyle="#FFFFFF";let n=_s(s),a=new i(s.mouseX,s.mouseY),r=_n(n,a);s.renderer.renderSpring(r,t)}let o=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY);o instanceof y&&(t.globalAlpha=.6,t.fillStyle="#00000000",t.strokeStyle="#FFFFFF",t.lineWidth=3,s.renderer.renderBody(o,t)),t.restore()},startInteractionFunc(s){s.choosed instanceof y?(Nt=s.choosed.pos.copy,Ht=s.choosed.rotation):typeof s.choosed!="boolean"&&(Nt=new i(s.choosed.x,s.choosed.y),Ht=0)},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY),t,o=_s(s),n=new i(s.mouseX,s.mouseY);s.choosed instanceof y&&Be&&(o=s.choosed.pos.copy),e instanceof y&&Be&&(n=e.pos.copy);let a=I;if(typeof e=="boolean"&&(e={x:s.mouseX,y:s.mouseY,pinPoint:!0}),s.choosed===e||s.choosed===void 0&&e===void 0||s.choosed instanceof Object&&e instanceof Object&&"pinPoint"in s.choosed&&"pinPoint"in e||(s.choosed instanceof Object&&e instanceof Object&&"pinPoint"in s.choosed&&"pos"in e?(t=new a(Math.sqrt((s.choosed.x-e.pos.x)**2+(s.choosed.y-e.pos.y)**2),ie),t.attachObject(e,n),t.pinHere(s.choosed.x,s.choosed.y)):e instanceof Object&&s.choosed instanceof Object&&"pos"in s.choosed&&"pinPoint"in e?(t=new a(Math.sqrt((s.choosed.pos.x-e.x)**2+(s.choosed.pos.y-e.y)**2),ie),t.attachObject(s.choosed,o),t.pinHere(e.x,e.y)):s.choosed instanceof Object&&e instanceof Object&&"pos"in s.choosed&&"pos"in e&&(t=new a(Math.sqrt((s.choosed.pos.x-e.pos.x)**2+(s.choosed.pos.y-e.pos.y)**2),ie),t.attachObject(s.choosed,o),t.attachObject(e,n)),typeof t=="undefined"))return;s.physics.addSpring(t),zt&&t.lockRotation()}}};Us.append(l("check-box",{checked:zt,onChange:s=>{zt=s}},"Lock rotation"),l("check-box",{checked:Be,onChange:s=>{Be=s}},"Snap to center"),l("range-slider",{min:2e3,max:1e5,value:ie,step:200,onChange:s=>{ie=s}},"Spring stiffness"));var Qs=Qn;var jt=!1,Ee=!0,Vt=new i(0,0),qt=0,me=new E(1);me.attachObject(new y(C.Circle(1,new i(0,0))));var Wt=document.createElement("div");function Js(s){let{choosed:e}=s,t=new i(s.lastX,s.lastY);if(s.lastX!==0&&s.lastY!==0&&e instanceof y){let o=i.sub(t,Vt);return o.rotate(e.rotation-qt),Ee&&(o.x=0,o.y=0),o.add(e.pos),o}return t}function Jn(s,e){return me.length=s.dist(e),me.objects[0].pos=s,me.objects[0].shape.points[0]=s,me.pinHere(e.x,e.y),me}var $n={name:"Stick creator",description:"",element:Wt,drawFunc(s,e){let t=s.cnv.getContext("2d");if(t.save(),s.lastX!==0&&s.lastY!==0){t.fillStyle="#00000000",t.strokeStyle="#FFFFFF";let n=Js(s),a=new i(s.mouseX,s.mouseY),r=Jn(n,a);s.renderer.renderStick(r,t)}let o=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY);o instanceof y&&(t.globalAlpha=.6,t.fillStyle="#00000000",t.strokeStyle="#FFFFFF",t.lineWidth=3,s.renderer.renderBody(o,t)),t.restore()},startInteractionFunc(s){s.choosed instanceof y?(Vt=s.choosed.pos.copy,qt=s.choosed.rotation):typeof s.choosed!="boolean"&&(Vt=new i(s.choosed.x,s.choosed.y),qt=0)},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY),t,o=Js(s),n=new i(s.mouseX,s.mouseY);s.choosed instanceof y&&Ee&&(o=s.choosed.pos.copy),e instanceof y&&Ee&&(n=e.pos.copy);let a=E;if(typeof e=="boolean"&&(e={x:s.mouseX,y:s.mouseY,pinPoint:!0}),typeof s.choosed=="boolean"||s.choosed===e||s.choosed===void 0&&e===void 0||"pinPoint"in s.choosed&&"pinPoint"in e||("pinPoint"in s.choosed&&"pos"in e?(t=new a(Math.sqrt((s.choosed.x-e.pos.x)**2+(s.choosed.y-e.pos.y)**2)),t.attachObject(e,n),t.pinHere(s.choosed.x,s.choosed.y)):"pinPoint"in e&&"pos"in s.choosed?(t=new a(Math.sqrt((s.choosed.pos.x-e.x)**2+(s.choosed.pos.y-e.y)**2)),t.attachObject(s.choosed,o),t.pinHere(e.x,e.y)):"pos"in s.choosed&&"pos"in e&&(t=new a(Math.sqrt((s.choosed.pos.x-e.pos.x)**2+(s.choosed.pos.y-e.pos.y)**2)),t.attachObject(s.choosed,o),t.attachObject(e,n)),typeof t=="undefined"))return;s.physics.addSpring(t),jt&&t.lockRotation()}},keyGotUpFunc(s){},keyGotDownFunc(s){}};[l("check-box",{checked:jt,onChange:s=>{jt=s}},"Lock rotation"),l("check-box",{checked:Ee,onChange:s=>{Ee=s}},"Snap to center")].forEach(Wt.appendChild.bind(Wt));var $s=$n;var Ks=document.createElement("template");Ks.innerHTML=`
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
`;var Zs=class extends HTMLElement{constructor(){super();this.minNum=0,this.maxNum=0,this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Ks.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{id:"mainContainer"},l("p",{className:"slider-label"},l("slot",null)),l("input",{id:"slider",type:"range",className:"slider"}),l("input",{id:"number-input",type:"number",className:"number"})))}get slider(){return this.shadowRoot.querySelector("#slider")}get numInput(){return this.shadowRoot.querySelector("#number-input")}set min(e){this.slider.min=e,this.numInput.min=e,this.minNum=e}set max(e){this.slider.max=e,this.numInput.max=e,this.maxNum=e}set step(e){this.slider.step=e,this.numInput.step=e}set value(e){this.slider.value=e,this.numInput.value=e}normalizeValue(e){return Math.min(Math.max(this.minNum,e),this.maxNum)}disable(){this.shadowRoot.querySelector("#mainContainer").classList.add("disabled")}enable(){this.shadowRoot.querySelector("#mainContainer").classList.remove("disabled")}set onChange(e){this.slider.onchange=t=>{let o=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(o)),this.value=o},this.slider.oninput=t=>{let o=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(o)),this.value=o},this.numInput.onchange=t=>{let o=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(o)),this.value=o}}};window.customElements.define("range-slider-number",Zs);var Kn=document.createElement("div"),Zn={name:"World settings",description:"",element:Kn,init(s){let e=s;this.element.append(l("range-slider",{min:0,max:5e3,step:200,value:e.physics.gravity.y,onChange:t=>{e.physics.gravity.y=t}},"Gravity"),l("range-slider",{min:-5e3,max:5e3,step:1e3,value:e.physics.gravity.x,onChange:t=>{e.physics.gravity.x=t}},"Gravity in X direction"),l("range-slider",{min:0,max:.99,step:.01,value:1-e.physics.airFriction,onChange:t=>{e.physics.setAirFriction(1-t)}},"Air friction"),l("range-slider-number",{min:700,max:1e4,step:10,value:e.worldSize.width,onChange:t=>{e.setWorldSize({width:t,height:e.worldSize.height})}},"World width"),l("range-slider-number",{min:700,max:5e3,step:10,value:e.worldSize.height,onChange:t=>{e.setWorldSize({width:e.worldSize.width,height:t})}},"World height"),l("check-box",{checked:e.drawCollisions,onChange:t=>{e.drawCollisions=t}},"Show collision data"),l("check-box",{checked:e.showAxes,onChange:t=>{e.showAxes=t}},"Show body axes"),l("check-box",{checked:e.showBoundingBoxes,onChange:t=>{e.showBoundingBoxes=t}},"Show boounding boxes"),l("check-box",{checked:e.showVelocities,onChange:t=>{e.showVelocities=t}},"Show velocities"))}},As=Zn;var en=document.createElement("template");en.innerHTML=`
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
`;var tn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(en.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"number-label"},l("span",null,l("slot",null)),l("div",{id:"indicatorContainer"},l("hr",{id:"rotationIndicator"})),l("span",null,"\xA0"),l("span",{id:"numberPlace"}),l("span",{id:"symbolPlace"},"\xB0")))}set value(e){let t=e*180/Math.PI%360;this.shadowRoot.querySelector("#numberPlace").innerText=Math.abs(t).toFixed(),this.shadowRoot.querySelector("#rotationIndicator").style.transform=`translateY(-0.1em) rotate(${t}deg)`}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}hideNumber(){this.shadowRoot.querySelector("#numberPlace").classList.add("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.add("hidden")}showNumber(){this.shadowRoot.querySelector("#numberPlace").classList.remove("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.remove("hidden")}};window.customElements.define("angle-display",tn);var sn=document.createElement("template");sn.innerHTML=`
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
      display: none;
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
`;var nn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(sn.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{id:"btn"},l("slot",null))),this.hidden=!1}set bgColor(e){this.btn.style.backgroundColor=e}set textColor(e){this.btn.style.color=e}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(e){this.btn.onclick=e}smallMargin(){this.btn.style.marginTop="0.2em"}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}};window.customElements.define("button-btn",nn);var on=document.createElement("template");on.innerHTML=`
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
`;var an=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(on.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",null,l("input",{type:"file",id:"inputEl",name:"inputEl"}),l("label",{id:"inputLabel",htmlFor:"inputEl"},l("slot",null))))}get input(){return this.shadowRoot.getElementById("inputEl")}set accept(e){this.input.accept=e}set onFile(e){let t=o=>{o.target.files.length!==0&&e(o.target.files[0])};this.input.onchange=t}};window.customElements.define("file-input",an);var rn=document.createElement("template");rn.innerHTML=`
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
`;var cn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(rn.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{id:"container"},l("div",{id:"apply",className:"btn"},"Apply"),l("div",{id:"cancel",className:"btn"}," Cancel")))}set visible(e){if(e){let t=this.containerElement;t.style.display!=="flex"&&(t.style.display="flex")}else{let t=this.containerElement;t.style.display!=="none"&&(t.style.display="none")}}get containerElement(){return this.shadowRoot.getElementById("container")}get applyBtn(){return this.shadowRoot.getElementById("apply")}get cancelBtn(){return this.shadowRoot.getElementById("cancel")}set onApply(e){this.applyBtn.onclick=e}set onCancel(e){this.cancelBtn.onclick=e}};window.customElements.define("apply-cancel",cn);var ln=document.createElement("template");ln.innerHTML=`
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
`;var hn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ln.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",null,l("span",null,l("slot",null)),l("ul",{id:"listHolder",className:"dropdown"})))}set entries(e){this.entryList=e;let{listHolder:t}=this;t.innerHTML="",t.append(...this.entryList.map(o=>l("li",{innerText:o})))}set value(e){this.listHolder.childNodes.forEach(t=>{"classList"in t&&(t.innerText===e?t.classList.add("chosen"):t.classList.remove("chosen"))})}get listHolder(){return this.shadowRoot.getElementById("listHolder")}set onChoice(e){let t=n=>{e(n.target.innerText),this.listHolder.classList.add("hidden"),this.listHolder.childNodes.forEach(a=>{"classList"in a&&(a.innerText===n.target.innerText?a.classList.add("chosen"):a.classList.remove("chosen"))}),setTimeout(()=>{this.listHolder.classList.remove("hidden")},20)},o=this.listHolder;this.listHolder.childNodes.forEach(n=>{let a=n.cloneNode(!0);a.addEventListener("click",t),o.replaceChild(a,n)})}};window.customElements.define("drop-down",hn);var dn=document.createElement("template");dn.innerHTML=`
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
`;var mn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(dn.content.cloneNode(!0)),this.shadowRoot.appendChild(l("div",{className:"container"},l("input",{id:"collapsible",className:"toggle",type:"checkbox",checked:!0}),l("label",{htmlFor:"collapsible",className:"toggle",id:"toggleEl"},"More"),l("div",{className:"toClose"},l("slot",null))))}get input(){return this.shadowRoot.getElementById("collapsible")}set title(e){this.shadowRoot.querySelector("#toggleEl").innerText=e}collapse(){this.input.checked=!1}open(){this.input.checked=!0}set closed(e){this.input.checked=!e}};window.customElements.define("collapsible-element",mn);var te=7,se=6.5,Gt=8,Ut=25,ue=7,un=8,qe=7,fn=7,_t=23,fe=30,pn=4,d=!1,pe=!1,ge=!1,M=!1,re=!1,ne=!1,ce=document.createElement("div"),D,W=!1,le=1,P=new i(0,0),be=0,Te="repeat",_=0,X=1,ye={body:!0,spring:!0};function We(s){ce.innerHTML="",W=!1;let e=l("collapsible-element",{title:"Bodies",closed:!0}),t=[];for(let a=pn;a<s.physics.bodies.length;a+=1){let r=s.physics.bodies[a],c=a-pn,h=l("hover-detector-btn",{bgColor:S.pinkDarker},`Body #${c}`);h.onClick=()=>{pe=r,ge=!1},h.onEnter=()=>{ge=r},h.onLeave=()=>{ge===r&&(ge=!1)},a===s.physics.bodies.length-1&&h.asLast(),t.push(h)}e.append(...t);let o=l("collapsible-element",{title:"Sticks/Springs",closed:!0}),n=[];for(let a=0;a<s.physics.springs.length;a+=1){let r=s.physics.springs[a],c=r instanceof E?"Stick":"Spring",h=l("hover-detector-btn",{bgColor:S.pinkDarker},`${c} #${a}`);h.onClick=()=>{re=r,ne=!1},h.onEnter=()=>{ne=r},h.onLeave=()=>{ne===r&&(ne=!1)},a===s.physics.bodies.length-1&&h.asLast(),n.push(h)}o.append(...n),ce.append(l("number-display",{value:""},"Selectable types:"),l("check-box",{checked:ye.body,onChange:a=>{ye.body=a}},"Body"),l("check-box",{checked:ye.spring,onChange:a=>{ye.spring=a}},"Stick/Spring"),e,o)}var L="none";function gn(s){if(pe instanceof y){let e=pe;return pe=!1,e}return re instanceof I||!ye.body?!1:s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY,4)}function Ge(s){if(pe instanceof y||re instanceof I)return"none";if(typeof W!="boolean"){let e=new i(s.mouseX,s.mouseY);return P.dist(e)<=un?"move-texture":new i(P.x,P.y-_t).dist(e)<=qe?"rotate-texture":new i(P.x+fe,P.y+fe).dist(e)<=fn?"scale-texture-xy":"choose-texture"}if(s.timeMultiplier!==0&&!(d instanceof y&&d.m===0))return"none";if(d instanceof y){let e=d.boundingBox,t=new i(e.x.min,e.y.min),o=new i(e.x.max,e.y.min),n=new i(e.x.min,e.y.max),a=new i(e.x.max,e.y.max),r=i.add(i.lerp(o,t,.5),new i(0,-Ut)),c=new i(s.mouseX,s.mouseY);if(i.dist(r,c)<=Gt)return"rotate";if(i.dist(n,c)<=te)return"resize-bl";if(i.dist(a,c)<=te)return"resize-br";if(i.dist(t,c)<=te)return"resize-tl";if(i.dist(o,c)<=te)return"resize-tr";if(i.dist(i.lerp(o,t,.5),c)<=se)return"resize-t";if(i.dist(i.lerp(a,n,.5),c)<=se)return"resize-b";if(i.dist(i.lerp(t,n,.5),c)<=se)return"resize-l";if(i.dist(i.lerp(o,a,.5),c)<=se)return"resize-r";if(c.x>=t.x&&c.y>=t.y&&c.x<=a.x&&c.y<=a.y)return"move"}else if(typeof M!="boolean"){let e=M.points,t=new i(s.mouseX,s.mouseY);if(e[0].dist(t)<=ue)return"move-spring0";if(e[1].dist(t)<=ue)return"move-spring1"}return"none"}function An(s){if(!(d instanceof y))return;let e=d.boundingBox,t=new i(e.x.min,e.y.min),o=new i(e.x.max,e.y.min),n=new i(e.x.min,e.y.max),a=new i(e.x.max,e.y.max);X=1,s==="rotate"&&(_=d.rotation),s==="resize-bl"&&(_=i.sub(n,o).heading),s==="resize-br"&&(_=i.sub(a,t).heading),s==="resize-tl"&&(_=i.sub(t,a).heading),s==="resize-tr"&&(_=i.sub(o,n).heading),s==="resize-t"&&(_=new i(0,-1).heading),s==="resize-b"&&(_=new i(0,1).heading),s==="resize-l"&&(_=new i(-1,0).heading),s==="resize-r"&&(_=new i(1,0).heading),s==="rotate-texture"&&(_=Math.PI)}function Qt(s){if(typeof d!="boolean"){let e=new i(s.mouseX,s.mouseY),t=new i(s.oldMouseX,s.oldMouseY),o=i.sub(t,d.pos),n=i.sub(e,d.pos),a=d.boundingBox,r=new i(a.x.min,a.y.min),c=new i(a.x.max,a.y.min),h=new i(a.x.min,a.y.max),f=new i(a.x.max,a.y.max),m=i.lerp(r,c,.5),u=i.lerp(h,f,.5),g=i.lerp(f,c,.5),p=i.lerp(h,r,.5),x=i.fromAngle(_),b=1;switch(L){case"move":d.move(new i(s.mouseX-s.oldMouseX,s.mouseY-s.oldMouseY));break;case"rotate":d.rotate(n.heading-o.heading);break;case"resize-bl":b=i.dot(x,i.sub(e,c))/i.dot(x,i.sub(t,c)),b*X>=.03?(d.scaleAround(c,b),d.textureTransform.offset.mult(b),d.textureTransform.scale*=b,X*=b):L="none";break;case"resize-br":b=i.dot(x,i.sub(e,r))/i.dot(x,i.sub(t,r)),b*X>=.03?(d.scaleAround(r,b),d.textureTransform.offset.mult(b),d.textureTransform.scale*=b,X*=b):L="none";break;case"resize-tl":b=i.dot(x,i.sub(e,f))/i.dot(x,i.sub(t,f)),b*X>=.03?(d.scaleAround(f,b),d.textureTransform.offset.mult(b),d.textureTransform.scale*=b,X*=b):L="none";break;case"resize-tr":b=i.dot(x,i.sub(e,h))/i.dot(x,i.sub(t,h)),b*X>=.03?(d.scaleAround(h,b),d.textureTransform.offset.mult(b),d.textureTransform.scale*=b,X*=b):L="none";break;case"resize-t":b=i.dot(x,i.sub(e,u))/i.dot(x,i.sub(t,u)),b*X>=.1?(d.scaleAroundY(u,b),X*=b):L="none";break;case"resize-b":b=i.dot(x,i.sub(e,m))/i.dot(x,i.sub(t,m)),b*X>=.1?(d.scaleAroundY(m,b),X*=b):L="none";break;case"resize-l":b=i.dot(x,i.sub(e,g))/i.dot(x,i.sub(t,g)),b*X>=.1?(d.scaleAroundX(g,b),X*=b):L="none";break;case"resize-r":b=i.dot(x,i.sub(e,p))/i.dot(x,i.sub(t,p)),b*X>=.1?(d.scaleAroundX(p,b),X*=b):L="none";break;default:break}}else if(typeof M!="boolean"){let e=new i(s.mouseX,s.mouseY);switch(L){case"move-spring0":M.updateAttachPoint0(e,ue);break;case"move-spring1":M.updateAttachPoint1(e,ue);break;default:break}}if(typeof W!="boolean"&&typeof d!="boolean"){let e=new i(s.mouseX,s.mouseY),t=new i(s.oldMouseX,s.oldMouseY),o=i.sub(e,P),n=i.sub(t,P),a=new i(1,1);switch(L){case"move-texture":P.x=s.mouseX,P.y=s.mouseY;break;case"scale-texture-xy":le*=i.dot(o,a)/i.dot(n,a),le*=i.dot(o,a)/i.dot(n,a);break;case"rotate-texture":be+=o.heading-n.heading;break;default:break}}}var bn="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAyklEQVQ4T6XST0qCQRjH8Y8JBnoCr9DGjXQBEbqDm6QQgvZeoX0bQVy7cRtBeIPcewi3bYLKeF6mmAZBeZvN8Pz5PvOb53ka/p4mHnGDVgp9YIVrvCdft5FxV3guCpXmBD1sfsAhXrKseOUVcV/ivKgwDvAMn1ngFosisVRTgQ+YpsQ7zA7IjX/fZ/4KfEMHX4jmlKePUeFcBrhPzi0ujjTnN/wv8JjUXMQO7fjWqc0JeIB1qvJUdxydOgtQjazOys1Dbg6GfeqS+wZwAS6Pac4meQAAAABJRU5ErkJggg==') 6.5 6.5, auto",Jt={none:"default",move:"move",rotate:bn,"resize-bl":"nesw-resize","resize-br":"nwse-resize","resize-tl":"nwse-resize","resize-tr":"nesw-resize","resize-t":"ns-resize","resize-b":"ns-resize","resize-l":"ew-resize","resize-r":"ew-resize","move-spring0":"move","move-spring1":"move","move-texture":"move","rotate-texture":bn,"scale-texture-xy":"nwse-resize","choose-texture":"default"};function yn(s){if(re instanceof I){let o=re;return re=!1,o}if(!ye.spring)return!1;let e=new i(s.mouseX,s.mouseY),t=s.physics.springs.find(o=>o.getAsSegment().distFromPoint(e)<=ue);return typeof t=="undefined"?!1:t}function eo(s,e){if(d instanceof y)if(L!=="rotate"){s.strokeStyle=S["Roman Silver"],s.setLineDash([5,3.5]),s.strokeRect(d.boundingBox.x.min,d.boundingBox.y.min,d.boundingBox.x.max-d.boundingBox.x.min,d.boundingBox.y.max-d.boundingBox.y.min),s.beginPath(),s.moveTo(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.min),s.lineTo(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.min-Ut),s.stroke(),s.fillStyle=S.blue,s.beginPath(),s.arc(d.boundingBox.x.min,d.boundingBox.y.min,te,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.min,d.boundingBox.y.max,te,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max,d.boundingBox.y.min,te,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max,d.boundingBox.y.max,te,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.min,d.boundingBox.y.min/2+d.boundingBox.y.max/2,se,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max,d.boundingBox.y.min/2+d.boundingBox.y.max/2,se,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.max,se,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.min,se,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.min-Ut,Gt,0,Math.PI*2),s.fill();let t=Ge(e),o=Jt[t],n=e.cnv.style;n.cursor!==o&&(n.cursor=o)}else s.strokeStyle=S["Roman Silver"],s.setLineDash([5,3.5]),s.beginPath(),s.moveTo(d.pos.x,d.pos.y),s.lineTo(e.mouseX,e.mouseY),s.stroke(),s.fillStyle=S.blue,s.beginPath(),s.arc(e.mouseX,e.mouseY,Gt,0,Math.PI*2),s.fill()}function to(s,e){if(typeof M!="boolean"){let t=M.points;s.fillStyle=S.blue,s.beginPath(),t.forEach(r=>{s.arc(r.x,r.y,ue,0,Math.PI*2)}),s.fill();let o=Ge(e),n=Jt[o],a=e.cnv.style;a.cursor!==n&&(a.cursor=n)}}function so(s){let e=yn(s);if(typeof e!="boolean"){ce.innerHTML="",M=e;let t=l("number-display",{value:M.getAsSegment().length.toFixed(1)},"Length:\xA0"),o=l("range-slider-number",{min:15,max:Math.max(s.worldSize.width,s.worldSize.height),step:1,value:M.length.toFixed(1),onChange:r=>{typeof M!="boolean"&&(M.length=r)}},"Start length"),n;M instanceof I&&!(M instanceof E)?n=l("range-slider-number",{min:2e3,max:1e5,value:M.springConstant,step:200,onChange:r=>{M instanceof I&&(M.springConstant=r)}},"Spring stiffness"):n=l("div",null);let a=l("angle-display",{value:0},"Orientation:\xA0");a.hideNumber(),ce.append(l("number-display",{value:M instanceof E?"stick":"spring"},"Type:\xA0"),t,a,o,n,l("check-box",{checked:M.rotationLocked,onChange:r=>{typeof M!="boolean"&&(r?M.lockRotation():M.unlockRotation())}},"Locked"),l("button-btn",{bgColor:S["Imperial Red"],textColor:"white",onClick:()=>{typeof M!="boolean"&&(s.physics.removeObjFromSystem(M),We(s),D=()=>{},d=!1,M=!1)}},"Delete")),D=()=>{if(typeof M=="boolean")return;t.value=M.getAsSegment().length.toFixed(1);let r=M.getAsSegment();a.value=i.sub(r.b,r.a).heading}}else M=!1,We(s)}function no(s,e){if(s.strokeStyle=S["Roman Silver"],s.setLineDash([5,3.5]),L==="rotate-texture"){let t=new i(e.mouseX,e.mouseY);s.beginPath(),s.moveTo(P.x,P.y),s.lineTo(t.x,t.y),s.stroke(),s.fillStyle=S.blue,s.setLineDash([]),s.beginPath(),s.arc(P.x,P.y,qe,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(t.x,t.y,qe,0,Math.PI*2),s.closePath(),s.fill();return}s.beginPath(),s.moveTo(P.x,P.y-_t),s.lineTo(P.x,P.y),s.stroke(),s.beginPath(),s.moveTo(P.x,P.y),s.lineTo(P.x+fe,P.y+fe),s.stroke(),s.setLineDash([]),s.fillStyle=S.blue,s.beginPath(),s.arc(P.x,P.y,un,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(P.x,P.y-_t,qe,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(P.x+fe,P.y+fe,fn,0,Math.PI*2),s.closePath(),s.fill()}var oo={name:"Select",description:"",element:ce,drawFunc(s,e){var a,r;pe instanceof y&&((a=this.startInteractionFunc)==null||a.call(this,s)),re instanceof I&&((r=this.startInteractionFunc)==null||r.call(this,s));let t=gn(s),o=yn(s),n=s.cnv.getContext("2d");if(n.save(),n.strokeStyle="orange",n.fillStyle="#00000000",n.setLineDash([]),n.lineWidth=4,typeof d!="boolean")if(s.renderer.renderBody(d,n),n.globalAlpha=.6,s.physics.getSpringsWithBody(d).forEach(c=>{n.fillStyle="#00000000",n.strokeStyle="#FFFFFF",c instanceof E?s.renderer.renderStick(c,n):c instanceof I&&s.renderer.renderSpring(c,n)}),n.globalAlpha=1,typeof W!="boolean"){let c=n.createPattern(W,Te);be%=Math.PI*2;let h=new DOMMatrix([le,0,0,le,P.x,P.y]);h.rotateSelf(0,0,be*180/Math.PI),c.setTransform(h),n.fillStyle=c,n.strokeStyle="#00000000",s.renderer.renderBody(d,n),no(n,s),Qt(s);let f=Ge(s),m=Jt[f],u=s.cnv.style;u.cursor!==m&&(u.cursor=m)}else(d.m===0||s.timeMultiplier===0)&&(Qt(s),eo(n,s));else{let c=s.cnv.style;c.cursor!=="default"&&(c.cursor="default")}if(typeof M!="boolean")n.fillStyle="#00000000",M instanceof E?s.renderer.renderStick(M,n):M instanceof I&&s.renderer.renderSpring(M,n),n.globalAlpha=.6,n.strokeStyle="#FFFFFF",M.objects.forEach(c=>s.renderer.renderBody(c,n)),n.globalAlpha=1,s.timeMultiplier===0&&(Qt(s),to(n,s));else if(typeof d=="boolean"){let c=s.cnv.style;c.cursor!=="default"&&(c.cursor="default")}ge instanceof y&&(n.strokeStyle="yellow",n.fillStyle="#00000000",n.setLineDash([3,5]),s.renderer.renderBody(ge,n)),ne instanceof I&&(n.strokeStyle="yellow",n.fillStyle="#00000000",n.setLineDash([3,5]),ne instanceof E?s.renderer.renderStick(ne,n):s.renderer.renderSpring(ne,n)),n.strokeStyle="yellow",n.fillStyle="#00000000",n.setLineDash([3,5]),typeof t!="boolean"?s.renderer.renderBody(t,n):typeof o!="boolean"&&(n.fillStyle="#00000000",o instanceof E?s.renderer.renderStick(o,n):s.renderer.renderSpring(o,n)),n.restore(),D==null||D()},startInteractionFunc(s){let e=Ge(s);if(e!=="none"){L=e,An(e);return}L="none";let t=gn(s);if(t instanceof y&&d!==t&&e==="none"){ce.innerHTML="",d=t,M=!1;let o=l("range-slider-number",{min:.1,max:25,step:.05,value:Number.parseFloat(d.density.toFixed(2)),onChange:w=>{d instanceof y&&(d.density=w),D==null||D()}},"Density");d.m===0&&o.disable();let n=l("check-box",{checked:d.m===0,onChange:w=>{d instanceof y&&(w?(o.disable(),d.density=0,d.vel=new i(0,0),d.ang=0,o.value=0):(o.enable(),d.density=1,o.value=d.density),D==null||D())}},"Fixed down"),a=l("number-display",{value:d.shape.r!==0?"circle":"polygon"},"Type:\xA0"),r=l("number-display",{value:d.m.toFixed(2)},"Mass:\xA0"),c=l("number-display",{value:d.pos.x.toFixed(2)},"X coord:\xA0"),h=l("number-display",{value:d.pos.y.toFixed(2)},"Y coord:\xA0"),f=l("number-display",{value:d.vel.x.toFixed(2)},"X vel:\xA0"),m=l("number-display",{value:d.vel.y.toFixed(2)},"Y vel:\xA0"),u=l("button-btn",{onClick:()=>{d instanceof y&&(d.vel.x=0,d.vel.y=0,d.ang=0)}},"Reset motion");u.smallMargin();let g=l("angle-display",{value:d.rotation.toFixed(2)},"Rotation:\xA0"),p=l("number-display",{value:d.texture==="none"?"none":"set"},"Texture:\xA0"),x=l("file-input",{accept:"image/*",onFile:w=>{if(w.type.includes("image")){let G=new FileReader;G.readAsDataURL(w),G.onload=()=>{if(typeof G.result!="string")return;let Q=new Image;Q.onload=()=>{createImageBitmap(Q).then(O=>{var Y;d instanceof y?(s.timeMultiplier!==0&&((Y=document.getElementById("pause"))==null||Y.click()),W=O,le=Math.max(d.boundingBox.x.size()/O.width,d.boundingBox.y.size()/O.height),P.x=d.boundingBox.x.min,P.y=d.boundingBox.y.min,be=0,d.texture="none"):W=!1})},Q.src=G.result}}}},"Select image"),b=l("apply-cancel",{visible:!0,onApply:()=>{if(typeof d=="boolean"||typeof W=="boolean")return;let w=i.sub(P,d.pos);w.rotate(-d.rotation),d.textureTransform={scale:le,rotation:be-d.rotation,offset:w},d.texture=W,d.textureRepeat=Te,W=!1},onCancel:()=>{W=!1}}),v=l("button-btn",{textColor:"white",onClick:()=>{if(typeof d!="boolean"&&d.texture!=="none"){W=d.texture,d.texture="none",le=d.textureTransform.scale,be=d.textureTransform.rotation+d.rotation;let w=d.textureTransform.offset.copy;w.rotate(d.rotation),w.add(d.pos),P.x=w.x,P.y=w.y}}},"Edit texture");v.smallMargin(),d.texture!=="none"?v.show():v.hide();let k=l("button-btn",{bgColor:S["Imperial Red"],textColor:"white",onClick:()=>{typeof d!="boolean"&&(d.texture="none")}},"Remove texture");k.smallMargin(),d.texture!=="none"?k.show():k.hide();let F=["repeat","repeat-x","repeat-y","no-repeat"];Te=d.textureRepeat;let H=l("drop-down",{entries:F,value:Te,onChoice:w=>{F.includes(w)&&(Te=w,typeof d!="boolean"&&(d.textureRepeat=w))}},"\u25BC\xA0Texture mode");D=()=>{d instanceof y&&(c.value!=d.pos.x&&(c.value=d.pos.x.toFixed(2)),h.value!=d.pos.y&&(h.value=d.pos.y.toFixed(2)),f.value!=d.vel.x&&(f.value=d.vel.x.toFixed(2)),m.value!=d.vel.y&&(m.value=d.vel.y.toFixed(2)),r.value!=d.m&&(r.value=d.m.toFixed(2)),g.value=d.rotation.toFixed(2),p.value!==d.texture&&(p.value=d.texture==="none"?"none":"set"),typeof W!="boolean"?b.visible=!0:b.visible=!1,d.texture!=="none"?k.hidden&&k.show():k.hidden||k.hide(),d.texture!=="none"?v.hidden&&v.show():v.hidden||v.hide())},ce.append(a,r,g,c,h,f,m,u,n,o,l("range-slider-number",{min:0,max:.98,step:.02,value:d.k,onChange:w=>{d instanceof y&&(d.k=w)}},"Bounciness"),l("range-slider-number",{min:0,max:2,step:.1,value:d.fc,onChange:w=>{d instanceof y&&(d.fc=w)}},"Coefficient of friction"),l("color-picker",{value:d.style,onChange:w=>{d instanceof y&&(d.style=w)}},"Color:"),p,H,x,b,v,k,l("button-btn",{bgColor:S["Imperial Red"],textColor:"white",onClick:()=>{typeof d!="boolean"&&(s.physics.removeObjFromSystem(d),We(s),D=()=>{},d=!1,M=!1)}},"Delete"))}else typeof t=="boolean"&&e==="none"&&(d=t,D=()=>{},so(s))},endInteractionFunc(s){L="none"},deactivated(){d=!1,M=!1,D=()=>{}},activated(s){We(s)}},xn=oo;var vn=[Gs,xn,$s,Qs,ls,cs,As];var wn=class{constructor(){this.textures=[]}renderBody(e,t){if(e.shape.r!==0)t.beginPath(),t.arc(e.pos.x,e.pos.y,e.shape.r,0,Math.PI*2),t.stroke(),t.fill();else{t.beginPath(),t.moveTo(e.shape.points[0].x,e.shape.points[0].y);for(let o=1;o<e.shape.points.length;o+=1)t.lineTo(e.shape.points[o].x,e.shape.points[o].y);t.closePath(),t.stroke(),t.fill()}}renderSpring(e,t){let o=e.points,n=o[0].x,a=o[0].y,r=o[1].x,c=o[1].y,h=new i(r-n,c-a),f=h.copy;h.rotate(Math.PI/2),h.setMag(5);let m=new i(n,a),u=Math.floor(e.length/10);for(let g=1;g<=u;g+=1)g===u&&(h=new i(0,0)),t.beginPath(),t.moveTo(m.x,m.y),t.lineTo(n+g/u*f.x+h.x,a+g/u*f.y+h.y),t.stroke(),m=new i(n+g/u*f.x+h.x,a+g/u*f.y+h.y),h.mult(-1);t.strokeStyle="black",e.points.forEach(g=>{t.beginPath(),t.arc(g.x,g.y,2.5,0,Math.PI*2),t.fill(),t.stroke()})}renderStick(e,t){let o=e.points;t.beginPath(),t.moveTo(o[0].x,o[0].y),t.lineTo(o[1].x,o[1].y),t.stroke(),t.strokeStyle="black",e.points.forEach(n=>{t.beginPath(),t.arc(n.x,n.y,2.5,0,Math.PI*2),t.fill(),t.stroke()})}},kn=wn;var $=vn,Ue=$.map(s=>s.name),Mn=class{constructor(){this.resizeCanvas=()=>{let e=this.canvasHolder.getBoundingClientRect();this.cnv.width=e.width,this.cnv.height=window.innerHeight-e.top;let t=window.devicePixelRatio||1,o=e;this.cnv.width=o.width*t,this.cnv.height=o.height*t,this.cnv.style.width=`${o.width}px`,this.cnv.style.height=`${o.height}px`,this.scaling=this.cnv.height/this.worldSize.height,this.scaling/=t,this.scaling*=.9,this.viewOffsetX=.01*this.cnv.width,this.viewOffsetY=.03*this.cnv.height;let n=this.cnv.getContext("2d");n&&(n.scale(t,t),n.lineWidth=t),this.defaultSize=(this.cnv.width+this.cnv.height)/80};this.drawFunction=()=>{var n,a;Number.isFinite(this.lastFrameTime)||(this.lastFrameTime=performance.now());let e=performance.now()-this.lastFrameTime;Number.isFinite(e)||(e=0),e/=1e3,e=Math.min(e,.04166666666);let t=this.cnv.getContext("2d");t.fillStyle=S.Beige,t.fillRect(0,0,this.cnv.width,this.cnv.height),t.save(),t.translate(this.viewOffsetX,this.viewOffsetY),t.scale(this.scaling,this.scaling),this.physicsDraw(),(a=(n=$[this.mode]).drawFunc)==null||a.call(n,this,e*this.timeMultiplier),t.restore(),this.collisionData=[],e*=this.timeMultiplier;let o=this.physics.bodies.find(r=>r.m!==0);o&&(this.right&&(o.ang=Math.min(o.ang+300*e,15)),this.left&&(o.ang=Math.max(o.ang-300*e,-15))),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.lastFrameTime=performance.now(),requestAnimationFrame(this.drawFunction),this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY};this.startInteraction=(e,t)=>{var o,n;this.mouseX=e/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=t/this.scaling-this.viewOffsetY/this.scaling,this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY,this.choosed=this.physics.getObjectAtCoordinates(this.mouseX,this.mouseY,4),!this.choosed&&typeof this.choosed=="boolean"&&(this.choosed={x:this.mouseX,y:this.mouseY,pinPoint:!0}),this.lastX=this.mouseX,this.lastY=this.mouseY,this.mouseDown=!0,(n=(o=$[this.mode]).startInteractionFunc)==null||n.call(o,this)};this.endInteraction=(e,t)=>{var o,n;this.mouseX=e/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=t/this.scaling-this.viewOffsetY/this.scaling,(n=(o=$[this.mode]).endInteractionFunc)==null||n.call(o,this),this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.discardInteraction=()=>{this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.keyGotDown=e=>{let t=e.key;t==="s"&&this.spawnNewtonsCradle(this.cnv.width/2,this.cnv.height/2,.5,this.physics),t==="a"&&(this.scaling+=.01),t==="d"&&(this.scaling-=.01),t==="j"&&(this.viewOffsetX-=10),t==="l"&&(this.viewOffsetX+=10),t==="k"&&(this.viewOffsetY-=10),t==="i"&&(this.viewOffsetY+=10),t==="ArrowRight"&&(this.right=!0),t==="ArrowLeft"&&(this.left=!0)};this.keyGotUp=e=>{let t=e.key;t==="ArrowRight"&&(this.right=!1),t==="ArrowLeft"&&(this.left=!1)};this.startTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();return e.touches.length>1?(this.discardInteraction(),e.touches.length===2&&(this.touchIDs.push(e.touches[0].identifier),this.touchIDs.push(e.touches[1].identifier),this.touchCoords.push(new i(e.touches[0].clientX-t.left,e.touches[0].clientY-t.top)),this.touchCoords.push(new i(e.touches[1].clientX-t.left,e.touches[1].clientY-t.top))),e.touches.length>2&&(this.touchIDs=[],this.touchCoords=[]),!1):(this.startInteraction(e.changedTouches[0].clientX-t.left,e.changedTouches[0].clientY-t.top),!1)};this.endTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();return e.touches.length<=1&&(this.touchIDs=[],this.touchCoords=[]),this.endInteraction(e.changedTouches[0].clientX-t.left,e.changedTouches[0].clientY-t.top),!1};this.moveTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();if(e.touches.length===2){let o=[];return e.touches.item(0).identifier===this.touchIDs[0]?(o.push(e.touches.item(0)),o.push(e.touches.item(1))):(o.push(e.touches.item(1)),o.push(e.touches.item(0))),o=o.map(n=>new i(n.clientX-t.left,n.clientY-t.top)),this.processMultiTouchGesture(this.touchCoords,o),this.touchCoords=o,!1}return e.touches.length>2||(this.mouseX=e.changedTouches[0].clientX-t.left,this.mouseY=e.changedTouches[0].clientY-t.top,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling),!1};this.processMultiTouchGesture=(e,t)=>{let o=i.add(e[1],e[0]);o.mult(.5);let n=i.add(t[1],t[0]);n.mult(.5);let a=i.dist(e[1],e[0]),r=i.dist(t[1],t[0]),c=Math.sqrt(r/a),h=i.add(o,n);h.mult(.5);let f=i.sub(n,o);f.mult(c),this.scaleAround(h,c),this.viewOffsetX+=f.x,this.viewOffsetY+=f.y};this.scaleAround=(e,t)=>{this.viewOffsetX=e.x-(e.x-this.viewOffsetX)*t,this.viewOffsetY=e.y-(e.y-this.viewOffsetY)*t,this.scaling*=t};this.startMouse=e=>(e.button===0&&this.startInteraction(e.offsetX,e.offsetY),e.button===2&&(this.rightButtonDown=new i(e.offsetX,e.offsetY),this.cnv.style.cursor="all-scroll"),!1);this.endMouse=e=>(e.button===0&&this.endInteraction(e.offsetX,e.offsetY),e.button===2&&(this.rightButtonDown=!1,this.cnv.style.cursor="default"),!1);this.handleMouseMovement=e=>{if(this.mouseX=e.offsetX,this.mouseY=e.offsetY,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling,this.rightButtonDown){let t=new i(e.offsetX,e.offsetY),o=i.sub(t,this.rightButtonDown);this.viewOffsetX+=o.x,this.viewOffsetY+=o.y,this.rightButtonDown=t}};this.handleMouseWheel=e=>{e.preventDefault();let t=new i(e.offsetX,e.offsetY),o=5e-4;e.deltaMode===WheelEvent.DOM_DELTA_LINE&&(o/=16);let n=1-e.deltaY*o;this.scaleAround(t,n)};this.convertToPhysicsSpace=e=>new i(e.x/this.scaling-this.viewOffsetX/this.scaling,e.y/this.scaling-this.viewOffsetY/this.scaling);this.convertToCanvasSpace=e=>new i(e.x*this.scaling+this.viewOffsetX,e.y*this.scaling+this.viewOffsetY);this.physicsDraw=()=>{let e=this.cnv.getContext("2d");if(e){e.fillStyle=S.Independence,e.fillRect(0,0,this.worldSize.width,this.worldSize.height);let t=n=>{if(n.m===0&&(e.strokeStyle="#00000000"),n.shape.r!==0){let a=n;e.beginPath(),e.arc(a.pos.x,a.pos.y,a.shape.r,0,2*Math.PI),e.stroke(),e.fill(),n.m!==0&&(e.beginPath(),e.moveTo(a.pos.x,a.pos.y),e.lineTo(a.pos.x+a.shape.r*Math.cos(a.rotation),a.pos.y+a.shape.r*Math.sin(a.rotation)),e.stroke())}else e.beginPath(),e.moveTo(n.shape.points[n.shape.points.length-1].x,n.shape.points[n.shape.points.length-1].y),n.shape.points.forEach(a=>{e.lineTo(a.x,a.y)}),e.stroke(),e.fill(),n.m!==0&&(e.beginPath(),e.arc(n.pos.x,n.pos.y,1.5,0,Math.PI*2),e.stroke()),this.showAxes&&(e.strokeStyle="black",n.axes.forEach(a=>{e.beginPath(),e.moveTo(n.pos.x,n.pos.y),e.lineTo(n.pos.x+a.x*30,n.pos.y+a.y*30),e.stroke()}))};if(this.physics.bodies.forEach(n=>{e.fillStyle=n.style,e.strokeStyle="black",t(n)}),this.physics.bodies.forEach(n=>{if(n.texture==="none")return;let a=n.textureTransform,r=a.offset.copy;r.rotate(n.rotation),r.add(n.pos);let c=new DOMMatrix([a.scale,0,0,a.scale,r.x,r.y]);c.rotateSelf(0,0,(a.rotation+n.rotation)*180/Math.PI);let h=e.createPattern(n.texture,n.textureRepeat);h.setTransform(c),e.fillStyle=h,e.strokeStyle="#00000000",t(n)}),e.save(),e.lineWidth=2,this.physics.springs.forEach(n=>{n instanceof I&&!(n instanceof E)?(e.strokeStyle=S.blue,e.fillStyle=S.blue,this.renderer.renderSpring(n,e)):(e.strokeStyle=S.blue,e.fillStyle=S.blue,this.renderer.renderStick(n,e))}),e.restore(),e.strokeStyle="rgba(255, 255, 255, 0.2)",this.showBoundingBoxes&&this.physics.bodies.forEach(n=>{e.strokeRect(n.boundingBox.x.min,n.boundingBox.y.min,n.boundingBox.x.max-n.boundingBox.x.min,n.boundingBox.y.max-n.boundingBox.y.min)}),this.showVelocities){let n=e.lineWidth;e.strokeStyle=S.pink,e.fillStyle=S.pink,e.lineWidth=3.5;let a=.05;this.physics.bodies.forEach(r=>{let c=r.pos.copy,h=i.add(c,i.mult(r.vel,a));e.beginPath(),e.moveTo(c.x,c.y),e.lineTo(h.x,h.y),e.stroke();let f=Math.min(r.vel.length/5,15),m=r.vel.copy;m.normalize(),m.setMag(f);let u=i.add(h,m);m.rotate90(),m.div(3),e.beginPath(),e.moveTo(u.x,u.y),e.lineTo(h.x+m.x,h.y+m.y),e.lineTo(h.x-m.x,h.y-m.y),e.closePath(),e.fill()}),e.lineWidth=n}e.fillStyle=S["Maximum Yellow Red"],e.strokeStyle=S["Maximum Yellow Red"];let o=e.lineWidth;e.lineWidth=4,this.drawCollisions&&this.collisionData.forEach(n=>{e.beginPath(),e.moveTo(n.cp.x,n.cp.y),e.lineTo(n.cp.x+n.n.x*30,n.cp.y+n.n.y*30),e.stroke(),e.beginPath(),e.arc(n.cp.x,n.cp.y,4,0,Math.PI*2),e.fill()}),e.lineWidth=o}};this.spawnNewtonsCradle=(e,t,o,n)=>{let a=[],r=25,c=250,h=8;a.push(new y(C.Circle(o*r,new i(e,t)),1,1,0));let f=1;for(let m=0;m<h-1;m+=1)a.push(new y(C.Circle(o*r,new i(e+f*o*r*1.01*2,t)),1,1,0)),f*=-1,f>0&&(f+=1),m===h-2&&(a[a.length-1].vel.x=-Math.sign(f)*o*r*8);a.forEach(m=>{n.addBody(m);let u=new E(c);u.attachObject(m),u.pinHere(m.pos.x,m.pos.y-c),n.addSpring(u),u.lockRotation()})};this.modeButtonClicked=e=>{let t=e.target.id.replace("-btn",""),o=Ue.indexOf(t);this.switchToMode(o)};this.switchToMode=e=>{var n,a,r,c;let t=document.getElementById(`${Ue[this.mode]}-btn`);t&&t.classList.remove("bg-pink-darker"),this.sidebar.innerHTML="",(a=(n=$[this.mode]).deactivated)==null||a.call(n,this),(c=(r=$[e]).activated)==null||c.call(r,this);let o=document.getElementById(`${Ue[e]}-btn`);o&&o.classList.add("bg-pink-darker"),this.modeTitleHolder.innerText=$[e].name,this.mode=e,this.sidebar.appendChild($[this.mode].element)};this.setupModes=()=>{let e=document.getElementById("button-holder");Ue.forEach((t,o)=>{var a,r;let n=document.createElement("div");n.classList.add("big-button"),n.id=`${t}-btn`,n.textContent=$[o].name,(r=(a=$[o]).init)==null||r.call(a,this),n.onclick=this.modeButtonClicked,e&&e.appendChild(n)}),this.switchToMode(this.mode)};this.setTimeMultiplier=e=>{Number.isFinite(e)&&e>=0&&(this.timeMultiplier=e,e===0?this.pauseBtn.classList.add("bg-pink-darker"):this.pauseBtn.classList.remove("bg-pink-darker"))};this.getTimeMultiplier=()=>this.timeMultiplier;this.setPhysics=e=>{e instanceof $e&&(this.physics=e)};this.getPhysics=()=>this.physics;this.physics=new $e,this.mouseX=0,this.mouseY=0,this.oldMouseX=0,this.oldMouseY=0,this.mouseDown=!1,this.defaultSize=30,this.k=.5,this.fc=2,this.springConstant=2e3,this.scaling=1,this.viewOffsetX=0,this.viewOffsetY=0,this.mode=0,this.lastX=0,this.lastY=0,this.touchIDs=[],this.touchCoords=[],this.rightButtonDown=!1,this.timeMultiplier=1,this.lastFrameTime=performance.now(),this.choosed=!1,this.drawCollisions=!1,this.showAxes=!1,this.worldSize={width:0,height:0},this.collisionData=[],this.showBoundingBoxes=!1,this.showVelocities=!1,this.renderer=new kn,this.left=!1,this.right=!1,this.cnv=document.getElementById("defaulCanvas0"),this.canvasHolder=document.getElementById("canvas-holder"),this.sidebar=document.getElementById("sidebar"),this.modeTitleHolder=document.getElementById("mode-title-text"),this.pauseBtn=document.getElementById("pause"),this.setWorldSize({width:2e3,height:1e3}),this.physics.setGravity(new i(0,1e3)),this.physics.setAirFriction(.9),this.cnv.addEventListener("touchstart",this.startTouch,!1),this.cnv.addEventListener("touchend",this.endTouch,!1),this.cnv.addEventListener("touchmove",this.moveTouch,!1),this.cnv.addEventListener("mousedown",this.startMouse,!1),this.cnv.addEventListener("mouseup",this.endMouse,!1),this.cnv.addEventListener("mousemove",this.handleMouseMovement,!1),this.cnv.addEventListener("wheel",this.handleMouseWheel),this.cnv.addEventListener("contextmenu",e=>e.preventDefault()),document.addEventListener("keydown",this.keyGotDown,!1),document.addEventListener("keyup",this.keyGotUp,!1),window.addEventListener("resize",this.resizeCanvas,!1),this.resizeCanvas(),this.setupModes(),Ke(this),requestAnimationFrame(this.drawFunction)}setWorldSize(e){this.physics.setBounds(0,0,e.width,e.height),this.worldSize=e}},Sn=Mn;window.onload=()=>{window.editorApp=new Sn,"serviceWorker"in navigator&&navigator.serviceWorker.register("serviceworker.js").then(()=>{},s=>{console.log("ServiceWorker registration failed: ",s)})};})();
