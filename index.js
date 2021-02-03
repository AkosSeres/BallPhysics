(()=>{var C=class{constructor(t,e){this.x=t,this.y=e}get copy(){return new C(this.x,this.y)}setCoordinates(t,e){this.x=t,this.y=e}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get sqlength(){return this.x*this.x+this.y*this.y}get heading(){if(this.x===0&&this.y===0)return 0;if(this.x===0)return this.y>0?Math.PI/2:1.5*Math.PI;if(this.y===0)return this.x>0?0:Math.PI;let t=C.normalized(this);return this.x>0&&this.y>0?Math.asin(t.y):this.x<0&&this.y>0?Math.asin(-t.x)+Math.PI/2:this.x<0&&this.y<0?Math.asin(-t.y)+Math.PI:this.x>0&&this.y<0?Math.asin(t.x)+1.5*Math.PI:0}add(t){this.x+=t.x,this.y+=t.y}sub(t){this.x-=t.x,this.y-=t.y}mult(t){this.x*=t,this.y*=t}div(t){this.x/=t,this.y/=t}lerp(t,e){this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e}dist(t){return new C(this.x-t.x,this.y-t.y).length}pNorm(t){let e=t;return e<1&&(e=1),(Math.abs(this.x**e)+Math.abs(this.y**e))**(1/e)}setMag(t){this.length!==0&&this.mult(t/this.length)}normalize(){this.length!==0&&this.div(this.length)}scaleAround(t,e){this.x=t.x+(this.x-t.x)*e,this.y=t.y+(this.y-t.y)*e}scaleAroundX(t,e){this.x=t.x+(this.x-t.x)*e}scaleAroundY(t,e){this.y=t.y+(this.y-t.y)*e}rotate(t){let e=Math.cos(t),n=Math.sin(t);this.setCoordinates(this.x*e-this.y*n,this.x*n+this.y*e)}static rotateArr(t,e){let n=Math.cos(e),i=Math.sin(e);t.forEach(a=>{a.setCoordinates(a.x*n-a.y*i,a.x*i+a.y*n)})}rotate90(){let{x:t}=this;this.x=-this.y,this.y=t}rotate270(){let{x:t}=this;this.x=this.y,this.y=-t}static add(t,e){return new C(t.x+e.x,t.y+e.y)}static sub(t,e){return new C(t.x-e.x,t.y-e.y)}static mult(t,e){return new C(t.x*e,t.y*e)}static div(t,e){return new C(t.x/e,t.y/e)}static fromAngle(t){return new C(Math.cos(t),Math.sin(t))}static fromAnglePNorm(t,e){let n=new C(Math.cos(t),Math.sin(t));return n.div(n.pNorm(e)),n}static lerp(t,e,n){return C.add(t,C.mult(C.sub(e,t),n))}static dist(t,e){return C.sub(t,e).length}static dot(t,e){return t.x*e.x+t.y*e.y}static cross(t,e){return t.x*e.y-t.y*e.x}static crossScalarFirst(t,e){return new C(-e.y*t,e.x*t)}static crossScalarSecond(t,e){return new C(t.y*e,-t.x*e)}static angle(t,e){return Math.acos(Math.min(Math.max(C.dot(t,e)/Math.sqrt(t.sqlength*e.sqlength),1),-1))}static angleACW(t,e){let n=t.heading,a=e.heading-n;return a<0?2*Math.PI+a:a}static normalized(t){let e=t.length;return e===0?t:new C(t.x/e,t.y/e)}toJSON(){return{x:this.x,y:this.y}}static fromObject(t){return new C(t.x,t.y)}},o=C;var pe=class{constructor(t,e){this.a=t,this.b=e}get length(){return o.dist(this.a,this.b)}distFromPoint(t){let e=o.sub(this.b,this.a),n=e.length;e.normalize();let i=o.sub(t,this.a),a=o.dot(e,i),r=o.cross(e,i);return a>=0&&a<=n?Math.abs(r):Math.sqrt(Math.min(i.sqlength,o.sub(t,this.b).sqlength))}get nearestPointO(){let t=o.sub(this.b,this.a);if(o.dot(this.a,t)>=0)return this.a.copy;if(o.dot(this.b,t)<=0)return this.b.copy;t.normalize();let e=-o.dot(this.a,t);return o.add(this.a,o.mult(t,e))}static intersect(t,e){let n=o.sub(t.b,t.a),i=n.y/n.x,a=t.b.y-t.b.x*i,r=o.sub(e.b,e.a),c=r.y/r.x,l=e.b.y-e.b.x*c;if(n.x===0&&r.x!==0){if(t.a.x>=e.a.x&&t.a.x<=e.b.x||t.a.x<=e.a.x&&t.a.x>=e.b.x){let p=c*t.a.x+l;if(p>t.a.y&&p<t.b.y||p<t.a.y&&p>t.b.y)return new o(t.a.x,p)}return!1}if(r.x===0&&n.x!==0){if(e.a.x>=t.a.x&&e.a.x<=t.b.x||e.a.x<=t.a.x&&e.a.x>=t.b.x){let p=i*e.a.x+a;if(p>e.a.y&&p<e.b.y||p<e.a.y&&p>e.b.y)return new o(e.a.x,p)}return!1}if(n.x===0&&r.x===0){if(t.a.x===e.a.x){let p;t.a.y<t.b.y?p=[t.a.y,t.b.y]:p=[t.b.y,t.a.y];let y;e.a.y<e.b.y?y=[e.a.y,e.b.y]:y=[e.b.y,e.a.y];let g=[p[0]>y[0]?p[0]:y[0],p[1]<y[1]?p[1]:y[1]];if(g[0]<=g[1])return new o(t.a.x,(g[0]+g[1])/2)}return!1}let f;t.a.x<t.b.x?f=[t.a.x,t.b.x]:f=[t.b.x,t.a.x];let m;e.a.x<e.b.x?m=[e.a.x,e.b.x]:m=[e.b.x,e.a.x];let d=[f[0]>m[0]?f[0]:m[0],f[1]<m[1]?f[1]:m[1]];if(i===c&&a===l&&d[0]<=d[1])return new o((d[0]+d[1])/2,(d[0]+d[1])/2*i+a);let b=(l-a)/(i-c);return b>=d[0]&&b<=d[1]?new o(b,b*i+a):!1}},L=pe;var be=class extends L{get length(){return Number.POSITIVE_INFINITY}distFromPoint(t){let e=o.sub(this.a,this.b);e.setMag(1),e.rotate(Math.PI/2);let n=o.sub(t,this.a);return Math.abs(o.dot(n,e))}static intersect(t,e){let n=o.sub(t.b,t.a),i=n.y/n.x,a=t.b.y-t.b.x*i,r=o.sub(e.b,e.a),c=r.y/r.x,l=e.b.y-e.b.x*c;if(i===c)return t.distFromPoint(e.a)===0?new o((t.a.x+t.b.x+e.a.x+e.b.x)/4,(t.a.y+t.b.y+e.a.y+e.b.y)/4):!1;let f=(l-a)/(i-c);return new o(f,i*f+a)}static intersectWithLineSegment(t,e){let n=o.sub(t.b,t.a),i=n.y/n.x,a=t.b.y-t.b.x*i,r=o.sub(e.b,e.a),c=r.y/r.x,l=e.b.y-e.b.x*c;if(n.x===0){if(r.x===0)return t.a.x===e.a.x?new o((e.a.x+e.b.x)/2,(e.a.y+e.b.y)/2):!1;let d=t.a.x,b=c*d+l;return Math.min(e.a.x,e.b.x)<d&&d<Math.max(e.a.x,e.b.x)&&Math.min(e.a.y,e.b.y)<b&&Math.max(e.a.y,e.b.y)>b?new o(d,b):!1}if(r.x===0){let d=e.a.x,b=i*d+a;return Math.min(e.a.x,e.b.x)<d&&d<Math.max(e.a.x,e.b.x)&&Math.min(e.a.y,e.b.y)<b&&Math.max(e.a.y,e.b.y)>b?new o(d,b):!1}if(i===c)return t.distFromPoint(e.a)===0?new o((e.a.x+e.b.x)/2,(e.a.y+e.b.y)/2):!1;let f=(l-a)/(i-c),m=i*f+a;return Math.min(e.a.x,e.b.x)<f&&f<Math.max(e.a.x,e.b.x)&&Math.min(e.a.y,e.b.y)<m&&Math.max(e.a.y,e.b.y)>m?new o(f,m):!1}},J=be;function ct(s,t){this.min=s,this.max=t}ct.prototype.size=function(){return this.max-this.min};function Tt(s){return new ct(Math.min(...s),Math.max(...s))}function Rt(s,t){return new ct(Math.max(s.min,t.min),Math.min(s.max,t.max))}var G=class{constructor(t){if(t.length<3)throw new Error("Not enough points in polygon (minimum required: 3)");this.points=t,this.makeAntiClockwise()}getSideVector(t){let e=t;return e<0&&(e+=Math.abs(Math.floor(e))*this.points.length),o.sub(this.points[(e+1)%this.points.length],this.points[e%this.points.length])}getSideSegment(t){let e=t;return e<0&&(e+=Math.abs(Math.floor(e))*this.points.length),new L(o.fromObject(this.points[(e+1)%this.points.length]),o.fromObject(this.points[e%this.points.length]))}getSideLine(t){let e=t;return e<0&&(e+=Math.abs(Math.floor(e))*this.points.length),new L(o.fromObject(this.points[(e+1)%this.points.length]),o.fromObject(this.points[e%this.points.length]))}get sides(){return this.points.length}makeAntiClockwise(){let t=0;for(let e=1;e<=this.sides;e+=1){let n=this.getSideVector(e),i=this.getSideVector(e-1);i.mult(-1),t+=o.angleACW(n,i)}this.sides===3?t>Math.PI*1.5&&this.reverseOrder():this.sides===4?o.angleACW(this.getSideVector(1),this.getSideVector(0))>=Math.PI&&this.reverseOrder():this.sides>4&&t-this.sides*Math.PI>0&&this.reverseOrder()}reverseOrder(){this.points=this.points.reverse()}isPointInside(t){let e=new o(t.x,t.y);if(o.dist(e,this.centerPoint)>this.boundRadius)return!1;let n=this.centerPoint.copy;n.add(o.mult(new o(1.1,.6),this.boundRadius));let i=new L(e,n),a=0;return[...Array(this.sides).keys()].map(r=>this.getSideSegment(r)).forEach(r=>{L.intersect(r,i)&&(a+=1)}),a%2==0?!1:a%2==1}get centerPoint(){let t=new o(0,0);return this.points.forEach(e=>{t.add(e)}),t.div(this.sides),t}get boundRadius(){let t=this.centerPoint;return Math.max(...this.points.map(e=>o.dist(e,t)))}get allSides(){return[...Array(this.sides).keys()].map(t=>this.getSideSegment(t))}static intersection(t,e){if(o.dist(t.centerPoint,e.centerPoint)>t.boundRadius+e.boundRadius)return;let n=[],i=t.allSides,a=e.allSides;if(i.forEach((d,b)=>{a.forEach((p,y)=>{let g=L.intersect(d,p);typeof g=="object"&&"x"in g&&(g.isIntersectionPoint=!0,n.push({intersectionPoint:g,sideNum1:b,sideNum2:y}))})}),n.length===0){if(t.isPointInside(e.points[0]))return new G(e.points.map(d=>o.fromObject(d)));if(e.isPointInside(t.points[0]))return new G(t.points.map(d=>o.fromObject(d)))}let r=new G(t.points);for(let d=r.points.length-1;d>=0;d-=1){let b=n.filter(p=>p.sideNum1===d);b.length>1&&b.sort((p,y)=>o.dist(r.points[d],p.intersectionPoint)-o.dist(r.points[d],y.intersectionPoint)),b.length>0&&r.points.splice(d+1,0,...b.map(p=>p.intersectionPoint))}let c=new G(e.points);for(let d=c.points.length-1;d>=0;d-=1){let b=n.filter(p=>p.sideNum2===d);b.length>1&&b.sort((p,y)=>o.dist(c.points[d],p.intersectionPoint)-o.dist(c.points[d],y.intersectionPoint)),b.length>0&&c.points.splice(d+1,0,...b.map(p=>p.intersectionPoint))}let l={polyNum:1,pointNum:0};for(let d=0;d<r.points.length;d+=1)if("isIntersectionPoint"in r.points[d]){l.pointNum=d;break}else if(c.isPointInside(r.points[d])){l.pointNum=d;break}let f=!1,m=[];for(;!f;){let d=l.polyNum===1?r:c,b=l.polyNum===1?c:r;if(m.push(o.fromObject(d.points[l.pointNum%d.points.length])),m.length>2&&m[0].x===m[m.length-1].x&&m[0].y===m[m.length-1].y){m.pop();break}if(m.length>r.points.length+c.points.length)break;"isIntersectionPoint"in d.points[l.pointNum%d.points.length]?"isIntersectionPoint"in d.points[(l.pointNum+1)%d.points.length]||b.isPointInside(d.points[(l.pointNum+1)%d.points.length])&&!("isIntersectionPoint"in d.points[(l.pointNum+1)%d.points.length])?l.pointNum+=1:(l.pointNum=b.points.indexOf(d.points[l.pointNum%d.points.length])+1,l.polyNum=l.polyNum===1?2:1):l.pointNum+=1}return new G(m)}static createCircle(t,e,n=25){let i=[...Array(n).keys()].map(a=>{let r=o.fromAngle(2*Math.PI*a/n);return r.setMag(t),r.add(e),r});return new G(i)}static fracture(t,e=500){return t.map((i,a)=>{let r=[];for(let l=0;l<t.length;l+=1)if(a!==l){let f=t[l],m=o.div(o.add(i,f),2),d=o.sub(i,f);d.rotate(Math.PI/2),r.push(new J(m,o.add(d,m)))}return r=r.filter((l,f)=>{let m=new L(l.a,i);for(let d=0;d<r.length;d+=1)if(f!==d&&J.intersectWithLineSegment(r[d],m))return!1;return!0}),r=r.sort((l,f)=>o.sub(l.a,l.b).heading-o.sub(f.a,f.b).heading),r.map((l,f)=>{let m=[];for(let b=0;b<r.length;b+=1)if(f!==b){let p=J.intersect(l,r[b]);p instanceof o&&m.push(p)}let d=o.sub(l.a,l.b);return m=m.filter(b=>{let p=o.sub(b,i);return d.setMag(1),o.dot(p,d)>0}),m.length===0&&m.push(o.add(o.mult(d,e*1.2),l.a)),m=m.sort((b,p)=>o.dist(b,i)-o.dist(p,i)),m[0]})}).filter(i=>i.length>=3).map(i=>new G(i))}},qt=G;var tt=class{constructor(){this.r=0,this.points=[new o(0,0)]}static Circle(t,e){let n=new tt;return n.r=Math.abs(t),n.points[0]=e.copy,n}static Polygon(t){let e=new tt;if(t.length<3)throw new Error("A polygon needs at least 3 points to be valid!");return e.points=new qt(t).points.map(n=>o.fromObject(n)),e}getGeometricalData(){let t={center:this.points[0].copy,area:0,secondArea:0};if(this.r!==0)t.area=this.r*this.r*Math.PI,t.secondArea=.5*Math.PI*this.r**4;else{let e=[];for(let r=2;r<this.points.length;r+=1)e.push([this.points[0],this.points[r-1],this.points[r]]);let n=0,i=0,a=new o(0,0);e.forEach(r=>{let c=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),l=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),m=(c+l+f)/2,d=Math.sqrt(m*(m-c)*(m-l)*(m-f));n+=d,a.x+=d*(r[0].x+r[1].x+r[2].x)/3,a.y+=d*(r[0].y+r[1].y+r[2].y)/3}),a.div(n),t.center=a,t.area=n,e.forEach(r=>{let c=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),l=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),m=(c+l+f)/2,d=Math.sqrt(m*(m-c)*(m-l)*(m-f)),p=new J(r[1],r[2]).distFromPoint(r[0]),y=o.sub(r[2],r[1]);y.rotate90(),y.add(r[1]),c=new J(r[1],y).distFromPoint(r[0]);let w=(l*l*l*p-l*l*p*c+l*p*c*c+l*p*p*p)/36;w+=new o((r[0].x+r[1].x+r[2].x)/3,(r[0].y+r[1].y+r[2].y)/3).dist(t.center)**2*d,i+=w}),t.secondArea=i}return t}getMinMaxX(){let t=Tt(this.points.map(e=>e.x));return t.min-=this.r,t.max+=this.r,t}getMinMaxY(){let t=Tt(this.points.map(e=>e.y));return t.min-=this.r,t.max+=this.r,t}getMinMaxInDirection(t){let e=Tt(this.points.map(n=>o.dot(n,t)));return e.min-=this.r,e.max+=this.r,e}move(t){this.points.forEach(e=>e.add(t))}rotateAround(t,e){this.points.forEach(n=>{n.sub(t)}),o.rotateArr(this.points,e),this.points.forEach(n=>{n.add(t)})}containsPoint(t){if(this.r!==0)return o.sub(t,this.points[0]).sqlength<=this.r*this.r;if(this.points.length===4){let n=new o(this.getMinMaxX().max+10,this.getMinMaxY().max+10),i=new L(t,n),a=0;return this.sides.forEach(r=>{L.intersect(r,i)&&(a+=1)}),a%2==1}return this.points.map((n,i)=>{let a=o.sub(this.points[(i+1)%this.points.length],n);return a.rotate90(),a}).every((n,i)=>o.dot(n,o.sub(t,this.points[i]))>=0)}get sides(){return this.points.map((t,e)=>new L(t,this.points[(e+1)%this.points.length]))}getClosestPoint(t){let e=this.points.map(r=>o.sub(r,t).sqlength),n=e[0],i=0,a=e.length;for(let r=1;r<a;r+=1)e[r]<n&&(n=e[r],i=r);return this.points[i].copy}static fromObject(t){let e=new tt;return e.r=t.r,e.points=t.points.map(n=>o.fromObject(n)),e}get copy(){let t=new tt;return t.r=this.r,t.points=this.points.map(e=>e.copy),t}},T=tt;var Vt={white:"#faf3dd",green:"#02c39a",pink:"#e58c8a",pinkDarker:"#da5a58",pinkHover:"#de6a68",blue:"#3db2f1",black:"#363732",Beige:"#f2f3d9",Independence:"#38405f",Turquoise:"#5dd9c1","Rich Black FOGRA 29":"#0e131f","Independence 2":"#59546c","Roman Silver":"#8b939c","Imperial Red":"#ff0035","Hot Pink":"#fc6dab","Maximum Yellow Red":"#f5b841","Lavender Web":"#dcd6f7"},S=Vt,ge=Vt.Turquoise,Q=Vt.Turquoise;var Ts=15,wt=class{constructor(t,e=1,n=.2,i=.5){this.shape=t,this.k=n,this.fc=i;let a=this.shape.getGeometricalData();this.m=a.area*e,this.pos=a.center,this.am=a.secondArea*e,this.rotation=0,this.ang=0,this.vel=new o(0,0),this.layer=void 0,this.defaultAxes=[],this.axes=[],this.calculateAxes(),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()},this.minMaxes=[],this.calculateMinMaxes(),this.style=Q,this.texture="none",this.textureTransform={offset:new o(0,0),scale:1,rotation:0},this.textureRepeat="repeat"}calculateAxes(){let t=Math.cos(Math.PI/Ts);this.defaultAxes=this.normals.map(e=>new o(e.x,Math.abs(e.y)));for(let e=this.defaultAxes.length-2;e>=0;e-=1)for(let n=this.defaultAxes.length-1;n>e;n-=1){let i=this.defaultAxes[n],a=this.defaultAxes[e];Math.abs(o.dot(i,a))>t&&(this.defaultAxes.splice(n,1),this.defaultAxes[e]=i)}this.axes=this.defaultAxes.map(e=>e.copy)}calculateMinMaxes(){this.minMaxes=this.axes.map(t=>this.shape.getMinMaxInDirection(t))}get normals(){if(this.shape.r!==0)return[new o(0,1)];let t=this.shape.points.map((e,n)=>o.sub(this.shape.points[(n+1)%this.shape.points.length],e));return t.forEach(e=>{e.rotate270(),e.normalize()}),t}move(t){this.shape.move(t),this.pos.add(t),this.boundingBox.x.max+=t.x,this.boundingBox.x.min+=t.x,this.boundingBox.y.max+=t.y,this.boundingBox.y.min+=t.y}rotate(t){this.rotation+=t,this.shape.r===0&&this.shape.rotateAround(this.pos,t),o.rotateArr(this.axes,t),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()}}velInPlace(t){let e=o.sub(t,this.pos);return e.rotate90(),e.mult(this.ang),e.add(this.vel),e}containsPoint(t){return this.shape.containsPoint(t)}get density(){return this.m/this.shape.getGeometricalData().area}set density(t){if(t<0||!Number.isFinite(t))return;let e=this.shape.getGeometricalData();this.m=e.area*t,this.am=e.secondArea*t}fixDown(){this.m=0}scaleAround(t,e){e!==0&&(this.pos.scaleAround(t,e),this.shape.points.forEach(n=>n.scaleAround(t,e)),this.shape.r=Math.abs(this.shape.r*e),this.m*=e**2,this.am*=e**4)}scaleAroundX(t,e){if(e===0)return;let{density:n}=this;this.shape.points.forEach(a=>a.scaleAroundX(t,e)),this.shape.r=Math.abs(this.shape.r*e);let i=this.shape.getGeometricalData();this.m=i.area*n,this.pos=i.center,this.am=i.secondArea*n,this.calculateAxes(),this.calculateMinMaxes()}scaleAroundY(t,e){if(e===0)return;let{density:n}=this;this.shape.points.forEach(a=>a.scaleAroundY(t,e)),this.shape.r=Math.abs(this.shape.r*e);let i=this.shape.getGeometricalData();this.m=i.area*n,this.pos=i.center,this.am=i.secondArea*n,this.calculateAxes(),this.calculateMinMaxes()}applyImpulse(t,e){if(this.m===0)return;let n=o.sub(t,this.pos);this.vel.add(o.div(e,this.m)),this.ang+=o.cross(n,e)/this.am}static detectCollision(t,e){let n=t,i=e;{let w=Rt(n.boundingBox.x,i.boundingBox.x);if(w.max<w.min)return!1;let x=Rt(n.boundingBox.y,i.boundingBox.y);if(x.max<x.min)return!1}let a=t.axes,r=e.axes;if(n.shape.r!==0){let w=i.shape.getClosestPoint(n.pos),x=o.sub(w,n.pos);x.normalize(),a=[x],n.minMaxes=[n.shape.getMinMaxInDirection(x)]}if(i.shape.r!==0){let w=n.shape.getClosestPoint(i.pos),x=o.sub(w,i.pos);x.normalize(),r=[x],i.minMaxes=[i.shape.getMinMaxInDirection(x)]}let c=[...a,...r],l=w=>n.shape.getMinMaxInDirection(w),f=w=>i.shape.getMinMaxInDirection(w),m=[];if(c.some((w,x)=>{let B;x<a.length?B=t.minMaxes[x]:B=l(w);let X;x>=a.length?X=e.minMaxes[x-a.length]:X=f(w);let I=Rt(B,X);return I.max<I.min?!0:(m.push(I),!1)}))return!1;let d=m.map(w=>w.size()),b=d[0],p=0;for(let w=1;w<d.length;w+=1)b>d[w]&&(b=d[w],p=w);let y=c[p].copy;o.dot(y,o.sub(n.pos,i.pos))>0&&y.mult(-1);let g;if(p<a.length){let w=i.shape.points.map(x=>o.dot(x,y));g=i.shape.points[w.indexOf(Math.min(...w))].copy,i.shape.r!==0&&g.sub(o.mult(y,i.shape.r))}else{let w=n.shape.points.map(x=>o.dot(x,y));g=n.shape.points[w.indexOf(Math.max(...w))].copy,n.shape.r!==0&&g.add(o.mult(y,n.shape.r))}return{normal:y,overlap:b,contactPoint:g}}static fromObject(t){let e=Object.create(wt.prototype);return e.am=t.am,e.ang=t.ang,e.axes=t.axes.map(n=>o.fromObject(n)),e.boundingBox={x:new ct(t.boundingBox.x.min,t.boundingBox.x.max),y:new ct(t.boundingBox.y.min,t.boundingBox.y.max)},e.defaultAxes=t.defaultAxes.map(n=>o.fromObject(n)),e.fc=t.fc,e.k=t.k,e.layer=t.layer,e.m=t.m,e.pos=o.fromObject(t.pos),e.rotation=t.rotation,e.shape=T.fromObject(t.shape),e.style=t.style,e.vel=o.fromObject(t.vel),e.minMaxes=[],e.calculateMinMaxes(),e}get copy(){return wt.fromObject(this)}},v=wt;var ye=class{constructor(t,e){this.length=t,this.springConstant=e,this.pinned=!1,this.objects=[],this.rotationLocked=!1,this.initialHeading=0,this.initialOrientations=[0,0],this.attachPoints=[],this.attachRotations=[],this.attachPositions=[]}pinHere(t,e){this.pinned={x:t,y:e}}unpin(){this.pinned=!1}attachObject(t,e=void 0){let n=this.objects;n.push(t),e?this.attachPoints.push(e.copy):this.attachPoints.push(t.pos.copy),this.attachPositions.push(t.pos.copy),this.attachRotations.push(t.rotation),n.length===2&&(this.pinned=!1),n.length>=3&&(n=[n[n.length-2],n[n.length-1]],this.attachPoints=[this.attachPoints[this.attachPoints.length-2],this.attachPoints[this.attachPoints.length-1]],this.attachPositions=[this.attachPositions[this.attachPositions.length-2],this.attachPositions[this.attachPositions.length-1]],this.attachRotations=[this.attachRotations[this.attachRotations.length-2],this.attachRotations[this.attachRotations.length-1]])}updateAttachPoint0(t,e=0){let n=this.rotationLocked;n&&this.unlockRotation(),this.attachPoints[0]=t.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=e&&(this.attachPoints[0]=this.attachPositions[0].copy),n&&this.lockRotation()}updateAttachPoint1(t,e=0){let n=this.rotationLocked;n&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=t.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=e&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=t.copy),n&&this.lockRotation()}get points(){let t=this.objects.map((e,n)=>{let i=o.sub(this.attachPoints[n],this.attachPositions[n]);return i.rotate(e.rotation-this.attachRotations[n]),o.add(i,e.pos)});return typeof this.pinned!="boolean"&&t.push(o.fromObject(this.pinned)),t}lockRotation(){this.rotationLocked=!0,this.initialOrientations=this.objects.map(e=>e.rotation);let t=this.points;this.initialHeading=o.sub(t[1],t[0]).heading}unlockRotation(){this.rotationLocked=!1}arrangeOrientations(){let t=this.points,n=o.sub(t[1],t[0]).heading-this.initialHeading;this.objects.forEach((i,a)=>{let r=this.initialOrientations[a]+n;i.rotate(r-i.rotation)})}getAsSegment(){let t=this.points;return new L(t[0],t[1])}update(t){this.rotationLocked&&this.arrangeOrientations();let e,n;if(this.pinned instanceof Object&&this.objects[0]){[n,e]=[this.pinned,this.objects[0]];let i=this.points,a=new o(i[1].x-i[0].x,i[1].y-i[0].y),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*t),e.applyImpulse(i[1],a);let c=e.vel;if(c.rotate(-a.heading),this.rotationLocked&&e.m!==0){let l=new o(n.x,n.y),m=o.sub(e.pos,l).length,d=m*m*e.m+e.am,b=(e.am*e.ang-m*e.m*c.y)/d;c.y=-b*m,e.ang=b}c.rotate(a.heading)}else if(this.objects[0]&&this.objects[1]){[e,n]=[this.objects[0],this.objects[1]];let i=this.points,a=o.sub(i[0],i[1]),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*t),n.applyImpulse(i[1],a),a.mult(-1),e.applyImpulse(i[0],a),a=o.sub(e.pos,n.pos);let c=e.vel,l=n.vel;if(c.rotate(-a.heading),l.rotate(-a.heading),this.rotationLocked&&e.m!==0&&n.m!==0){let f=new o(e.pos.x*e.m+n.pos.x*n.m,e.pos.y*e.m+n.pos.y*n.m);f.div(e.m+n.m);let m=o.sub(e.pos,f),d=o.sub(n.pos,f),b=m.length,p=d.length,y=b*b*e.m+e.am+p*p*n.m+n.am,g=(c.y-l.y)*p/(b+p)+l.y,w=(e.am*e.ang+n.am*n.ang+b*e.m*(c.y-g)-p*n.m*(l.y-g))/y;c.y=w*b+g,l.y=-w*p+g,e.ang=w,n.ang=w}c.rotate(a.heading),l.rotate(a.heading)}}},P=ye;var xe=class extends P{constructor(t){super(t,0);this.springConstant=0}updateAttachPoint0(t,e=0){let n=this.rotationLocked;n&&this.unlockRotation(),this.attachPoints[0]=t.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=e&&(this.attachPoints[0]=this.attachPositions[0].copy),this.length=this.getAsSegment().length,n&&this.lockRotation()}updateAttachPoint1(t,e=0){let n=this.rotationLocked;n&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=t.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=e&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=t.copy),this.length=this.getAsSegment().length,n&&this.lockRotation()}update(){this.rotationLocked&&this.arrangeOrientations();let t,e;if(this.pinned instanceof Object&&"x"in this.pinned&&this.objects[0]){if([e,t]=[this.pinned,this.objects[0]],t.m===0)return;let n=this.points,i=new o(n[1].x-n[0].x,n[1].y-n[0].y);i.setMag(i.length-this.length),t.move(i),i=new o(n[1].x-n[0].x,n[1].y-n[0].y),i.normalize();let a=n[0],r=i,c=t,l=o.sub(a,c.pos),f=o.mult(c.velInPlace(a),-1),m=1/c.m;m+=o.dot(o.crossScalarFirst(o.cross(l,r)/c.am,l),r),m=-o.dot(f,r)/m;let d=o.sub(c.vel,o.mult(r,m/c.m)),b=c.ang-m*o.cross(l,r)/c.am;t.vel=d,t.ang=b;let p=t.vel;if(p.rotate(-i.heading),this.rotationLocked&&t.m!==0){let y=new o(e.x,e.y),w=o.sub(t.pos,y).length,x=w*w*t.m+t.am,B=(t.am*t.ang+w*t.m*p.y)/x;p.y=B*w,t.ang=B}p.rotate(i.heading)}else if(this.objects[0]&&this.objects[1]){[t,e]=[this.objects[0],this.objects[1]];let n=this.points,i=o.sub(n[0],n[1]),a=this.length-i.length;i.setMag(1);let r=t,c=e,l=r.m===0?Infinity:r.m,f=c.m===0?Infinity:c.m,m,d;if(l!==Infinity&&f!==Infinity)m=o.mult(i,a*f/(l+f)),d=o.mult(i,-a*l/(l+f));else if(l===Infinity&&f!==Infinity)m=new o(0,0),d=o.mult(i,-a);else if(l!==Infinity&&f===Infinity)d=new o(0,0),m=o.mult(i,a);else return;t.move(m),e.move(d),n=this.points,i=o.sub(n[1],n[0]),i.normalize();let b=i,p=n[0],y=n[1],g=r.ang,w=c.ang,x=o.sub(p,r.pos),B=o.sub(y,c.pos),X=r.m===0?Infinity:r.am,I=c.m===0?Infinity:c.am,W=r.velInPlace(p),A=c.velInPlace(y),q=o.sub(A,W),D=1/l+1/f;D+=o.dot(o.crossScalarFirst(o.cross(x,b)/X,x),b),D+=o.dot(o.crossScalarFirst(o.cross(B,b)/I,B),b),D=-o.dot(q,b)/D;let at=o.sub(r.vel,o.mult(b,D/l)),yt=o.add(c.vel,o.mult(b,D/f)),xt=g-D*o.cross(x,b)/X,Y=w+D*o.cross(B,b)/I;t.m!==0&&(t.vel=at,t.ang=xt),e.m!==0&&(e.vel=yt,e.ang=Y);let z=t.vel,N=e.vel;if(z.rotate(-i.heading),N.rotate(-i.heading),this.rotationLocked&&t.m!==0&&e.m!==0){let Ht=new o(t.pos.x*t.m+e.pos.x*e.m,t.pos.y*t.m+e.pos.y*e.m);Ht.div(t.m+e.m);let vt=o.sub(t.pos,Ht).length,rt=o.sub(e.pos,Ht).length,Bs=vt*vt*t.m+t.am+rt*rt*e.m+e.am,Et=(z.y-N.y)*rt/(vt+rt)+N.y,Bt=(t.am*t.ang+e.am*e.ang+vt*t.m*(z.y-Et)-rt*e.m*(N.y-Et))/Bs;z.y=Bt*vt+Et,N.y=-Bt*rt+Et,t.ang=Bt,e.ang=Bt}z.rotate(i.heading),N.rotate(i.heading)}}},E=xe;function Rs(s,t,e,n){let i=n,a=e,r=s,c=t,l=r.vel,f=c.vel,m=r.ang,d=c.ang,b=o.sub(a,r.pos),p=o.sub(a,c.pos),y=r.am,g=c.am,w=r.m,x=c.m,B=(r.k+c.k)/2,X=(r.fc+c.fc)/2,I=r.velInPlace(a),W=c.velInPlace(a),A=o.sub(W,I),q=1/w+1/x;q+=o.dot(o.crossScalarFirst(o.cross(b,i)/y,b),i),q+=o.dot(o.crossScalarFirst(o.cross(p,i)/g,p),i),q=-((1+B)*o.dot(A,i))/q;let D=o.sub(l,o.mult(i,q/w)),at=o.add(f,o.mult(i,q/x)),yt=m-q*o.cross(b,i)/y,xt=d+q*o.cross(p,i)/g,Y=A.copy;if(Y.sub(o.mult(i,o.dot(A,i))),Y.setMag(1),o.dot(i,Y)**2>.5)return[{dVel:o.sub(D,r.vel),dAng:yt-r.ang},{dVel:o.sub(at,c.vel),dAng:xt-c.ang}];let z=1/w+1/x;z+=o.dot(o.crossScalarFirst(o.cross(b,Y)/y,b),Y),z+=o.dot(o.crossScalarFirst(o.cross(p,Y)/g,p),Y),z=-o.dot(A,Y)/z;let N=Math.sign(z)*q*X;return Math.abs(N)>Math.abs(z)&&(N=z),D=o.sub(D,o.mult(Y,N/w)),at=o.add(at,o.mult(Y,N/x)),yt-=N*o.cross(b,Y)/y,xt+=N*o.cross(p,Y)/g,[{dVel:o.sub(D,r.vel),dAng:yt-r.ang},{dVel:o.sub(at,c.vel),dAng:xt-c.ang}]}function ve(s,t,e){let n=t,i=e,a=s,r=o.sub(n,a.pos),{am:c,m:l}=a,f=o.mult(a.velInPlace(n),-1),m=1/l;m+=o.dot(o.crossScalarFirst(o.cross(r,i)/c,r),i),m=-((1+a.k)*o.dot(f,i))/m;let d=o.sub(a.vel,o.mult(i,m/l)),b=a.ang-m*o.cross(r,i)/c,p=f.copy;if(p.sub(o.mult(i,o.dot(f,i))),p.setMag(1),o.dot(i,p)**2>.5)return{dVel:o.sub(d,a.vel),dAng:b-a.ang};let y=1/l;y+=o.dot(o.crossScalarFirst(o.cross(r,p)/c,r),p),y=-o.dot(f,p)/y;let g=Math.sign(y)*m*a.fc;return Math.abs(g)>Math.abs(y)&&(g=y),d=o.sub(d,o.mult(p,g/l)),b-=g*o.cross(r,p)/c,{dVel:o.sub(d,a.vel),dAng:b-a.ang}}function we(s){let t=[],e=s.length,n=Array(e).fill(0),i=Array(e).fill(0),a=Array(e).fill(0),r=Array(e).fill(0),c=Array(e).fill(0),l=Array(e).fill(0);s.forEach(f=>f.calculateMinMaxes());for(let f=0;f<e-1;f+=1)for(let m=f+1;m<e;m+=1){let d=s[f],b=s[m];if(d.m===0&&b.m===0)continue;let p=v.detectCollision(d,b);if(p&&typeof p!="boolean"){let y=o.dot(d.velInPlace(p.contactPoint),p.normal),g=o.dot(b.velInPlace(p.contactPoint),p.normal);t.push({n:p.normal,cp:p.contactPoint});let w=-p.overlap,x=p.overlap;if(d.m===0){w=0;let I=ve(b,p.contactPoint,o.mult(p.normal,-1));r[m]+=I.dVel.x,c[m]+=I.dVel.y,l[m]+=I.dAng,a[m]+=1}else if(b.m===0){x=0;let I=ve(d,p.contactPoint,o.mult(p.normal,1));r[f]+=I.dVel.x,c[f]+=I.dVel.y,l[f]+=I.dAng,a[f]+=1}else{w*=b.m/(d.m+b.m),x*=d.m/(d.m+b.m);let[I,W]=Rs(d,b,p.contactPoint,o.mult(p.normal,1));y>=g&&(r[f]+=I.dVel.x,c[f]+=I.dVel.y,l[f]+=I.dAng,r[m]+=W.dVel.x,c[m]+=W.dVel.y,l[m]+=W.dAng)}let B=o.mult(p.normal,w),X=o.mult(p.normal,x);n[f]+=B.x,n[m]+=X.x,i[f]+=B.y,i[m]+=X.y}}for(let f=0;f<e;f+=1){let m=s[f];if(m.m===0)continue;let d=Math.max(a[f],1);m.move(new o(n[f],i[f])),m.vel.add(new o(r[f]/d,c[f]/d)),m.ang+=l[f]/d}return t}var kt=class{constructor(){this.bodies=[],this.springs=[],this.airFriction=1,this.gravity=new o(0,0)}update(t){let e=[];for(let n=0;n<this.bodies.length;n+=1)this.bodies[n].move(new o(this.bodies[n].vel.x*t,this.bodies[n].vel.y*t)),this.bodies[n].rotate(this.bodies[n].ang*t);for(let n=0;n<3;n+=1)this.springs.forEach(i=>{i.update(t/3/2)});for(let n=0;n<this.bodies.length;n+=1)this.bodies[n].m!==0&&this.bodies[n].vel.add(new o(this.gravity.x*t,this.gravity.y*t));e=we(this.bodies);for(let n=0;n<3;n+=1)this.springs.forEach(i=>{i.update(t/3/2)});return this.bodies.forEach(n=>{let i=n;n.m!==0&&(i.vel.mult(this.airFriction**t),i.ang*=this.airFriction**t)}),e}get copy(){let t=this.toJSON();return kt.fromObject(t)}setAirFriction(t){!Number.isFinite(t)||(this.airFriction=t,this.airFriction<0&&(this.airFriction=0),this.airFriction>1&&(this.airFriction=1))}setGravity(t){this.gravity=t.copy}addBody(t){this.bodies.push(t)}addSoftSquare(t,e,n,i,a=24,r=1){let c={sides:[],points:[]},l=Math.sqrt(e*e/Math.PI);c.points=[...new Array(a).keys()].map(d=>2*d*Math.PI/a).map(d=>o.add(o.mult(o.fromAngle(d),l),t)).map(d=>new v(T.Circle(Math.PI*l/a,d),1,.2,n)),c.sides=c.points.map((d,b)=>{let p=new E(1);return p.attachObject(d),p.attachObject(c.points[(b+1)%c.points.length]),b%2==0&&p.lockRotation(),p}),c.sides.forEach(d=>{let b=d;b.length=.96*4*e/a}),c.points.forEach(d=>{let b=d;b.vel=i.copy}),this.bodies.push(...c.points),this.springs.push(...c.sides);let f=e*e*200*r,m=new P(Math.sqrt(l*l*Math.PI),f/2);m.attachObject(c.points[0]),m.attachObject(c.points[a/2]),this.springs.push(m),m=new P(Math.sqrt(l*l*Math.PI),f/2),m.attachObject(c.points[a/4]),m.attachObject(c.points[3*a/4]),this.springs.push(m),m=new P(Math.sqrt(2*l*l*Math.PI),f),m.attachObject(c.points[a/8]),m.attachObject(c.points[5*a/8]),this.springs.push(m),m=new P(Math.sqrt(2*l*l*Math.PI),f),m.attachObject(c.points[3*a/8]),m.attachObject(c.points[7*a/8]),this.springs.push(m)}addRectWall(t,e,n,i){let a=[];a.push(new o(t-n/2,e-i/2)),a.push(new o(t+n/2,e-i/2)),a.push(new o(t+n/2,e+i/2)),a.push(new o(t-n/2,e+i/2)),this.bodies.push(new v(T.Polygon(a),0))}addRectBody(t,e,n,i,a,r,c=Q){let l=[];l.push(new o(t-n/2,e-i/2)),l.push(new o(t+n/2,e-i/2)),l.push(new o(t+n/2,e+i/2)),l.push(new o(t-n/2,e+i/2));let f=new v(T.Polygon(l),1,r,a);f.style=c,this.bodies.push(f)}addFixedBall(t,e,n){this.bodies.push(new v(T.Circle(n,new o(t,e)),0)),this.bodies[this.bodies.length-1].style=S.Beige}addSpring(t){this.springs.push(t)}getSpringsWithBody(t){return this.springs.filter(e=>e.objects.includes(t))}setBounds(t,e,n,i){let a=(r,c,l,f)=>{let m=[];return m.push(new o(r-l/2,c-f/2)),m.push(new o(r+l/2,c-f/2)),m.push(new o(r+l/2,c+f/2)),m.push(new o(r-l/2,c+f/2)),new v(T.Polygon(m),0)};this.bodies[0]=a(t-n,e,2*n,4*i),this.bodies[1]=a(t+2*n,e,2*n,4*i),this.bodies[2]=a(t,e-i,4*n,i*2),this.bodies[3]=a(t+n/2,e+2*i,5*n,2*i);for(let r=0;r<4;r+=1)this.bodies[r].style=S.Beige}getObjectAtCoordinates(t,e,n=0){let i=!1,a=new o(t,e);return this.bodies.some((r,c)=>r.containsPoint(a)&&c>=n?(i=r,!0):!1),i}removeObjFromSystem(t){let e=-1;if(t instanceof v&&(e=this.bodies.indexOf(t)),e!==-1){let n=this.getSpringsWithBody(this.bodies[e]);this.bodies.splice(e,1),n.forEach(i=>{this.removeObjFromSystem(i)});return}(t instanceof E||t instanceof P)&&(e=this.springs.indexOf(t)),e!==-1&&this.springs.splice(e,1)}getObjectIdentifier(t){return t instanceof v?{type:"body",index:this.bodies.indexOf(t)}:{type:"nothing",index:-1}}toJSON(){let t={};return t.airFriction=this.airFriction,t.gravity=this.gravity.toJSON(),t.bodies=this.bodies.map(e=>e.copy),t.springs=this.springs.map(e=>{let n={};return n.length=e.length,n.pinned=e.pinned,n.rotationLocked=e.rotationLocked,n.springConstant=e.springConstant,e instanceof P?n.type="spring":e instanceof E&&(n.type="stick"),n.objects=e.objects.map(i=>this.getObjectIdentifier(i)),n}),t}stickOrSpringFromObject(t){let e={};return t.type==="spring"?e=new P(t.length,t.springConstant):t.type==="stick"&&(e=new E(t.length)),e.pinned=t.pinned,e.rotationLocked=t.rotationLocked,e.objects=t.objects.map(n=>this.bodies[n.index]),e}static fromObject(t){let e=new kt;return e.bodies=t.bodies.map(n=>v.fromObject(n)),e.airFriction=t.airFriction,e.gravity=o.fromObject(t.gravity),e.springs=t.springs.map(n=>e.stickOrSpringFromObject(n)),e}};var lt=kt;var ht,ke,Mt;function St(s){ke=s,s?Mt.classList.add("bg-pink-darker"):Mt.classList.remove("bg-pink-darker")}function Wt(s){ht=s.getPhysics().toJSON(),Mt=document.getElementById("set start"),St(!1);let t=document.getElementById("pause");t&&(t.onclick=()=>{s.getTimeMultiplier()!==0?s.setTimeMultiplier(0):(s.setTimeMultiplier(1),ke===!0&&(ht=s.getPhysics().toJSON()),St(!1))});let e=document.getElementById("revert");e&&(e.onclick=()=>{s.setTimeMultiplier(0),console.log(lt.fromObject(ht)),s.setPhysics(lt.fromObject(ht)),St(!0)});let n=document.getElementById("clear all");n&&(n.onclick=()=>{St(!0);let a=s.getPhysics();a.springs=[],a.bodies=[]}),Mt&&(Mt.onclick=()=>{ht=s.getPhysics().toJSON(),console.log(ht),St(!0),s.setTimeMultiplier(0)});let i=!1;document.addEventListener("visibilitychange",()=>{document.hidden?s.getTimeMultiplier()!==0?(s.setTimeMultiplier(0),i=!0):i=!1:i&&s.setTimeMultiplier(1)})}function u(s,t,...e){let n=document.createElement(s);return t&&Object.entries(t).forEach(([i,a])=>{n[i]=a}),e&&e.forEach(i=>{typeof i=="string"?n.appendChild(document.createTextNode(i)):i instanceof HTMLElement&&n.appendChild(i)}),n}var Me=document.createElement("template");Me.innerHTML=`
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
      width: 90%;
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
`;var Se=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Me.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",null,u("p",{className:"slider-label"},u("slot",null)),u("input",{id:"slider",type:"range",className:"slider"})))}get slider(){return this.shadowRoot.querySelector("#slider")}set min(t){this.slider.min=t}set max(t){this.slider.max=t}set step(t){this.slider.step=t}set value(t){this.slider.value=t}set onChange(t){this.slider.onchange=e=>t(e.target.valueAsNumber),this.slider.oninput=e=>t(e.target.valueAsNumber)}};window.customElements.define("range-slider",Se);var Pe=document.createElement("template");Pe.innerHTML=`
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
`;var Ie=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Pe.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",null,u("label",{htmlFor:"colorWell",className:"picker-label"},u("div",null,u("slot",null)),u("input",{type:"color",id:"colorWell"}))))}get picker(){return this.shadowRoot.querySelector("#colorWell")}set value(t){this.picker.value=t,this.picker.style["background-color"]=t}set onChange(t){let e=n=>{t(n.target.value),this.picker.style["background-color"]=n.target.value};this.picker.onchange=e,this.picker.oninput=e}};window.customElements.define("color-picker",Ie);var Lt=35,Gt=.5,Ut=1.5,Jt=ge,Ce=document.createElement("div"),Ls={name:"Ball creator",description:"",element:Ce,drawFunc(s,t){let e=s.cnv.getContext("2d");e.strokeStyle="black",e.beginPath(),e.arc(s.mouseX,s.mouseY,Lt,0,2*Math.PI),e.stroke(),s.lastX!==0&&s.lastY!==0&&(e.beginPath(),e.moveTo(s.mouseX,s.mouseY),e.lineTo(s.lastX,s.lastY),e.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let t=new v(T.Circle(Lt,new o(s.lastX,s.lastY)),1,Gt,Ut);t.vel=new o(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=Jt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Ce.append(u("range-slider",{min:5,max:120,step:1,value:Lt,onChange:s=>{Lt=s}},"Size"),u("range-slider",{min:0,max:1,step:.02,value:Gt,onChange:s=>{Gt=s}},"Bounciness"),u("range-slider",{min:0,max:2,step:.1,value:Ut,onChange:s=>{Ut=s}},"Coefficient of friction"),u("color-picker",{value:Jt,onChange:s=>{Jt=s}},"Color:"));var Ee=Ls;var Be=document.createElement("template");Be.innerHTML=`
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
`;var Te=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Be.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",{className:"number-label"},u("span",null,u("slot",null)),u("span",{id:"numberPlace"})))}set value(t){this.shadowRoot.querySelector("#numberPlace").innerText=t}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}};window.customElements.define("number-display",Te);var Re=document.createElement("template");Re.innerHTML=`
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
`;var Le=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Re.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",{className:"cursor-pointer"},u("label",{htmlFor:"cbIdentifier",className:"checkbox-label"},u("input",{type:"checkbox",className:"ch-box",id:"cbIdentifier"}),u("div",{className:"checkbox-display"}),u("div",{className:"label-text"},u("slot",null))))),this.shadowRoot.querySelector(".checkbox-display").innerHTML='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.877px" height="101.052px" viewBox="0 0 122.877 101.052" id="checkmark-svg" enable-background="new 0 0 122.877 101.052" xml:space="preserve"><g><path d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"/></g></svg>',this.shadowRoot.querySelector("#checkmark-svg").classList.add("checkmark")}get checkbox(){return this.shadowRoot.querySelector("#cbIdentifier")}set checked(t){this.checkbox.checked=t}set onChange(t){this.checkbox.onchange=e=>t(e.target.checked)}};window.customElements.define("check-box",Le);var _={spring:!0,body:!0},Os=7,Oe=document.createElement("div");function Xe(s){if(!_.spring)return!1;let t=new o(s.mouseX,s.mouseY),e=s.physics.springs.find(n=>n.getAsSegment().distFromPoint(t)<=Os);return typeof e=="undefined"?!1:e}var Xs={name:"Delete",description:"",element:Oe,drawFunc(s,t){let e=_.body&&s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY,4);if(typeof e!="boolean"){let i=s.cnv.getContext("2d");i.save(),i.fillStyle="#00000000",i.strokeStyle=S["Imperial Red"],i.lineWidth=3,s.renderer.renderBody(e,i),i.restore();return}let n=Xe(s);if(n){let i=s.cnv.getContext("2d");i.save(),i.fillStyle="#00000000",i.strokeStyle=S["Imperial Red"],i.lineWidth=3,n instanceof E?s.renderer.renderStick(n,i):s.renderer.renderSpring(n,i),i.restore()}},startInteractionFunc(s){let t=Xe(s);s.choosed&&s.choosed instanceof v&&_.body?s.physics.removeObjFromSystem(s.choosed):_.spring&&t&&s.physics.removeObjFromSystem(t)}};Oe.append(u("number-display",null,"Deletable types:"),u("check-box",{checked:_.body,onChange:s=>{_.body=s}},"Body"),u("check-box",{checked:_.spring,onChange:s=>{_.spring=s}},"Stick/Spring"));var Fe=Xs;var Ye=0,De=0,Fs=document.createElement("div"),Ys={name:"Move",description:"",element:Fs,drawFunc(s,t){let{choosed:e}=s;e instanceof v&&e.m!==0&&(e.move(new o(s.mouseX-e.pos.x,s.mouseY-e.pos.y)),t===0?(e.vel.x=0,e.vel.y=0):(e.vel.x=(s.mouseX-Ye)/t,e.vel.y=(s.mouseY-De)/t),e.ang=0),Ye=s.mouseX,De=s.mouseY},startInteractionFunc(s){let{choosed:t}=s;if(t instanceof v&&t.m!==0){let e=s;e.cnv.style.cursor="grabbing"}},endInteractionFunc(s){let{choosed:t}=s;if(t instanceof v&&t.m!==0){let e=s;e.cnv.style.cursor="grab"}},activated(s){let t=s;t.cnv.style.cursor="grab"},deactivated(s){let t=s;t.cnv.style.cursor="default"}},ze=Ys;var Ds=document.createElement("div"),zs={name:"Rectangle wall",description:"",element:Ds,drawFunc(s,t){if(s.lastX!==0&&s.lastY!==0){let e=s.cnv.getContext("2d");e.strokeStyle="black",e.strokeRect(s.mouseX,s.mouseY,s.lastX-s.mouseX,s.lastY-s.mouseY)}},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){if(Math.abs(s.lastX-s.mouseX)<5&&Math.abs(s.lastY-s.mouseY)<5)return;s.physics.addRectWall(s.lastX/2+s.mouseX/2,s.lastY/2+s.mouseY/2,2*Math.abs(s.lastX/2-s.mouseX/2),2*Math.abs(s.lastY/2-s.mouseY/2));let t=s;t.physics.bodies[t.physics.bodies.length-1].style=S.Beige}}},Ne=zs;var Qt=.2,_t=.5,$t=Q,je=document.createElement("div"),Ns={name:"Rectangle body",description:"",element:je,drawFunc(s,t){let e=s.cnv.getContext("2d");s.lastX!==0&&s.lastY!==0&&(e.strokeStyle="black",e.strokeRect(s.mouseX,s.mouseY,s.lastX-s.mouseX,s.lastY-s.mouseY))},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let t=Math.abs(s.mouseX-s.lastX),e=Math.abs(s.mouseY-s.lastY);if(t/e>50||e/t>50||e===0||t===0)return;s.physics.addRectBody(s.lastX/2+s.mouseX/2,s.lastY/2+s.mouseY/2,2*Math.abs(s.lastX/2-s.mouseX/2),2*Math.abs(s.lastY/2-s.mouseY/2),_t,Qt,$t)}},keyGotUpFunc(s){},keyGotDownFunc(s){}};je.append(u("range-slider",{min:0,max:.6,step:.02,value:Qt,onChange:s=>{Qt=s}},"Bounciness"),u("range-slider",{min:0,max:2,step:.1,value:_t,onChange:s=>{_t=s}},"Coefficient of friction"),u("color-picker",{value:$t,onChange:s=>{$t=s}},"Color:"));var He=Ns;var Ot=35,Kt=.5,Zt=.5,Xt=4,Ft=24,At=Q,qe=document.createElement("div");function Ve(s=24,t=4){return[...new Array(s).keys()].map(e=>o.fromAnglePNorm(Math.PI*2*e/s,t))}var js={name:"Squircle creator",description:"",element:qe,drawFunc(s,t){let e=s.cnv.getContext("2d");e.strokeStyle="black";let n=Ve(Ft,Xt);n.forEach(i=>i.mult(Ot)),e.beginPath(),e.moveTo(s.mouseX+n[0].x,s.mouseY+n[0].y);for(let i=1;i<n.length;i+=1)e.lineTo(s.mouseX+n[i].x,s.mouseY+n[i].y);e.closePath(),e.stroke(),s.mouseDown&&(e.beginPath(),e.moveTo(s.mouseX,s.mouseY),e.lineTo(s.lastX,s.lastY),e.stroke())},startInteractionFunc(s){},endInteractionFunc(s){let t=Ve(Ft,Xt),e=new o(s.lastX,s.lastY);if(t.forEach(n=>{n.mult(Ot),n.add(e)}),s.lastX!==0&&s.lastY!==0){let n=new v(T.Polygon(t),1,Kt,Zt);n.vel=new o(s.lastX-s.mouseX,s.lastY-s.mouseY),n.style=At,s.physics.addBody(n)}}};qe.append(u("range-slider",{min:5,max:120,step:1,value:Ot,onChange:s=>{Ot=s}},"Size"),u("range-slider",{min:2,max:7,step:1,value:9-Xt,onChange:s=>{Xt=9-s}},"Roundness"),u("range-slider",{min:12,max:36,step:1,value:Ft,onChange:s=>{Ft=s}},"Resolution"),u("range-slider",{min:0,max:.9,step:.02,value:Kt,onChange:s=>{Kt=s}},"Bounciness"),u("range-slider",{min:0,max:2,step:.1,value:Zt,onChange:s=>{Zt=s}},"Coefficient of friction"),u("color-picker",{value:At,onChange:s=>{At=s}},"Color:"));var We=js;var j=35;var te=1.5,ee=24,se=1,Ge=document.createElement("div"),Hs={name:"Soft square creator",description:"",element:Ge,drawFunc(s,t){let e=s.cnv.getContext("2d");e.strokeStyle="black",e.beginPath(),e.moveTo(s.mouseX-j,s.mouseY-j),e.lineTo(s.mouseX+j,s.mouseY-j),e.lineTo(s.mouseX+j,s.mouseY+j),e.lineTo(s.mouseX-j,s.mouseY+j),e.lineTo(s.mouseX-j,s.mouseY-j),e.stroke(),s.lastX!==0&&s.lastY!==0&&(e.beginPath(),e.moveTo(s.mouseX,s.mouseY),e.lineTo(s.lastX,s.lastY),e.stroke())},startInteractionFunc(s){},endInteractionFunc(s){s.lastX!==0&&s.lastY!==0&&s.physics.addSoftSquare(new o(s.lastX,s.lastY),j*2,te,new o(s.lastX-s.mouseX,s.lastY-s.mouseY),ee,se)}};Ge.append(u("range-slider",{min:5,max:100,step:1,value:j,onChange:s=>{j=s}},"Size"),u("range-slider",{min:.4,max:3,step:.1,value:se,onChange:s=>{se=s}},"Pressure"),u("range-slider",{min:0,max:2,step:.1,value:te,onChange:s=>{te=s}},"Coefficient of friction"),u("range-slider",{min:16,max:48,step:8,value:ee,onChange:s=>{ee=s}},"Resolution"));var Ue=Hs;var ne=!1,Pt=!0,oe=new o(0,0),ie=0,et=1e4,st=new P(1,et);st.attachObject(new v(T.Circle(1,new o(0,0))));var Je=document.createElement("div");function Qe(s){let{choosed:t}=s,e=new o(s.lastX,s.lastY);if(s.lastX!==0&&s.lastY!==0&&t instanceof v){let n=o.sub(e,oe);return n.rotate(t.rotation-ie),Pt&&(n.x=0,n.y=0),n.add(t.pos),n}return e}function qs(s,t){return st.length=s.dist(t),st.springConstant=et,st.objects[0].pos=s,st.objects[0].shape.points[0]=s,st.pinHere(t.x,t.y),st}var Vs={name:"Spring creator",description:"",element:Je,drawFunc(s,t){let e=s.cnv.getContext("2d");if(e.save(),s.lastX!==0&&s.lastY!==0){e.fillStyle="#00000000",e.strokeStyle="#FFFFFF";let i=Qe(s),a=new o(s.mouseX,s.mouseY),r=qs(i,a);s.renderer.renderSpring(r,e)}let n=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY);n instanceof v&&(e.globalAlpha=.6,e.fillStyle="#00000000",e.strokeStyle="#FFFFFF",e.lineWidth=3,s.renderer.renderBody(n,e)),e.restore()},startInteractionFunc(s){s.choosed instanceof v?(oe=s.choosed.pos.copy,ie=s.choosed.rotation):typeof s.choosed!="boolean"&&(oe=new o(s.choosed.x,s.choosed.y),ie=0)},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let t=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY),e,n=Qe(s),i=new o(s.mouseX,s.mouseY);s.choosed instanceof v&&Pt&&(n=s.choosed.pos.copy),t instanceof v&&Pt&&(i=t.pos.copy);let a=P;if(typeof t=="boolean"&&(t={x:s.mouseX,y:s.mouseY,pinPoint:!0}),s.choosed===t||s.choosed===void 0&&t===void 0||s.choosed instanceof Object&&t instanceof Object&&"pinPoint"in s.choosed&&"pinPoint"in t||(s.choosed instanceof Object&&t instanceof Object&&"pinPoint"in s.choosed&&"pos"in t?(e=new a(Math.sqrt((s.choosed.x-t.pos.x)**2+(s.choosed.y-t.pos.y)**2),et),e.attachObject(t,i),e.pinHere(s.choosed.x,s.choosed.y)):t instanceof Object&&s.choosed instanceof Object&&"pos"in s.choosed&&"pinPoint"in t?(e=new a(Math.sqrt((s.choosed.pos.x-t.x)**2+(s.choosed.pos.y-t.y)**2),et),e.attachObject(s.choosed,n),e.pinHere(t.x,t.y)):s.choosed instanceof Object&&t instanceof Object&&"pos"in s.choosed&&"pos"in t&&(e=new a(Math.sqrt((s.choosed.pos.x-t.pos.x)**2+(s.choosed.pos.y-t.pos.y)**2),et),e.attachObject(s.choosed,n),e.attachObject(t,i)),typeof e=="undefined"))return;s.physics.addSpring(e),ne&&e.lockRotation()}}};Je.append(u("check-box",{checked:ne,onChange:s=>{ne=s}},"Lock rotation"),u("check-box",{checked:Pt,onChange:s=>{Pt=s}},"Snap to center"),u("range-slider",{min:2e3,max:1e5,value:et,step:200,onChange:s=>{et=s}},"Spring stiffness"));var _e=Vs;var ae=!1,It=!0,re=new o(0,0),ce=0,dt=new E(1);dt.attachObject(new v(T.Circle(1,new o(0,0))));var le=document.createElement("div");function $e(s){let{choosed:t}=s,e=new o(s.lastX,s.lastY);if(s.lastX!==0&&s.lastY!==0&&t instanceof v){let n=o.sub(e,re);return n.rotate(t.rotation-ce),It&&(n.x=0,n.y=0),n.add(t.pos),n}return e}function Ws(s,t){return dt.length=s.dist(t),dt.objects[0].pos=s,dt.objects[0].shape.points[0]=s,dt.pinHere(t.x,t.y),dt}var Gs={name:"Stick creator",description:"",element:le,drawFunc(s,t){let e=s.cnv.getContext("2d");if(e.save(),s.lastX!==0&&s.lastY!==0){e.fillStyle="#00000000",e.strokeStyle="#FFFFFF";let i=$e(s),a=new o(s.mouseX,s.mouseY),r=Ws(i,a);s.renderer.renderStick(r,e)}let n=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY);n instanceof v&&(e.globalAlpha=.6,e.fillStyle="#00000000",e.strokeStyle="#FFFFFF",e.lineWidth=3,s.renderer.renderBody(n,e)),e.restore()},startInteractionFunc(s){s.choosed instanceof v?(re=s.choosed.pos.copy,ce=s.choosed.rotation):typeof s.choosed!="boolean"&&(re=new o(s.choosed.x,s.choosed.y),ce=0)},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let t=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY),e,n=$e(s),i=new o(s.mouseX,s.mouseY);s.choosed instanceof v&&It&&(n=s.choosed.pos.copy),t instanceof v&&It&&(i=t.pos.copy);let a=E;if(typeof t=="boolean"&&(t={x:s.mouseX,y:s.mouseY,pinPoint:!0}),typeof s.choosed=="boolean"||s.choosed===t||s.choosed===void 0&&t===void 0||"pinPoint"in s.choosed&&"pinPoint"in t||("pinPoint"in s.choosed&&"pos"in t?(e=new a(Math.sqrt((s.choosed.x-t.pos.x)**2+(s.choosed.y-t.pos.y)**2)),e.attachObject(t,i),e.pinHere(s.choosed.x,s.choosed.y)):"pinPoint"in t&&"pos"in s.choosed?(e=new a(Math.sqrt((s.choosed.pos.x-t.x)**2+(s.choosed.pos.y-t.y)**2)),e.attachObject(s.choosed,n),e.pinHere(t.x,t.y)):"pos"in s.choosed&&"pos"in t&&(e=new a(Math.sqrt((s.choosed.pos.x-t.pos.x)**2+(s.choosed.pos.y-t.pos.y)**2)),e.attachObject(s.choosed,n),e.attachObject(t,i)),typeof e=="undefined"))return;s.physics.addSpring(e),ae&&e.lockRotation()}},keyGotUpFunc(s){},keyGotDownFunc(s){}};[u("check-box",{checked:ae,onChange:s=>{ae=s}},"Lock rotation"),u("check-box",{checked:It,onChange:s=>{It=s}},"Snap to center")].forEach(le.appendChild.bind(le));var Ke=Gs;var Yt=20,Ze=document.createElement("div"),Us={name:"Wall drawer",description:"",element:Ze,drawFunc(s,t){let e=s.cnv.getContext("2d");e.strokeStyle="black",e.beginPath(),e.arc(s.mouseX,s.mouseY,Yt,0,2*Math.PI),e.stroke(),s.lastX!==0&&s.lastY!==0&&s.physics.addFixedBall(s.mouseX,s.mouseY,Yt)}};Ze.append(u("range-slider",{min:5,max:70,step:1,value:Yt,onChange:s=>{Yt=s}},"Size"));var Ae=Us;var ts=document.createElement("template");ts.innerHTML=`
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
      width: 90%;
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
      width: 90%;
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
`;var es=class extends HTMLElement{constructor(){super();this.minNum=0,this.maxNum=0,this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ts.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",{id:"mainContainer"},u("p",{className:"slider-label"},u("slot",null)),u("input",{id:"slider",type:"range",className:"slider"}),u("input",{id:"number-input",type:"number",className:"number"})))}get slider(){return this.shadowRoot.querySelector("#slider")}get numInput(){return this.shadowRoot.querySelector("#number-input")}set min(t){this.slider.min=t,this.numInput.min=t,this.minNum=t}set max(t){this.slider.max=t,this.numInput.max=t,this.maxNum=t}set step(t){this.slider.step=t,this.numInput.step=t}set value(t){this.slider.value=t,this.numInput.value=t}normalizeValue(t){return Math.min(Math.max(this.minNum,t),this.maxNum)}disable(){this.shadowRoot.querySelector("#mainContainer").classList.add("disabled")}enable(){this.shadowRoot.querySelector("#mainContainer").classList.remove("disabled")}set onChange(t){this.slider.onchange=e=>{let n=this.normalizeValue(e.target.valueAsNumber).toString();t(Number.parseFloat(n)),this.value=n},this.slider.oninput=e=>{let n=this.normalizeValue(e.target.valueAsNumber).toString();t(Number.parseFloat(n)),this.value=n},this.numInput.onchange=e=>{let n=this.normalizeValue(e.target.valueAsNumber).toString();t(Number.parseFloat(n)),this.value=n}}};window.customElements.define("range-slider-number",es);var Js=document.createElement("div"),Qs={name:"World settings",description:"",element:Js,init(s){let t=s;this.element.append(u("range-slider",{min:0,max:5e3,step:200,value:t.physics.gravity.y,onChange:e=>{t.physics.gravity.y=e}},"Gravity"),u("range-slider",{min:-5e3,max:5e3,step:1e3,value:t.physics.gravity.x,onChange:e=>{t.physics.gravity.x=e}},"Gravity in X direction"),u("range-slider",{min:0,max:.99,step:.01,value:1-t.physics.airFriction,onChange:e=>{t.physics.setAirFriction(1-e)}},"Air friction"),u("range-slider-number",{min:700,max:1e4,step:10,value:t.worldSize.width,onChange:e=>{t.setWorldSize({width:e,height:t.worldSize.height})}},"World width"),u("range-slider-number",{min:700,max:5e3,step:10,value:t.worldSize.height,onChange:e=>{t.setWorldSize({width:t.worldSize.width,height:e})}},"World height"),u("check-box",{checked:t.drawCollisions,onChange:e=>{t.drawCollisions=e}},"Show collision data"),u("check-box",{checked:t.showAxes,onChange:e=>{t.showAxes=e}},"Show body axes"),u("check-box",{checked:t.showBoundingBoxes,onChange:e=>{t.showBoundingBoxes=e}},"Show boounding boxes"))}},ss=Qs;var ns=document.createElement("template");ns.innerHTML=`
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
`;var os=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ns.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",{className:"number-label"},u("span",null,u("slot",null)),u("div",{id:"indicatorContainer"},u("hr",{id:"rotationIndicator"})),u("span",null,"\xA0"),u("span",{id:"numberPlace"}),u("span",{id:"symbolPlace"},"\xB0")))}set value(t){let e=t*180/Math.PI%360;this.shadowRoot.querySelector("#numberPlace").innerText=Math.abs(e).toFixed(),this.shadowRoot.querySelector("#rotationIndicator").style.transform=`translateY(-0.1em) rotate(${e}deg)`}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}hideNumber(){this.shadowRoot.querySelector("#numberPlace").classList.add("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.add("hidden")}showNumber(){this.shadowRoot.querySelector("#numberPlace").classList.remove("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.remove("hidden")}};window.customElements.define("angle-display",os);var is=document.createElement("template");is.innerHTML=`
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
        width: 90%;
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
            width: 90%;
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
`;var as=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(is.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",{id:"btn"},u("slot",null))),this.hidden=!1}set bgColor(t){this.btn.style.backgroundColor=t}set textColor(t){this.btn.style.color=t}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(t){this.btn.onclick=t}smallMargin(){this.btn.style.marginTop="0.2em"}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}};window.customElements.define("button-btn",as);var rs=document.createElement("template");rs.innerHTML=`
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
      width: 90%;
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
`;var cs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(rs.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",null,u("input",{type:"file",id:"inputEl",name:"inputEl"}),u("label",{id:"inputLabel",htmlFor:"inputEl"},u("slot",null))))}get input(){return this.shadowRoot.getElementById("inputEl")}set accept(t){this.input.accept=t}set onFile(t){let e=n=>{n.target.files.length!==0&&t(n.target.files[0])};this.input.onchange=e}};window.customElements.define("file-input",cs);var ls=document.createElement("template");ls.innerHTML=`
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
        width: 90%;
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
`;var hs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ls.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",{id:"container"},u("div",{id:"apply",className:"btn"},"Apply"),u("div",{id:"cancel",className:"btn"}," Cancel")))}set visible(t){if(t){let e=this.containerElement;e.style.display!=="flex"&&(e.style.display="flex")}else{let e=this.containerElement;e.style.display!=="none"&&(e.style.display="none")}}get containerElement(){return this.shadowRoot.getElementById("container")}get applyBtn(){return this.shadowRoot.getElementById("apply")}get cancelBtn(){return this.shadowRoot.getElementById("cancel")}set onApply(t){this.applyBtn.onclick=t}set onCancel(t){this.cancelBtn.onclick=t}};window.customElements.define("apply-cancel",hs);var ds=document.createElement("template");ds.innerHTML=`
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
        width: 90%;
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
`;var us=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ds.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",null,u("span",null,u("slot",null)),u("ul",{id:"listHolder",className:"dropdown"})))}set entries(t){this.entryList=t;let{listHolder:e}=this;e.innerHTML="",e.append(...this.entryList.map(n=>u("li",{innerText:n})))}set value(t){this.listHolder.childNodes.forEach(e=>{"classList"in e&&(e.innerText===t?e.classList.add("chosen"):e.classList.remove("chosen"))})}get listHolder(){return this.shadowRoot.getElementById("listHolder")}set onChoice(t){let e=i=>{t(i.target.innerText),this.listHolder.classList.add("hidden"),this.listHolder.childNodes.forEach(a=>{"classList"in a&&(a.innerText===i.target.innerText?a.classList.add("chosen"):a.classList.remove("chosen"))}),setTimeout(()=>{this.listHolder.classList.remove("hidden")},20)},n=this.listHolder;this.listHolder.childNodes.forEach(i=>{let a=i.cloneNode(!0);a.addEventListener("click",e),n.replaceChild(a,i)})}};window.customElements.define("drop-down",us);var ms=document.createElement("template");ms.innerHTML=`
  <style>
    .container {
        width: 90%;
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
`;var fs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ms.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",{className:"container"},u("input",{id:"collapsible",className:"toggle",type:"checkbox",checked:!0}),u("label",{htmlFor:"collapsible",className:"toggle",id:"toggleEl"},"More"),u("div",{className:"toClose"},u("slot",null))))}get input(){return this.shadowRoot.getElementById("collapsible")}set title(t){this.shadowRoot.querySelector("#toggleEl").innerText=t}collapse(){this.input.checked=!1}open(){this.input.checked=!0}set closed(t){this.input.checked=!t}};window.customElements.define("collapsible-element",fs);var ps=document.createElement("template");ps.innerHTML=`
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
`;var bs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ps.content.cloneNode(!0)),this.shadowRoot.appendChild(u("div",{id:"btn"},u("slot",null))),this.hidden=!1}set bgColor(t){this.btn.style.backgroundColor=t}set textColor(t){this.btn.style.color=t}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(t){this.btn.onclick=t}set onEnter(t){this.btn.onpointerenter=t}set onLeave(t){this.btn.onpointerleave=t}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}asUpper(){this.btn.classList.add("upper")}asMiddle(){this.btn.classList.remove("upper"),this.btn.classList.remove("last")}asLast(){this.btn.classList.add("last")}};window.customElements.define("hover-detector-btn",bs);var $=7,K=6.5,he=8,de=25,ut=7,gs=8,Dt=7,ys=7,ue=23,mt=30,xs=4,h=!1,ft=!1,pt=!1,k=!1,nt=!1,Z=!1,ot=document.createElement("div"),F,H=!1,it=1,M=new o(0,0),bt=0,Ct="repeat",V=0,R=1,gt={body:!0,spring:!0};function zt(s){ot.innerHTML="",H=!1;let t=u("collapsible-element",{title:"Bodies",closed:!0}),e=[];for(let a=xs;a<s.physics.bodies.length;a+=1){let r=s.physics.bodies[a],c=a-xs,l=u("hover-detector-btn",{bgColor:S.pinkDarker},`Body #${c}`);l.onClick=()=>{ft=r,pt=!1},l.onEnter=()=>{pt=r},l.onLeave=()=>{pt===r&&(pt=!1)},a===s.physics.bodies.length-1&&l.asLast(),e.push(l)}t.append(...e);let n=u("collapsible-element",{title:"Sticks/Springs",closed:!0}),i=[];for(let a=0;a<s.physics.springs.length;a+=1){let r=s.physics.springs[a],c=r instanceof E?"Stick":"Spring",l=u("hover-detector-btn",{bgColor:S.pinkDarker},`${c} #${a}`);l.onClick=()=>{nt=r,Z=!1},l.onEnter=()=>{Z=r},l.onLeave=()=>{Z===r&&(Z=!1)},a===s.physics.bodies.length-1&&l.asLast(),i.push(l)}n.append(...i),ot.append(u("number-display",{value:""},"Selectable types:"),u("check-box",{checked:gt.body,onChange:a=>{gt.body=a}},"Body"),u("check-box",{checked:gt.spring,onChange:a=>{gt.spring=a}},"Stick/Spring"),t,n)}var O="none";function vs(s){if(ft instanceof v){let t=ft;return ft=!1,t}return nt instanceof P||!gt.body?!1:s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY,4)}function Nt(s){if(ft instanceof v||nt instanceof P)return"none";if(typeof H!="boolean"){let t=new o(s.mouseX,s.mouseY);return M.dist(t)<=gs?"move-texture":new o(M.x,M.y-ue).dist(t)<=Dt?"rotate-texture":new o(M.x+mt,M.y+mt).dist(t)<=ys?"scale-texture-xy":"choose-texture"}if(s.timeMultiplier!==0&&!(h instanceof v&&h.m===0))return"none";if(h instanceof v){let t=h.boundingBox,e=new o(t.x.min,t.y.min),n=new o(t.x.max,t.y.min),i=new o(t.x.min,t.y.max),a=new o(t.x.max,t.y.max),r=o.add(o.lerp(n,e,.5),new o(0,-de)),c=new o(s.mouseX,s.mouseY);if(o.dist(r,c)<=he)return"rotate";if(o.dist(i,c)<=$)return"resize-bl";if(o.dist(a,c)<=$)return"resize-br";if(o.dist(e,c)<=$)return"resize-tl";if(o.dist(n,c)<=$)return"resize-tr";if(o.dist(o.lerp(n,e,.5),c)<=K)return"resize-t";if(o.dist(o.lerp(a,i,.5),c)<=K)return"resize-b";if(o.dist(o.lerp(e,i,.5),c)<=K)return"resize-l";if(o.dist(o.lerp(n,a,.5),c)<=K)return"resize-r";if(c.x>=e.x&&c.y>=e.y&&c.x<=a.x&&c.y<=a.y)return"move"}else if(typeof k!="boolean"){let t=k.points,e=new o(s.mouseX,s.mouseY);if(t[0].dist(e)<=ut)return"move-spring0";if(t[1].dist(e)<=ut)return"move-spring1"}return"none"}function _s(s){if(!(h instanceof v))return;let t=h.boundingBox,e=new o(t.x.min,t.y.min),n=new o(t.x.max,t.y.min),i=new o(t.x.min,t.y.max),a=new o(t.x.max,t.y.max);R=1,s==="rotate"&&(V=h.rotation),s==="resize-bl"&&(V=o.sub(i,n).heading),s==="resize-br"&&(V=o.sub(a,e).heading),s==="resize-tl"&&(V=o.sub(e,a).heading),s==="resize-tr"&&(V=o.sub(n,i).heading),s==="resize-t"&&(V=new o(0,-1).heading),s==="resize-b"&&(V=new o(0,1).heading),s==="resize-l"&&(V=new o(-1,0).heading),s==="resize-r"&&(V=new o(1,0).heading),s==="rotate-texture"&&(V=Math.PI)}function me(s){if(typeof h!="boolean"){let t=new o(s.mouseX,s.mouseY),e=new o(s.oldMouseX,s.oldMouseY),n=o.sub(e,h.pos),i=o.sub(t,h.pos),a=h.boundingBox,r=new o(a.x.min,a.y.min),c=new o(a.x.max,a.y.min),l=new o(a.x.min,a.y.max),f=new o(a.x.max,a.y.max),m=o.lerp(r,c,.5),d=o.lerp(l,f,.5),b=o.lerp(f,c,.5),p=o.lerp(l,r,.5),y=o.fromAngle(V),g=1;switch(O){case"move":h.move(new o(s.mouseX-s.oldMouseX,s.mouseY-s.oldMouseY));break;case"rotate":h.rotate(i.heading-n.heading);break;case"resize-bl":g=o.dot(y,o.sub(t,c))/o.dot(y,o.sub(e,c)),g*R>=.03?(h.scaleAround(c,g),h.textureTransform.offset.mult(g),h.textureTransform.scale*=g,R*=g):O="none";break;case"resize-br":g=o.dot(y,o.sub(t,r))/o.dot(y,o.sub(e,r)),g*R>=.03?(h.scaleAround(r,g),h.textureTransform.offset.mult(g),h.textureTransform.scale*=g,R*=g):O="none";break;case"resize-tl":g=o.dot(y,o.sub(t,f))/o.dot(y,o.sub(e,f)),g*R>=.03?(h.scaleAround(f,g),h.textureTransform.offset.mult(g),h.textureTransform.scale*=g,R*=g):O="none";break;case"resize-tr":g=o.dot(y,o.sub(t,l))/o.dot(y,o.sub(e,l)),g*R>=.03?(h.scaleAround(l,g),h.textureTransform.offset.mult(g),h.textureTransform.scale*=g,R*=g):O="none";break;case"resize-t":g=o.dot(y,o.sub(t,d))/o.dot(y,o.sub(e,d)),g*R>=.1?(h.scaleAroundY(d,g),R*=g):O="none";break;case"resize-b":g=o.dot(y,o.sub(t,m))/o.dot(y,o.sub(e,m)),g*R>=.1?(h.scaleAroundY(m,g),R*=g):O="none";break;case"resize-l":g=o.dot(y,o.sub(t,b))/o.dot(y,o.sub(e,b)),g*R>=.1?(h.scaleAroundX(b,g),R*=g):O="none";break;case"resize-r":g=o.dot(y,o.sub(t,p))/o.dot(y,o.sub(e,p)),g*R>=.1?(h.scaleAroundX(p,g),R*=g):O="none";break;default:break}}else if(typeof k!="boolean"){let t=new o(s.mouseX,s.mouseY);switch(O){case"move-spring0":k.updateAttachPoint0(t,ut);break;case"move-spring1":k.updateAttachPoint1(t,ut);break;default:break}}if(typeof H!="boolean"&&typeof h!="boolean"){let t=new o(s.mouseX,s.mouseY),e=new o(s.oldMouseX,s.oldMouseY),n=o.sub(t,M),i=o.sub(e,M),a=new o(1,1);switch(O){case"move-texture":M.x=s.mouseX,M.y=s.mouseY;break;case"scale-texture-xy":it*=o.dot(n,a)/o.dot(i,a),it*=o.dot(n,a)/o.dot(i,a);break;case"rotate-texture":bt+=n.heading-i.heading;break;default:break}}}var ws="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAyklEQVQ4T6XST0qCQRjH8Y8JBnoCr9DGjXQBEbqDm6QQgvZeoX0bQVy7cRtBeIPcewi3bYLKeF6mmAZBeZvN8Pz5PvOb53ka/p4mHnGDVgp9YIVrvCdft5FxV3guCpXmBD1sfsAhXrKseOUVcV/ivKgwDvAMn1ngFosisVRTgQ+YpsQ7zA7IjX/fZ/4KfEMHX4jmlKePUeFcBrhPzi0ujjTnN/wv8JjUXMQO7fjWqc0JeIB1qvJUdxydOgtQjazOys1Dbg6GfeqS+wZwAS6Pac4meQAAAABJRU5ErkJggg==') 6.5 6.5, auto",fe={none:"default",move:"move",rotate:ws,"resize-bl":"nesw-resize","resize-br":"nwse-resize","resize-tl":"nwse-resize","resize-tr":"nesw-resize","resize-t":"ns-resize","resize-b":"ns-resize","resize-l":"ew-resize","resize-r":"ew-resize","move-spring0":"move","move-spring1":"move","move-texture":"move","rotate-texture":ws,"scale-texture-xy":"nwse-resize","choose-texture":"default"};function ks(s){if(nt instanceof P){let n=nt;return nt=!1,n}if(!gt.spring)return!1;let t=new o(s.mouseX,s.mouseY),e=s.physics.springs.find(n=>n.getAsSegment().distFromPoint(t)<=ut);return typeof e=="undefined"?!1:e}function $s(s,t){if(h instanceof v)if(O!=="rotate"){s.strokeStyle=S["Roman Silver"],s.setLineDash([5,3.5]),s.strokeRect(h.boundingBox.x.min,h.boundingBox.y.min,h.boundingBox.x.max-h.boundingBox.x.min,h.boundingBox.y.max-h.boundingBox.y.min),s.beginPath(),s.moveTo(h.boundingBox.x.max/2+h.boundingBox.x.min/2,h.boundingBox.y.min),s.lineTo(h.boundingBox.x.max/2+h.boundingBox.x.min/2,h.boundingBox.y.min-de),s.stroke(),s.fillStyle=S.blue,s.beginPath(),s.arc(h.boundingBox.x.min,h.boundingBox.y.min,$,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(h.boundingBox.x.min,h.boundingBox.y.max,$,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(h.boundingBox.x.max,h.boundingBox.y.min,$,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(h.boundingBox.x.max,h.boundingBox.y.max,$,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(h.boundingBox.x.min,h.boundingBox.y.min/2+h.boundingBox.y.max/2,K,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(h.boundingBox.x.max,h.boundingBox.y.min/2+h.boundingBox.y.max/2,K,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(h.boundingBox.x.max/2+h.boundingBox.x.min/2,h.boundingBox.y.max,K,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(h.boundingBox.x.max/2+h.boundingBox.x.min/2,h.boundingBox.y.min,K,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(h.boundingBox.x.max/2+h.boundingBox.x.min/2,h.boundingBox.y.min-de,he,0,Math.PI*2),s.fill();let e=Nt(t),n=fe[e],i=t.cnv.style;i.cursor!==n&&(i.cursor=n)}else s.strokeStyle=S["Roman Silver"],s.setLineDash([5,3.5]),s.beginPath(),s.moveTo(h.pos.x,h.pos.y),s.lineTo(t.mouseX,t.mouseY),s.stroke(),s.fillStyle=S.blue,s.beginPath(),s.arc(t.mouseX,t.mouseY,he,0,Math.PI*2),s.fill()}function Ks(s,t){if(typeof k!="boolean"){let e=k.points;s.fillStyle=S.blue,s.beginPath(),e.forEach(r=>{s.arc(r.x,r.y,ut,0,Math.PI*2)}),s.fill();let n=Nt(t),i=fe[n],a=t.cnv.style;a.cursor!==i&&(a.cursor=i)}}function Zs(s){let t=ks(s);if(typeof t!="boolean"){ot.innerHTML="",k=t;let e=u("number-display",{value:k.getAsSegment().length.toFixed(1)},"Length:\xA0"),n=u("range-slider-number",{min:15,max:Math.max(s.worldSize.width,s.worldSize.height),step:1,value:k.length.toFixed(1),onChange:r=>{typeof k!="boolean"&&(k.length=r)}},"Start length"),i;k instanceof P&&!(k instanceof E)?i=u("range-slider-number",{min:2e3,max:1e5,value:k.springConstant,step:200,onChange:r=>{k instanceof P&&(k.springConstant=r)}},"Spring stiffness"):i=u("div",null);let a=u("angle-display",{value:0},"Orientation:\xA0");a.hideNumber(),ot.append(u("number-display",{value:k instanceof E?"stick":"spring"},"Type:\xA0"),e,a,n,i,u("check-box",{checked:k.rotationLocked,onChange:r=>{typeof k!="boolean"&&(r?k.lockRotation():k.unlockRotation())}},"Locked"),u("button-btn",{bgColor:S["Imperial Red"],textColor:"white",onClick:()=>{typeof k!="boolean"&&(s.physics.removeObjFromSystem(k),zt(s),F=()=>{},h=!1,k=!1)}},"Delete")),F=()=>{if(typeof k=="boolean")return;e.value=k.getAsSegment().length.toFixed(1);let r=k.getAsSegment();a.value=o.sub(r.b,r.a).heading}}else k=!1,zt(s)}function As(s,t){if(s.strokeStyle=S["Roman Silver"],s.setLineDash([5,3.5]),O==="rotate-texture"){let e=new o(t.mouseX,t.mouseY);s.beginPath(),s.moveTo(M.x,M.y),s.lineTo(e.x,e.y),s.stroke(),s.fillStyle=S.blue,s.setLineDash([]),s.beginPath(),s.arc(M.x,M.y,Dt,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(e.x,e.y,Dt,0,Math.PI*2),s.closePath(),s.fill();return}s.beginPath(),s.moveTo(M.x,M.y-ue),s.lineTo(M.x,M.y),s.stroke(),s.beginPath(),s.moveTo(M.x,M.y),s.lineTo(M.x+mt,M.y+mt),s.stroke(),s.setLineDash([]),s.fillStyle=S.blue,s.beginPath(),s.arc(M.x,M.y,gs,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(M.x,M.y-ue,Dt,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(M.x+mt,M.y+mt,ys,0,Math.PI*2),s.closePath(),s.fill()}var tn={name:"Select",description:"",element:ot,drawFunc(s,t){var a,r;ft instanceof v&&((a=this.startInteractionFunc)==null||a.call(this,s)),nt instanceof P&&((r=this.startInteractionFunc)==null||r.call(this,s));let e=vs(s),n=ks(s),i=s.cnv.getContext("2d");if(i.save(),i.strokeStyle="orange",i.fillStyle="#00000000",i.setLineDash([]),i.lineWidth=4,typeof h!="boolean")if(s.renderer.renderBody(h,i),i.globalAlpha=.6,s.physics.getSpringsWithBody(h).forEach(c=>{i.fillStyle="#00000000",i.strokeStyle="#FFFFFF",c instanceof E?s.renderer.renderStick(c,i):c instanceof P&&s.renderer.renderSpring(c,i)}),i.globalAlpha=1,typeof H!="boolean"){let c=i.createPattern(H,Ct);bt%=Math.PI*2;let l=new DOMMatrix([it,0,0,it,M.x,M.y]);l.rotateSelf(0,0,bt*180/Math.PI),c.setTransform(l),i.fillStyle=c,i.strokeStyle="#00000000",s.renderer.renderBody(h,i),As(i,s),me(s);let f=Nt(s),m=fe[f],d=s.cnv.style;d.cursor!==m&&(d.cursor=m)}else(h.m===0||s.timeMultiplier===0)&&(me(s),$s(i,s));else{let c=s.cnv.style;c.cursor!=="default"&&(c.cursor="default")}if(typeof k!="boolean")i.fillStyle="#00000000",k instanceof E?s.renderer.renderStick(k,i):k instanceof P&&s.renderer.renderSpring(k,i),i.globalAlpha=.6,i.strokeStyle="#FFFFFF",k.objects.forEach(c=>s.renderer.renderBody(c,i)),i.globalAlpha=1,s.timeMultiplier===0&&(me(s),Ks(i,s));else if(typeof h=="boolean"){let c=s.cnv.style;c.cursor!=="default"&&(c.cursor="default")}pt instanceof v&&(i.strokeStyle="yellow",i.fillStyle="#00000000",i.setLineDash([3,5]),s.renderer.renderBody(pt,i)),Z instanceof P&&(i.strokeStyle="yellow",i.fillStyle="#00000000",i.setLineDash([3,5]),Z instanceof E?s.renderer.renderStick(Z,i):s.renderer.renderSpring(Z,i)),i.strokeStyle="yellow",i.fillStyle="#00000000",i.setLineDash([3,5]),typeof e!="boolean"?s.renderer.renderBody(e,i):typeof n!="boolean"&&(i.fillStyle="#00000000",n instanceof E?s.renderer.renderStick(n,i):s.renderer.renderSpring(n,i)),i.restore(),F==null||F()},startInteractionFunc(s){let t=Nt(s);if(t!=="none"){O=t,_s(t);return}O="none";let e=vs(s);if(e instanceof v&&h!==e&&t==="none"){ot.innerHTML="",h=e,k=!1;let n=u("range-slider-number",{min:.1,max:25,step:.05,value:Number.parseFloat(h.density.toFixed(2)),onChange:x=>{h instanceof v&&(h.density=x),F==null||F()}},"Density");h.m===0&&n.disable();let i=u("check-box",{checked:h.m===0,onChange:x=>{h instanceof v&&(x?(n.disable(),h.density=0,h.vel=new o(0,0),h.ang=0,n.value=0):(n.enable(),h.density=1,n.value=h.density),F==null||F())}},"Fixed down"),a=u("number-display",{value:h.shape.r!==0?"circle":"polygon"},"Type:\xA0"),r=u("number-display",{value:h.m.toFixed(2)},"Mass:\xA0"),c=u("number-display",{value:h.pos.x.toFixed(2)},"X coord:\xA0"),l=u("number-display",{value:h.pos.y.toFixed(2)},"Y coord:\xA0"),f=u("angle-display",{value:h.rotation.toFixed(2)},"Rotation:\xA0"),m=u("number-display",{value:h.texture==="none"?"none":"set"},"Texture:\xA0"),d=u("file-input",{accept:"image/*",onFile:x=>{if(x.type.includes("image")){let B=new FileReader;B.readAsDataURL(x),B.onload=()=>{if(typeof B.result!="string")return;let X=new Image;X.onload=()=>{createImageBitmap(X).then(I=>{var W;h instanceof v?(s.timeMultiplier!==0&&((W=document.getElementById("pause"))==null||W.click()),H=I,it=Math.max(h.boundingBox.x.size()/I.width,h.boundingBox.y.size()/I.height),M.x=h.boundingBox.x.min,M.y=h.boundingBox.y.min,bt=0,h.texture="none"):H=!1})},X.src=B.result}}}},"Select image"),b=u("apply-cancel",{visible:!0,onApply:()=>{if(typeof h=="boolean"||typeof H=="boolean")return;let x=o.sub(M,h.pos);x.rotate(-h.rotation),h.textureTransform={scale:it,rotation:bt-h.rotation,offset:x},h.texture=H,h.textureRepeat=Ct,H=!1},onCancel:()=>{H=!1}}),p=u("button-btn",{textColor:"white",onClick:()=>{if(typeof h!="boolean"&&h.texture!=="none"){H=h.texture,h.texture="none",it=h.textureTransform.scale,bt=h.textureTransform.rotation+h.rotation;let x=h.textureTransform.offset.copy;x.rotate(h.rotation),x.add(h.pos),M.x=x.x,M.y=x.y}}},"Edit texture");p.smallMargin(),h.texture!=="none"?p.show():p.hide();let y=u("button-btn",{bgColor:S["Imperial Red"],textColor:"white",onClick:()=>{typeof h!="boolean"&&(h.texture="none")}},"Remove texture");y.smallMargin(),h.texture!=="none"?y.show():y.hide();let g=["repeat","repeat-x","repeat-y","no-repeat"];Ct=h.textureRepeat;let w=u("drop-down",{entries:g,value:Ct,onChoice:x=>{g.includes(x)&&(Ct=x,typeof h!="boolean"&&(h.textureRepeat=x))}},"\u25BC\xA0Texture mode");F=()=>{h instanceof v&&(c.value!=h.pos.x&&(c.value=h.pos.x.toFixed(2)),l.value!=h.pos.y&&(l.value=h.pos.y.toFixed(2)),r.value!=h.m&&(r.value=h.m.toFixed(2)),f.value=h.rotation.toFixed(2),m.value!==h.texture&&(m.value=h.texture==="none"?"none":"set"),typeof H!="boolean"?b.visible=!0:b.visible=!1,h.texture!=="none"?y.hidden&&y.show():y.hidden||y.hide(),h.texture!=="none"?p.hidden&&p.show():p.hidden||p.hide())},ot.append(a,r,f,c,l,i,n,u("range-slider-number",{min:0,max:.98,step:.02,value:h.k,onChange:x=>{h instanceof v&&(h.k=x)}},"Bounciness"),u("range-slider-number",{min:0,max:2,step:.1,value:h.fc,onChange:x=>{h instanceof v&&(h.fc=x)}},"Coefficient of friction"),u("color-picker",{value:h.style,onChange:x=>{h instanceof v&&(h.style=x)}},"Color:"),m,w,d,b,p,y,u("button-btn",{bgColor:S["Imperial Red"],textColor:"white",onClick:()=>{typeof h!="boolean"&&(s.physics.removeObjFromSystem(h),zt(s),F=()=>{},h=!1,k=!1)}},"Delete"))}else typeof e=="boolean"&&t==="none"&&(h=e,F=()=>{},Zs(s))},endInteractionFunc(s){O="none"},deactivated(){h=!1,k=!1,F=()=>{}},activated(s){zt(s)}},Ms=tn;var Ss=[Ee,Ms,Ne,Ae,Ke,_e,ze,Ue,Fe,He,ss,We];var Ps=class{constructor(){this.textures=[]}renderBody(t,e){if(t.shape.r!==0)e.beginPath(),e.arc(t.pos.x,t.pos.y,t.shape.r,0,Math.PI*2),e.stroke(),e.fill();else{e.beginPath(),e.moveTo(t.shape.points[0].x,t.shape.points[0].y);for(let n=1;n<t.shape.points.length;n+=1)e.lineTo(t.shape.points[n].x,t.shape.points[n].y);e.closePath(),e.stroke(),e.fill()}}renderSpring(t,e){let n=t.points,i=n[0].x,a=n[0].y,r=n[1].x,c=n[1].y,l=new o(r-i,c-a),f=l.copy;l.rotate(Math.PI/2),l.setMag(5);let m=new o(i,a),d=Math.floor(t.length/10);for(let b=1;b<=d;b+=1)b===d&&(l=new o(0,0)),e.beginPath(),e.moveTo(m.x,m.y),e.lineTo(i+b/d*f.x+l.x,a+b/d*f.y+l.y),e.stroke(),m=new o(i+b/d*f.x+l.x,a+b/d*f.y+l.y),l.mult(-1);e.strokeStyle="black",t.points.forEach(b=>{e.beginPath(),e.arc(b.x,b.y,2.5,0,Math.PI*2),e.fill(),e.stroke()})}renderStick(t,e){let n=t.points;e.beginPath(),e.moveTo(n[0].x,n[0].y),e.lineTo(n[1].x,n[1].y),e.stroke(),e.strokeStyle="black",t.points.forEach(i=>{e.beginPath(),e.arc(i.x,i.y,2.5,0,Math.PI*2),e.fill(),e.stroke()})}},Is=Ps;var U=Ss,jt=U.map(s=>s.name),Cs=class{constructor(){this.resizeCanvas=()=>{let t=this.canvasHolder.getBoundingClientRect();this.cnv.width=t.width,this.cnv.height=window.innerHeight-t.top;let e=window.devicePixelRatio||1,n=t;this.cnv.width=n.width*e,this.cnv.height=n.height*e,this.cnv.style.width=`${n.width}px`,this.cnv.style.height=`${n.height}px`,this.scaling=this.cnv.height/this.worldSize.height,this.scaling/=e,this.scaling*=.9,this.viewOffsetX=.01*this.cnv.width,this.viewOffsetY=.03*this.cnv.height;let i=this.cnv.getContext("2d");i&&(i.scale(e,e),i.lineWidth=e),this.defaultSize=(this.cnv.width+this.cnv.height)/80};this.drawFunction=()=>{var i,a;Number.isFinite(this.lastFrameTime)||(this.lastFrameTime=performance.now());let t=performance.now()-this.lastFrameTime;Number.isFinite(t)||(t=0),t/=1e3,t=Math.min(t,.04166666666);let e=this.cnv.getContext("2d");e.fillStyle=S.Beige,e.fillRect(0,0,this.cnv.width,this.cnv.height),e.save(),e.translate(this.viewOffsetX,this.viewOffsetY),e.scale(this.scaling,this.scaling),this.physicsDraw(),(a=(i=U[this.mode]).drawFunc)==null||a.call(i,this,t*this.timeMultiplier),e.restore(),this.collisionData=[],t*=this.timeMultiplier;let n=this.physics.bodies.find(r=>r.m!==0);n&&(this.right&&(n.ang=Math.min(n.ang+300*t,15)),this.left&&(n.ang=Math.max(n.ang-300*t,-15))),this.collisionData.push(...this.physics.update(t/5)),this.collisionData.push(...this.physics.update(t/5)),this.collisionData.push(...this.physics.update(t/5)),this.collisionData.push(...this.physics.update(t/5)),this.collisionData.push(...this.physics.update(t/5)),this.lastFrameTime=performance.now(),requestAnimationFrame(this.drawFunction),this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY};this.startInteraction=(t,e)=>{var n,i;this.mouseX=t/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=e/this.scaling-this.viewOffsetY/this.scaling,this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY,this.choosed=this.physics.getObjectAtCoordinates(this.mouseX,this.mouseY,4),!this.choosed&&typeof this.choosed=="boolean"&&(this.choosed={x:this.mouseX,y:this.mouseY,pinPoint:!0}),this.lastX=this.mouseX,this.lastY=this.mouseY,this.mouseDown=!0,(i=(n=U[this.mode]).startInteractionFunc)==null||i.call(n,this)};this.endInteraction=(t,e)=>{var n,i;this.mouseX=t/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=e/this.scaling-this.viewOffsetY/this.scaling,(i=(n=U[this.mode]).endInteractionFunc)==null||i.call(n,this),this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.discardInteraction=()=>{this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.keyGotDown=t=>{let e=t.key;e==="s"&&this.spawnNewtonsCradle(this.cnv.width/2,this.cnv.height/2,.5,this.physics),e==="a"&&(this.scaling+=.01),e==="d"&&(this.scaling-=.01),e==="j"&&(this.viewOffsetX-=10),e==="l"&&(this.viewOffsetX+=10),e==="k"&&(this.viewOffsetY-=10),e==="i"&&(this.viewOffsetY+=10),e==="ArrowRight"&&(this.right=!0),e==="ArrowLeft"&&(this.left=!0)};this.keyGotUp=t=>{let e=t.key;e==="ArrowRight"&&(this.right=!1),e==="ArrowLeft"&&(this.left=!1)};this.startTouch=t=>{t.preventDefault();let e=this.canvasHolder.getBoundingClientRect();return t.touches.length>1?(this.discardInteraction(),t.touches.length===2&&(this.touchIDs.push(t.touches[0].identifier),this.touchIDs.push(t.touches[1].identifier),this.touchCoords.push(new o(t.touches[0].clientX-e.left,t.touches[0].clientY-e.top)),this.touchCoords.push(new o(t.touches[1].clientX-e.left,t.touches[1].clientY-e.top))),t.touches.length>2&&(this.touchIDs=[],this.touchCoords=[]),!1):(this.startInteraction(t.changedTouches[0].clientX-e.left,t.changedTouches[0].clientY-e.top),!1)};this.endTouch=t=>{t.preventDefault();let e=this.canvasHolder.getBoundingClientRect();return t.touches.length<=1&&(this.touchIDs=[],this.touchCoords=[]),this.endInteraction(t.changedTouches[0].clientX-e.left,t.changedTouches[0].clientY-e.top),!1};this.moveTouch=t=>{t.preventDefault();let e=this.canvasHolder.getBoundingClientRect();if(t.touches.length===2){let n=[];return t.touches.item(0).identifier===this.touchIDs[0]?(n.push(t.touches.item(0)),n.push(t.touches.item(1))):(n.push(t.touches.item(1)),n.push(t.touches.item(0))),n=n.map(i=>new o(i.clientX-e.left,i.clientY-e.top)),this.processMultiTouchGesture(this.touchCoords,n),this.touchCoords=n,!1}return t.touches.length>2||(this.mouseX=t.changedTouches[0].clientX-e.left,this.mouseY=t.changedTouches[0].clientY-e.top,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling),!1};this.processMultiTouchGesture=(t,e)=>{let n=o.add(t[1],t[0]);n.mult(.5);let i=o.add(e[1],e[0]);i.mult(.5);let a=o.dist(t[1],t[0]),r=o.dist(e[1],e[0]),c=Math.sqrt(r/a),l=o.add(n,i);l.mult(.5);let f=o.sub(i,n);f.mult(c),this.scaleAround(l,c),this.viewOffsetX+=f.x,this.viewOffsetY+=f.y};this.scaleAround=(t,e)=>{this.viewOffsetX=t.x-(t.x-this.viewOffsetX)*e,this.viewOffsetY=t.y-(t.y-this.viewOffsetY)*e,this.scaling*=e};this.startMouse=t=>(t.button===0&&this.startInteraction(t.offsetX,t.offsetY),t.button===2&&(this.rightButtonDown=new o(t.offsetX,t.offsetY),this.cnv.style.cursor="all-scroll"),!1);this.endMouse=t=>(t.button===0&&this.endInteraction(t.offsetX,t.offsetY),t.button===2&&(this.rightButtonDown=!1,this.cnv.style.cursor="default"),!1);this.handleMouseMovement=t=>{if(this.mouseX=t.offsetX,this.mouseY=t.offsetY,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling,this.rightButtonDown){let e=new o(t.offsetX,t.offsetY),n=o.sub(e,this.rightButtonDown);this.viewOffsetX+=n.x,this.viewOffsetY+=n.y,this.rightButtonDown=e}};this.handleMouseWheel=t=>{t.preventDefault();let e=new o(t.offsetX,t.offsetY),n=5e-4;t.deltaMode===WheelEvent.DOM_DELTA_LINE&&(n/=16);let i=1-t.deltaY*n;this.scaleAround(e,i)};this.convertToPhysicsSpace=t=>new o(t.x/this.scaling-this.viewOffsetX/this.scaling,t.y/this.scaling-this.viewOffsetY/this.scaling);this.convertToCanvasSpace=t=>new o(t.x*this.scaling+this.viewOffsetX,t.y*this.scaling+this.viewOffsetY);this.physicsDraw=()=>{let t=this.cnv.getContext("2d");if(t){t.fillStyle=S.Independence,t.fillRect(0,0,this.worldSize.width,this.worldSize.height);let e=i=>{if(i.m===0&&(t.strokeStyle="#00000000"),i.shape.r!==0){let a=i;t.beginPath(),t.arc(a.pos.x,a.pos.y,a.shape.r,0,2*Math.PI),t.stroke(),t.fill(),i.m!==0&&(t.beginPath(),t.moveTo(a.pos.x,a.pos.y),t.lineTo(a.pos.x+a.shape.r*Math.cos(a.rotation),a.pos.y+a.shape.r*Math.sin(a.rotation)),t.stroke())}else t.beginPath(),t.moveTo(i.shape.points[i.shape.points.length-1].x,i.shape.points[i.shape.points.length-1].y),i.shape.points.forEach(a=>{t.lineTo(a.x,a.y)}),t.stroke(),t.fill(),i.m!==0&&(t.beginPath(),t.arc(i.pos.x,i.pos.y,1.5,0,Math.PI*2),t.stroke()),this.showAxes&&(t.strokeStyle="black",i.axes.forEach(a=>{t.beginPath(),t.moveTo(i.pos.x,i.pos.y),t.lineTo(i.pos.x+a.x*30,i.pos.y+a.y*30),t.stroke()}))};this.physics.bodies.forEach(i=>{t.fillStyle=i.style,t.strokeStyle="black",e(i)}),this.physics.bodies.forEach(i=>{if(i.texture==="none")return;let a=i.textureTransform,r=a.offset.copy;r.rotate(i.rotation),r.add(i.pos);let c=new DOMMatrix([a.scale,0,0,a.scale,r.x,r.y]);c.rotateSelf(0,0,(a.rotation+i.rotation)*180/Math.PI);let l=t.createPattern(i.texture,i.textureRepeat);l.setTransform(c),t.fillStyle=l,t.strokeStyle="#00000000",e(i)}),t.save(),t.lineWidth=2,this.physics.springs.forEach(i=>{i instanceof P&&!(i instanceof E)?(t.strokeStyle=S.blue,t.fillStyle=S.blue,this.renderer.renderSpring(i,t)):(t.strokeStyle=S.blue,t.fillStyle=S.blue,this.renderer.renderStick(i,t))}),t.restore(),t.strokeStyle="rgba(255, 255, 255, 0.2)",this.showBoundingBoxes&&this.physics.bodies.forEach(i=>{t.strokeRect(i.boundingBox.x.min,i.boundingBox.y.min,i.boundingBox.x.max-i.boundingBox.x.min,i.boundingBox.y.max-i.boundingBox.y.min)}),t.fillStyle=S["Maximum Yellow Red"],t.strokeStyle=S["Maximum Yellow Red"];let n=t.lineWidth;t.lineWidth=4,this.drawCollisions&&this.collisionData.forEach(i=>{t.beginPath(),t.moveTo(i.cp.x,i.cp.y),t.lineTo(i.cp.x+i.n.x*30,i.cp.y+i.n.y*30),t.stroke(),t.beginPath(),t.arc(i.cp.x,i.cp.y,4,0,Math.PI*2),t.fill()}),t.lineWidth=n}};this.spawnNewtonsCradle=(t,e,n,i)=>{let a=[],r=25,c=250,l=8;a.push(new v(T.Circle(n*r,new o(t,e)),1,1,0));let f=1;for(let m=0;m<l-1;m+=1)a.push(new v(T.Circle(n*r,new o(t+f*n*r*1.01*2,e)),1,1,0)),f*=-1,f>0&&(f+=1),m===l-2&&(a[a.length-1].vel.x=-Math.sign(f)*n*r*8);a.forEach(m=>{i.addBody(m);let d=new E(c);d.attachObject(m),d.pinHere(m.pos.x,m.pos.y-c),i.addSpring(d),d.lockRotation()})};this.modeButtonClicked=t=>{let e=t.target.id.replace("-btn",""),n=jt.indexOf(e);this.switchToMode(n)};this.switchToMode=t=>{var i,a,r,c;let e=document.getElementById(`${jt[this.mode]}-btn`);e&&e.classList.remove("bg-pink-darker"),this.sidebar.innerHTML="",(a=(i=U[this.mode]).deactivated)==null||a.call(i,this),(c=(r=U[t]).activated)==null||c.call(r,this);let n=document.getElementById(`${jt[t]}-btn`);n&&n.classList.add("bg-pink-darker"),this.modeTitleHolder.innerText=U[t].name,this.mode=t,this.sidebar.appendChild(U[this.mode].element)};this.setupModes=()=>{let t=document.getElementById("button-holder");jt.forEach((e,n)=>{var a,r;let i=document.createElement("div");i.classList.add("big-button"),i.id=`${e}-btn`,i.textContent=U[n].name,(r=(a=U[n]).init)==null||r.call(a,this),i.onclick=this.modeButtonClicked,t&&t.appendChild(i)}),this.switchToMode(this.mode)};this.setTimeMultiplier=t=>{Number.isFinite(t)&&t>=0&&(this.timeMultiplier=t,t===0?this.pauseBtn.classList.add("bg-pink-darker"):this.pauseBtn.classList.remove("bg-pink-darker"))};this.getTimeMultiplier=()=>this.timeMultiplier;this.setPhysics=t=>{t instanceof lt&&(this.physics=t)};this.getPhysics=()=>this.physics;this.physics=new lt,this.mouseX=0,this.mouseY=0,this.oldMouseX=0,this.oldMouseY=0,this.mouseDown=!1,this.defaultSize=30,this.k=.5,this.fc=2,this.springConstant=2e3,this.scaling=1,this.viewOffsetX=0,this.viewOffsetY=0,this.mode=0,this.lastX=0,this.lastY=0,this.touchIDs=[],this.touchCoords=[],this.rightButtonDown=!1,this.timeMultiplier=1,this.lastFrameTime=performance.now(),this.choosed=!1,this.drawCollisions=!1,this.showAxes=!1,this.worldSize={width:0,height:0},this.collisionData=[],this.showBoundingBoxes=!1,this.renderer=new Is,this.left=!1,this.right=!1,this.cnv=document.getElementById("defaulCanvas0"),this.canvasHolder=document.getElementById("canvas-holder"),this.sidebar=document.getElementById("sidebar"),this.modeTitleHolder=document.getElementById("mode-title-text"),this.pauseBtn=document.getElementById("pause"),this.setWorldSize({width:2e3,height:1e3}),this.physics.setGravity(new o(0,1e3)),this.physics.setAirFriction(.9),this.cnv.addEventListener("touchstart",this.startTouch,!1),this.cnv.addEventListener("touchend",this.endTouch,!1),this.cnv.addEventListener("touchmove",this.moveTouch,!1),this.cnv.addEventListener("mousedown",this.startMouse,!1),this.cnv.addEventListener("mouseup",this.endMouse,!1),this.cnv.addEventListener("mousemove",this.handleMouseMovement,!1),this.cnv.addEventListener("wheel",this.handleMouseWheel),this.cnv.addEventListener("contextmenu",t=>t.preventDefault()),document.addEventListener("keydown",this.keyGotDown,!1),document.addEventListener("keyup",this.keyGotUp,!1),window.addEventListener("resize",this.resizeCanvas,!1),this.resizeCanvas(),this.setupModes(),Wt(this),requestAnimationFrame(this.drawFunction)}setWorldSize(t){this.physics.setBounds(0,0,t.width,t.height),this.worldSize=t}},Es=Cs;window.onload=()=>{window.editorApp=new Es,"serviceWorker"in navigator&&navigator.serviceWorker.register("serviceworker.js").then(()=>{},s=>{console.log("ServiceWorker registration failed: ",s)})};})();
