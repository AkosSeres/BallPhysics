(()=>{var I=class{constructor(t,e){this.x=t,this.y=e}get copy(){return new I(this.x,this.y)}setCoordinates(t,e){this.x=t,this.y=e}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get sqlength(){return this.x*this.x+this.y*this.y}get heading(){if(this.x===0&&this.y===0)return 0;if(this.x===0)return this.y>0?Math.PI/2:1.5*Math.PI;if(this.y===0)return this.x>0?0:Math.PI;let t=I.normalized(this);return this.x>0&&this.y>0?Math.asin(t.y):this.x<0&&this.y>0?Math.asin(-t.x)+Math.PI/2:this.x<0&&this.y<0?Math.asin(-t.y)+Math.PI:this.x>0&&this.y<0?Math.asin(t.x)+1.5*Math.PI:0}add(t){this.x+=t.x,this.y+=t.y}sub(t){this.x-=t.x,this.y-=t.y}mult(t){this.x*=t,this.y*=t}div(t){this.x/=t,this.y/=t}lerp(t,e){this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e}dist(t){return new I(this.x-t.x,this.y-t.y).length}pNorm(t){let e=t;return e<1&&(e=1),(Math.abs(this.x**e)+Math.abs(this.y**e))**(1/e)}setMag(t){this.length!==0&&this.mult(t/this.length)}normalize(){this.length!==0&&this.div(this.length)}scaleAround(t,e){this.x=t.x+(this.x-t.x)*e,this.y=t.y+(this.y-t.y)*e}scaleAroundX(t,e){this.x=t.x+(this.x-t.x)*e}scaleAroundY(t,e){this.y=t.y+(this.y-t.y)*e}rotate(t){let e=Math.cos(t),n=Math.sin(t);this.setCoordinates(this.x*e-this.y*n,this.x*n+this.y*e)}static rotateArr(t,e){let n=Math.cos(e),o=Math.sin(e);t.forEach(a=>{a.setCoordinates(a.x*n-a.y*o,a.x*o+a.y*n)})}rotate90(){let{x:t}=this;this.x=-this.y,this.y=t}rotate270(){let{x:t}=this;this.x=this.y,this.y=-t}static add(t,e){return new I(t.x+e.x,t.y+e.y)}static sub(t,e){return new I(t.x-e.x,t.y-e.y)}static mult(t,e){return new I(t.x*e,t.y*e)}static div(t,e){return new I(t.x/e,t.y/e)}static fromAngle(t){return new I(Math.cos(t),Math.sin(t))}static fromAnglePNorm(t,e){let n=new I(Math.cos(t),Math.sin(t));return n.div(n.pNorm(e)),n}static lerp(t,e,n){return I.add(t,I.mult(I.sub(e,t),n))}static dist(t,e){return I.sub(t,e).length}static dot(t,e){return t.x*e.x+t.y*e.y}static cross(t,e){return t.x*e.y-t.y*e.x}static crossScalarFirst(t,e){return new I(-e.y*t,e.x*t)}static crossScalarSecond(t,e){return new I(t.y*e,-t.x*e)}static angle(t,e){return Math.acos(Math.min(Math.max(I.dot(t,e)/Math.sqrt(t.sqlength*e.sqlength),1),-1))}static angleACW(t,e){let n=t.heading,a=e.heading-n;return a<0?2*Math.PI+a:a}static normalized(t){let e=t.length;return e===0?t:new I(t.x/e,t.y/e)}toJSON(){return{x:this.x,y:this.y}}static fromObject(t){return new I(t.x,t.y)}},i=I;var se=class{constructor(t,e){this.a=t,this.b=e}get length(){return i.dist(this.a,this.b)}distFromPoint(t){let e=i.sub(this.b,this.a),n=e.length;e.normalize();let o=i.sub(t,this.a),a=i.dot(e,o),r=i.cross(e,o);return a>=0&&a<=n?Math.abs(r):Math.sqrt(Math.min(o.sqlength,i.sub(t,this.b).sqlength))}get nearestPointO(){let t=i.sub(this.b,this.a);if(i.dot(this.a,t)>=0)return this.a.copy;if(i.dot(this.b,t)<=0)return this.b.copy;t.normalize();let e=-i.dot(this.a,t);return i.add(this.a,i.mult(t,e))}static intersect(t,e){let n=i.sub(t.b,t.a),o=n.y/n.x,a=t.b.y-t.b.x*o,r=i.sub(e.b,e.a),c=r.y/r.x,l=e.b.y-e.b.x*c;if(n.x===0&&r.x!==0){if(t.a.x>=e.a.x&&t.a.x<=e.b.x||t.a.x<=e.a.x&&t.a.x>=e.b.x){let p=c*t.a.x+l;if(p>t.a.y&&p<t.b.y||p<t.a.y&&p>t.b.y)return new i(t.a.x,p)}return!1}if(r.x===0&&n.x!==0){if(e.a.x>=t.a.x&&e.a.x<=t.b.x||e.a.x<=t.a.x&&e.a.x>=t.b.x){let p=o*e.a.x+a;if(p>e.a.y&&p<e.b.y||p<e.a.y&&p>e.b.y)return new i(e.a.x,p)}return!1}if(n.x===0&&r.x===0){if(t.a.x===e.a.x){let p;t.a.y<t.b.y?p=[t.a.y,t.b.y]:p=[t.b.y,t.a.y];let x;e.a.y<e.b.y?x=[e.a.y,e.b.y]:x=[e.b.y,e.a.y];let g=[p[0]>x[0]?p[0]:x[0],p[1]<x[1]?p[1]:x[1]];if(g[0]<=g[1])return new i(t.a.x,(g[0]+g[1])/2)}return!1}let m;t.a.x<t.b.x?m=[t.a.x,t.b.x]:m=[t.b.x,t.a.x];let d;e.a.x<e.b.x?d=[e.a.x,e.b.x]:d=[e.b.x,e.a.x];let h=[m[0]>d[0]?m[0]:d[0],m[1]<d[1]?m[1]:d[1]];if(o===c&&a===l&&h[0]<=h[1])return new i((h[0]+h[1])/2,(h[0]+h[1])/2*o+a);let b=(l-a)/(o-c);return b>=h[0]&&b<=h[1]?new i(b,b*o+a):!1}},T=se;var ne=class extends T{get length(){return Number.POSITIVE_INFINITY}distFromPoint(t){let e=i.sub(this.a,this.b);e.setMag(1),e.rotate(Math.PI/2);let n=i.sub(t,this.a);return Math.abs(i.dot(n,e))}static intersect(t,e){let n=i.sub(t.b,t.a),o=n.y/n.x,a=t.b.y-t.b.x*o,r=i.sub(e.b,e.a),c=r.y/r.x,l=e.b.y-e.b.x*c;if(o===c)return t.distFromPoint(e.a)===0?new i((t.a.x+t.b.x+e.a.x+e.b.x)/4,(t.a.y+t.b.y+e.a.y+e.b.y)/4):!1;let m=(l-a)/(o-c);return new i(m,o*m+a)}static intersectWithLineSegment(t,e){let n=i.sub(t.b,t.a),o=n.y/n.x,a=t.b.y-t.b.x*o,r=i.sub(e.b,e.a),c=r.y/r.x,l=e.b.y-e.b.x*c;if(n.x===0){if(r.x===0)return t.a.x===e.a.x?new i((e.a.x+e.b.x)/2,(e.a.y+e.b.y)/2):!1;let h=t.a.x,b=c*h+l;return Math.min(e.a.x,e.b.x)<h&&h<Math.max(e.a.x,e.b.x)&&Math.min(e.a.y,e.b.y)<b&&Math.max(e.a.y,e.b.y)>b?new i(h,b):!1}if(r.x===0){let h=e.a.x,b=o*h+a;return Math.min(e.a.x,e.b.x)<h&&h<Math.max(e.a.x,e.b.x)&&Math.min(e.a.y,e.b.y)<b&&Math.max(e.a.y,e.b.y)>b?new i(h,b):!1}if(o===c)return t.distFromPoint(e.a)===0?new i((e.a.x+e.b.x)/2,(e.a.y+e.b.y)/2):!1;let m=(l-a)/(o-c),d=o*m+a;return Math.min(e.a.x,e.b.x)<m&&m<Math.max(e.a.x,e.b.x)&&Math.min(e.a.y,e.b.y)<d&&Math.max(e.a.y,e.b.y)>d?new i(m,d):!1}},J=ne;function st(s,t){this.min=s,this.max=t}st.prototype.size=function(){return this.max-this.min};function vt(s){return new st(Math.min(...s),Math.max(...s))}function wt(s,t){return new st(Math.max(s.min,t.min),Math.min(s.max,t.max))}var W=class{constructor(t){if(t.length<3)throw new Error("Not enough points in polygon (minimum required: 3)");this.points=t,this.makeAntiClockwise()}getSideVector(t){let e=t;return e<0&&(e+=Math.abs(Math.floor(e))*this.points.length),i.sub(this.points[(e+1)%this.points.length],this.points[e%this.points.length])}getSideSegment(t){let e=t;return e<0&&(e+=Math.abs(Math.floor(e))*this.points.length),new T(i.fromObject(this.points[(e+1)%this.points.length]),i.fromObject(this.points[e%this.points.length]))}getSideLine(t){let e=t;return e<0&&(e+=Math.abs(Math.floor(e))*this.points.length),new T(i.fromObject(this.points[(e+1)%this.points.length]),i.fromObject(this.points[e%this.points.length]))}get sides(){return this.points.length}makeAntiClockwise(){let t=0;for(let e=1;e<=this.sides;e+=1){let n=this.getSideVector(e),o=this.getSideVector(e-1);o.mult(-1),t+=i.angleACW(n,o)}this.sides===3?t>Math.PI*1.5&&this.reverseOrder():this.sides===4?i.angleACW(this.getSideVector(1),this.getSideVector(0))>=Math.PI&&this.reverseOrder():this.sides>4&&t-this.sides*Math.PI>0&&this.reverseOrder()}reverseOrder(){this.points=this.points.reverse()}isPointInside(t){let e=new i(t.x,t.y);if(i.dist(e,this.centerPoint)>this.boundRadius)return!1;let n=this.centerPoint.copy;n.add(i.mult(new i(1.1,.6),this.boundRadius));let o=new T(e,n),a=0;return[...Array(this.sides).keys()].map(r=>this.getSideSegment(r)).forEach(r=>{T.intersect(r,o)&&(a+=1)}),a%2==0?!1:a%2==1}get centerPoint(){let t=new i(0,0);return this.points.forEach(e=>{t.add(e)}),t.div(this.sides),t}get boundRadius(){let t=this.centerPoint;return Math.max(...this.points.map(e=>i.dist(e,t)))}get allSides(){return[...Array(this.sides).keys()].map(t=>this.getSideSegment(t))}static intersection(t,e){if(i.dist(t.centerPoint,e.centerPoint)>t.boundRadius+e.boundRadius)return;let n=[],o=t.allSides,a=e.allSides;if(o.forEach((h,b)=>{a.forEach((p,x)=>{let g=T.intersect(h,p);typeof g=="object"&&"x"in g&&(g.isIntersectionPoint=!0,n.push({intersectionPoint:g,sideNum1:b,sideNum2:x}))})}),n.length===0){if(t.isPointInside(e.points[0]))return new W(e.points.map(h=>i.fromObject(h)));if(e.isPointInside(t.points[0]))return new W(t.points.map(h=>i.fromObject(h)))}let r=new W(t.points);for(let h=r.points.length-1;h>=0;h-=1){let b=n.filter(p=>p.sideNum1===h);b.length>1&&b.sort((p,x)=>i.dist(r.points[h],p.intersectionPoint)-i.dist(r.points[h],x.intersectionPoint)),b.length>0&&r.points.splice(h+1,0,...b.map(p=>p.intersectionPoint))}let c=new W(e.points);for(let h=c.points.length-1;h>=0;h-=1){let b=n.filter(p=>p.sideNum2===h);b.length>1&&b.sort((p,x)=>i.dist(c.points[h],p.intersectionPoint)-i.dist(c.points[h],x.intersectionPoint)),b.length>0&&c.points.splice(h+1,0,...b.map(p=>p.intersectionPoint))}let l={polyNum:1,pointNum:0};for(let h=0;h<r.points.length;h+=1)if("isIntersectionPoint"in r.points[h]){l.pointNum=h;break}else if(c.isPointInside(r.points[h])){l.pointNum=h;break}let m=!1,d=[];for(;!m;){let h=l.polyNum===1?r:c,b=l.polyNum===1?c:r;if(d.push(i.fromObject(h.points[l.pointNum%h.points.length])),d.length>2&&d[0].x===d[d.length-1].x&&d[0].y===d[d.length-1].y){d.pop();break}if(d.length>r.points.length+c.points.length)break;"isIntersectionPoint"in h.points[l.pointNum%h.points.length]?"isIntersectionPoint"in h.points[(l.pointNum+1)%h.points.length]||b.isPointInside(h.points[(l.pointNum+1)%h.points.length])&&!("isIntersectionPoint"in h.points[(l.pointNum+1)%h.points.length])?l.pointNum+=1:(l.pointNum=b.points.indexOf(h.points[l.pointNum%h.points.length])+1,l.polyNum=l.polyNum===1?2:1):l.pointNum+=1}return new W(d)}static createCircle(t,e,n=25){let o=[...Array(n).keys()].map(a=>{let r=i.fromAngle(2*Math.PI*a/n);return r.setMag(t),r.add(e),r});return new W(o)}static fracture(t,e=500){return t.map((o,a)=>{let r=[];for(let l=0;l<t.length;l+=1)if(a!==l){let m=t[l],d=i.div(i.add(o,m),2),h=i.sub(o,m);h.rotate(Math.PI/2),r.push(new J(d,i.add(h,d)))}return r=r.filter((l,m)=>{let d=new T(l.a,o);for(let h=0;h<r.length;h+=1)if(m!==h&&J.intersectWithLineSegment(r[h],d))return!1;return!0}),r=r.sort((l,m)=>i.sub(l.a,l.b).heading-i.sub(m.a,m.b).heading),r.map((l,m)=>{let d=[];for(let b=0;b<r.length;b+=1)if(m!==b){let p=J.intersect(l,r[b]);p instanceof i&&d.push(p)}let h=i.sub(l.a,l.b);return d=d.filter(b=>{let p=i.sub(b,o);return h.setMag(1),i.dot(p,h)>0}),d.length===0&&d.push(i.add(i.mult(h,e*1.2),l.a)),d=d.sort((b,p)=>i.dist(b,o)-i.dist(p,o)),d[0]})}).filter(o=>o.length>=3).map(o=>new W(o))}},Lt=W;var $=class{constructor(){this.r=0,this.points=[new i(0,0)]}static Circle(t,e){let n=new $;return n.r=Math.abs(t),n.points[0]=e.copy,n}static Polygon(t){let e=new $;if(t.length<3)throw new Error("A polygon needs at least 3 points to be valid!");return e.points=new Lt(t).points.map(n=>i.fromObject(n)),e}getGeometricalData(){let t={center:this.points[0].copy,area:0,secondArea:0};if(this.r!==0)t.area=this.r*this.r*Math.PI,t.secondArea=.5*Math.PI*this.r**4;else{let e=[];for(let r=2;r<this.points.length;r+=1)e.push([this.points[0],this.points[r-1],this.points[r]]);let n=0,o=0,a=new i(0,0);e.forEach(r=>{let c=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),l=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),m=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),d=(c+l+m)/2,h=Math.sqrt(d*(d-c)*(d-l)*(d-m));n+=h,a.x+=h*(r[0].x+r[1].x+r[2].x)/3,a.y+=h*(r[0].y+r[1].y+r[2].y)/3}),a.div(n),t.center=a,t.area=n,e.forEach(r=>{let c=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),l=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),m=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),d=(c+l+m)/2,h=Math.sqrt(d*(d-c)*(d-l)*(d-m)),p=new J(r[1],r[2]).distFromPoint(r[0]),x=i.sub(r[2],r[1]);x.rotate90(),x.add(r[1]),c=new J(r[1],x).distFromPoint(r[0]);let y=(l*l*l*p-l*l*p*c+l*p*c*c+l*p*p*p)/36;y+=new i((r[0].x+r[1].x+r[2].x)/3,(r[0].y+r[1].y+r[2].y)/3).dist(t.center)**2*h,o+=y}),t.secondArea=o}return t}getMinMaxX(){let t=vt(this.points.map(e=>e.x));return t.min-=this.r,t.max+=this.r,t}getMinMaxY(){let t=vt(this.points.map(e=>e.y));return t.min-=this.r,t.max+=this.r,t}getMinMaxInDirection(t){let e=vt(this.points.map(n=>i.dot(n,t)));return e.min-=this.r,e.max+=this.r,e}move(t){this.points.forEach(e=>e.add(t))}rotateAround(t,e){this.points.forEach(n=>{n.sub(t)}),i.rotateArr(this.points,e),this.points.forEach(n=>{n.add(t)})}containsPoint(t){if(this.r!==0)return i.sub(t,this.points[0]).sqlength<=this.r*this.r;if(this.points.length===4){let n=new i(this.getMinMaxX().max+10,this.getMinMaxY().max+10),o=new T(t,n),a=0;return this.sides.forEach(r=>{T.intersect(r,o)&&(a+=1)}),a%2==1}return this.points.map((n,o)=>{let a=i.sub(this.points[(o+1)%this.points.length],n);return a.rotate90(),a}).every((n,o)=>i.dot(n,i.sub(t,this.points[o]))>=0)}get sides(){return this.points.map((t,e)=>new T(t,this.points[(e+1)%this.points.length]))}getClosestPoint(t){let e=this.points.map(r=>i.sub(r,t).sqlength),n=e[0],o=0,a=e.length;for(let r=1;r<a;r+=1)e[r]<n&&(n=e[r],o=r);return this.points[o].copy}static fromObject(t){let e=new $;return e.r=t.r,e.points=t.points.map(n=>i.fromObject(n)),e}get copy(){let t=new $;return t.r=this.r,t.points=this.points.map(e=>e.copy),t}},X=$;var Ot={white:"#faf3dd",green:"#02c39a",pink:"#e58c8a",blue:"#3db2f1",black:"#363732",Beige:"#f2f3d9",Independence:"#38405f",Turquoise:"#5dd9c1","Rich Black FOGRA 29":"#0e131f","Independence 2":"#59546c","Roman Silver":"#8b939c","Imperial Red":"#ff0035","Hot Pink":"#fc6dab","Maximum Yellow Red":"#f5b841","Lavender Web":"#dcd6f7"},S=Ot,ie=Ot.Turquoise,Q=Ot.Turquoise;var cs=15,ut=class{constructor(t,e=1,n=.2,o=.5){this.shape=t,this.k=n,this.fc=o;let a=this.shape.getGeometricalData();this.m=a.area*e,this.pos=a.center,this.am=a.secondArea*e,this.rotation=0,this.ang=0,this.vel=new i(0,0),this.layer=void 0,this.defaultAxes=[],this.axes=[],this.calculateAxes(),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()},this.minMaxes=[],this.calculateMinMaxes(),this.style=Q,this.texture="none",this.textureTransform={offset:new i(0,0),scale:1,rotation:0},this.textureRepeat="repeat"}calculateAxes(){let t=Math.cos(Math.PI/cs);this.defaultAxes=this.normals.map(e=>new i(e.x,Math.abs(e.y)));for(let e=this.defaultAxes.length-2;e>=0;e-=1)for(let n=this.defaultAxes.length-1;n>e;n-=1){let o=this.defaultAxes[n],a=this.defaultAxes[e];Math.abs(i.dot(o,a))>t&&(this.defaultAxes.splice(n,1),this.defaultAxes[e]=o)}this.axes=this.defaultAxes.map(e=>e.copy)}calculateMinMaxes(){this.minMaxes=this.axes.map(t=>this.shape.getMinMaxInDirection(t))}get normals(){if(this.shape.r!==0)return[new i(0,1)];let t=this.shape.points.map((e,n)=>i.sub(this.shape.points[(n+1)%this.shape.points.length],e));return t.forEach(e=>{e.rotate270(),e.normalize()}),t}move(t){this.shape.move(t),this.pos.add(t),this.boundingBox.x.max+=t.x,this.boundingBox.x.min+=t.x,this.boundingBox.y.max+=t.y,this.boundingBox.y.min+=t.y}rotate(t){this.rotation+=t,this.shape.r===0&&this.shape.rotateAround(this.pos,t),i.rotateArr(this.axes,t),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()}}velInPlace(t){let e=i.sub(t,this.pos);return e.rotate90(),e.mult(this.ang),e.add(this.vel),e}containsPoint(t){return this.shape.containsPoint(t)}get density(){return this.m/this.shape.getGeometricalData().area}set density(t){if(t<0||!Number.isFinite(t))return;let e=this.shape.getGeometricalData();this.m=e.area*t,this.am=e.secondArea*t}fixDown(){this.m=0}scaleAround(t,e){e!==0&&(this.pos.scaleAround(t,e),this.shape.points.forEach(n=>n.scaleAround(t,e)),this.shape.r=Math.abs(this.shape.r*e),this.m*=e**2,this.am*=e**4)}scaleAroundX(t,e){if(e===0)return;let{density:n}=this;this.shape.points.forEach(a=>a.scaleAroundX(t,e)),this.shape.r=Math.abs(this.shape.r*e);let o=this.shape.getGeometricalData();this.m=o.area*n,this.pos=o.center,this.am=o.secondArea*n,this.calculateAxes(),this.calculateMinMaxes()}scaleAroundY(t,e){if(e===0)return;let{density:n}=this;this.shape.points.forEach(a=>a.scaleAroundY(t,e)),this.shape.r=Math.abs(this.shape.r*e);let o=this.shape.getGeometricalData();this.m=o.area*n,this.pos=o.center,this.am=o.secondArea*n,this.calculateAxes(),this.calculateMinMaxes()}applyImpulse(t,e){if(this.m===0)return;let n=i.sub(t,this.pos);this.vel.add(i.div(e,this.m)),this.ang+=i.cross(n,e)/this.am}static detectCollision(t,e){let n=t,o=e;{let y=wt(n.boundingBox.x,o.boundingBox.x);if(y.max<y.min)return!1;let v=wt(n.boundingBox.y,o.boundingBox.y);if(v.max<v.min)return!1}let a=t.axes,r=e.axes;if(n.shape.r!==0){let y=o.shape.getClosestPoint(n.pos),v=i.sub(y,n.pos);v.normalize(),a=[v],n.minMaxes=[n.shape.getMinMaxInDirection(v)]}if(o.shape.r!==0){let y=n.shape.getClosestPoint(o.pos),v=i.sub(y,o.pos);v.normalize(),r=[v],o.minMaxes=[o.shape.getMinMaxInDirection(v)]}let c=[...a,...r],l=y=>n.shape.getMinMaxInDirection(y),m=y=>o.shape.getMinMaxInDirection(y),d=[];if(c.some((y,v)=>{let C;v<a.length?C=t.minMaxes[v]:C=l(y);let O;v>=a.length?O=e.minMaxes[v-a.length]:O=m(y);let P=wt(C,O);return P.max<P.min?!0:(d.push(P),!1)}))return!1;let h=d.map(y=>y.size()),b=h[0],p=0;for(let y=1;y<h.length;y+=1)b>h[y]&&(b=h[y],p=y);let x=c[p].copy;i.dot(x,i.sub(n.pos,o.pos))>0&&x.mult(-1);let g;if(p<a.length){let y=o.shape.points.map(v=>i.dot(v,x));g=o.shape.points[y.indexOf(Math.min(...y))].copy,o.shape.r!==0&&g.sub(i.mult(x,o.shape.r))}else{let y=n.shape.points.map(v=>i.dot(v,x));g=n.shape.points[y.indexOf(Math.max(...y))].copy,n.shape.r!==0&&g.add(i.mult(x,n.shape.r))}return{normal:x,overlap:b,contactPoint:g}}static fromObject(t){let e=Object.create(ut.prototype);return e.am=t.am,e.ang=t.ang,e.axes=t.axes.map(n=>i.fromObject(n)),e.boundingBox={x:new st(t.boundingBox.x.min,t.boundingBox.x.max),y:new st(t.boundingBox.y.min,t.boundingBox.y.max)},e.defaultAxes=t.defaultAxes.map(n=>i.fromObject(n)),e.fc=t.fc,e.k=t.k,e.layer=t.layer,e.m=t.m,e.pos=i.fromObject(t.pos),e.rotation=t.rotation,e.shape=X.fromObject(t.shape),e.style=t.style,e.vel=i.fromObject(t.vel),e.minMaxes=[],e.calculateMinMaxes(),e}get copy(){return ut.fromObject(this)}},k=ut;var oe=class{constructor(t,e){this.length=t,this.springConstant=e,this.pinned=!1,this.objects=[],this.rotationLocked=!1,this.initialHeading=0,this.initialOrientations=[0,0],this.attachPoints=[],this.attachRotations=[],this.attachPositions=[]}pinHere(t,e){this.pinned={x:t,y:e}}unpin(){this.pinned=!1}attachObject(t,e=void 0){let n=this.objects;n.push(t),e?this.attachPoints.push(e.copy):this.attachPoints.push(t.pos.copy),this.attachPositions.push(t.pos.copy),this.attachRotations.push(t.rotation),n.length===2&&(this.pinned=!1),n.length>=3&&(n=[n[n.length-2],n[n.length-1]],this.attachPoints=[this.attachPoints[this.attachPoints.length-2],this.attachPoints[this.attachPoints.length-1]],this.attachPositions=[this.attachPositions[this.attachPositions.length-2],this.attachPositions[this.attachPositions.length-1]],this.attachRotations=[this.attachRotations[this.attachRotations.length-2],this.attachRotations[this.attachRotations.length-1]])}updateAttachPoint0(t,e=0){let n=this.rotationLocked;n&&this.unlockRotation(),this.attachPoints[0]=t.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=e&&(this.attachPoints[0]=this.attachPositions[0].copy),n&&this.lockRotation()}updateAttachPoint1(t,e=0){let n=this.rotationLocked;n&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=t.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=e&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=t.copy),n&&this.lockRotation()}get points(){let t=this.objects.map((e,n)=>{let o=i.sub(this.attachPoints[n],this.attachPositions[n]);return o.rotate(e.rotation-this.attachRotations[n]),i.add(o,e.pos)});return typeof this.pinned!="boolean"&&t.push(i.fromObject(this.pinned)),t}lockRotation(){this.rotationLocked=!0,this.initialOrientations=this.objects.map(e=>e.rotation);let t=this.points;this.initialHeading=i.sub(t[1],t[0]).heading}unlockRotation(){this.rotationLocked=!1}arrangeOrientations(){let t=this.points,n=i.sub(t[1],t[0]).heading-this.initialHeading;this.objects.forEach((o,a)=>{let r=this.initialOrientations[a]+n;o.rotate(r-o.rotation)})}getAsSegment(){let t=this.points;return new T(t[0],t[1])}update(t){this.rotationLocked&&this.arrangeOrientations();let e,n;if(this.pinned instanceof Object&&this.objects[0]){[n,e]=[this.pinned,this.objects[0]];let o=this.points,a=new i(o[1].x-o[0].x,o[1].y-o[0].y),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*t),e.applyImpulse(o[1],a);let c=e.vel;if(c.rotate(-a.heading),this.rotationLocked&&e.m!==0){let l=new i(n.x,n.y),d=i.sub(e.pos,l).length,h=d*d*e.m+e.am,b=(e.am*e.ang-d*e.m*c.y)/h;c.y=-b*d,e.ang=b}c.rotate(a.heading)}else if(this.objects[0]&&this.objects[1]){[e,n]=[this.objects[0],this.objects[1]];let o=this.points,a=i.sub(o[0],o[1]),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*t),n.applyImpulse(o[1],a),a.mult(-1),e.applyImpulse(o[0],a),a=i.sub(e.pos,n.pos);let c=e.vel,l=n.vel;if(c.rotate(-a.heading),l.rotate(-a.heading),this.rotationLocked&&e.m!==0&&n.m!==0){let m=new i(e.pos.x*e.m+n.pos.x*n.m,e.pos.y*e.m+n.pos.y*n.m);m.div(e.m+n.m);let d=i.sub(e.pos,m),h=i.sub(n.pos,m),b=d.length,p=h.length,x=b*b*e.m+e.am+p*p*n.m+n.am,g=(c.y-l.y)*p/(b+p)+l.y,y=(e.am*e.ang+n.am*n.ang+b*e.m*(c.y-g)-p*n.m*(l.y-g))/x;c.y=y*b+g,l.y=-y*p+g,e.ang=y,n.ang=y}c.rotate(a.heading),l.rotate(a.heading)}}},E=oe;var ae=class extends E{constructor(t){super(t,0);this.springConstant=0}updateAttachPoint0(t,e=0){let n=this.rotationLocked;n&&this.unlockRotation(),this.attachPoints[0]=t.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=e&&(this.attachPoints[0]=this.attachPositions[0].copy),this.length=this.getAsSegment().length,n&&this.lockRotation()}updateAttachPoint1(t,e=0){let n=this.rotationLocked;n&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=t.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=e&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=t.copy),this.length=this.getAsSegment().length,n&&this.lockRotation()}update(){this.rotationLocked&&this.arrangeOrientations();let t,e;if(this.pinned instanceof Object&&"x"in this.pinned&&this.objects[0]){if([e,t]=[this.pinned,this.objects[0]],t.m===0)return;let n=this.points,o=new i(n[1].x-n[0].x,n[1].y-n[0].y);o.setMag(o.length-this.length),t.move(o),o=new i(n[1].x-n[0].x,n[1].y-n[0].y),o.normalize();let a=n[0],r=o,c=t,l=i.sub(a,c.pos),m=i.mult(c.velInPlace(a),-1),d=1/c.m;d+=i.dot(i.crossScalarFirst(i.cross(l,r)/c.am,l),r),d=-i.dot(m,r)/d;let h=i.sub(c.vel,i.mult(r,d/c.m)),b=c.ang-d*i.cross(l,r)/c.am;t.vel=h,t.ang=b;let p=t.vel;if(p.rotate(-o.heading),this.rotationLocked&&t.m!==0){let x=new i(e.x,e.y),y=i.sub(t.pos,x).length,v=y*y*t.m+t.am,C=(t.am*t.ang+y*t.m*p.y)/v;p.y=C*y,t.ang=C}p.rotate(o.heading)}else if(this.objects[0]&&this.objects[1]){[t,e]=[this.objects[0],this.objects[1]];let n=this.points,o=i.sub(n[0],n[1]),a=this.length-o.length;o.setMag(1);let r=t,c=e,l=r.m===0?Infinity:r.m,m=c.m===0?Infinity:c.m,d,h;if(l!==Infinity&&m!==Infinity)d=i.mult(o,a*m/(l+m)),h=i.mult(o,-a*l/(l+m));else if(l===Infinity&&m!==Infinity)d=new i(0,0),h=i.mult(o,-a);else if(l!==Infinity&&m===Infinity)h=new i(0,0),d=i.mult(o,a);else return;t.move(d),e.move(h),n=this.points,o=i.sub(n[1],n[0]),o.normalize();let b=o,p=n[0],x=n[1],g=r.ang,y=c.ang,v=i.sub(p,r.pos),C=i.sub(x,c.pos),O=r.m===0?Infinity:r.am,P=c.m===0?Infinity:c.am,U=r.velInPlace(p),A=c.velInPlace(x),q=i.sub(A,U),D=1/l+1/m;D+=i.dot(i.crossScalarFirst(i.cross(v,b)/O,v),b),D+=i.dot(i.crossScalarFirst(i.cross(C,b)/P,C),b),D=-i.dot(q,b)/D;let tt=i.sub(r.vel,i.mult(b,D/l)),lt=i.add(c.vel,i.mult(b,D/m)),ht=g-D*i.cross(v,b)/O,F=y+D*i.cross(C,b)/P;t.m!==0&&(t.vel=tt,t.ang=ht),e.m!==0&&(e.vel=lt,e.ang=F);let z=t.vel,N=e.vel;if(z.rotate(-o.heading),N.rotate(-o.heading),this.rotationLocked&&t.m!==0&&e.m!==0){let Rt=new i(t.pos.x*t.m+e.pos.x*e.m,t.pos.y*t.m+e.pos.y*e.m);Rt.div(t.m+e.m);let dt=i.sub(t.pos,Rt).length,et=i.sub(e.pos,Rt).length,rs=dt*dt*t.m+t.am+et*et*e.m+e.am,yt=(z.y-N.y)*et/(dt+et)+N.y,xt=(t.am*t.ang+e.am*e.ang+dt*t.m*(z.y-yt)-et*e.m*(N.y-yt))/rs;z.y=xt*dt+yt,N.y=-xt*et+yt,t.ang=xt,e.ang=xt}z.rotate(o.heading),N.rotate(o.heading)}}},R=ae;function ls(s,t,e,n){let o=n,a=e,r=s,c=t,l=r.vel,m=c.vel,d=r.ang,h=c.ang,b=i.sub(a,r.pos),p=i.sub(a,c.pos),x=r.am,g=c.am,y=r.m,v=c.m,C=(r.k+c.k)/2,O=(r.fc+c.fc)/2,P=r.velInPlace(a),U=c.velInPlace(a),A=i.sub(U,P),q=1/y+1/v;q+=i.dot(i.crossScalarFirst(i.cross(b,o)/x,b),o),q+=i.dot(i.crossScalarFirst(i.cross(p,o)/g,p),o),q=-((1+C)*i.dot(A,o))/q;let D=i.sub(l,i.mult(o,q/y)),tt=i.add(m,i.mult(o,q/v)),lt=d-q*i.cross(b,o)/x,ht=h+q*i.cross(p,o)/g,F=A.copy;if(F.sub(i.mult(o,i.dot(A,o))),F.setMag(1),i.dot(o,F)**2>.5)return[{dVel:i.sub(D,r.vel),dAng:lt-r.ang},{dVel:i.sub(tt,c.vel),dAng:ht-c.ang}];let z=1/y+1/v;z+=i.dot(i.crossScalarFirst(i.cross(b,F)/x,b),F),z+=i.dot(i.crossScalarFirst(i.cross(p,F)/g,p),F),z=-i.dot(A,F)/z;let N=Math.sign(z)*q*O;return Math.abs(N)>Math.abs(z)&&(N=z),D=i.sub(D,i.mult(F,N/y)),tt=i.add(tt,i.mult(F,N/v)),lt-=N*i.cross(b,F)/x,ht+=N*i.cross(p,F)/g,[{dVel:i.sub(D,r.vel),dAng:lt-r.ang},{dVel:i.sub(tt,c.vel),dAng:ht-c.ang}]}function re(s,t,e){let n=t,o=e,a=s,r=i.sub(n,a.pos),{am:c,m:l}=a,m=i.mult(a.velInPlace(n),-1),d=1/l;d+=i.dot(i.crossScalarFirst(i.cross(r,o)/c,r),o),d=-((1+a.k)*i.dot(m,o))/d;let h=i.sub(a.vel,i.mult(o,d/l)),b=a.ang-d*i.cross(r,o)/c,p=m.copy;if(p.sub(i.mult(o,i.dot(m,o))),p.setMag(1),i.dot(o,p)**2>.5)return{dVel:i.sub(h,a.vel),dAng:b-a.ang};let x=1/l;x+=i.dot(i.crossScalarFirst(i.cross(r,p)/c,r),p),x=-i.dot(m,p)/x;let g=Math.sign(x)*d*a.fc;return Math.abs(g)>Math.abs(x)&&(g=x),h=i.sub(h,i.mult(p,g/l)),b-=g*i.cross(r,p)/c,{dVel:i.sub(h,a.vel),dAng:b-a.ang}}function ce(s){let t=[],e=s.length,n=Array(e).fill(0),o=Array(e).fill(0),a=Array(e).fill(0),r=Array(e).fill(0),c=Array(e).fill(0),l=Array(e).fill(0);s.forEach(m=>m.calculateMinMaxes());for(let m=0;m<e-1;m+=1)for(let d=m+1;d<e;d+=1){let h=s[m],b=s[d];if(h.m===0&&b.m===0)continue;let p=k.detectCollision(h,b);if(p&&typeof p!="boolean"){let x=i.dot(h.velInPlace(p.contactPoint),p.normal),g=i.dot(b.velInPlace(p.contactPoint),p.normal);t.push({n:p.normal,cp:p.contactPoint});let y=-p.overlap,v=p.overlap;if(h.m===0){y=0;let P=re(b,p.contactPoint,i.mult(p.normal,-1));r[d]+=P.dVel.x,c[d]+=P.dVel.y,l[d]+=P.dAng,a[d]+=1}else if(b.m===0){v=0;let P=re(h,p.contactPoint,i.mult(p.normal,1));r[m]+=P.dVel.x,c[m]+=P.dVel.y,l[m]+=P.dAng,a[m]+=1}else{y*=b.m/(h.m+b.m),v*=h.m/(h.m+b.m);let[P,U]=ls(h,b,p.contactPoint,i.mult(p.normal,1));x>=g&&(r[m]+=P.dVel.x,c[m]+=P.dVel.y,l[m]+=P.dAng,r[d]+=U.dVel.x,c[d]+=U.dVel.y,l[d]+=U.dAng)}let C=i.mult(p.normal,y),O=i.mult(p.normal,v);n[m]+=C.x,n[d]+=O.x,o[m]+=C.y,o[d]+=O.y}}for(let m=0;m<e;m+=1){let d=s[m];if(d.m===0)continue;let h=Math.max(a[m],1);d.move(new i(n[m],o[m])),d.vel.add(new i(r[m]/h,c[m]/h)),d.ang+=l[m]/h}return t}var mt=class{constructor(){this.bodies=[],this.springs=[],this.airFriction=1,this.gravity=new i(0,0)}update(t){let e=[];for(let n=0;n<this.bodies.length;n+=1)this.bodies[n].move(new i(this.bodies[n].vel.x*t,this.bodies[n].vel.y*t)),this.bodies[n].rotate(this.bodies[n].ang*t);for(let n=0;n<3;n+=1)this.springs.forEach(o=>{o.update(t/3/2)});for(let n=0;n<this.bodies.length;n+=1)this.bodies[n].m!==0&&this.bodies[n].vel.add(new i(this.gravity.x*t,this.gravity.y*t));e=ce(this.bodies);for(let n=0;n<3;n+=1)this.springs.forEach(o=>{o.update(t/3/2)});return this.bodies.forEach(n=>{let o=n;n.m!==0&&(o.vel.mult(this.airFriction**t),o.ang*=this.airFriction**t)}),e}get copy(){let t=this.toJSON();return mt.fromObject(t)}setAirFriction(t){!Number.isFinite(t)||(this.airFriction=t,this.airFriction<0&&(this.airFriction=0),this.airFriction>1&&(this.airFriction=1))}setGravity(t){this.gravity=t.copy}addBody(t){this.bodies.push(t)}addSoftSquare(t,e,n,o,a=24,r=1){let c={sides:[],points:[]},l=Math.sqrt(e*e/Math.PI);c.points=[...new Array(a).keys()].map(h=>2*h*Math.PI/a).map(h=>i.add(i.mult(i.fromAngle(h),l),t)).map(h=>new k(X.Circle(Math.PI*l/a,h),1,.2,n)),c.sides=c.points.map((h,b)=>{let p=new R(1);return p.attachObject(h),p.attachObject(c.points[(b+1)%c.points.length]),b%2==0&&p.lockRotation(),p}),c.sides.forEach(h=>{let b=h;b.length=.96*4*e/a}),c.points.forEach(h=>{let b=h;b.vel=o.copy}),this.bodies.push(...c.points),this.springs.push(...c.sides);let m=e*e*200*r,d=new E(Math.sqrt(l*l*Math.PI),m/2);d.attachObject(c.points[0]),d.attachObject(c.points[a/2]),this.springs.push(d),d=new E(Math.sqrt(l*l*Math.PI),m/2),d.attachObject(c.points[a/4]),d.attachObject(c.points[3*a/4]),this.springs.push(d),d=new E(Math.sqrt(2*l*l*Math.PI),m),d.attachObject(c.points[a/8]),d.attachObject(c.points[5*a/8]),this.springs.push(d),d=new E(Math.sqrt(2*l*l*Math.PI),m),d.attachObject(c.points[3*a/8]),d.attachObject(c.points[7*a/8]),this.springs.push(d)}addRectWall(t,e,n,o){let a=[];a.push(new i(t-n/2,e-o/2)),a.push(new i(t+n/2,e-o/2)),a.push(new i(t+n/2,e+o/2)),a.push(new i(t-n/2,e+o/2)),this.bodies.push(new k(X.Polygon(a),0))}addRectBody(t,e,n,o,a,r,c=Q){let l=[];l.push(new i(t-n/2,e-o/2)),l.push(new i(t+n/2,e-o/2)),l.push(new i(t+n/2,e+o/2)),l.push(new i(t-n/2,e+o/2));let m=new k(X.Polygon(l),1,r,a);m.style=c,this.bodies.push(m)}addFixedBall(t,e,n){this.bodies.push(new k(X.Circle(n,new i(t,e)),0)),this.bodies[this.bodies.length-1].style=S.Beige}addSpring(t){this.springs.push(t)}getSpringsWithBody(t){return this.springs.filter(e=>e.objects.includes(t))}setBounds(t,e,n,o){let a=(r,c,l,m)=>{let d=[];return d.push(new i(r-l/2,c-m/2)),d.push(new i(r+l/2,c-m/2)),d.push(new i(r+l/2,c+m/2)),d.push(new i(r-l/2,c+m/2)),new k(X.Polygon(d),0)};this.bodies[0]=a(t-n,e,2*n,4*o),this.bodies[1]=a(t+2*n,e,2*n,4*o),this.bodies[2]=a(t,e-o,4*n,o*2),this.bodies[3]=a(t+n/2,e+2*o,5*n,2*o);for(let r=0;r<4;r+=1)this.bodies[r].style=S.Beige}getObjectAtCoordinates(t,e,n=0){let o=!1,a=new i(t,e);return this.bodies.some((r,c)=>r.containsPoint(a)&&c>=n?(o=r,!0):!1),o}removeObjFromSystem(t){let e=-1;if(t instanceof k&&(e=this.bodies.indexOf(t)),e!==-1){let n=this.getSpringsWithBody(this.bodies[e]);this.bodies.splice(e,1),n.forEach(o=>{this.removeObjFromSystem(o)});return}(t instanceof R||t instanceof E)&&(e=this.springs.indexOf(t)),e!==-1&&this.springs.splice(e,1)}getObjectIdentifier(t){return t instanceof k?{type:"body",index:this.bodies.indexOf(t)}:{type:"nothing",index:-1}}toJSON(){let t={};return t.airFriction=this.airFriction,t.gravity=this.gravity.toJSON(),t.bodies=this.bodies.map(e=>e.copy),t.springs=this.springs.map(e=>{let n={};return n.length=e.length,n.pinned=e.pinned,n.rotationLocked=e.rotationLocked,n.springConstant=e.springConstant,e instanceof E?n.type="spring":e instanceof R&&(n.type="stick"),n.objects=e.objects.map(o=>this.getObjectIdentifier(o)),n}),t}stickOrSpringFromObject(t){let e={};return t.type==="spring"?e=new E(t.length,t.springConstant):t.type==="stick"&&(e=new R(t.length)),e.pinned=t.pinned,e.rotationLocked=t.rotationLocked,e.objects=t.objects.map(n=>this.bodies[n.index]),e}static fromObject(t){let e=new mt;return e.bodies=t.bodies.map(n=>k.fromObject(n)),e.airFriction=t.airFriction,e.gravity=i.fromObject(t.gravity),e.springs=t.springs.map(n=>e.stickOrSpringFromObject(n)),e}};var nt=mt;var it,le,ft;function pt(s){le=s,s?ft.classList.add("bg-pink-darker"):ft.classList.remove("bg-pink-darker")}function Xt(s){it=s.getPhysics().toJSON(),ft=document.getElementById("set start"),pt(!1);let t=document.getElementById("pause");t&&(t.onclick=()=>{s.getTimeMultiplier()!==0?s.setTimeMultiplier(0):(s.setTimeMultiplier(1),le===!0&&(it=s.getPhysics().toJSON()),pt(!1))});let e=document.getElementById("revert");e&&(e.onclick=()=>{s.setTimeMultiplier(0),console.log(nt.fromObject(it)),s.setPhysics(nt.fromObject(it)),pt(!0)});let n=document.getElementById("clear all");n&&(n.onclick=()=>{pt(!0);let a=s.getPhysics();a.springs=[],a.bodies=[]}),ft&&(ft.onclick=()=>{it=s.getPhysics().toJSON(),console.log(it),pt(!0),s.setTimeMultiplier(0)});let o=!1;document.addEventListener("visibilitychange",()=>{document.hidden?s.getTimeMultiplier()!==0?(s.setTimeMultiplier(0),o=!0):o=!1:o&&s.setTimeMultiplier(1)})}function f(s,t,...e){let n=document.createElement(s);return t&&Object.entries(t).forEach(([o,a])=>{n[o]=a}),e&&e.forEach(o=>{typeof o=="string"?n.appendChild(document.createTextNode(o)):o instanceof HTMLElement&&n.appendChild(o)}),n}var he=document.createElement("template");he.innerHTML=`
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
`;var de=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(he.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",null,f("p",{className:"slider-label"},f("slot",null)),f("input",{id:"slider",type:"range",className:"slider"})))}get slider(){return this.shadowRoot.querySelector("#slider")}set min(t){this.slider.min=t}set max(t){this.slider.max=t}set step(t){this.slider.step=t}set value(t){this.slider.value=t}set onChange(t){this.slider.onchange=e=>t(e.target.valueAsNumber),this.slider.oninput=e=>t(e.target.valueAsNumber)}};window.customElements.define("range-slider",de);var ue=document.createElement("template");ue.innerHTML=`
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
`;var me=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ue.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",null,f("label",{htmlFor:"colorWell",className:"picker-label"},f("div",null,f("slot",null)),f("input",{type:"color",id:"colorWell"}))))}get picker(){return this.shadowRoot.querySelector("#colorWell")}set value(t){this.picker.value=t,this.picker.style["background-color"]=t}set onChange(t){let e=n=>{t(n.target.value),this.picker.style["background-color"]=n.target.value};this.picker.onchange=e,this.picker.oninput=e}};window.customElements.define("color-picker",me);var kt=35,Yt=.5,Ft=1.5,Dt=ie,fe=document.createElement("div"),hs={name:"Ball creator",description:"",element:fe,drawFunc(s,t){let e=s.cnv.getContext("2d");e.strokeStyle="black",e.beginPath(),e.arc(s.mouseX,s.mouseY,kt,0,2*Math.PI),e.stroke(),s.lastX!==0&&s.lastY!==0&&(e.beginPath(),e.moveTo(s.mouseX,s.mouseY),e.lineTo(s.lastX,s.lastY),e.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let t=new k(X.Circle(kt,new i(s.lastX,s.lastY)),1,Yt,Ft);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=Dt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};fe.append(f("range-slider",{min:5,max:120,step:1,value:kt,onChange:s=>{kt=s}},"Size"),f("range-slider",{min:0,max:1,step:.02,value:Yt,onChange:s=>{Yt=s}},"Bounciness"),f("range-slider",{min:0,max:2,step:.1,value:Ft,onChange:s=>{Ft=s}},"Coefficient of friction"),f("color-picker",{value:Dt,onChange:s=>{Dt=s}},"Color:"));var pe=hs;var ds=document.createElement("div"),us={name:"Delete",description:"",element:ds,drawFunc(s,t){},startInteractionFunc(s){s.choosed&&typeof s.choosed!="boolean"&&s.choosed instanceof k&&s.physics.removeObjFromSystem(s.choosed)}},be=us;var ge=0,ye=0,ms=document.createElement("div"),fs={name:"Move",description:"",element:ms,drawFunc(s,t){let{choosed:e}=s;e instanceof k&&e.m!==0&&(e.move(new i(s.mouseX-e.pos.x,s.mouseY-e.pos.y)),t===0?(e.vel.x=0,e.vel.y=0):(e.vel.x=(s.mouseX-ge)/t,e.vel.y=(s.mouseY-ye)/t),e.ang=0),ge=s.mouseX,ye=s.mouseY},startInteractionFunc(s){let{choosed:t}=s;if(t instanceof k&&t.m!==0){let e=s;e.cnv.style.cursor="grabbing"}},endInteractionFunc(s){let{choosed:t}=s;if(t instanceof k&&t.m!==0){let e=s;e.cnv.style.cursor="grab"}},activated(s){let t=s;t.cnv.style.cursor="grab"},deactivated(s){let t=s;t.cnv.style.cursor="default"}},xe=fs;var ps=document.createElement("div"),bs={name:"Rectangle wall",description:"",element:ps,drawFunc(s,t){if(s.lastX!==0&&s.lastY!==0){let e=s.cnv.getContext("2d");e.strokeStyle="black",e.strokeRect(s.mouseX,s.mouseY,s.lastX-s.mouseX,s.lastY-s.mouseY)}},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){if(Math.abs(s.lastX-s.mouseX)<5&&Math.abs(s.lastY-s.mouseY)<5)return;s.physics.addRectWall(s.lastX/2+s.mouseX/2,s.lastY/2+s.mouseY/2,2*Math.abs(s.lastX/2-s.mouseX/2),2*Math.abs(s.lastY/2-s.mouseY/2));let t=s;t.physics.bodies[t.physics.bodies.length-1].style=S.Beige}}},ve=bs;var zt=.2,Nt=.5,jt=Q,we=document.createElement("div"),gs={name:"Rectangle body",description:"",element:we,drawFunc(s,t){let e=s.cnv.getContext("2d");s.lastX!==0&&s.lastY!==0&&(e.strokeStyle="black",e.strokeRect(s.mouseX,s.mouseY,s.lastX-s.mouseX,s.lastY-s.mouseY))},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let t=Math.abs(s.mouseX-s.lastX),e=Math.abs(s.mouseY-s.lastY);if(t/e>50||e/t>50||e===0||t===0)return;s.physics.addRectBody(s.lastX/2+s.mouseX/2,s.lastY/2+s.mouseY/2,2*Math.abs(s.lastX/2-s.mouseX/2),2*Math.abs(s.lastY/2-s.mouseY/2),Nt,zt,jt)}},keyGotUpFunc(s){},keyGotDownFunc(s){}};we.append(f("range-slider",{min:0,max:.6,step:.02,value:zt,onChange:s=>{zt=s}},"Bounciness"),f("range-slider",{min:0,max:2,step:.1,value:Nt,onChange:s=>{Nt=s}},"Coefficient of friction"),f("color-picker",{value:jt,onChange:s=>{jt=s}},"Color:"));var ke=gs;var Mt=35,Ht=.5,qt=.5,St=4,Pt=24,Vt=Q,Me=document.createElement("div");function Se(s=24,t=4){return[...new Array(s).keys()].map(e=>i.fromAnglePNorm(Math.PI*2*e/s,t))}var ys={name:"Squircle creator",description:"",element:Me,drawFunc(s,t){let e=s.cnv.getContext("2d");e.strokeStyle="black";let n=Se(Pt,St);n.forEach(o=>o.mult(Mt)),e.beginPath(),e.moveTo(s.mouseX+n[0].x,s.mouseY+n[0].y);for(let o=1;o<n.length;o+=1)e.lineTo(s.mouseX+n[o].x,s.mouseY+n[o].y);e.closePath(),e.stroke(),s.mouseDown&&(e.beginPath(),e.moveTo(s.mouseX,s.mouseY),e.lineTo(s.lastX,s.lastY),e.stroke())},startInteractionFunc(s){},endInteractionFunc(s){let t=Se(Pt,St),e=new i(s.lastX,s.lastY);if(t.forEach(n=>{n.mult(Mt),n.add(e)}),s.lastX!==0&&s.lastY!==0){let n=new k(X.Polygon(t),1,Ht,qt);n.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),n.style=Vt,s.physics.addBody(n)}}};Me.append(f("range-slider",{min:5,max:120,step:1,value:Mt,onChange:s=>{Mt=s}},"Size"),f("range-slider",{min:2,max:7,step:1,value:9-St,onChange:s=>{St=9-s}},"Roundness"),f("range-slider",{min:12,max:36,step:1,value:Pt,onChange:s=>{Pt=s}},"Resolution"),f("range-slider",{min:0,max:.9,step:.02,value:Ht,onChange:s=>{Ht=s}},"Bounciness"),f("range-slider",{min:0,max:2,step:.1,value:qt,onChange:s=>{qt=s}},"Coefficient of friction"),f("color-picker",{value:Vt,onChange:s=>{Vt=s}},"Color:"));var Pe=ys;var j=35;var Wt=1.5,Gt=24,Ut=1,Ie=document.createElement("div"),xs={name:"Soft square creator",description:"",element:Ie,drawFunc(s,t){let e=s.cnv.getContext("2d");e.strokeStyle="black",e.beginPath(),e.moveTo(s.mouseX-j,s.mouseY-j),e.lineTo(s.mouseX+j,s.mouseY-j),e.lineTo(s.mouseX+j,s.mouseY+j),e.lineTo(s.mouseX-j,s.mouseY+j),e.lineTo(s.mouseX-j,s.mouseY-j),e.stroke(),s.lastX!==0&&s.lastY!==0&&(e.beginPath(),e.moveTo(s.mouseX,s.mouseY),e.lineTo(s.lastX,s.lastY),e.stroke())},startInteractionFunc(s){},endInteractionFunc(s){s.lastX!==0&&s.lastY!==0&&s.physics.addSoftSquare(new i(s.lastX,s.lastY),j*2,Wt,new i(s.lastX-s.mouseX,s.lastY-s.mouseY),Gt,Ut)}};Ie.append(f("range-slider",{min:5,max:100,step:1,value:j,onChange:s=>{j=s}},"Size"),f("range-slider",{min:.4,max:3,step:.1,value:Ut,onChange:s=>{Ut=s}},"Pressure"),f("range-slider",{min:0,max:2,step:.1,value:Wt,onChange:s=>{Wt=s}},"Coefficient of friction"),f("range-slider",{min:16,max:48,step:8,value:Gt,onChange:s=>{Gt=s}},"Resolution"));var Ce=xs;var Ee=document.createElement("template");Ee.innerHTML=`
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
`;var Be=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Ee.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",{className:"cursor-pointer"},f("label",{htmlFor:"cbIdentifier",className:"checkbox-label"},f("input",{type:"checkbox",className:"ch-box",id:"cbIdentifier"}),f("div",{className:"checkbox-display"}),f("div",{className:"label-text"},f("slot",null))))),this.shadowRoot.querySelector(".checkbox-display").innerHTML='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.877px" height="101.052px" viewBox="0 0 122.877 101.052" id="checkmark-svg" enable-background="new 0 0 122.877 101.052" xml:space="preserve"><g><path d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"/></g></svg>',this.shadowRoot.querySelector("#checkmark-svg").classList.add("checkmark")}get checkbox(){return this.shadowRoot.querySelector("#cbIdentifier")}set checked(t){this.checkbox.checked=t}set onChange(t){this.checkbox.onchange=e=>t(e.target.checked)}};window.customElements.define("check-box",Be);var Jt=!1,bt=1e4,Te=document.createElement("div"),vs={name:"Spring creator",description:"",element:Te,drawFunc(s,t){let e=s.cnv.getContext("2d");s.lastX!==0&&s.lastY!==0&&(e.strokeStyle="black",e.beginPath(),e.moveTo(s.mouseX,s.mouseY),e.lineTo(s.lastX,s.lastY),e.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let t=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY),e,n=E;if(typeof t=="boolean"&&(t={x:s.mouseX,y:s.mouseY,pinPoint:!0}),s.choosed===t||s.choosed===void 0&&t===void 0||s.choosed instanceof Object&&t instanceof Object&&"pinPoint"in s.choosed&&"pinPoint"in t||(s.choosed instanceof Object&&t instanceof Object&&"pinPoint"in s.choosed&&"pos"in t?(e=new n(Math.sqrt((s.choosed.x-t.pos.x)**2+(s.choosed.y-t.pos.y)**2),bt),e.attachObject(t),e.pinHere(s.choosed.x,s.choosed.y)):t instanceof Object&&s.choosed instanceof Object&&"pos"in s.choosed&&"pinPoint"in t?(e=new n(Math.sqrt((s.choosed.pos.x-t.x)**2+(s.choosed.pos.y-t.y)**2),bt),e.attachObject(s.choosed),e.pinHere(t.x,t.y)):s.choosed instanceof Object&&t instanceof Object&&"pos"in s.choosed&&"pos"in t&&(e=new n(Math.sqrt((s.choosed.pos.x-t.pos.x)**2+(s.choosed.pos.y-t.pos.y)**2),bt),e.attachObject(s.choosed),e.attachObject(t)),typeof e=="undefined"))return;s.physics.addSpring(e),Jt&&e.lockRotation()}}};Te.append(f("check-box",{checked:Jt,onChange:s=>{Jt=s}},"Lock rotation"),f("range-slider",{min:2e3,max:1e5,value:bt,step:200,onChange:s=>{bt=s}},"Spring stiffness"));var Re=vs;var Qt=!1,_t=document.createElement("div"),ws={name:"Stick creator",description:"",element:_t,drawFunc(s,t){let e=s.cnv.getContext("2d");s.lastX!==0&&s.lastY!==0&&(e.strokeStyle="black",e.beginPath(),e.moveTo(s.mouseX,s.mouseY),e.lineTo(s.lastX,s.lastY),e.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let t=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY),e,n=R;if(typeof t=="boolean"&&(t={x:s.mouseX,y:s.mouseY,pinPoint:!0}),typeof s.choosed=="boolean"||s.choosed===t||s.choosed===void 0&&t===void 0||"pinPoint"in s.choosed&&"pinPoint"in t||("pinPoint"in s.choosed&&"pos"in t?(e=new n(Math.sqrt((s.choosed.x-t.pos.x)**2+(s.choosed.y-t.pos.y)**2)),e.attachObject(t),e.pinHere(s.choosed.x,s.choosed.y)):"pinPoint"in t&&"pos"in s.choosed?(e=new n(Math.sqrt((s.choosed.pos.x-t.x)**2+(s.choosed.pos.y-t.y)**2)),e.attachObject(s.choosed),e.pinHere(t.x,t.y)):"pos"in s.choosed&&"pos"in t&&(e=new n(Math.sqrt((s.choosed.pos.x-t.pos.x)**2+(s.choosed.pos.y-t.pos.y)**2)),e.attachObject(s.choosed),e.attachObject(t)),typeof e=="undefined"))return;s.physics.addSpring(e),Qt&&e.lockRotation()}},keyGotUpFunc(s){},keyGotDownFunc(s){}};[f("check-box",{checked:Qt,onChange:s=>{Qt=s}},"Lock rotation")].forEach(_t.appendChild.bind(_t));var Le=ws;var It=20,Oe=document.createElement("div"),ks={name:"Wall drawer",description:"",element:Oe,drawFunc(s,t){let e=s.cnv.getContext("2d");e.strokeStyle="black",e.beginPath(),e.arc(s.mouseX,s.mouseY,It,0,2*Math.PI),e.stroke(),s.lastX!==0&&s.lastY!==0&&s.physics.addFixedBall(s.mouseX,s.mouseY,It)}};Oe.append(f("range-slider",{min:5,max:70,step:1,value:It,onChange:s=>{It=s}},"Size"));var Xe=ks;var Ye=document.createElement("template");Ye.innerHTML=`
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
`;var Fe=class extends HTMLElement{constructor(){super();this.minNum=0,this.maxNum=0,this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Ye.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",{id:"mainContainer"},f("p",{className:"slider-label"},f("slot",null)),f("input",{id:"slider",type:"range",className:"slider"}),f("input",{id:"number-input",type:"number",className:"number"})))}get slider(){return this.shadowRoot.querySelector("#slider")}get numInput(){return this.shadowRoot.querySelector("#number-input")}set min(t){this.slider.min=t,this.numInput.min=t,this.minNum=t}set max(t){this.slider.max=t,this.numInput.max=t,this.maxNum=t}set step(t){this.slider.step=t,this.numInput.step=t}set value(t){this.slider.value=t,this.numInput.value=t}normalizeValue(t){return Math.min(Math.max(this.minNum,t),this.maxNum)}disable(){this.shadowRoot.querySelector("#mainContainer").classList.add("disabled")}enable(){this.shadowRoot.querySelector("#mainContainer").classList.remove("disabled")}set onChange(t){this.slider.onchange=e=>{let n=this.normalizeValue(e.target.valueAsNumber).toString();t(Number.parseFloat(n)),this.value=n},this.slider.oninput=e=>{let n=this.normalizeValue(e.target.valueAsNumber).toString();t(Number.parseFloat(n)),this.value=n},this.numInput.onchange=e=>{let n=this.normalizeValue(e.target.valueAsNumber).toString();t(Number.parseFloat(n)),this.value=n}}};window.customElements.define("range-slider-number",Fe);var Ms=document.createElement("div"),Ss={name:"World settings",description:"",element:Ms,init(s){let t=s;this.element.append(f("range-slider",{min:0,max:5e3,step:200,value:t.physics.gravity.y,onChange:e=>{t.physics.gravity.y=e}},"Gravity"),f("range-slider",{min:-5e3,max:5e3,step:1e3,value:t.physics.gravity.x,onChange:e=>{t.physics.gravity.x=e}},"Gravity in X direction"),f("range-slider",{min:0,max:.99,step:.01,value:1-t.physics.airFriction,onChange:e=>{t.physics.setAirFriction(1-e)}},"Air friction"),f("range-slider-number",{min:700,max:1e4,step:10,value:t.worldSize.width,onChange:e=>{t.setWorldSize({width:e,height:t.worldSize.height})}},"World width"),f("range-slider-number",{min:700,max:5e3,step:10,value:t.worldSize.height,onChange:e=>{t.setWorldSize({width:t.worldSize.width,height:e})}},"World height"),f("check-box",{checked:t.drawCollisions,onChange:e=>{t.drawCollisions=e}},"Show collision data"),f("check-box",{checked:t.showAxes,onChange:e=>{t.showAxes=e}},"Show body axes"),f("check-box",{checked:t.showBoundingBoxes,onChange:e=>{t.showBoundingBoxes=e}},"Show boounding boxes"))}},De=Ss;var ze=document.createElement("template");ze.innerHTML=`
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
`;var Ne=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ze.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",{className:"number-label"},f("span",null,f("slot",null)),f("span",{id:"numberPlace"})))}set value(t){this.shadowRoot.querySelector("#numberPlace").innerText=t}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}};window.customElements.define("number-display",Ne);var je=document.createElement("template");je.innerHTML=`
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
`;var He=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(je.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",{className:"number-label"},f("span",null,f("slot",null)),f("div",{id:"indicatorContainer"},f("hr",{id:"rotationIndicator"})),f("span",null,"\xA0"),f("span",{id:"numberPlace"}),f("span",{id:"symbolPlace"},"\xB0")))}set value(t){let e=t*180/Math.PI%360;this.shadowRoot.querySelector("#numberPlace").innerText=Math.abs(e).toFixed(),this.shadowRoot.querySelector("#rotationIndicator").style.transform=`translateY(-0.1em) rotate(${e}deg)`}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}hideNumber(){this.shadowRoot.querySelector("#numberPlace").classList.add("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.add("hidden")}showNumber(){this.shadowRoot.querySelector("#numberPlace").classList.remove("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.remove("hidden")}};window.customElements.define("angle-display",He);var qe=document.createElement("template");qe.innerHTML=`
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
`;var Ve=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(qe.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",{id:"btn"},f("slot",null))),this.hidden=!1}set bgColor(t){this.btn.style.backgroundColor=t}set textColor(t){this.btn.style.color=t}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(t){this.btn.onclick=t}smallMargin(){this.btn.style.marginTop="0.2em"}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}};window.customElements.define("button-btn",Ve);var We=document.createElement("template");We.innerHTML=`
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
`;var Ge=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(We.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",null,f("input",{type:"file",id:"inputEl",name:"inputEl"}),f("label",{id:"inputLabel",htmlFor:"inputEl"},f("slot",null))))}get input(){return this.shadowRoot.getElementById("inputEl")}set accept(t){this.input.accept=t}set onFile(t){let e=n=>{n.target.files.length!==0&&t(n.target.files[0])};this.input.onchange=e}};window.customElements.define("file-input",Ge);var Ue=document.createElement("template");Ue.innerHTML=`
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
`;var Je=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Ue.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",{id:"container"},f("div",{id:"apply",className:"btn"},"Apply"),f("div",{id:"cancel",className:"btn"}," Cancel")))}set visible(t){if(t){let e=this.containerElement;e.style.display!=="flex"&&(e.style.display="flex")}else{let e=this.containerElement;e.style.display!=="none"&&(e.style.display="none")}}get containerElement(){return this.shadowRoot.getElementById("container")}get applyBtn(){return this.shadowRoot.getElementById("apply")}get cancelBtn(){return this.shadowRoot.getElementById("cancel")}set onApply(t){this.applyBtn.onclick=t}set onCancel(t){this.cancelBtn.onclick=t}};window.customElements.define("apply-cancel",Je);var Qe=document.createElement("template");Qe.innerHTML=`
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
`;var _e=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Qe.content.cloneNode(!0)),this.shadowRoot.appendChild(f("div",null,f("span",null,f("slot",null)),f("ul",{id:"listHolder",className:"dropdown"})))}set entries(t){this.entryList=t;let{listHolder:e}=this;e.innerHTML="",e.append(...this.entryList.map(n=>f("li",{innerText:n})))}set value(t){this.listHolder.childNodes.forEach(e=>{"classList"in e&&(e.innerText===t?e.classList.add("chosen"):e.classList.remove("chosen"))})}get listHolder(){return this.shadowRoot.getElementById("listHolder")}set onChoice(t){let e=o=>{t(o.target.innerText),this.listHolder.classList.add("hidden"),this.listHolder.childNodes.forEach(a=>{"classList"in a&&(a.innerText===o.target.innerText?a.classList.add("chosen"):a.classList.remove("chosen"))}),setTimeout(()=>{this.listHolder.classList.remove("hidden")},20)},n=this.listHolder;this.listHolder.childNodes.forEach(o=>{let a=o.cloneNode(!0);a.addEventListener("click",e),n.replaceChild(a,o)})}};window.customElements.define("drop-down",_e);var _=7,K=6.5,Kt=8,$t=25,ot=7,Ke=8,Ct=7,$e=7,Zt=23,at=30,u=!1,w=!1,Z=document.createElement("div"),Y,H=!1,rt=1,M=new i(0,0),gt=0,At="repeat",V=0,B=1,ct={body:!0,spring:!0};function Et(){Z.innerHTML="",H=!1,Z.append(f("number-display",{value:""},"Selectable types:"),f("check-box",{checked:ct.body,onChange:s=>{ct.body=s}},"Body"),f("check-box",{checked:ct.spring,onChange:s=>{ct.spring=s}},"Stick/Spring"))}var L="none";function Ze(s){return ct.body?s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY,4):!1}function Bt(s){if(typeof H!="boolean"){let t=new i(s.mouseX,s.mouseY);return M.dist(t)<=Ke?"move-texture":new i(M.x,M.y-Zt).dist(t)<=Ct?"rotate-texture":new i(M.x+at,M.y+at).dist(t)<=$e?"scale-texture-xy":"choose-texture"}if(s.timeMultiplier!==0&&!(u instanceof k&&u.m===0))return"none";if(u instanceof k){let t=u.boundingBox,e=new i(t.x.min,t.y.min),n=new i(t.x.max,t.y.min),o=new i(t.x.min,t.y.max),a=new i(t.x.max,t.y.max),r=i.add(i.lerp(n,e,.5),new i(0,-$t)),c=new i(s.mouseX,s.mouseY);if(i.dist(r,c)<=Kt)return"rotate";if(i.dist(o,c)<=_)return"resize-bl";if(i.dist(a,c)<=_)return"resize-br";if(i.dist(e,c)<=_)return"resize-tl";if(i.dist(n,c)<=_)return"resize-tr";if(i.dist(i.lerp(n,e,.5),c)<=K)return"resize-t";if(i.dist(i.lerp(a,o,.5),c)<=K)return"resize-b";if(i.dist(i.lerp(e,o,.5),c)<=K)return"resize-l";if(i.dist(i.lerp(n,a,.5),c)<=K)return"resize-r";if(c.x>=e.x&&c.y>=e.y&&c.x<=a.x&&c.y<=a.y)return"move"}else if(typeof w!="boolean"){let t=w.points,e=new i(s.mouseX,s.mouseY);if(t[0].dist(e)<=ot)return"move-spring0";if(t[1].dist(e)<=ot)return"move-spring1"}return"none"}function Ps(s){if(!(u instanceof k))return;let t=u.boundingBox,e=new i(t.x.min,t.y.min),n=new i(t.x.max,t.y.min),o=new i(t.x.min,t.y.max),a=new i(t.x.max,t.y.max);B=1,s==="rotate"&&(V=u.rotation),s==="resize-bl"&&(V=i.sub(o,n).heading),s==="resize-br"&&(V=i.sub(a,e).heading),s==="resize-tl"&&(V=i.sub(e,a).heading),s==="resize-tr"&&(V=i.sub(n,o).heading),s==="resize-t"&&(V=new i(0,-1).heading),s==="resize-b"&&(V=new i(0,1).heading),s==="resize-l"&&(V=new i(-1,0).heading),s==="resize-r"&&(V=new i(1,0).heading),s==="rotate-texture"&&(V=Math.PI)}function te(s){if(typeof u!="boolean"){let t=new i(s.mouseX,s.mouseY),e=new i(s.oldMouseX,s.oldMouseY),n=i.sub(e,u.pos),o=i.sub(t,u.pos),a=u.boundingBox,r=new i(a.x.min,a.y.min),c=new i(a.x.max,a.y.min),l=new i(a.x.min,a.y.max),m=new i(a.x.max,a.y.max),d=i.lerp(r,c,.5),h=i.lerp(l,m,.5),b=i.lerp(m,c,.5),p=i.lerp(l,r,.5),x=i.fromAngle(V),g=1;switch(L){case"move":u.move(new i(s.mouseX-s.oldMouseX,s.mouseY-s.oldMouseY));break;case"rotate":u.rotate(o.heading-n.heading);break;case"resize-bl":g=i.dot(x,i.sub(t,c))/i.dot(x,i.sub(e,c)),g*B>=.03?(u.scaleAround(c,g),B*=g):L="none";break;case"resize-br":g=i.dot(x,i.sub(t,r))/i.dot(x,i.sub(e,r)),g*B>=.03?(u.scaleAround(r,g),B*=g):L="none";break;case"resize-tl":g=i.dot(x,i.sub(t,m))/i.dot(x,i.sub(e,m)),g*B>=.03?(u.scaleAround(m,g),B*=g):L="none";break;case"resize-tr":g=i.dot(x,i.sub(t,l))/i.dot(x,i.sub(e,l)),g*B>=.03?(u.scaleAround(l,g),B*=g):L="none";break;case"resize-t":g=i.dot(x,i.sub(t,h))/i.dot(x,i.sub(e,h)),g*B>=.1?(u.scaleAroundY(h,g),B*=g):L="none";break;case"resize-b":g=i.dot(x,i.sub(t,d))/i.dot(x,i.sub(e,d)),g*B>=.1?(u.scaleAroundY(d,g),B*=g):L="none";break;case"resize-l":g=i.dot(x,i.sub(t,b))/i.dot(x,i.sub(e,b)),g*B>=.1?(u.scaleAroundX(b,g),B*=g):L="none";break;case"resize-r":g=i.dot(x,i.sub(t,p))/i.dot(x,i.sub(e,p)),g*B>=.1?(u.scaleAroundX(p,g),B*=g):L="none";break;default:break}}else if(typeof w!="boolean"){let t=new i(s.mouseX,s.mouseY);switch(L){case"move-spring0":w.updateAttachPoint0(t,ot);break;case"move-spring1":w.updateAttachPoint1(t,ot);break;default:break}}if(typeof H!="boolean"&&typeof u!="boolean"){let t=new i(s.mouseX,s.mouseY),e=new i(s.oldMouseX,s.oldMouseY),n=i.sub(t,M),o=i.sub(e,M),a=new i(1,1);switch(L){case"move-texture":M.x=s.mouseX,M.y=s.mouseY;break;case"scale-texture-xy":rt*=i.dot(n,a)/i.dot(o,a),rt*=i.dot(n,a)/i.dot(o,a);break;case"rotate-texture":gt+=n.heading-o.heading;break;default:break}}}var Ae="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAyklEQVQ4T6XST0qCQRjH8Y8JBnoCr9DGjXQBEbqDm6QQgvZeoX0bQVy7cRtBeIPcewi3bYLKeF6mmAZBeZvN8Pz5PvOb53ka/p4mHnGDVgp9YIVrvCdft5FxV3guCpXmBD1sfsAhXrKseOUVcV/ivKgwDvAMn1ngFosisVRTgQ+YpsQ7zA7IjX/fZ/4KfEMHX4jmlKePUeFcBrhPzi0ujjTnN/wv8JjUXMQO7fjWqc0JeIB1qvJUdxydOgtQjazOys1Dbg6GfeqS+wZwAS6Pac4meQAAAABJRU5ErkJggg==') 6.5 6.5, auto",ee={none:"default",move:"move",rotate:Ae,"resize-bl":"nesw-resize","resize-br":"nwse-resize","resize-tl":"nwse-resize","resize-tr":"nesw-resize","resize-t":"ns-resize","resize-b":"ns-resize","resize-l":"ew-resize","resize-r":"ew-resize","move-spring0":"move","move-spring1":"move","move-texture":"move","rotate-texture":Ae,"scale-texture-xy":"nwse-resize","choose-texture":"default"};function ts(s){if(!ct.spring)return!1;let t=new i(s.mouseX,s.mouseY),e=s.physics.springs.find(n=>n.getAsSegment().distFromPoint(t)<=ot);return typeof e=="undefined"?!1:e}function Is(s,t){if(u instanceof k)if(L!=="rotate"){s.strokeStyle=S["Roman Silver"],s.setLineDash([5,3.5]),s.strokeRect(u.boundingBox.x.min,u.boundingBox.y.min,u.boundingBox.x.max-u.boundingBox.x.min,u.boundingBox.y.max-u.boundingBox.y.min),s.beginPath(),s.moveTo(u.boundingBox.x.max/2+u.boundingBox.x.min/2,u.boundingBox.y.min),s.lineTo(u.boundingBox.x.max/2+u.boundingBox.x.min/2,u.boundingBox.y.min-$t),s.stroke(),s.fillStyle=S.blue,s.beginPath(),s.arc(u.boundingBox.x.min,u.boundingBox.y.min,_,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(u.boundingBox.x.min,u.boundingBox.y.max,_,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(u.boundingBox.x.max,u.boundingBox.y.min,_,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(u.boundingBox.x.max,u.boundingBox.y.max,_,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(u.boundingBox.x.min,u.boundingBox.y.min/2+u.boundingBox.y.max/2,K,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(u.boundingBox.x.max,u.boundingBox.y.min/2+u.boundingBox.y.max/2,K,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(u.boundingBox.x.max/2+u.boundingBox.x.min/2,u.boundingBox.y.max,K,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(u.boundingBox.x.max/2+u.boundingBox.x.min/2,u.boundingBox.y.min,K,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(u.boundingBox.x.max/2+u.boundingBox.x.min/2,u.boundingBox.y.min-$t,Kt,0,Math.PI*2),s.fill();let e=Bt(t),n=ee[e],o=t.cnv.style;o.cursor!==n&&(o.cursor=n)}else s.strokeStyle=S["Roman Silver"],s.setLineDash([5,3.5]),s.beginPath(),s.moveTo(u.pos.x,u.pos.y),s.lineTo(t.mouseX,t.mouseY),s.stroke(),s.fillStyle=S.blue,s.beginPath(),s.arc(t.mouseX,t.mouseY,Kt,0,Math.PI*2),s.fill()}function Cs(s,t){if(typeof w!="boolean"){let e=w.points;s.fillStyle=S.blue,s.beginPath(),e.forEach(r=>{s.arc(r.x,r.y,ot,0,Math.PI*2)}),s.fill();let n=Bt(t),o=ee[n],a=t.cnv.style;a.cursor!==o&&(a.cursor=o)}}function Es(s){let t=ts(s);if(typeof t!="boolean"){Z.innerHTML="",w=t;let e=f("number-display",{value:w.getAsSegment().length.toFixed(1)},"Length:\xA0"),n=f("range-slider-number",{min:15,max:Math.max(s.worldSize.width,s.worldSize.height),step:1,value:w.length.toFixed(1),onChange:r=>{typeof w!="boolean"&&(w.length=r)}},"Start length"),o;w instanceof E&&!(w instanceof R)?o=f("range-slider-number",{min:2e3,max:1e5,value:w.springConstant,step:200,onChange:r=>{w instanceof E&&(w.springConstant=r)}},"Spring stiffness"):o=f("div",null);let a=f("angle-display",{value:0},"Orientation:\xA0");a.hideNumber(),Z.append(f("number-display",{value:w instanceof R?"stick":"spring"},"Type:\xA0"),e,a,n,o,f("check-box",{checked:w.rotationLocked,onChange:r=>{typeof w!="boolean"&&(r?w.lockRotation():w.unlockRotation())}},"Locked"),f("button-btn",{bgColor:S["Imperial Red"],textColor:"white",onClick:()=>{typeof w!="boolean"&&(s.physics.removeObjFromSystem(w),Et(),Y=()=>{},u=!1,w=!1)}},"Delete")),Y=()=>{if(typeof w=="boolean")return;e.value=w.getAsSegment().length.toFixed(1);let r=w.getAsSegment();a.value=i.sub(r.b,r.a).heading}}else w=!1,Et()}function Bs(s,t){if(s.strokeStyle=S["Roman Silver"],s.setLineDash([5,3.5]),L==="rotate-texture"){let e=new i(t.mouseX,t.mouseY);s.beginPath(),s.moveTo(M.x,M.y),s.lineTo(e.x,e.y),s.stroke(),s.fillStyle=S.blue,s.setLineDash([]),s.beginPath(),s.arc(M.x,M.y,Ct,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(e.x,e.y,Ct,0,Math.PI*2),s.closePath(),s.fill();return}s.beginPath(),s.moveTo(M.x,M.y-Zt),s.lineTo(M.x,M.y),s.stroke(),s.beginPath(),s.moveTo(M.x,M.y),s.lineTo(M.x+at,M.y+at),s.stroke(),s.setLineDash([]),s.fillStyle=S.blue,s.beginPath(),s.arc(M.x,M.y,Ke,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(M.x,M.y-Zt,Ct,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(M.x+at,M.y+at,$e,0,Math.PI*2),s.closePath(),s.fill()}var Ts={name:"Select",description:"",element:Z,drawFunc(s,t){let e=Ze(s),n=ts(s),o=s.cnv.getContext("2d");if(o.save(),o.strokeStyle="orange",o.fillStyle="#00000000",o.setLineDash([]),o.lineWidth=4,typeof u!="boolean")if(s.renderer.renderBody(u,o),o.globalAlpha=.6,s.physics.getSpringsWithBody(u).forEach(a=>{o.fillStyle="#00000000",o.strokeStyle="#FFFFFF",a instanceof R?s.renderer.renderStick(a,o):a instanceof E&&s.renderer.renderSpring(a,o)}),o.globalAlpha=1,typeof H!="boolean"){let a=o.createPattern(H,At);gt%=Math.PI*2;let r=new DOMMatrix([rt,0,0,rt,M.x,M.y]);r.rotateSelf(0,0,gt*180/Math.PI),a.setTransform(r),o.fillStyle=a,o.strokeStyle="#00000000",s.renderer.renderBody(u,o),Bs(o,s),te(s);let c=Bt(s),l=ee[c],m=s.cnv.style;m.cursor!==l&&(m.cursor=l)}else(u.m===0||s.timeMultiplier===0)&&(te(s),Is(o,s));else{let a=s.cnv.style;a.cursor!=="default"&&(a.cursor="default")}if(typeof w!="boolean")o.fillStyle="#00000000",w instanceof R?s.renderer.renderStick(w,o):w instanceof E&&s.renderer.renderSpring(w,o),o.globalAlpha=.6,o.strokeStyle="#FFFFFF",w.objects.forEach(a=>s.renderer.renderBody(a,o)),o.globalAlpha=1,s.timeMultiplier===0&&(te(s),Cs(o,s));else if(typeof u=="boolean"){let a=s.cnv.style;a.cursor!=="default"&&(a.cursor="default")}o.strokeStyle="yellow",o.fillStyle="#00000000",o.setLineDash([3,5]),typeof e!="boolean"?s.renderer.renderBody(e,o):typeof n!="boolean"&&(o.fillStyle="#00000000",n instanceof R?s.renderer.renderStick(n,o):s.renderer.renderSpring(n,o)),o.restore(),Y==null||Y()},startInteractionFunc(s){let t=Bt(s);if(t!=="none"){L=t,Ps(t);return}L="none";let e=Ze(s);if(e instanceof k&&u!==e&&t==="none"){Z.innerHTML="",u=e,w=!1;let n=f("range-slider-number",{min:.1,max:25,step:.05,value:Number.parseFloat(u.density.toFixed(2)),onChange:y=>{u instanceof k&&(u.density=y),Y==null||Y()}},"Density");u.m===0&&n.disable();let o=f("check-box",{checked:u.m===0,onChange:y=>{u instanceof k&&(y?(n.disable(),u.density=0,u.vel=new i(0,0),u.ang=0,n.value=0):(n.enable(),u.density=1,n.value=u.density),Y==null||Y())}},"Fixed down"),a=f("number-display",{value:u.shape.r!==0?"circle":"polygon"},"Type:\xA0"),r=f("number-display",{value:u.m.toFixed(2)},"Mass:\xA0"),c=f("number-display",{value:u.pos.x.toFixed(2)},"X coord:\xA0"),l=f("number-display",{value:u.pos.y.toFixed(2)},"Y coord:\xA0"),m=f("angle-display",{value:u.rotation.toFixed(2)},"Rotation:\xA0"),d=f("number-display",{value:u.texture==="none"?"none":"set"},"Texture:\xA0"),h=f("file-input",{accept:"image/*",onFile:y=>{if(y.type.includes("image")){let v=new FileReader;v.readAsDataURL(y),v.onload=()=>{if(typeof v.result!="string")return;let C=new Image;C.onload=()=>{createImageBitmap(C).then(O=>{var P;u instanceof k?(s.timeMultiplier!==0&&((P=document.getElementById("pause"))==null||P.click()),H=O,rt=Math.max(u.boundingBox.x.size()/O.width,u.boundingBox.y.size()/O.height),M.x=u.boundingBox.x.min,M.y=u.boundingBox.y.min,gt=0,u.texture="none"):H=!1})},C.src=v.result}}}},"Select image"),b=f("apply-cancel",{visible:!0,onApply:()=>{if(typeof u=="boolean"||typeof H=="boolean")return;let y=i.sub(M,u.pos);y.rotate(-u.rotation),u.textureTransform={scale:rt,rotation:gt-u.rotation,offset:y},u.texture=H,H=!1},onCancel:()=>{H=!1}}),p=f("button-btn",{bgColor:S["Imperial Red"],textColor:"white",onClick:()=>{typeof u!="boolean"&&(u.texture="none")}},"Remove texture");p.smallMargin(),u.texture!=="none"?p.show():p.hide();let x=["repeat","repeat-x","repeat-y","no-repeat"],g=f("drop-down",{entries:x,value:At,onChoice:y=>{x.includes(y)&&(At=y)}},"\u25BC\xA0Texture repeat");Y=()=>{u instanceof k&&(c.value!=u.pos.x&&(c.value=u.pos.x.toFixed(2)),l.value!=u.pos.y&&(l.value=u.pos.y.toFixed(2)),r.value!=u.m&&(r.value=u.m.toFixed(2)),m.value=u.rotation.toFixed(2),d.value!==u.texture&&(d.value=u.texture==="none"?"none":"set"),typeof H!="boolean"?b.visible=!0:b.visible=!1,u.texture!=="none"?p.hidden&&p.show():p.hidden||p.hide())},Z.append(a,r,m,c,l,o,n,f("range-slider-number",{min:0,max:.98,step:.02,value:u.k,onChange:y=>{u instanceof k&&(u.k=y)}},"Bounciness"),f("range-slider-number",{min:0,max:2,step:.1,value:u.fc,onChange:y=>{u instanceof k&&(u.fc=y)}},"Coefficient of friction"),f("color-picker",{value:u.style,onChange:y=>{u instanceof k&&(u.style=y)}},"Color:"),d,g,h,b,p,f("button-btn",{bgColor:S["Imperial Red"],textColor:"white",onClick:()=>{typeof u!="boolean"&&(s.physics.removeObjFromSystem(u),Et(),Y=()=>{},u=!1,w=!1)}},"Delete"))}else typeof e=="boolean"&&t==="none"&&(u=e,Y=()=>{},Es(s))},endInteractionFunc(s){L="none"},deactivated(){u=!1,w=!1,Y=()=>{}},activated(){Et()}},es=Ts;var ss=[pe,es,ve,Xe,Le,Re,xe,Ce,be,ke,De,Pe];var ns=class{constructor(){this.textures=[]}renderBody(t,e){if(t.shape.r!==0)e.beginPath(),e.arc(t.pos.x,t.pos.y,t.shape.r,0,Math.PI*2),e.stroke(),e.fill();else{e.beginPath(),e.moveTo(t.shape.points[0].x,t.shape.points[0].y);for(let n=1;n<t.shape.points.length;n+=1)e.lineTo(t.shape.points[n].x,t.shape.points[n].y);e.closePath(),e.stroke(),e.fill()}}renderSpring(t,e){let n=t.points,o=n[0].x,a=n[0].y,r=n[1].x,c=n[1].y,l=new i(r-o,c-a),m=l.copy;l.rotate(Math.PI/2),l.setMag(5);let d=new i(o,a),h=Math.floor(t.length/10);for(let b=1;b<=h;b+=1)b===h&&(l=new i(0,0)),e.beginPath(),e.moveTo(d.x,d.y),e.lineTo(o+b/h*m.x+l.x,a+b/h*m.y+l.y),e.stroke(),d=new i(o+b/h*m.x+l.x,a+b/h*m.y+l.y),l.mult(-1);e.strokeStyle="black",t.points.forEach(b=>{e.beginPath(),e.arc(b.x,b.y,2.5,0,Math.PI*2),e.fill(),e.stroke()})}renderStick(t,e){let n=t.points;e.beginPath(),e.moveTo(n[0].x,n[0].y),e.lineTo(n[1].x,n[1].y),e.stroke(),e.strokeStyle="black",t.points.forEach(o=>{e.beginPath(),e.arc(o.x,o.y,2.5,0,Math.PI*2),e.fill(),e.stroke()})}},is=ns;var G=ss,Tt=G.map(s=>s.name),os=class{constructor(){this.resizeCanvas=()=>{let t=this.canvasHolder.getBoundingClientRect();this.cnv.width=t.width,this.cnv.height=window.innerHeight-t.top;let e=window.devicePixelRatio||1,n=t;this.cnv.width=n.width*e,this.cnv.height=n.height*e,this.cnv.style.width=`${n.width}px`,this.cnv.style.height=`${n.height}px`,this.scaling=this.cnv.height/this.worldSize.height,this.scaling/=e,this.scaling*=.9,this.viewOffsetX=.01*this.cnv.width,this.viewOffsetY=.03*this.cnv.height;let o=this.cnv.getContext("2d");o&&(o.scale(e,e),o.lineWidth=e),this.defaultSize=(this.cnv.width+this.cnv.height)/80};this.drawFunction=()=>{var n,o;Number.isFinite(this.lastFrameTime)||(this.lastFrameTime=performance.now());let t=performance.now()-this.lastFrameTime;Number.isFinite(t)||(t=0),t/=1e3,t=Math.min(t,.04166666666);let e=this.cnv.getContext("2d");e.fillStyle=S.Beige,e.fillRect(0,0,this.cnv.width,this.cnv.height),e.save(),e.translate(this.viewOffsetX,this.viewOffsetY),e.scale(this.scaling,this.scaling),this.physicsDraw(),(o=(n=G[this.mode]).drawFunc)==null||o.call(n,this,t*this.timeMultiplier),e.restore(),this.collisionData=[],t*=this.timeMultiplier,this.collisionData.push(...this.physics.update(t/5)),this.collisionData.push(...this.physics.update(t/5)),this.collisionData.push(...this.physics.update(t/5)),this.collisionData.push(...this.physics.update(t/5)),this.collisionData.push(...this.physics.update(t/5)),this.lastFrameTime=performance.now(),requestAnimationFrame(this.drawFunction),this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY};this.startInteraction=(t,e)=>{var n,o;this.mouseX=t/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=e/this.scaling-this.viewOffsetY/this.scaling,this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY,this.choosed=this.physics.getObjectAtCoordinates(this.mouseX,this.mouseY),!this.choosed&&typeof this.choosed=="boolean"&&(this.choosed={x:this.mouseX,y:this.mouseY,pinPoint:!0}),this.lastX=this.mouseX,this.lastY=this.mouseY,this.mouseDown=!0,(o=(n=G[this.mode]).startInteractionFunc)==null||o.call(n,this)};this.endInteraction=(t,e)=>{var n,o;this.mouseX=t/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=e/this.scaling-this.viewOffsetY/this.scaling,(o=(n=G[this.mode]).endInteractionFunc)==null||o.call(n,this),this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.discardInteraction=()=>{this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.keyGotDown=t=>{let e=t.key;e==="s"&&this.spawnNewtonsCradle(this.cnv.width/2,this.cnv.height/2,.5,this.physics),e==="a"&&(this.scaling+=.01),e==="d"&&(this.scaling-=.01),e==="j"&&(this.viewOffsetX-=10),e==="l"&&(this.viewOffsetX+=10),e==="k"&&(this.viewOffsetY-=10),e==="i"&&(this.viewOffsetY+=10)};this.keyGotUp=t=>{};this.startTouch=t=>{t.preventDefault();let e=this.canvasHolder.getBoundingClientRect();return t.touches.length>1?(this.discardInteraction(),t.touches.length===2&&(this.touchIDs.push(t.touches[0].identifier),this.touchIDs.push(t.touches[1].identifier),this.touchCoords.push(new i(t.touches[0].clientX-e.left,t.touches[0].clientY-e.top)),this.touchCoords.push(new i(t.touches[1].clientX-e.left,t.touches[1].clientY-e.top))),t.touches.length>2&&(this.touchIDs=[],this.touchCoords=[]),!1):(this.startInteraction(t.changedTouches[0].clientX-e.left,t.changedTouches[0].clientY-e.top),!1)};this.endTouch=t=>{t.preventDefault();let e=this.canvasHolder.getBoundingClientRect();return t.touches.length<=1&&(this.touchIDs=[],this.touchCoords=[]),this.endInteraction(t.changedTouches[0].clientX-e.left,t.changedTouches[0].clientY-e.top),!1};this.moveTouch=t=>{t.preventDefault();let e=this.canvasHolder.getBoundingClientRect();if(t.touches.length===2){let n=[];return t.touches.item(0).identifier===this.touchIDs[0]?(n.push(t.touches.item(0)),n.push(t.touches.item(1))):(n.push(t.touches.item(1)),n.push(t.touches.item(0))),n=n.map(o=>new i(o.clientX-e.left,o.clientY-e.top)),this.processMultiTouchGesture(this.touchCoords,n),this.touchCoords=n,!1}return t.touches.length>2||(this.mouseX=t.changedTouches[0].clientX-e.left,this.mouseY=t.changedTouches[0].clientY-e.top,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling),!1};this.processMultiTouchGesture=(t,e)=>{let n=i.add(t[1],t[0]);n.mult(.5);let o=i.add(e[1],e[0]);o.mult(.5);let a=i.dist(t[1],t[0]),r=i.dist(e[1],e[0]),c=Math.sqrt(r/a),l=i.add(n,o);l.mult(.5);let m=i.sub(o,n);m.mult(c),this.scaleAround(l,c),this.viewOffsetX+=m.x,this.viewOffsetY+=m.y};this.scaleAround=(t,e)=>{this.viewOffsetX=t.x-(t.x-this.viewOffsetX)*e,this.viewOffsetY=t.y-(t.y-this.viewOffsetY)*e,this.scaling*=e};this.startMouse=t=>(t.button===0&&this.startInteraction(t.offsetX,t.offsetY),t.button===2&&(this.rightButtonDown=new i(t.offsetX,t.offsetY),this.cnv.style.cursor="all-scroll"),!1);this.endMouse=t=>(t.button===0&&this.endInteraction(t.offsetX,t.offsetY),t.button===2&&(this.rightButtonDown=!1,this.cnv.style.cursor="default"),!1);this.handleMouseMovement=t=>{if(this.mouseX=t.offsetX,this.mouseY=t.offsetY,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling,this.rightButtonDown){let e=new i(t.offsetX,t.offsetY),n=i.sub(e,this.rightButtonDown);this.viewOffsetX+=n.x,this.viewOffsetY+=n.y,this.rightButtonDown=e}};this.handleMouseWheel=t=>{t.preventDefault();let e=new i(t.offsetX,t.offsetY),n=5e-4;t.deltaMode===WheelEvent.DOM_DELTA_LINE&&(n/=16);let o=1-t.deltaY*n;this.scaleAround(e,o)};this.convertToPhysicsSpace=t=>new i(t.x/this.scaling-this.viewOffsetX/this.scaling,t.y/this.scaling-this.viewOffsetY/this.scaling);this.convertToCanvasSpace=t=>new i(t.x*this.scaling+this.viewOffsetX,t.y*this.scaling+this.viewOffsetY);this.physicsDraw=()=>{let t=this.cnv.getContext("2d");if(t){t.fillStyle=S.Independence,t.fillRect(0,0,this.worldSize.width,this.worldSize.height);let e=o=>{if(o.m===0&&(t.strokeStyle="#00000000"),o.shape.r!==0){let a=o;t.beginPath(),t.arc(a.pos.x,a.pos.y,a.shape.r,0,2*Math.PI),t.stroke(),t.fill(),o.m!==0&&(t.beginPath(),t.moveTo(a.pos.x,a.pos.y),t.lineTo(a.pos.x+a.shape.r*Math.cos(a.rotation),a.pos.y+a.shape.r*Math.sin(a.rotation)),t.stroke())}else t.beginPath(),t.moveTo(o.shape.points[o.shape.points.length-1].x,o.shape.points[o.shape.points.length-1].y),o.shape.points.forEach(a=>{t.lineTo(a.x,a.y)}),t.stroke(),t.fill(),this.showAxes&&(t.strokeStyle="black",o.axes.forEach(a=>{t.beginPath(),t.moveTo(o.pos.x,o.pos.y),t.lineTo(o.pos.x+a.x*30,o.pos.y+a.y*30),t.stroke()}));o.m!==0&&(t.beginPath(),t.arc(o.pos.x,o.pos.y,1.5,0,Math.PI*2),t.stroke())};this.physics.bodies.forEach(o=>{t.fillStyle=o.style,t.strokeStyle="black",e(o)}),this.physics.bodies.forEach(o=>{if(o.texture==="none")return;let a=o.textureTransform,r=a.offset.copy;r.rotate(o.rotation),r.add(o.pos);let c=new DOMMatrix([a.scale,0,0,a.scale,r.x,r.y]);c.rotateSelf(0,0,(a.rotation+o.rotation)*180/Math.PI);let l=t.createPattern(o.texture,o.textureRepeat);l.setTransform(c),t.fillStyle=l,t.strokeStyle="black",e(o)}),t.save(),t.lineWidth=2,this.physics.springs.forEach(o=>{o instanceof E&&!(o instanceof R)?(t.strokeStyle=S.blue,t.fillStyle=S.blue,this.renderer.renderSpring(o,t)):(t.strokeStyle=S.blue,t.fillStyle=S.blue,this.renderer.renderStick(o,t))}),t.restore(),t.strokeStyle="rgba(255, 255, 255, 0.2)",this.showBoundingBoxes&&this.physics.bodies.forEach(o=>{t.strokeRect(o.boundingBox.x.min,o.boundingBox.y.min,o.boundingBox.x.max-o.boundingBox.x.min,o.boundingBox.y.max-o.boundingBox.y.min)}),t.fillStyle=S["Maximum Yellow Red"],t.strokeStyle=S["Maximum Yellow Red"];let n=t.lineWidth;t.lineWidth=4,this.drawCollisions&&this.collisionData.forEach(o=>{t.beginPath(),t.moveTo(o.cp.x,o.cp.y),t.lineTo(o.cp.x+o.n.x*30,o.cp.y+o.n.y*30),t.stroke(),t.beginPath(),t.arc(o.cp.x,o.cp.y,4,0,Math.PI*2),t.fill()}),t.lineWidth=n}};this.spawnNewtonsCradle=(t,e,n,o)=>{let a=[],r=25,c=250,l=8;a.push(new k(X.Circle(n*r,new i(t,e)),1,1,0));let m=1;for(let d=0;d<l-1;d+=1)a.push(new k(X.Circle(n*r,new i(t+m*n*r*1.01*2,e)),1,1,0)),m*=-1,m>0&&(m+=1),d===l-2&&(a[a.length-1].vel.x=-Math.sign(m)*n*r*8);a.forEach(d=>{o.addBody(d);let h=new R(c);h.attachObject(d),h.pinHere(d.pos.x,d.pos.y-c),o.addSpring(h),h.lockRotation()})};this.modeButtonClicked=t=>{let e=t.target.id.replace("-btn",""),n=Tt.indexOf(e);this.switchToMode(n)};this.switchToMode=t=>{var o,a,r,c;let e=document.getElementById(`${Tt[this.mode]}-btn`);e&&e.classList.remove("bg-pink-darker"),this.sidebar.innerHTML="",(a=(o=G[this.mode]).deactivated)==null||a.call(o,this),(c=(r=G[t]).activated)==null||c.call(r,this);let n=document.getElementById(`${Tt[t]}-btn`);n&&n.classList.add("bg-pink-darker"),this.modeTitleHolder.innerText=G[t].name,this.mode=t,this.sidebar.appendChild(G[this.mode].element)};this.setupModes=()=>{let t=document.getElementById("button-holder");Tt.forEach((e,n)=>{var a,r;let o=document.createElement("div");o.classList.add("big-button"),o.id=`${e}-btn`,o.textContent=G[n].name,(r=(a=G[n]).init)==null||r.call(a,this),o.onclick=this.modeButtonClicked,t&&t.appendChild(o)}),this.switchToMode(this.mode)};this.setTimeMultiplier=t=>{Number.isFinite(t)&&t>=0&&(this.timeMultiplier=t,t===0?this.pauseBtn.classList.add("bg-pink-darker"):this.pauseBtn.classList.remove("bg-pink-darker"))};this.getTimeMultiplier=()=>this.timeMultiplier;this.setPhysics=t=>{t instanceof nt&&(this.physics=t)};this.getPhysics=()=>this.physics;this.physics=new nt,this.mouseX=0,this.mouseY=0,this.oldMouseX=0,this.oldMouseY=0,this.mouseDown=!1,this.defaultSize=30,this.k=.5,this.fc=2,this.springConstant=2e3,this.scaling=1,this.viewOffsetX=0,this.viewOffsetY=0,this.mode=0,this.lastX=0,this.lastY=0,this.touchIDs=[],this.touchCoords=[],this.rightButtonDown=!1,this.timeMultiplier=1,this.lastFrameTime=performance.now(),this.choosed=!1,this.drawCollisions=!1,this.showAxes=!1,this.worldSize={width:0,height:0},this.collisionData=[],this.showBoundingBoxes=!1,this.renderer=new is,this.cnv=document.getElementById("defaulCanvas0"),this.canvasHolder=document.getElementById("canvas-holder"),this.sidebar=document.getElementById("sidebar"),this.modeTitleHolder=document.getElementById("mode-title-text"),this.pauseBtn=document.getElementById("pause"),this.setWorldSize({width:2e3,height:1e3}),this.physics.setGravity(new i(0,1e3)),this.physics.setAirFriction(.9),this.cnv.addEventListener("touchstart",this.startTouch,!1),this.cnv.addEventListener("touchend",this.endTouch,!1),this.cnv.addEventListener("touchmove",this.moveTouch,!1),this.cnv.addEventListener("mousedown",this.startMouse,!1),this.cnv.addEventListener("mouseup",this.endMouse,!1),this.cnv.addEventListener("mousemove",this.handleMouseMovement,!1),this.cnv.addEventListener("wheel",this.handleMouseWheel),this.cnv.addEventListener("contextmenu",t=>t.preventDefault()),document.addEventListener("keydown",this.keyGotDown,!1),document.addEventListener("keyup",this.keyGotUp,!1),window.addEventListener("resize",this.resizeCanvas,!1),this.resizeCanvas(),this.setupModes(),Xt(this),requestAnimationFrame(this.drawFunction)}setWorldSize(t){this.physics.setBounds(0,0,t.width,t.height),this.worldSize=t}},as=os;window.onload=()=>{window.editorApp=new as,"serviceWorker"in navigator&&navigator.serviceWorker.register("serviceworker.js").then(()=>{},s=>{console.log("ServiceWorker registration failed: ",s)})};})();
