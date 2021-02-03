(()=>{var E=class{constructor(e,t){this.x=e,this.y=t}get copy(){return new E(this.x,this.y)}setCoordinates(e,t){this.x=e,this.y=t}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get sqlength(){return this.x*this.x+this.y*this.y}get heading(){if(this.x===0&&this.y===0)return 0;if(this.x===0)return this.y>0?Math.PI/2:1.5*Math.PI;if(this.y===0)return this.x>0?0:Math.PI;let e=E.normalized(this);return this.x>0&&this.y>0?Math.asin(e.y):this.x<0&&this.y>0?Math.asin(-e.x)+Math.PI/2:this.x<0&&this.y<0?Math.asin(-e.y)+Math.PI:this.x>0&&this.y<0?Math.asin(e.x)+1.5*Math.PI:0}add(e){this.x+=e.x,this.y+=e.y}sub(e){this.x-=e.x,this.y-=e.y}mult(e){this.x*=e,this.y*=e}div(e){this.x/=e,this.y/=e}lerp(e,t){this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t}dist(e){return new E(this.x-e.x,this.y-e.y).length}pNorm(e){let t=e;return t<1&&(t=1),(Math.abs(this.x**t)+Math.abs(this.y**t))**(1/t)}setMag(e){this.length!==0&&this.mult(e/this.length)}normalize(){this.length!==0&&this.div(this.length)}scaleAround(e,t){this.x=e.x+(this.x-e.x)*t,this.y=e.y+(this.y-e.y)*t}scaleAroundX(e,t){this.x=e.x+(this.x-e.x)*t}scaleAroundY(e,t){this.y=e.y+(this.y-e.y)*t}rotate(e){let t=Math.cos(e),o=Math.sin(e);this.setCoordinates(this.x*t-this.y*o,this.x*o+this.y*t)}static rotateArr(e,t){let o=Math.cos(t),n=Math.sin(t);e.forEach(a=>{a.setCoordinates(a.x*o-a.y*n,a.x*n+a.y*o)})}rotate90(){let{x:e}=this;this.x=-this.y,this.y=e}rotate270(){let{x:e}=this;this.x=this.y,this.y=-e}static add(e,t){return new E(e.x+t.x,e.y+t.y)}static sub(e,t){return new E(e.x-t.x,e.y-t.y)}static mult(e,t){return new E(e.x*t,e.y*t)}static div(e,t){return new E(e.x/t,e.y/t)}static fromAngle(e){return new E(Math.cos(e),Math.sin(e))}static fromAnglePNorm(e,t){let o=new E(Math.cos(e),Math.sin(e));return o.div(o.pNorm(t)),o}static lerp(e,t,o){return E.add(e,E.mult(E.sub(t,e),o))}static dist(e,t){return E.sub(e,t).length}static dot(e,t){return e.x*t.x+e.y*t.y}static cross(e,t){return e.x*t.y-e.y*t.x}static crossScalarFirst(e,t){return new E(-t.y*e,t.x*e)}static crossScalarSecond(e,t){return new E(e.y*t,-e.x*t)}static angle(e,t){return Math.acos(Math.min(Math.max(E.dot(e,t)/Math.sqrt(e.sqlength*t.sqlength),1),-1))}static angleACW(e,t){let o=e.heading,a=t.heading-o;return a<0?2*Math.PI+a:a}static normalized(e){let t=e.length;return t===0?e:new E(e.x/t,e.y/t)}toJSON(){return{x:this.x,y:this.y}}static fromObject(e){return new E(e.x,e.y)}},i=E;var Jt=class{constructor(e,t){this.a=e,this.b=t}get length(){return i.dist(this.a,this.b)}distFromPoint(e){let t=i.sub(this.b,this.a),o=t.length;t.normalize();let n=i.sub(e,this.a),a=i.dot(t,n),r=i.cross(t,n);return a>=0&&a<=o?Math.abs(r):Math.sqrt(Math.min(n.sqlength,i.sub(e,this.b).sqlength))}get nearestPointO(){let e=i.sub(this.b,this.a);if(i.dot(this.a,e)>=0)return this.a.copy;if(i.dot(this.b,e)<=0)return this.b.copy;e.normalize();let t=-i.dot(this.a,e);return i.add(this.a,i.mult(e,t))}static intersect(e,t){let o=i.sub(e.b,e.a),n=o.y/o.x,a=e.b.y-e.b.x*n,r=i.sub(t.b,t.a),l=r.y/r.x,h=t.b.y-t.b.x*l;if(o.x===0&&r.x!==0){if(e.a.x>=t.a.x&&e.a.x<=t.b.x||e.a.x<=t.a.x&&e.a.x>=t.b.x){let g=l*e.a.x+h;if(g>e.a.y&&g<e.b.y||g<e.a.y&&g>e.b.y)return new i(e.a.x,g)}return!1}if(r.x===0&&o.x!==0){if(t.a.x>=e.a.x&&t.a.x<=e.b.x||t.a.x<=e.a.x&&t.a.x>=e.b.x){let g=n*t.a.x+a;if(g>t.a.y&&g<t.b.y||g<t.a.y&&g>t.b.y)return new i(t.a.x,g)}return!1}if(o.x===0&&r.x===0){if(e.a.x===t.a.x){let g;e.a.y<e.b.y?g=[e.a.y,e.b.y]:g=[e.b.y,e.a.y];let y;t.a.y<t.b.y?y=[t.a.y,t.b.y]:y=[t.b.y,t.a.y];let b=[g[0]>y[0]?g[0]:y[0],g[1]<y[1]?g[1]:y[1]];if(b[0]<=b[1])return new i(e.a.x,(b[0]+b[1])/2)}return!1}let f;e.a.x<e.b.x?f=[e.a.x,e.b.x]:f=[e.b.x,e.a.x];let m;t.a.x<t.b.x?m=[t.a.x,t.b.x]:m=[t.b.x,t.a.x];let u=[f[0]>m[0]?f[0]:m[0],f[1]<m[1]?f[1]:m[1]];if(n===l&&a===h&&u[0]<=u[1])return new i((u[0]+u[1])/2,(u[0]+u[1])/2*n+a);let p=(h-a)/(n-l);return p>=u[0]&&p<=u[1]?new i(p,p*n+a):!1}},X=Jt;var Qt=class extends X{get length(){return Number.POSITIVE_INFINITY}distFromPoint(e){let t=i.sub(this.a,this.b);t.setMag(1),t.rotate(Math.PI/2);let o=i.sub(e,this.a);return Math.abs(i.dot(o,t))}static intersect(e,t){let o=i.sub(e.b,e.a),n=o.y/o.x,a=e.b.y-e.b.x*n,r=i.sub(t.b,t.a),l=r.y/r.x,h=t.b.y-t.b.x*l;if(n===l)return e.distFromPoint(t.a)===0?new i((e.a.x+e.b.x+t.a.x+t.b.x)/4,(e.a.y+e.b.y+t.a.y+t.b.y)/4):!1;let f=(h-a)/(n-l);return new i(f,n*f+a)}static intersectWithLineSegment(e,t){let o=i.sub(e.b,e.a),n=o.y/o.x,a=e.b.y-e.b.x*n,r=i.sub(t.b,t.a),l=r.y/r.x,h=t.b.y-t.b.x*l;if(o.x===0){if(r.x===0)return e.a.x===t.a.x?new i((t.a.x+t.b.x)/2,(t.a.y+t.b.y)/2):!1;let u=e.a.x,p=l*u+h;return Math.min(t.a.x,t.b.x)<u&&u<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<p&&Math.max(t.a.y,t.b.y)>p?new i(u,p):!1}if(r.x===0){let u=t.a.x,p=n*u+a;return Math.min(t.a.x,t.b.x)<u&&u<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<p&&Math.max(t.a.y,t.b.y)>p?new i(u,p):!1}if(n===l)return e.distFromPoint(t.a)===0?new i((t.a.x+t.b.x)/2,(t.a.y+t.b.y)/2):!1;let f=(h-a)/(n-l),m=n*f+a;return Math.min(t.a.x,t.b.x)<f&&f<Math.max(t.a.x,t.b.x)&&Math.min(t.a.y,t.b.y)<m&&Math.max(t.a.y,t.b.y)>m?new i(f,m):!1}},$=Qt;function he(s,e){this.min=s,this.max=e}he.prototype.size=function(){return this.max-this.min};function Le(s){return new he(Math.min(...s),Math.max(...s))}function Oe(s,e){return new he(Math.max(s.min,e.min),Math.min(s.max,e.max))}var J=class{constructor(e){if(e.length<3)throw new Error("Not enough points in polygon (minimum required: 3)");this.points=e,this.makeAntiClockwise()}getSideVector(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),i.sub(this.points[(t+1)%this.points.length],this.points[t%this.points.length])}getSideSegment(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),new X(i.fromObject(this.points[(t+1)%this.points.length]),i.fromObject(this.points[t%this.points.length]))}getSideLine(e){let t=e;return t<0&&(t+=Math.abs(Math.floor(t))*this.points.length),new X(i.fromObject(this.points[(t+1)%this.points.length]),i.fromObject(this.points[t%this.points.length]))}get sides(){return this.points.length}makeAntiClockwise(){let e=0;for(let t=1;t<=this.sides;t+=1){let o=this.getSideVector(t),n=this.getSideVector(t-1);n.mult(-1),e+=i.angleACW(o,n)}this.sides===3?e>Math.PI*1.5&&this.reverseOrder():this.sides===4?i.angleACW(this.getSideVector(1),this.getSideVector(0))>=Math.PI&&this.reverseOrder():this.sides>4&&e-this.sides*Math.PI>0&&this.reverseOrder()}reverseOrder(){this.points=this.points.reverse()}isPointInside(e){let t=new i(e.x,e.y);if(i.dist(t,this.centerPoint)>this.boundRadius)return!1;let o=this.centerPoint.copy;o.add(i.mult(new i(1.1,.6),this.boundRadius));let n=new X(t,o),a=0;return[...Array(this.sides).keys()].map(r=>this.getSideSegment(r)).forEach(r=>{X.intersect(r,n)&&(a+=1)}),a%2==0?!1:a%2==1}get centerPoint(){let e=new i(0,0);return this.points.forEach(t=>{e.add(t)}),e.div(this.sides),e}get boundRadius(){let e=this.centerPoint;return Math.max(...this.points.map(t=>i.dist(t,e)))}get allSides(){return[...Array(this.sides).keys()].map(e=>this.getSideSegment(e))}static intersection(e,t){if(i.dist(e.centerPoint,t.centerPoint)>e.boundRadius+t.boundRadius)return;let o=[],n=e.allSides,a=t.allSides;if(n.forEach((u,p)=>{a.forEach((g,y)=>{let b=X.intersect(u,g);typeof b=="object"&&"x"in b&&(b.isIntersectionPoint=!0,o.push({intersectionPoint:b,sideNum1:p,sideNum2:y}))})}),o.length===0){if(e.isPointInside(t.points[0]))return new J(t.points.map(u=>i.fromObject(u)));if(t.isPointInside(e.points[0]))return new J(e.points.map(u=>i.fromObject(u)))}let r=new J(e.points);for(let u=r.points.length-1;u>=0;u-=1){let p=o.filter(g=>g.sideNum1===u);p.length>1&&p.sort((g,y)=>i.dist(r.points[u],g.intersectionPoint)-i.dist(r.points[u],y.intersectionPoint)),p.length>0&&r.points.splice(u+1,0,...p.map(g=>g.intersectionPoint))}let l=new J(t.points);for(let u=l.points.length-1;u>=0;u-=1){let p=o.filter(g=>g.sideNum2===u);p.length>1&&p.sort((g,y)=>i.dist(l.points[u],g.intersectionPoint)-i.dist(l.points[u],y.intersectionPoint)),p.length>0&&l.points.splice(u+1,0,...p.map(g=>g.intersectionPoint))}let h={polyNum:1,pointNum:0};for(let u=0;u<r.points.length;u+=1)if("isIntersectionPoint"in r.points[u]){h.pointNum=u;break}else if(l.isPointInside(r.points[u])){h.pointNum=u;break}let f=!1,m=[];for(;!f;){let u=h.polyNum===1?r:l,p=h.polyNum===1?l:r;if(m.push(i.fromObject(u.points[h.pointNum%u.points.length])),m.length>2&&m[0].x===m[m.length-1].x&&m[0].y===m[m.length-1].y){m.pop();break}if(m.length>r.points.length+l.points.length)break;"isIntersectionPoint"in u.points[h.pointNum%u.points.length]?"isIntersectionPoint"in u.points[(h.pointNum+1)%u.points.length]||p.isPointInside(u.points[(h.pointNum+1)%u.points.length])&&!("isIntersectionPoint"in u.points[(h.pointNum+1)%u.points.length])?h.pointNum+=1:(h.pointNum=p.points.indexOf(u.points[h.pointNum%u.points.length])+1,h.polyNum=h.polyNum===1?2:1):h.pointNum+=1}return new J(m)}static createCircle(e,t,o=25){let n=[...Array(o).keys()].map(a=>{let r=i.fromAngle(2*Math.PI*a/o);return r.setMag(e),r.add(t),r});return new J(n)}static fracture(e,t=500){return e.map((n,a)=>{let r=[];for(let h=0;h<e.length;h+=1)if(a!==h){let f=e[h],m=i.div(i.add(n,f),2),u=i.sub(n,f);u.rotate(Math.PI/2),r.push(new $(m,i.add(u,m)))}return r=r.filter((h,f)=>{let m=new X(h.a,n);for(let u=0;u<r.length;u+=1)if(f!==u&&$.intersectWithLineSegment(r[u],m))return!1;return!0}),r=r.sort((h,f)=>i.sub(h.a,h.b).heading-i.sub(f.a,f.b).heading),r.map((h,f)=>{let m=[];for(let p=0;p<r.length;p+=1)if(f!==p){let g=$.intersect(h,r[p]);g instanceof i&&m.push(g)}let u=i.sub(h.a,h.b);return m=m.filter(p=>{let g=i.sub(p,n);return u.setMag(1),i.dot(g,u)>0}),m.length===0&&m.push(i.add(i.mult(u,t*1.2),h.a)),m=m.sort((p,g)=>i.dist(p,n)-i.dist(g,n)),m[0]})}).filter(n=>n.length>=3).map(n=>new J(n))}},_e=J;var K=class{constructor(){this.r=0,this.points=[new i(0,0)]}static Circle(e,t){let o=new K;return o.r=Math.abs(e),o.points[0]=t.copy,o}static Polygon(e){let t=new K;if(e.length<3)throw new Error("A polygon needs at least 3 points to be valid!");return t.points=new _e(e).points.map(o=>i.fromObject(o)),t}getGeometricalData(){let e={center:this.points[0].copy,area:0,secondArea:0};if(this.r!==0)e.area=this.r*this.r*Math.PI,e.secondArea=.5*Math.PI*this.r**4;else{let t=[];for(let r=2;r<this.points.length;r+=1)t.push([this.points[0],this.points[r-1],this.points[r]]);let o=0,n=0,a=new i(0,0);t.forEach(r=>{let l=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),h=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),m=(l+h+f)/2,u=Math.sqrt(m*(m-l)*(m-h)*(m-f));o+=u,a.x+=u*(r[0].x+r[1].x+r[2].x)/3,a.y+=u*(r[0].y+r[1].y+r[2].y)/3}),a.div(o),e.center=a,e.area=o,t.forEach(r=>{let l=Math.sqrt((r[0].x-r[1].x)**2+(r[0].y-r[1].y)**2),h=Math.sqrt((r[1].x-r[2].x)**2+(r[1].y-r[2].y)**2),f=Math.sqrt((r[2].x-r[0].x)**2+(r[2].y-r[0].y)**2),m=(l+h+f)/2,u=Math.sqrt(m*(m-l)*(m-h)*(m-f)),g=new $(r[1],r[2]).distFromPoint(r[0]),y=i.sub(r[2],r[1]);y.rotate90(),y.add(r[1]),l=new $(r[1],y).distFromPoint(r[0]);let w=(h*h*h*g-h*h*g*l+h*g*l*l+h*g*g*g)/36;w+=new i((r[0].x+r[1].x+r[2].x)/3,(r[0].y+r[1].y+r[2].y)/3).dist(e.center)**2*u,n+=w}),e.secondArea=n}return e}getMinMaxX(){let e=Le(this.points.map(t=>t.x));return e.min-=this.r,e.max+=this.r,e}getMinMaxY(){let e=Le(this.points.map(t=>t.y));return e.min-=this.r,e.max+=this.r,e}getMinMaxInDirection(e){let t=Le(this.points.map(o=>i.dot(o,e)));return t.min-=this.r,t.max+=this.r,t}move(e){this.points.forEach(t=>t.add(e))}rotateAround(e,t){this.points.forEach(o=>{o.sub(e)}),i.rotateArr(this.points,t),this.points.forEach(o=>{o.add(e)})}containsPoint(e){if(this.r!==0)return i.sub(e,this.points[0]).sqlength<=this.r*this.r;if(this.points.length===4){let o=new i(this.getMinMaxX().max+10,this.getMinMaxY().max+10),n=new X(e,o),a=0;return this.sides.forEach(r=>{X.intersect(r,n)&&(a+=1)}),a%2==1}return this.points.map((o,n)=>{let a=i.sub(this.points[(n+1)%this.points.length],o);return a.rotate90(),a}).every((o,n)=>i.dot(o,i.sub(e,this.points[n]))>=0)}get sides(){return this.points.map((e,t)=>new X(e,this.points[(t+1)%this.points.length]))}getSide(e){return new X(this.points[e],this.points[(e+1)%this.points.length])}getSideLine(e){return new $(this.points[e],this.points[(e+1)%this.points.length])}getNormal(e){let t=i.sub(this.points[e],this.points[(e+1)%this.points.length]);return t.rotate90(),t.normalize(),t}getClosestPoint(e){let t=this.points.map(r=>i.sub(r,e).sqlength),o=t[0],n=0,a=t.length;for(let r=1;r<a;r+=1)t[r]<o&&(o=t[r],n=r);return this.points[n].copy}getConvexHull(){let e=this.points.map(a=>a),t=this.points[0],o=this.points[0];this.points.forEach(a=>{o.x<a.x&&(o=a),t.x>a.x&&(t=a)}),e.splice(e.indexOf(t),1),e.splice(e.indexOf(o),1);let n=new K;n.points=[t,o];for(let a=0;a<n.points.length;a+=1){if(e.length===0)return n;let r=n.getNormal(a),l=n.points[a],h=e[0],f=i.dot(i.sub(e[0],l),r);if(e.forEach((m,u)=>{if(u===0)return;let p=i.dot(i.sub(m,l),r);p>f&&(f=p,h=m)}),f>0){n.points.splice(a+1,0,h),e.splice(e.indexOf(h),1);for(let m=e.length-1;m>=0;m-=1)n.containsPoint(e[m])&&e.splice(m,1);a-=1}}return n}static fromObject(e){let t=new K;return t.r=e.r,t.points=e.points.map(o=>i.fromObject(o)),t}get copy(){let e=new K;return e.r=this.r,e.points=this.points.map(t=>t.copy),e}},P=K;var Je={white:"#faf3dd",green:"#02c39a",pink:"#e58c8a",pinkDarker:"#da5a58",pinkHover:"#de6a68",blue:"#3db2f1",black:"#363732",Beige:"#f2f3d9",Independence:"#38405f",Turquoise:"#5dd9c1","Rich Black FOGRA 29":"#0e131f","Independence 2":"#59546c","Roman Silver":"#8b939c","Imperial Red":"#ff0035","Hot Pink":"#fc6dab","Maximum Yellow Red":"#f5b841","Lavender Web":"#dcd6f7"},M=Je,$t=Je.Turquoise,F=Je.Turquoise;var Cn=15,Se=class{constructor(e,t=1,o=.2,n=.5){this.shape=e,this.k=o,this.fc=n;let a=this.shape.getGeometricalData();this.m=a.area*t,this.pos=a.center,this.am=a.secondArea*t,this.rotation=0,this.ang=0,this.vel=new i(0,0),this.layer=void 0,this.defaultAxes=[],this.axes=[],this.calculateAxes(),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()},this.minMaxes=[],this.calculateMinMaxes(),this.style=F,this.texture="none",this.textureTransform={offset:new i(0,0),scale:1,rotation:0},this.textureRepeat="repeat"}calculateAxes(){let e=Math.cos(Math.PI/Cn);this.defaultAxes=this.normals.map(t=>new i(t.x,Math.abs(t.y)));for(let t=this.defaultAxes.length-2;t>=0;t-=1)for(let o=this.defaultAxes.length-1;o>t;o-=1){let n=this.defaultAxes[o],a=this.defaultAxes[t];Math.abs(i.dot(n,a))>e&&(this.defaultAxes.splice(o,1),this.defaultAxes[t]=n)}this.axes=this.defaultAxes.map(t=>t.copy)}calculateMinMaxes(){this.minMaxes=this.axes.map(e=>this.shape.getMinMaxInDirection(e))}get normals(){if(this.shape.r!==0)return[new i(0,1)];let e=this.shape.points.map((t,o)=>i.sub(this.shape.points[(o+1)%this.shape.points.length],t));return e.forEach(t=>{t.rotate270(),t.normalize()}),e}move(e){this.shape.move(e),this.pos.add(e),this.boundingBox.x.max+=e.x,this.boundingBox.x.min+=e.x,this.boundingBox.y.max+=e.y,this.boundingBox.y.min+=e.y}rotate(e){this.rotation+=e,this.shape.r===0&&this.shape.rotateAround(this.pos,e),i.rotateArr(this.axes,e),this.boundingBox={x:this.shape.getMinMaxX(),y:this.shape.getMinMaxY()}}velInPlace(e){let t=i.sub(e,this.pos);return t.rotate90(),t.mult(this.ang),t.add(this.vel),t}containsPoint(e){return this.shape.containsPoint(e)}get density(){return this.m/this.shape.getGeometricalData().area}set density(e){if(e<0||!Number.isFinite(e))return;let t=this.shape.getGeometricalData();this.m=t.area*e,this.am=t.secondArea*e}fixDown(){this.m=0}scaleAround(e,t){t!==0&&(this.pos.scaleAround(e,t),this.shape.points.forEach(o=>o.scaleAround(e,t)),this.shape.r=Math.abs(this.shape.r*t),this.m*=t**2,this.am*=t**4)}scaleAroundX(e,t){if(t===0)return;let{density:o}=this;this.shape.points.forEach(a=>a.scaleAroundX(e,t)),this.shape.r=Math.abs(this.shape.r*t);let n=this.shape.getGeometricalData();this.m=n.area*o,this.pos=n.center,this.am=n.secondArea*o,this.calculateAxes(),this.calculateMinMaxes()}scaleAroundY(e,t){if(t===0)return;let{density:o}=this;this.shape.points.forEach(a=>a.scaleAroundY(e,t)),this.shape.r=Math.abs(this.shape.r*t);let n=this.shape.getGeometricalData();this.m=n.area*o,this.pos=n.center,this.am=n.secondArea*o,this.calculateAxes(),this.calculateMinMaxes()}applyImpulse(e,t){if(this.m===0)return;let o=i.sub(e,this.pos);this.vel.add(i.div(t,this.m)),this.ang+=i.cross(o,t)/this.am}static detectCollision(e,t){let o=e,n=t;{let w=Oe(o.boundingBox.x,n.boundingBox.x);if(w.max<w.min)return!1;let v=Oe(o.boundingBox.y,n.boundingBox.y);if(v.max<v.min)return!1}let a=e.axes,r=t.axes;if(o.shape.r!==0){let w=n.shape.getClosestPoint(o.pos),v=i.sub(w,o.pos);v.normalize(),a=[v],o.minMaxes=[o.shape.getMinMaxInDirection(v)]}if(n.shape.r!==0){let w=o.shape.getClosestPoint(n.pos),v=i.sub(w,n.pos);v.normalize(),r=[v],n.minMaxes=[n.shape.getMinMaxInDirection(v)]}let l=[...a,...r],h=w=>o.shape.getMinMaxInDirection(w),f=w=>n.shape.getMinMaxInDirection(w),m=[];if(l.some((w,v)=>{let T;v<a.length?T=e.minMaxes[v]:T=h(w);let L;v>=a.length?L=t.minMaxes[v-a.length]:L=f(w);let I=Oe(T,L);return I.max<I.min?!0:(m.push(I),!1)}))return!1;let u=m.map(w=>w.size()),p=u[0],g=0;for(let w=1;w<u.length;w+=1)p>u[w]&&(p=u[w],g=w);let y=l[g].copy;i.dot(y,i.sub(o.pos,n.pos))>0&&y.mult(-1);let b;if(g<a.length){let w=n.shape.points.map(v=>i.dot(v,y));b=n.shape.points[w.indexOf(Math.min(...w))].copy,n.shape.r!==0&&b.sub(i.mult(y,n.shape.r))}else{let w=o.shape.points.map(v=>i.dot(v,y));b=o.shape.points[w.indexOf(Math.max(...w))].copy,o.shape.r!==0&&b.add(i.mult(y,o.shape.r))}return{normal:y,overlap:p,contactPoint:b}}static fromObject(e){let t=Object.create(Se.prototype);return t.am=e.am,t.ang=e.ang,t.axes=e.axes.map(o=>i.fromObject(o)),t.boundingBox={x:new he(e.boundingBox.x.min,e.boundingBox.x.max),y:new he(e.boundingBox.y.min,e.boundingBox.y.max)},t.defaultAxes=e.defaultAxes.map(o=>i.fromObject(o)),t.fc=e.fc,t.k=e.k,t.layer=e.layer,t.m=e.m,t.pos=i.fromObject(e.pos),t.rotation=e.rotation,t.shape=P.fromObject(e.shape),t.style=e.style,t.vel=i.fromObject(e.vel),t.minMaxes=[],t.calculateMinMaxes(),t}get copy(){return Se.fromObject(this)}},x=Se;var Kt=class{constructor(e,t){this.length=e,this.springConstant=t,this.pinned=!1,this.objects=[],this.rotationLocked=!1,this.initialHeading=0,this.initialOrientations=[0,0],this.attachPoints=[],this.attachRotations=[],this.attachPositions=[]}pinHere(e,t){this.pinned={x:e,y:t}}unpin(){this.pinned=!1}attachObject(e,t=void 0){let o=this.objects;o.push(e),t?this.attachPoints.push(t.copy):this.attachPoints.push(e.pos.copy),this.attachPositions.push(e.pos.copy),this.attachRotations.push(e.rotation),o.length===2&&(this.pinned=!1),o.length>=3&&(o=[o[o.length-2],o[o.length-1]],this.attachPoints=[this.attachPoints[this.attachPoints.length-2],this.attachPoints[this.attachPoints.length-1]],this.attachPositions=[this.attachPositions[this.attachPositions.length-2],this.attachPositions[this.attachPositions.length-1]],this.attachRotations=[this.attachRotations[this.attachRotations.length-2],this.attachRotations[this.attachRotations.length-1]])}updateAttachPoint0(e,t=0){let o=this.rotationLocked;o&&this.unlockRotation(),this.attachPoints[0]=e.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=t&&(this.attachPoints[0]=this.attachPositions[0].copy),o&&this.lockRotation()}updateAttachPoint1(e,t=0){let o=this.rotationLocked;o&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=e.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=t&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=e.copy),o&&this.lockRotation()}get points(){let e=this.objects.map((t,o)=>{let n=i.sub(this.attachPoints[o],this.attachPositions[o]);return n.rotate(t.rotation-this.attachRotations[o]),i.add(n,t.pos)});return typeof this.pinned!="boolean"&&e.push(i.fromObject(this.pinned)),e}lockRotation(){this.rotationLocked=!0,this.initialOrientations=this.objects.map(t=>t.rotation);let e=this.points;this.initialHeading=i.sub(e[1],e[0]).heading}unlockRotation(){this.rotationLocked=!1}arrangeOrientations(){let e=this.points,o=i.sub(e[1],e[0]).heading-this.initialHeading;this.objects.forEach((n,a)=>{let r=this.initialOrientations[a]+o;n.rotate(r-n.rotation)})}getAsSegment(){let e=this.points;return new X(e[0],e[1])}update(e){this.rotationLocked&&this.arrangeOrientations();let t,o;if(this.pinned instanceof Object&&this.objects[0]){[o,t]=[this.pinned,this.objects[0]];let n=this.points,a=new i(n[1].x-n[0].x,n[1].y-n[0].y),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*e),t.applyImpulse(n[1],a);let l=t.vel;if(l.rotate(-a.heading),this.rotationLocked&&t.m!==0){let h=new i(o.x,o.y),m=i.sub(t.pos,h).length,u=m*m*t.m+t.am,p=(t.am*t.ang-m*t.m*l.y)/u;l.y=-p*m,t.ang=p}l.rotate(a.heading)}else if(this.objects[0]&&this.objects[1]){[t,o]=[this.objects[0],this.objects[1]];let n=this.points,a=i.sub(n[0],n[1]),r=a.length-this.length;a.setMag(1),a.mult(r*this.springConstant*e),o.applyImpulse(n[1],a),a.mult(-1),t.applyImpulse(n[0],a),a=i.sub(t.pos,o.pos);let l=t.vel,h=o.vel;if(l.rotate(-a.heading),h.rotate(-a.heading),this.rotationLocked&&t.m!==0&&o.m!==0){let f=new i(t.pos.x*t.m+o.pos.x*o.m,t.pos.y*t.m+o.pos.y*o.m);f.div(t.m+o.m);let m=i.sub(t.pos,f),u=i.sub(o.pos,f),p=m.length,g=u.length,y=p*p*t.m+t.am+g*g*o.m+o.am,b=(l.y-h.y)*g/(p+g)+h.y,w=(t.am*t.ang+o.am*o.ang+p*t.m*(l.y-b)-g*o.m*(h.y-b))/y;l.y=w*p+b,h.y=-w*g+b,t.ang=w,o.ang=w}l.rotate(a.heading),h.rotate(a.heading)}}},C=Kt;var Zt=class extends C{constructor(e){super(e,0);this.springConstant=0}updateAttachPoint0(e,t=0){let o=this.rotationLocked;o&&this.unlockRotation(),this.attachPoints[0]=e.copy,this.attachPositions[0]=this.objects[0].pos.copy,this.attachRotations[0]=this.objects[0].rotation,this.attachPoints[0].dist(this.attachPositions[0])<=t&&(this.attachPoints[0]=this.attachPositions[0].copy),this.length=this.getAsSegment().length,o&&this.lockRotation()}updateAttachPoint1(e,t=0){let o=this.rotationLocked;o&&this.unlockRotation(),this.objects.length===2?(this.attachPoints[1]=e.copy,this.attachPositions[1]=this.objects[1].pos.copy,this.attachRotations[1]=this.objects[1].rotation,this.attachPoints[1].dist(this.attachPositions[1])<=t&&(this.attachPoints[1]=this.attachPositions[1].copy)):typeof this.pinned!="boolean"&&(this.pinned=e.copy),this.length=this.getAsSegment().length,o&&this.lockRotation()}update(){this.rotationLocked&&this.arrangeOrientations();let e,t;if(this.pinned instanceof Object&&"x"in this.pinned&&this.objects[0]){if([t,e]=[this.pinned,this.objects[0]],e.m===0)return;let o=this.points,n=new i(o[1].x-o[0].x,o[1].y-o[0].y);n.setMag(n.length-this.length),e.move(n),n=new i(o[1].x-o[0].x,o[1].y-o[0].y),n.normalize();let a=o[0],r=n,l=e,h=i.sub(a,l.pos),f=i.mult(l.velInPlace(a),-1),m=1/l.m;m+=i.dot(i.crossScalarFirst(i.cross(h,r)/l.am,h),r),m=-i.dot(f,r)/m;let u=i.sub(l.vel,i.mult(r,m/l.m)),p=l.ang-m*i.cross(h,r)/l.am;e.vel=u,e.ang=p;let g=e.vel;if(g.rotate(-n.heading),this.rotationLocked&&e.m!==0){let y=new i(t.x,t.y),w=i.sub(e.pos,y).length,v=w*w*e.m+e.am,T=(e.am*e.ang+w*e.m*g.y)/v;g.y=T*w,e.ang=T}g.rotate(n.heading)}else if(this.objects[0]&&this.objects[1]){[e,t]=[this.objects[0],this.objects[1]];let o=this.points,n=i.sub(o[0],o[1]),a=this.length-n.length;n.setMag(1);let r=e,l=t,h=r.m===0?Infinity:r.m,f=l.m===0?Infinity:l.m,m,u;if(h!==Infinity&&f!==Infinity)m=i.mult(n,a*f/(h+f)),u=i.mult(n,-a*h/(h+f));else if(h===Infinity&&f!==Infinity)m=new i(0,0),u=i.mult(n,-a);else if(h!==Infinity&&f===Infinity)u=new i(0,0),m=i.mult(n,a);else return;e.move(m),t.move(u),o=this.points,n=i.sub(o[1],o[0]),n.normalize();let p=n,g=o[0],y=o[1],b=r.ang,w=l.ang,v=i.sub(g,r.pos),T=i.sub(y,l.pos),L=r.m===0?Infinity:r.am,I=l.m===0?Infinity:l.am,_=r.velInPlace(g),se=l.velInPlace(y),W=i.sub(se,_),z=1/h+1/f;z+=i.dot(i.crossScalarFirst(i.cross(v,p)/L,v),p),z+=i.dot(i.crossScalarFirst(i.cross(T,p)/I,T),p),z=-i.dot(W,p)/z;let le=i.sub(r.vel,i.mult(p,z/h)),we=i.add(l.vel,i.mult(p,z/f)),ke=b-z*i.cross(v,p)/L,D=w+z*i.cross(T,p)/I;e.m!==0&&(e.vel=le,e.ang=ke),t.m!==0&&(t.vel=we,t.ang=D);let H=e.vel,j=t.vel;if(H.rotate(-n.heading),j.rotate(-n.heading),this.rotationLocked&&e.m!==0&&t.m!==0){let Ue=new i(e.pos.x*e.m+t.pos.x*t.m,e.pos.y*e.m+t.pos.y*t.m);Ue.div(e.m+t.m);let Me=i.sub(e.pos,Ue).length,ce=i.sub(t.pos,Ue).length,Pn=Me*Me*e.m+e.am+ce*ce*t.m+t.am,Re=(H.y-j.y)*ce/(Me+ce)+j.y,Ye=(e.am*e.ang+t.am*t.ang+Me*e.m*(H.y-Re)-ce*t.m*(j.y-Re))/Pn;H.y=Ye*Me+Re,j.y=-Ye*ce+Re,e.ang=Ye,t.ang=Ye}H.rotate(n.heading),j.rotate(n.heading)}}},B=Zt;function In(s,e,t,o){let n=o,a=t,r=s,l=e,h=r.vel,f=l.vel,m=r.ang,u=l.ang,p=i.sub(a,r.pos),g=i.sub(a,l.pos),y=r.am,b=l.am,w=r.m,v=l.m,T=(r.k+l.k)/2,L=(r.fc+l.fc)/2,I=r.velInPlace(a),_=l.velInPlace(a),se=i.sub(_,I),W=1/w+1/v;W+=i.dot(i.crossScalarFirst(i.cross(p,n)/y,p),n),W+=i.dot(i.crossScalarFirst(i.cross(g,n)/b,g),n),W=-((1+T)*i.dot(se,n))/W;let z=i.sub(h,i.mult(n,W/w)),le=i.add(f,i.mult(n,W/v)),we=m-W*i.cross(p,n)/y,ke=u+W*i.cross(g,n)/b,D=se.copy;if(D.sub(i.mult(n,i.dot(se,n))),D.setMag(1),i.dot(n,D)**2>.5)return[{dVel:i.sub(z,r.vel),dAng:we-r.ang},{dVel:i.sub(le,l.vel),dAng:ke-l.ang}];let H=1/w+1/v;H+=i.dot(i.crossScalarFirst(i.cross(p,D)/y,p),D),H+=i.dot(i.crossScalarFirst(i.cross(g,D)/b,g),D),H=-i.dot(se,D)/H;let j=Math.sign(H)*W*L;return Math.abs(j)>Math.abs(H)&&(j=H),z=i.sub(z,i.mult(D,j/w)),le=i.add(le,i.mult(D,j/v)),we-=j*i.cross(p,D)/y,ke+=j*i.cross(g,D)/b,[{dVel:i.sub(z,r.vel),dAng:we-r.ang},{dVel:i.sub(le,l.vel),dAng:ke-l.ang}]}function At(s,e,t){let o=e,n=t,a=s,r=i.sub(o,a.pos),{am:l,m:h}=a,f=i.mult(a.velInPlace(o),-1),m=1/h;m+=i.dot(i.crossScalarFirst(i.cross(r,n)/l,r),n),m=-((1+a.k)*i.dot(f,n))/m;let u=i.sub(a.vel,i.mult(n,m/h)),p=a.ang-m*i.cross(r,n)/l,g=f.copy;if(g.sub(i.mult(n,i.dot(f,n))),g.setMag(1),i.dot(n,g)**2>.5)return{dVel:i.sub(u,a.vel),dAng:p-a.ang};let y=1/h;y+=i.dot(i.crossScalarFirst(i.cross(r,g)/l,r),g),y=-i.dot(f,g)/y;let b=Math.sign(y)*m*a.fc;return Math.abs(b)>Math.abs(y)&&(b=y),u=i.sub(u,i.mult(g,b/h)),p-=b*i.cross(r,g)/l,{dVel:i.sub(u,a.vel),dAng:p-a.ang}}function es(s){let e=[],t=s.length,o=Array(t).fill(0),n=Array(t).fill(0),a=Array(t).fill(0),r=Array(t).fill(0),l=Array(t).fill(0),h=Array(t).fill(0);s.forEach(f=>f.calculateMinMaxes());for(let f=0;f<t-1;f+=1)for(let m=f+1;m<t;m+=1){let u=s[f],p=s[m];if(u.m===0&&p.m===0)continue;let g=x.detectCollision(u,p);if(g&&typeof g!="boolean"){let y=i.dot(u.velInPlace(g.contactPoint),g.normal),b=i.dot(p.velInPlace(g.contactPoint),g.normal);e.push({n:g.normal,cp:g.contactPoint});let w=-g.overlap,v=g.overlap;if(u.m===0){w=0;let I=At(p,g.contactPoint,i.mult(g.normal,-1));r[m]+=I.dVel.x,l[m]+=I.dVel.y,h[m]+=I.dAng,a[m]+=1}else if(p.m===0){v=0;let I=At(u,g.contactPoint,i.mult(g.normal,1));r[f]+=I.dVel.x,l[f]+=I.dVel.y,h[f]+=I.dAng,a[f]+=1}else{w*=p.m/(u.m+p.m),v*=u.m/(u.m+p.m);let[I,_]=In(u,p,g.contactPoint,i.mult(g.normal,1));y>=b&&(r[f]+=I.dVel.x,l[f]+=I.dVel.y,h[f]+=I.dAng,r[m]+=_.dVel.x,l[m]+=_.dVel.y,h[m]+=_.dAng)}let T=i.mult(g.normal,w),L=i.mult(g.normal,v);o[f]+=T.x,o[m]+=L.x,n[f]+=T.y,n[m]+=L.y}}for(let f=0;f<t;f+=1){let m=s[f];if(m.m===0)continue;let u=Math.max(a[f],1);m.move(new i(o[f],n[f])),m.vel.add(new i(r[f]/u,l[f]/u)),m.ang+=h[f]/u}return e}var Pe=class{constructor(){this.bodies=[],this.springs=[],this.airFriction=1,this.gravity=new i(0,0)}update(e){let t=[];for(let o=0;o<this.bodies.length;o+=1)this.bodies[o].move(new i(this.bodies[o].vel.x*e,this.bodies[o].vel.y*e)),this.bodies[o].rotate(this.bodies[o].ang*e);for(let o=0;o<3;o+=1)this.springs.forEach(n=>{n.update(e/3/2)});for(let o=0;o<this.bodies.length;o+=1)this.bodies[o].m!==0&&this.bodies[o].vel.add(new i(this.gravity.x*e,this.gravity.y*e));t=es(this.bodies);for(let o=0;o<3;o+=1)this.springs.forEach(n=>{n.update(e/3/2)});return this.bodies.forEach(o=>{let n=o;o.m!==0&&(n.vel.mult(this.airFriction**e),n.ang*=this.airFriction**e)}),t}get copy(){let e=this.toJSON();return Pe.fromObject(e)}setAirFriction(e){!Number.isFinite(e)||(this.airFriction=e,this.airFriction<0&&(this.airFriction=0),this.airFriction>1&&(this.airFriction=1))}setGravity(e){this.gravity=e.copy}addBody(e){this.bodies.push(e)}addSoftSquare(e,t,o,n,a=24,r=1){let l={sides:[],points:[]},h=Math.sqrt(t*t/Math.PI);l.points=[...new Array(a).keys()].map(u=>2*u*Math.PI/a).map(u=>i.add(i.mult(i.fromAngle(u),h),e)).map(u=>new x(P.Circle(Math.PI*h/a,u),1,.2,o)),l.sides=l.points.map((u,p)=>{let g=new B(1);return g.attachObject(u),g.attachObject(l.points[(p+1)%l.points.length]),p%2==0&&g.lockRotation(),g}),l.sides.forEach(u=>{let p=u;p.length=.96*4*t/a}),l.points.forEach(u=>{let p=u;p.vel=n.copy}),this.bodies.push(...l.points),this.springs.push(...l.sides);let f=t*t*200*r,m=new C(Math.sqrt(h*h*Math.PI),f/2);m.attachObject(l.points[0]),m.attachObject(l.points[a/2]),this.springs.push(m),m=new C(Math.sqrt(h*h*Math.PI),f/2),m.attachObject(l.points[a/4]),m.attachObject(l.points[3*a/4]),this.springs.push(m),m=new C(Math.sqrt(2*h*h*Math.PI),f),m.attachObject(l.points[a/8]),m.attachObject(l.points[5*a/8]),this.springs.push(m),m=new C(Math.sqrt(2*h*h*Math.PI),f),m.attachObject(l.points[3*a/8]),m.attachObject(l.points[7*a/8]),this.springs.push(m)}addRectWall(e,t,o,n){let a=[];a.push(new i(e-o/2,t-n/2)),a.push(new i(e+o/2,t-n/2)),a.push(new i(e+o/2,t+n/2)),a.push(new i(e-o/2,t+n/2)),this.bodies.push(new x(P.Polygon(a),0))}addRectBody(e,t,o,n,a,r,l=F){let h=[];h.push(new i(e-o/2,t-n/2)),h.push(new i(e+o/2,t-n/2)),h.push(new i(e+o/2,t+n/2)),h.push(new i(e-o/2,t+n/2));let f=new x(P.Polygon(h),1,r,a);f.style=l,this.bodies.push(f)}addFixedBall(e,t,o){this.bodies.push(new x(P.Circle(o,new i(e,t)),0)),this.bodies[this.bodies.length-1].style=M.Beige}addSpring(e){this.springs.push(e)}getSpringsWithBody(e){return this.springs.filter(t=>t.objects.includes(e))}setBounds(e,t,o,n){let a=(r,l,h,f)=>{let m=[];return m.push(new i(r-h/2,l-f/2)),m.push(new i(r+h/2,l-f/2)),m.push(new i(r+h/2,l+f/2)),m.push(new i(r-h/2,l+f/2)),new x(P.Polygon(m),0)};this.bodies[0]=a(e-o,t,2*o,4*n),this.bodies[1]=a(e+2*o,t,2*o,4*n),this.bodies[2]=a(e,t-n,4*o,n*2),this.bodies[3]=a(e+o/2,t+2*n,5*o,2*n);for(let r=0;r<4;r+=1)this.bodies[r].style=M.Beige}getObjectAtCoordinates(e,t,o=0){let n=!1,a=new i(e,t);return this.bodies.some((r,l)=>r.containsPoint(a)&&l>=o?(n=r,!0):!1),n}removeObjFromSystem(e){let t=-1;if(e instanceof x&&(t=this.bodies.indexOf(e)),t!==-1){let o=this.getSpringsWithBody(this.bodies[t]);this.bodies.splice(t,1),o.forEach(n=>{this.removeObjFromSystem(n)});return}(e instanceof B||e instanceof C)&&(t=this.springs.indexOf(e)),t!==-1&&this.springs.splice(t,1)}getObjectIdentifier(e){return e instanceof x?{type:"body",index:this.bodies.indexOf(e)}:{type:"nothing",index:-1}}toJSON(){let e={};return e.airFriction=this.airFriction,e.gravity=this.gravity.toJSON(),e.bodies=this.bodies.map(t=>t.copy),e.springs=this.springs.map(t=>{let o={};return o.length=t.length,o.pinned=t.pinned,o.rotationLocked=t.rotationLocked,o.springConstant=t.springConstant,t instanceof C?o.type="spring":t instanceof B&&(o.type="stick"),o.objects=t.objects.map(n=>this.getObjectIdentifier(n)),o}),e}stickOrSpringFromObject(e){let t={};return e.type==="spring"?t=new C(e.length,e.springConstant):e.type==="stick"&&(t=new B(e.length)),t.pinned=e.pinned,t.rotationLocked=e.rotationLocked,t.objects=e.objects.map(o=>this.bodies[o.index]),t}static fromObject(e){let t=new Pe;return t.bodies=e.bodies.map(o=>x.fromObject(o)),t.airFriction=e.airFriction,t.gravity=i.fromObject(e.gravity),t.springs=e.springs.map(o=>t.stickOrSpringFromObject(o)),t}};var de=Pe;var me,ts,Ce;function Ie(s){ts=s,s?Ce.classList.add("bg-pink-darker"):Ce.classList.remove("bg-pink-darker")}function Qe(s){me=s.getPhysics().toJSON(),Ce=document.getElementById("set start"),Ie(!1);let e=document.getElementById("pause");e&&(e.onclick=()=>{s.getTimeMultiplier()!==0?s.setTimeMultiplier(0):(s.setTimeMultiplier(1),ts===!0&&(me=s.getPhysics().toJSON()),Ie(!1))});let t=document.getElementById("revert");t&&(t.onclick=()=>{s.setTimeMultiplier(0),console.log(de.fromObject(me)),s.setPhysics(de.fromObject(me)),Ie(!0)});let o=document.getElementById("clear all");o&&(o.onclick=()=>{Ie(!0);let a=s.getPhysics();a.springs=[],a.bodies=[]}),Ce&&(Ce.onclick=()=>{me=s.getPhysics().toJSON(),console.log(me),Ie(!0),s.setTimeMultiplier(0)});let n=!1;document.addEventListener("visibilitychange",()=>{document.hidden?s.getTimeMultiplier()!==0?(s.setTimeMultiplier(0),n=!0):n=!1:n&&s.setTimeMultiplier(1)})}function c(s,e,...t){let o=document.createElement(s);return e&&Object.entries(e).forEach(([n,a])=>{o[n]=a}),t&&t.forEach(n=>{typeof n=="string"?o.appendChild(document.createTextNode(n)):n instanceof HTMLElement&&o.appendChild(n)}),o}var ss=document.createElement("template");ss.innerHTML=`
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
`;var ns=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ss.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",{className:"number-label"},c("span",null,c("slot",null)),c("span",{id:"numberPlace"})))}set value(e){this.shadowRoot.querySelector("#numberPlace").innerText=e}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}};window.customElements.define("number-display",ns);var os=document.createElement("template");os.innerHTML=`
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
`;var is=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(os.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",{className:"cursor-pointer"},c("label",{htmlFor:"cbIdentifier",className:"checkbox-label"},c("input",{type:"checkbox",className:"ch-box",id:"cbIdentifier"}),c("div",{className:"checkbox-display"}),c("div",{className:"label-text"},c("slot",null))))),this.shadowRoot.querySelector(".checkbox-display").innerHTML='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.877px" height="101.052px" viewBox="0 0 122.877 101.052" id="checkmark-svg" enable-background="new 0 0 122.877 101.052" xml:space="preserve"><g><path d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"/></g></svg>',this.shadowRoot.querySelector("#checkmark-svg").classList.add("checkmark")}get checkbox(){return this.shadowRoot.querySelector("#cbIdentifier")}set checked(e){this.checkbox.checked=e}set onChange(e){this.checkbox.onchange=t=>e(t.target.checked)}};window.customElements.define("check-box",is);var Z={spring:!0,body:!0},En=7,as=document.createElement("div");function rs(s){if(!Z.spring)return!1;let e=new i(s.mouseX,s.mouseY),t=s.physics.springs.find(o=>o.getAsSegment().distFromPoint(e)<=En);return typeof t=="undefined"?!1:t}var Bn={name:"Delete",description:"",element:as,drawFunc(s,e){let t=Z.body&&s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY,4);if(typeof t!="boolean"){let n=s.cnv.getContext("2d");n.save(),n.fillStyle="#00000000",n.strokeStyle=M["Imperial Red"],n.lineWidth=3,s.renderer.renderBody(t,n),n.restore();return}let o=rs(s);if(o){let n=s.cnv.getContext("2d");n.save(),n.fillStyle="#00000000",n.strokeStyle=M["Imperial Red"],n.lineWidth=3,o instanceof B?s.renderer.renderStick(o,n):s.renderer.renderSpring(o,n),n.restore()}},startInteractionFunc(s){let e=rs(s);s.choosed&&s.choosed instanceof x&&Z.body?s.physics.removeObjFromSystem(s.choosed):Z.spring&&e&&s.physics.removeObjFromSystem(e)}};as.append(c("number-display",null,"Deletable types:"),c("check-box",{checked:Z.body,onChange:s=>{Z.body=s}},"Body"),c("check-box",{checked:Z.spring,onChange:s=>{Z.spring=s}},"Stick/Spring"));var ls=Bn;var Tn=document.createElement("div"),Fn={name:"Move",description:"",element:Tn,drawFunc(s,e){let{choosed:t}=s,o=new i(s.mouseX,s.mouseY),n=t||s.physics.getObjectAtCoordinates(o.x,o.y,4);if(n instanceof x){let a=s.cnv.getContext("2d");a.save(),a.lineWidth=3,a.globalAlpha=.6,a.strokeStyle="#FFFFFF",a.fillStyle="#00000000",s.renderer.renderBody(n,a),a.restore()}if(t instanceof x&&t.m!==0){let a=new i(s.oldMouseX,s.oldMouseY),r=i.sub(o,a);e===0?(t.vel.x=0,t.vel.y=0,t.move(r)):(o.x<t.boundingBox.x.min?t.move(new i(o.x-t.boundingBox.x.min,0)):o.x>t.boundingBox.x.max&&t.move(new i(o.x-t.boundingBox.x.max,0)),o.y<t.boundingBox.y.min?t.move(new i(0,o.y-t.boundingBox.y.min)):o.y>t.boundingBox.y.max&&t.move(new i(0,o.y-t.boundingBox.y.max)),t.vel.x=r.x/e,t.vel.y=r.y/e),t.ang=0}},startInteractionFunc(s){let{choosed:e}=s;if(e instanceof x&&e.m!==0){let t=s;t.cnv.style.cursor="grabbing"}},endInteractionFunc(s){let{choosed:e}=s;if(e instanceof x&&e.m!==0){let t=s;t.cnv.style.cursor="grab"}},activated(s){let e=s;e.cnv.style.cursor="grab"},deactivated(s){let e=s;e.cnv.style.cursor="default"}},cs=Fn;var hs=document.createElement("template");hs.innerHTML=`
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
`;var ds=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(hs.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",{id:"btn"},c("slot",null))),this.hidden=!1}set bgColor(e){this.btn.style.backgroundColor=e}set textColor(e){this.btn.style.color=e}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(e){this.btn.onclick=e}set onEnter(e){this.btn.onpointerenter=e}set onLeave(e){this.btn.onpointerleave=e}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}asUpper(){this.btn.classList.add("upper")}asMiddle(){this.btn.classList.remove("upper"),this.btn.classList.remove("last")}asLast(){this.btn.classList.add("last")}};window.customElements.define("hover-detector-btn",ds);var ms=document.createElement("template");ms.innerHTML=`
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
`;var us=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ms.content.cloneNode(!0)),this.customHeightDiv=c("div",null),this.customHeightDiv.style.height="1rem",this.shadowRoot.appendChild(this.customHeightDiv)}set height(e){this.customHeightDiv.style.height=`${e}rem`}};window.customElements.define("space-height",us);var fs=document.createElement("template");fs.innerHTML=`
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
`;var gs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(fs.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",null,c("p",{className:"slider-label"},c("slot",null)),c("input",{id:"slider",type:"range",className:"slider"})))}get slider(){return this.shadowRoot.querySelector("#slider")}set min(e){this.slider.min=e}set max(e){this.slider.max=e}set step(e){this.slider.step=e}set value(e){this.slider.value=e}set onChange(e){this.slider.onchange=t=>e(t.target.valueAsNumber),this.slider.oninput=t=>e(t.target.valueAsNumber)}};window.customElements.define("range-slider",gs);var ps=document.createElement("template");ps.innerHTML=`
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
`;var bs=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(ps.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",null,c("label",{htmlFor:"colorWell",className:"picker-label"},c("div",null,c("slot",null)),c("input",{type:"color",id:"colorWell"}))))}get picker(){return this.shadowRoot.querySelector("#colorWell")}set value(e){this.picker.value=e,this.picker.style["background-color"]=e}set onChange(e){let t=o=>{e(o.target.value),this.picker.style["background-color"]=o.target.value};this.picker.onchange=t,this.picker.oninput=t}};window.customElements.define("color-picker",bs);var Ee=35,$e=.5,Ke=1.5,Ze=$t,ys=document.createElement("div"),Xn={name:"Ball",description:"",element:ys,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black",s.mouseDown?(t.beginPath(),t.arc(s.lastX,s.lastY,Ee,0,2*Math.PI),t.stroke()):(t.beginPath(),t.arc(s.mouseX,s.mouseY,Ee,0,2*Math.PI),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new x(P.Circle(Ee,new i(s.lastX,s.lastY)),1,$e,Ke);e.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),e.style=Ze,Number.isFinite(e.pos.x)&&Number.isFinite(e.pos.y)&&Number.isFinite(e.vel.x)&&Number.isFinite(e.vel.y)||(e.vel.x=0,e.vel.y=0),s.physics.addBody(e)}}};ys.append(c("range-slider",{min:5,max:120,step:1,value:Ee,onChange:s=>{Ee=s}},"Size"),c("range-slider",{min:0,max:1,step:.02,value:$e,onChange:s=>{$e=s}},"Bounciness"),c("range-slider",{min:0,max:2,step:.1,value:Ke,onChange:s=>{Ke=s}},"Coefficient of friction"),c("color-picker",{value:Ze,onChange:s=>{Ze=s}},"Color:"));var xs=Xn;var Rn=document.createElement("div"),Yn={name:"Rectangle wall",description:"",element:Rn,drawFunc(s,e){if(s.lastX!==0&&s.lastY!==0){let t=s.cnv.getContext("2d");t.strokeStyle="black",t.strokeRect(s.mouseX,s.mouseY,s.lastX-s.mouseX,s.lastY-s.mouseY)}},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){if(Math.abs(s.lastX-s.mouseX)<5&&Math.abs(s.lastY-s.mouseY)<5)return;s.physics.addRectWall(s.lastX/2+s.mouseX/2,s.lastY/2+s.mouseY/2,2*Math.abs(s.lastX/2-s.mouseX/2),2*Math.abs(s.lastY/2-s.mouseY/2));let e=s;e.physics.bodies[e.physics.bodies.length-1].style=M.Beige}}},vs=Yn;var Ae=.2,et=.5,tt=F,ws=document.createElement("div"),Ln={name:"Rectangle body",description:"",element:ws,drawFunc(s,e){let t=s.cnv.getContext("2d");s.lastX!==0&&s.lastY!==0&&(t.strokeStyle="black",t.strokeRect(s.mouseX,s.mouseY,s.lastX-s.mouseX,s.lastY-s.mouseY))},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=Math.abs(s.mouseX-s.lastX),t=Math.abs(s.mouseY-s.lastY);if(e/t>50||t/e>50||t===0||e===0)return;s.physics.addRectBody(s.lastX/2+s.mouseX/2,s.lastY/2+s.mouseY/2,2*Math.abs(s.lastX/2-s.mouseX/2),2*Math.abs(s.lastY/2-s.mouseY/2),et,Ae,tt)}},keyGotUpFunc(s){},keyGotDownFunc(s){}};ws.append(c("range-slider",{min:0,max:.6,step:.02,value:Ae,onChange:s=>{Ae=s}},"Bounciness"),c("range-slider",{min:0,max:2,step:.1,value:et,onChange:s=>{et=s}},"Coefficient of friction"),c("color-picker",{value:tt,onChange:s=>{tt=s}},"Color:"));var ks=Ln;var De=35,st=.5,nt=.5,Ne=4,ze=24,ot=F,Ms=document.createElement("div");function Ss(s=24,e=4){return[...new Array(s).keys()].map(t=>i.fromAnglePNorm(Math.PI*2*t/s,e))}var On={name:"Squircle",description:"",element:Ms,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=Ss(ze,Ne);if(o.forEach(n=>n.mult(De)),s.mouseDown){t.beginPath(),t.moveTo(s.lastX+o[0].x,s.lastY+o[0].y);for(let n=1;n<o.length;n+=1)t.lineTo(s.lastX+o[n].x,s.lastY+o[n].y);t.closePath(),t.stroke()}else{t.beginPath(),t.moveTo(s.mouseX+o[0].x,s.mouseY+o[0].y);for(let n=1;n<o.length;n+=1)t.lineTo(s.mouseX+o[n].x,s.mouseY+o[n].y);t.closePath(),t.stroke()}s.mouseDown&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){let e=Ss(ze,Ne),t=new i(s.lastX,s.lastY);if(e.forEach(o=>{o.mult(De),o.add(t)}),s.lastX!==0&&s.lastY!==0){let o=new x(P.Polygon(e),1,st,nt);o.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),o.style=ot,s.physics.addBody(o)}}};Ms.append(c("range-slider",{min:5,max:120,step:1,value:De,onChange:s=>{De=s}},"Size"),c("range-slider",{min:2,max:7,step:1,value:9-Ne,onChange:s=>{Ne=9-s}},"Roundness"),c("range-slider",{min:12,max:36,step:1,value:ze,onChange:s=>{ze=s}},"Resolution"),c("range-slider",{min:0,max:.9,step:.02,value:st,onChange:s=>{st=s}},"Bounciness"),c("range-slider",{min:0,max:2,step:.1,value:nt,onChange:s=>{nt=s}},"Coefficient of friction"),c("color-picker",{value:ot,onChange:s=>{ot=s}},"Color:"));var Ps=On;var G=35;var it=1.5,at=24,rt=1,Cs=document.createElement("div"),Dn={name:"Soft square",description:"",element:Cs,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black",s.mouseDown?t.strokeRect(s.lastX-G,s.lastY-G,G*2,G*2):t.strokeRect(s.mouseX-G,s.mouseY-G,G*2,G*2),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){s.lastX!==0&&s.lastY!==0&&s.physics.addSoftSquare(new i(s.lastX,s.lastY),G*2,it,new i(s.lastX-s.mouseX,s.lastY-s.mouseY),at,rt)}};Cs.append(c("range-slider",{min:5,max:100,step:1,value:G,onChange:s=>{G=s}},"Size"),c("range-slider",{min:.4,max:3,step:.1,value:rt,onChange:s=>{rt=s}},"Pressure"),c("range-slider",{min:0,max:2,step:.1,value:it,onChange:s=>{it=s}},"Coefficient of friction"),c("range-slider",{min:16,max:48,step:8,value:at,onChange:s=>{at=s}},"Resolution"));var Is=Dn;var He=20,Es=document.createElement("div"),Nn={name:"Wall drawer",description:"",element:Es,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black",t.beginPath(),t.arc(s.mouseX,s.mouseY,He,0,2*Math.PI),t.stroke(),s.lastX!==0&&s.lastY!==0&&s.physics.addFixedBall(s.mouseX,s.mouseY,He)}};Es.append(c("range-slider",{min:5,max:70,step:1,value:He,onChange:s=>{He=s}},"Size"));var Bs=Nn;var lt=45,ct=.2,ht=1.5,dt=F,Ts=document.createElement("div");function mt(s){let e=s;return s===void 0&&(e=new i(0,0)),P.Polygon([...new Array(3).keys()].map(t=>{let o=2*Math.PI*t/3,n=i.fromAngle(o);return n.rotate(-(Math.PI*7)/6),n.mult(lt),n.add(e),n}))}var zn={name:"Triangle",description:"",element:Ts,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),mt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),mt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new x(mt(e),1,ct,ht);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=dt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Ts.append(c("range-slider",{min:5,max:120,step:1,value:lt,onChange:s=>{lt=s}},"Size"),c("range-slider",{min:0,max:.35,step:.02,value:ct,onChange:s=>{ct=s}},"Bounciness"),c("range-slider",{min:0,max:2,step:.1,value:ht,onChange:s=>{ht=s}},"Coefficient of friction"),c("color-picker",{value:dt,onChange:s=>{dt=s}},"Color:"));var Fs=zn;var ut=45,ft=.2,gt=1.5,pt=F,Xs=document.createElement("div");function bt(s){let e=s;return s===void 0&&(e=new i(0,0)),P.Polygon([...new Array(5).keys()].map(t=>{let o=2*Math.PI*t/5,n=i.fromAngle(o);return n.rotate(-Math.PI/10),n.mult(ut),n.add(e),n}))}var Hn={name:"Pentagon",description:"",element:Xs,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),bt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),bt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new x(bt(e),1,ft,gt);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=pt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Xs.append(c("range-slider",{min:5,max:120,step:1,value:ut,onChange:s=>{ut=s}},"Size"),c("range-slider",{min:0,max:1,step:.02,value:ft,onChange:s=>{ft=s}},"Bounciness"),c("range-slider",{min:0,max:2,step:.1,value:gt,onChange:s=>{gt=s}},"Coefficient of friction"),c("color-picker",{value:pt,onChange:s=>{pt=s}},"Color:"));var Rs=Hn;var yt=45,xt=.2,vt=1.5,wt=F,Ys=document.createElement("div");function kt(s){let e=s;return s===void 0&&(e=new i(0,0)),P.Polygon([...new Array(6).keys()].map(t=>{let o=2*Math.PI*t/6,n=i.fromAngle(o);return n.mult(yt),n.add(e),n}))}var jn={name:"Hexagon",description:"",element:Ys,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),kt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),kt(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new x(kt(e),1,xt,vt);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=wt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Ys.append(c("range-slider",{min:5,max:120,step:1,value:yt,onChange:s=>{yt=s}},"Size"),c("range-slider",{min:0,max:1,step:.02,value:xt,onChange:s=>{xt=s}},"Bounciness"),c("range-slider",{min:0,max:2,step:.1,value:vt,onChange:s=>{vt=s}},"Coefficient of friction"),c("color-picker",{value:wt,onChange:s=>{wt=s}},"Color:"));var Ls=jn;var Mt=45,St=.2,Pt=1.5,Ct=F,Os=document.createElement("div");function It(s){let e=s;return s===void 0&&(e=new i(0,0)),P.Polygon([...new Array(8).keys()].map(t=>{let o=2*Math.PI*t/8,n=i.fromAngle(o);return n.mult(Mt),n.add(e),n}))}var qn={name:"Octagon",description:"",element:Os,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),It(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),It(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new x(It(e),1,St,Pt);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=Ct,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Os.append(c("range-slider",{min:5,max:120,step:1,value:Mt,onChange:s=>{Mt=s}},"Size"),c("range-slider",{min:0,max:1,step:.02,value:St,onChange:s=>{St=s}},"Bounciness"),c("range-slider",{min:0,max:2,step:.1,value:Pt,onChange:s=>{Pt=s}},"Coefficient of friction"),c("color-picker",{value:Ct,onChange:s=>{Ct=s}},"Color:"));var Ds=qn;var je=45,Et=.2,Bt=1.5,Tt=F,Ns=document.createElement("div");function Ft(s){let e=s;s===void 0&&(e=new i(0,0));let t=P.Polygon([...new Array(11).keys()].map(o=>{let n=Math.PI*o/11,a=i.fromAngle(n);return a.mult(je),a.add(e),a}));return t.points.push(new i(-je+e.x,e.y)),t}var Vn={name:"Half circle",description:"",element:Ns,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown?(o.x=s.lastX,o.y=s.lastY,t.beginPath(),Ft(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()):(t.beginPath(),Ft(o).points.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()),s.lastX!==0&&s.lastY!==0&&(t.beginPath(),t.moveTo(s.mouseX,s.mouseY),t.lineTo(s.lastX,s.lastY),t.stroke())},startInteractionFunc(s){},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=new i(s.lastX,s.lastY),t=new x(Ft(e),1,Et,Bt);t.vel=new i(s.lastX-s.mouseX,s.lastY-s.mouseY),t.style=Tt,Number.isFinite(t.pos.x)&&Number.isFinite(t.pos.y)&&Number.isFinite(t.vel.x)&&Number.isFinite(t.vel.y)||(t.vel.x=0,t.vel.y=0),s.physics.addBody(t)}}};Ns.append(c("range-slider",{min:5,max:120,step:1,value:je,onChange:s=>{je=s}},"Size"),c("range-slider",{min:0,max:1,step:.02,value:Et,onChange:s=>{Et=s}},"Bounciness"),c("range-slider",{min:0,max:2,step:.1,value:Bt,onChange:s=>{Bt=s}},"Coefficient of friction"),c("color-picker",{value:Tt,onChange:s=>{Tt=s}},"Color:"));var zs=Vn;var Xt=.2,Rt=1.5,Yt=F,Hs=document.createElement("div"),q=[],Wn={name:"Draw convex shape",description:"",element:Hs,drawFunc(s,e){let t=s.cnv.getContext("2d");t.strokeStyle="black";let o=new i(s.mouseX,s.mouseY);s.mouseDown&&(q.some(n=>n.x===o.x&&n.y===o.y)||q.push(o),q.length>3&&(q=P.Polygon(q).getConvexHull().points)),t.beginPath(),q.forEach((n,a)=>{a===0?t.moveTo(n.x,n.y):t.lineTo(n.x,n.y)}),t.closePath(),t.stroke()},startInteractionFunc(s){},endInteractionFunc(s){if(q.length>3)q=P.Polygon(q).getConvexHull().points;else{q=[];return}if(s.lastX!==0&&s.lastY!==0){let e=new x(P.Polygon(q),1,Xt,Rt),o=[...new Array(100).keys()].map(n=>i.fromAngle(2*Math.PI*n/100)).map(n=>e.shape.getMinMaxInDirection(n).size());if(Math.max(...o)/Math.min(...o)>15){q=[];return}e.style=Yt,Number.isFinite(e.pos.x)&&Number.isFinite(e.pos.y)&&Number.isFinite(e.vel.x)&&Number.isFinite(e.vel.y)||(e.vel.x=0,e.vel.y=0),s.physics.addBody(e)}q=[]}};Hs.append(c("range-slider",{min:0,max:.35,step:.02,value:Xt,onChange:s=>{Xt=s}},"Bounciness"),c("range-slider",{min:0,max:2,step:.1,value:Rt,onChange:s=>{Rt=s}},"Coefficient of friction"),c("color-picker",{value:Yt,onChange:s=>{Yt=s}},"Color:"));var js=Wn;var ue=[xs,ks,vs,Bs,js,Ps,Is,zs,Fs,Rs,Ls,Ds],N=ue[0],qs=document.createElement("div"),Lt=c("div",{className:"full-width"}),Vs;function Gn(){return ue.indexOf(N)}function Ws(s,e){var o;let t=e;(o=N.deactivated)==null||o.call(N,Vs),t[Gn()].bgColor=M.Independence,t[s].bgColor=M.pinkDarker,Lt.innerHTML="",Lt.appendChild(ue[s].element),N=ue[s]}var Be=ue.map((s,e)=>c("hover-detector-btn",{onClick:()=>{Ws(e,Be)}},s.name)),Un={name:"Shapes",description:"",element:qs,drawFunc(s,e){var t;(t=N.drawFunc)==null||t.call(N,s,e)},startInteractionFunc(s){var e;(e=N.startInteractionFunc)==null||e.call(N,s)},endInteractionFunc(s){var e;(e=N.endInteractionFunc)==null||e.call(N,s)},init(s){Vs=s,ue.forEach(e=>{var t;return(t=e.init)==null?void 0:t.call(e,s)}),Be.forEach((e,t)=>{t===0&&e.asUpper(),t===Be.length-1&&e.asLast()})}};qs.append(c("space-height",{height:1}),...Be,Lt);Ws(0,Be);var Gs=Un;var Ot=!1,Te=!0,Dt=new i(0,0),Nt=0,ne=1e4,oe=new C(1,ne);oe.attachObject(new x(P.Circle(1,new i(0,0))));var Us=document.createElement("div");function _s(s){let{choosed:e}=s,t=new i(s.lastX,s.lastY);if(s.lastX!==0&&s.lastY!==0&&e instanceof x){let o=i.sub(t,Dt);return o.rotate(e.rotation-Nt),Te&&(o.x=0,o.y=0),o.add(e.pos),o}return t}function _n(s,e){return oe.length=s.dist(e),oe.springConstant=ne,oe.objects[0].pos=s,oe.objects[0].shape.points[0]=s,oe.pinHere(e.x,e.y),oe}var Jn={name:"Spring creator",description:"",element:Us,drawFunc(s,e){let t=s.cnv.getContext("2d");if(t.save(),s.lastX!==0&&s.lastY!==0){t.fillStyle="#00000000",t.strokeStyle="#FFFFFF";let n=_s(s),a=new i(s.mouseX,s.mouseY),r=_n(n,a);s.renderer.renderSpring(r,t)}let o=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY);o instanceof x&&(t.globalAlpha=.6,t.fillStyle="#00000000",t.strokeStyle="#FFFFFF",t.lineWidth=3,s.renderer.renderBody(o,t)),t.restore()},startInteractionFunc(s){s.choosed instanceof x?(Dt=s.choosed.pos.copy,Nt=s.choosed.rotation):typeof s.choosed!="boolean"&&(Dt=new i(s.choosed.x,s.choosed.y),Nt=0)},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY),t,o=_s(s),n=new i(s.mouseX,s.mouseY);s.choosed instanceof x&&Te&&(o=s.choosed.pos.copy),e instanceof x&&Te&&(n=e.pos.copy);let a=C;if(typeof e=="boolean"&&(e={x:s.mouseX,y:s.mouseY,pinPoint:!0}),s.choosed===e||s.choosed===void 0&&e===void 0||s.choosed instanceof Object&&e instanceof Object&&"pinPoint"in s.choosed&&"pinPoint"in e||(s.choosed instanceof Object&&e instanceof Object&&"pinPoint"in s.choosed&&"pos"in e?(t=new a(Math.sqrt((s.choosed.x-e.pos.x)**2+(s.choosed.y-e.pos.y)**2),ne),t.attachObject(e,n),t.pinHere(s.choosed.x,s.choosed.y)):e instanceof Object&&s.choosed instanceof Object&&"pos"in s.choosed&&"pinPoint"in e?(t=new a(Math.sqrt((s.choosed.pos.x-e.x)**2+(s.choosed.pos.y-e.y)**2),ne),t.attachObject(s.choosed,o),t.pinHere(e.x,e.y)):s.choosed instanceof Object&&e instanceof Object&&"pos"in s.choosed&&"pos"in e&&(t=new a(Math.sqrt((s.choosed.pos.x-e.pos.x)**2+(s.choosed.pos.y-e.pos.y)**2),ne),t.attachObject(s.choosed,o),t.attachObject(e,n)),typeof t=="undefined"))return;s.physics.addSpring(t),Ot&&t.lockRotation()}}};Us.append(c("check-box",{checked:Ot,onChange:s=>{Ot=s}},"Lock rotation"),c("check-box",{checked:Te,onChange:s=>{Te=s}},"Snap to center"),c("range-slider",{min:2e3,max:1e5,value:ne,step:200,onChange:s=>{ne=s}},"Spring stiffness"));var Js=Jn;var zt=!1,Fe=!0,Ht=new i(0,0),jt=0,fe=new B(1);fe.attachObject(new x(P.Circle(1,new i(0,0))));var qt=document.createElement("div");function Qs(s){let{choosed:e}=s,t=new i(s.lastX,s.lastY);if(s.lastX!==0&&s.lastY!==0&&e instanceof x){let o=i.sub(t,Ht);return o.rotate(e.rotation-jt),Fe&&(o.x=0,o.y=0),o.add(e.pos),o}return t}function Qn(s,e){return fe.length=s.dist(e),fe.objects[0].pos=s,fe.objects[0].shape.points[0]=s,fe.pinHere(e.x,e.y),fe}var $n={name:"Stick creator",description:"",element:qt,drawFunc(s,e){let t=s.cnv.getContext("2d");if(t.save(),s.lastX!==0&&s.lastY!==0){t.fillStyle="#00000000",t.strokeStyle="#FFFFFF";let n=Qs(s),a=new i(s.mouseX,s.mouseY),r=Qn(n,a);s.renderer.renderStick(r,t)}let o=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY);o instanceof x&&(t.globalAlpha=.6,t.fillStyle="#00000000",t.strokeStyle="#FFFFFF",t.lineWidth=3,s.renderer.renderBody(o,t)),t.restore()},startInteractionFunc(s){s.choosed instanceof x?(Ht=s.choosed.pos.copy,jt=s.choosed.rotation):typeof s.choosed!="boolean"&&(Ht=new i(s.choosed.x,s.choosed.y),jt=0)},endInteractionFunc(s){if(s.lastX!==0&&s.lastY!==0){let e=s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY),t,o=Qs(s),n=new i(s.mouseX,s.mouseY);s.choosed instanceof x&&Fe&&(o=s.choosed.pos.copy),e instanceof x&&Fe&&(n=e.pos.copy);let a=B;if(typeof e=="boolean"&&(e={x:s.mouseX,y:s.mouseY,pinPoint:!0}),typeof s.choosed=="boolean"||s.choosed===e||s.choosed===void 0&&e===void 0||"pinPoint"in s.choosed&&"pinPoint"in e||("pinPoint"in s.choosed&&"pos"in e?(t=new a(Math.sqrt((s.choosed.x-e.pos.x)**2+(s.choosed.y-e.pos.y)**2)),t.attachObject(e,n),t.pinHere(s.choosed.x,s.choosed.y)):"pinPoint"in e&&"pos"in s.choosed?(t=new a(Math.sqrt((s.choosed.pos.x-e.x)**2+(s.choosed.pos.y-e.y)**2)),t.attachObject(s.choosed,o),t.pinHere(e.x,e.y)):"pos"in s.choosed&&"pos"in e&&(t=new a(Math.sqrt((s.choosed.pos.x-e.pos.x)**2+(s.choosed.pos.y-e.pos.y)**2)),t.attachObject(s.choosed,o),t.attachObject(e,n)),typeof t=="undefined"))return;s.physics.addSpring(t),zt&&t.lockRotation()}},keyGotUpFunc(s){},keyGotDownFunc(s){}};[c("check-box",{checked:zt,onChange:s=>{zt=s}},"Lock rotation"),c("check-box",{checked:Fe,onChange:s=>{Fe=s}},"Snap to center")].forEach(qt.appendChild.bind(qt));var $s=$n;var Ks=document.createElement("template");Ks.innerHTML=`
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
`;var Zs=class extends HTMLElement{constructor(){super();this.minNum=0,this.maxNum=0,this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(Ks.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",{id:"mainContainer"},c("p",{className:"slider-label"},c("slot",null)),c("input",{id:"slider",type:"range",className:"slider"}),c("input",{id:"number-input",type:"number",className:"number"})))}get slider(){return this.shadowRoot.querySelector("#slider")}get numInput(){return this.shadowRoot.querySelector("#number-input")}set min(e){this.slider.min=e,this.numInput.min=e,this.minNum=e}set max(e){this.slider.max=e,this.numInput.max=e,this.maxNum=e}set step(e){this.slider.step=e,this.numInput.step=e}set value(e){this.slider.value=e,this.numInput.value=e}normalizeValue(e){return Math.min(Math.max(this.minNum,e),this.maxNum)}disable(){this.shadowRoot.querySelector("#mainContainer").classList.add("disabled")}enable(){this.shadowRoot.querySelector("#mainContainer").classList.remove("disabled")}set onChange(e){this.slider.onchange=t=>{let o=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(o)),this.value=o},this.slider.oninput=t=>{let o=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(o)),this.value=o},this.numInput.onchange=t=>{let o=this.normalizeValue(t.target.valueAsNumber).toString();e(Number.parseFloat(o)),this.value=o}}};window.customElements.define("range-slider-number",Zs);var Kn=document.createElement("div"),Zn={name:"World settings",description:"",element:Kn,init(s){let e=s;this.element.append(c("range-slider",{min:0,max:5e3,step:200,value:e.physics.gravity.y,onChange:t=>{e.physics.gravity.y=t}},"Gravity"),c("range-slider",{min:-5e3,max:5e3,step:1e3,value:e.physics.gravity.x,onChange:t=>{e.physics.gravity.x=t}},"Gravity in X direction"),c("range-slider",{min:0,max:.99,step:.01,value:1-e.physics.airFriction,onChange:t=>{e.physics.setAirFriction(1-t)}},"Air friction"),c("range-slider-number",{min:700,max:1e4,step:10,value:e.worldSize.width,onChange:t=>{e.setWorldSize({width:t,height:e.worldSize.height})}},"World width"),c("range-slider-number",{min:700,max:5e3,step:10,value:e.worldSize.height,onChange:t=>{e.setWorldSize({width:e.worldSize.width,height:t})}},"World height"),c("check-box",{checked:e.drawCollisions,onChange:t=>{e.drawCollisions=t}},"Show collision data"),c("check-box",{checked:e.showAxes,onChange:t=>{e.showAxes=t}},"Show body axes"),c("check-box",{checked:e.showBoundingBoxes,onChange:t=>{e.showBoundingBoxes=t}},"Show boounding boxes"))}},As=Zn;var en=document.createElement("template");en.innerHTML=`
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
`;var tn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(en.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",{className:"number-label"},c("span",null,c("slot",null)),c("div",{id:"indicatorContainer"},c("hr",{id:"rotationIndicator"})),c("span",null,"\xA0"),c("span",{id:"numberPlace"}),c("span",{id:"symbolPlace"},"\xB0")))}set value(e){let t=e*180/Math.PI%360;this.shadowRoot.querySelector("#numberPlace").innerText=Math.abs(t).toFixed(),this.shadowRoot.querySelector("#rotationIndicator").style.transform=`translateY(-0.1em) rotate(${t}deg)`}get value(){return this.shadowRoot.querySelector("#numberPlace").innerText}hideNumber(){this.shadowRoot.querySelector("#numberPlace").classList.add("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.add("hidden")}showNumber(){this.shadowRoot.querySelector("#numberPlace").classList.remove("hidden"),this.shadowRoot.querySelector("#symbolPlace").classList.remove("hidden")}};window.customElements.define("angle-display",tn);var sn=document.createElement("template");sn.innerHTML=`
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
`;var nn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(sn.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",{id:"btn"},c("slot",null))),this.hidden=!1}set bgColor(e){this.btn.style.backgroundColor=e}set textColor(e){this.btn.style.color=e}get btn(){return this.shadowRoot.getElementById("btn")}set onClick(e){this.btn.onclick=e}smallMargin(){this.btn.style.marginTop="0.2em"}hide(){this.btn.classList.add("hidden"),this.hidden=!0}show(){this.btn.classList.remove("hidden"),this.hidden=!1}};window.customElements.define("button-btn",nn);var on=document.createElement("template");on.innerHTML=`
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
`;var an=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(on.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",null,c("input",{type:"file",id:"inputEl",name:"inputEl"}),c("label",{id:"inputLabel",htmlFor:"inputEl"},c("slot",null))))}get input(){return this.shadowRoot.getElementById("inputEl")}set accept(e){this.input.accept=e}set onFile(e){let t=o=>{o.target.files.length!==0&&e(o.target.files[0])};this.input.onchange=t}};window.customElements.define("file-input",an);var rn=document.createElement("template");rn.innerHTML=`
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
`;var ln=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(rn.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",{id:"container"},c("div",{id:"apply",className:"btn"},"Apply"),c("div",{id:"cancel",className:"btn"}," Cancel")))}set visible(e){if(e){let t=this.containerElement;t.style.display!=="flex"&&(t.style.display="flex")}else{let t=this.containerElement;t.style.display!=="none"&&(t.style.display="none")}}get containerElement(){return this.shadowRoot.getElementById("container")}get applyBtn(){return this.shadowRoot.getElementById("apply")}get cancelBtn(){return this.shadowRoot.getElementById("cancel")}set onApply(e){this.applyBtn.onclick=e}set onCancel(e){this.cancelBtn.onclick=e}};window.customElements.define("apply-cancel",ln);var cn=document.createElement("template");cn.innerHTML=`
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
`;var hn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(cn.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",null,c("span",null,c("slot",null)),c("ul",{id:"listHolder",className:"dropdown"})))}set entries(e){this.entryList=e;let{listHolder:t}=this;t.innerHTML="",t.append(...this.entryList.map(o=>c("li",{innerText:o})))}set value(e){this.listHolder.childNodes.forEach(t=>{"classList"in t&&(t.innerText===e?t.classList.add("chosen"):t.classList.remove("chosen"))})}get listHolder(){return this.shadowRoot.getElementById("listHolder")}set onChoice(e){let t=n=>{e(n.target.innerText),this.listHolder.classList.add("hidden"),this.listHolder.childNodes.forEach(a=>{"classList"in a&&(a.innerText===n.target.innerText?a.classList.add("chosen"):a.classList.remove("chosen"))}),setTimeout(()=>{this.listHolder.classList.remove("hidden")},20)},o=this.listHolder;this.listHolder.childNodes.forEach(n=>{let a=n.cloneNode(!0);a.addEventListener("click",t),o.replaceChild(a,n)})}};window.customElements.define("drop-down",hn);var dn=document.createElement("template");dn.innerHTML=`
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
`;var mn=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(dn.content.cloneNode(!0)),this.shadowRoot.appendChild(c("div",{className:"container"},c("input",{id:"collapsible",className:"toggle",type:"checkbox",checked:!0}),c("label",{htmlFor:"collapsible",className:"toggle",id:"toggleEl"},"More"),c("div",{className:"toClose"},c("slot",null))))}get input(){return this.shadowRoot.getElementById("collapsible")}set title(e){this.shadowRoot.querySelector("#toggleEl").innerText=e}collapse(){this.input.checked=!1}open(){this.input.checked=!0}set closed(e){this.input.checked=!e}};window.customElements.define("collapsible-element",mn);var A=7,ee=6.5,Vt=8,Wt=25,ge=7,un=8,qe=7,fn=7,Gt=23,pe=30,gn=4,d=!1,be=!1,ye=!1,k=!1,ie=!1,te=!1,ae=document.createElement("div"),O,V=!1,re=1,S=new i(0,0),xe=0,Xe="repeat",U=0,R=1,ve={body:!0,spring:!0};function Ve(s){ae.innerHTML="",V=!1;let e=c("collapsible-element",{title:"Bodies",closed:!0}),t=[];for(let a=gn;a<s.physics.bodies.length;a+=1){let r=s.physics.bodies[a],l=a-gn,h=c("hover-detector-btn",{bgColor:M.pinkDarker},`Body #${l}`);h.onClick=()=>{be=r,ye=!1},h.onEnter=()=>{ye=r},h.onLeave=()=>{ye===r&&(ye=!1)},a===s.physics.bodies.length-1&&h.asLast(),t.push(h)}e.append(...t);let o=c("collapsible-element",{title:"Sticks/Springs",closed:!0}),n=[];for(let a=0;a<s.physics.springs.length;a+=1){let r=s.physics.springs[a],l=r instanceof B?"Stick":"Spring",h=c("hover-detector-btn",{bgColor:M.pinkDarker},`${l} #${a}`);h.onClick=()=>{ie=r,te=!1},h.onEnter=()=>{te=r},h.onLeave=()=>{te===r&&(te=!1)},a===s.physics.bodies.length-1&&h.asLast(),n.push(h)}o.append(...n),ae.append(c("number-display",{value:""},"Selectable types:"),c("check-box",{checked:ve.body,onChange:a=>{ve.body=a}},"Body"),c("check-box",{checked:ve.spring,onChange:a=>{ve.spring=a}},"Stick/Spring"),e,o)}var Y="none";function pn(s){if(be instanceof x){let e=be;return be=!1,e}return ie instanceof C||!ve.body?!1:s.physics.getObjectAtCoordinates(s.mouseX,s.mouseY,4)}function We(s){if(be instanceof x||ie instanceof C)return"none";if(typeof V!="boolean"){let e=new i(s.mouseX,s.mouseY);return S.dist(e)<=un?"move-texture":new i(S.x,S.y-Gt).dist(e)<=qe?"rotate-texture":new i(S.x+pe,S.y+pe).dist(e)<=fn?"scale-texture-xy":"choose-texture"}if(s.timeMultiplier!==0&&!(d instanceof x&&d.m===0))return"none";if(d instanceof x){let e=d.boundingBox,t=new i(e.x.min,e.y.min),o=new i(e.x.max,e.y.min),n=new i(e.x.min,e.y.max),a=new i(e.x.max,e.y.max),r=i.add(i.lerp(o,t,.5),new i(0,-Wt)),l=new i(s.mouseX,s.mouseY);if(i.dist(r,l)<=Vt)return"rotate";if(i.dist(n,l)<=A)return"resize-bl";if(i.dist(a,l)<=A)return"resize-br";if(i.dist(t,l)<=A)return"resize-tl";if(i.dist(o,l)<=A)return"resize-tr";if(i.dist(i.lerp(o,t,.5),l)<=ee)return"resize-t";if(i.dist(i.lerp(a,n,.5),l)<=ee)return"resize-b";if(i.dist(i.lerp(t,n,.5),l)<=ee)return"resize-l";if(i.dist(i.lerp(o,a,.5),l)<=ee)return"resize-r";if(l.x>=t.x&&l.y>=t.y&&l.x<=a.x&&l.y<=a.y)return"move"}else if(typeof k!="boolean"){let e=k.points,t=new i(s.mouseX,s.mouseY);if(e[0].dist(t)<=ge)return"move-spring0";if(e[1].dist(t)<=ge)return"move-spring1"}return"none"}function An(s){if(!(d instanceof x))return;let e=d.boundingBox,t=new i(e.x.min,e.y.min),o=new i(e.x.max,e.y.min),n=new i(e.x.min,e.y.max),a=new i(e.x.max,e.y.max);R=1,s==="rotate"&&(U=d.rotation),s==="resize-bl"&&(U=i.sub(n,o).heading),s==="resize-br"&&(U=i.sub(a,t).heading),s==="resize-tl"&&(U=i.sub(t,a).heading),s==="resize-tr"&&(U=i.sub(o,n).heading),s==="resize-t"&&(U=new i(0,-1).heading),s==="resize-b"&&(U=new i(0,1).heading),s==="resize-l"&&(U=new i(-1,0).heading),s==="resize-r"&&(U=new i(1,0).heading),s==="rotate-texture"&&(U=Math.PI)}function Ut(s){if(typeof d!="boolean"){let e=new i(s.mouseX,s.mouseY),t=new i(s.oldMouseX,s.oldMouseY),o=i.sub(t,d.pos),n=i.sub(e,d.pos),a=d.boundingBox,r=new i(a.x.min,a.y.min),l=new i(a.x.max,a.y.min),h=new i(a.x.min,a.y.max),f=new i(a.x.max,a.y.max),m=i.lerp(r,l,.5),u=i.lerp(h,f,.5),p=i.lerp(f,l,.5),g=i.lerp(h,r,.5),y=i.fromAngle(U),b=1;switch(Y){case"move":d.move(new i(s.mouseX-s.oldMouseX,s.mouseY-s.oldMouseY));break;case"rotate":d.rotate(n.heading-o.heading);break;case"resize-bl":b=i.dot(y,i.sub(e,l))/i.dot(y,i.sub(t,l)),b*R>=.03?(d.scaleAround(l,b),d.textureTransform.offset.mult(b),d.textureTransform.scale*=b,R*=b):Y="none";break;case"resize-br":b=i.dot(y,i.sub(e,r))/i.dot(y,i.sub(t,r)),b*R>=.03?(d.scaleAround(r,b),d.textureTransform.offset.mult(b),d.textureTransform.scale*=b,R*=b):Y="none";break;case"resize-tl":b=i.dot(y,i.sub(e,f))/i.dot(y,i.sub(t,f)),b*R>=.03?(d.scaleAround(f,b),d.textureTransform.offset.mult(b),d.textureTransform.scale*=b,R*=b):Y="none";break;case"resize-tr":b=i.dot(y,i.sub(e,h))/i.dot(y,i.sub(t,h)),b*R>=.03?(d.scaleAround(h,b),d.textureTransform.offset.mult(b),d.textureTransform.scale*=b,R*=b):Y="none";break;case"resize-t":b=i.dot(y,i.sub(e,u))/i.dot(y,i.sub(t,u)),b*R>=.1?(d.scaleAroundY(u,b),R*=b):Y="none";break;case"resize-b":b=i.dot(y,i.sub(e,m))/i.dot(y,i.sub(t,m)),b*R>=.1?(d.scaleAroundY(m,b),R*=b):Y="none";break;case"resize-l":b=i.dot(y,i.sub(e,p))/i.dot(y,i.sub(t,p)),b*R>=.1?(d.scaleAroundX(p,b),R*=b):Y="none";break;case"resize-r":b=i.dot(y,i.sub(e,g))/i.dot(y,i.sub(t,g)),b*R>=.1?(d.scaleAroundX(g,b),R*=b):Y="none";break;default:break}}else if(typeof k!="boolean"){let e=new i(s.mouseX,s.mouseY);switch(Y){case"move-spring0":k.updateAttachPoint0(e,ge);break;case"move-spring1":k.updateAttachPoint1(e,ge);break;default:break}}if(typeof V!="boolean"&&typeof d!="boolean"){let e=new i(s.mouseX,s.mouseY),t=new i(s.oldMouseX,s.oldMouseY),o=i.sub(e,S),n=i.sub(t,S),a=new i(1,1);switch(Y){case"move-texture":S.x=s.mouseX,S.y=s.mouseY;break;case"scale-texture-xy":re*=i.dot(o,a)/i.dot(n,a),re*=i.dot(o,a)/i.dot(n,a);break;case"rotate-texture":xe+=o.heading-n.heading;break;default:break}}}var bn="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAyklEQVQ4T6XST0qCQRjH8Y8JBnoCr9DGjXQBEbqDm6QQgvZeoX0bQVy7cRtBeIPcewi3bYLKeF6mmAZBeZvN8Pz5PvOb53ka/p4mHnGDVgp9YIVrvCdft5FxV3guCpXmBD1sfsAhXrKseOUVcV/ivKgwDvAMn1ngFosisVRTgQ+YpsQ7zA7IjX/fZ/4KfEMHX4jmlKePUeFcBrhPzi0ujjTnN/wv8JjUXMQO7fjWqc0JeIB1qvJUdxydOgtQjazOys1Dbg6GfeqS+wZwAS6Pac4meQAAAABJRU5ErkJggg==') 6.5 6.5, auto",_t={none:"default",move:"move",rotate:bn,"resize-bl":"nesw-resize","resize-br":"nwse-resize","resize-tl":"nwse-resize","resize-tr":"nesw-resize","resize-t":"ns-resize","resize-b":"ns-resize","resize-l":"ew-resize","resize-r":"ew-resize","move-spring0":"move","move-spring1":"move","move-texture":"move","rotate-texture":bn,"scale-texture-xy":"nwse-resize","choose-texture":"default"};function yn(s){if(ie instanceof C){let o=ie;return ie=!1,o}if(!ve.spring)return!1;let e=new i(s.mouseX,s.mouseY),t=s.physics.springs.find(o=>o.getAsSegment().distFromPoint(e)<=ge);return typeof t=="undefined"?!1:t}function eo(s,e){if(d instanceof x)if(Y!=="rotate"){s.strokeStyle=M["Roman Silver"],s.setLineDash([5,3.5]),s.strokeRect(d.boundingBox.x.min,d.boundingBox.y.min,d.boundingBox.x.max-d.boundingBox.x.min,d.boundingBox.y.max-d.boundingBox.y.min),s.beginPath(),s.moveTo(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.min),s.lineTo(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.min-Wt),s.stroke(),s.fillStyle=M.blue,s.beginPath(),s.arc(d.boundingBox.x.min,d.boundingBox.y.min,A,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.min,d.boundingBox.y.max,A,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max,d.boundingBox.y.min,A,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max,d.boundingBox.y.max,A,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.min,d.boundingBox.y.min/2+d.boundingBox.y.max/2,ee,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max,d.boundingBox.y.min/2+d.boundingBox.y.max/2,ee,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.max,ee,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.min,ee,0,Math.PI*2),s.fill(),s.beginPath(),s.arc(d.boundingBox.x.max/2+d.boundingBox.x.min/2,d.boundingBox.y.min-Wt,Vt,0,Math.PI*2),s.fill();let t=We(e),o=_t[t],n=e.cnv.style;n.cursor!==o&&(n.cursor=o)}else s.strokeStyle=M["Roman Silver"],s.setLineDash([5,3.5]),s.beginPath(),s.moveTo(d.pos.x,d.pos.y),s.lineTo(e.mouseX,e.mouseY),s.stroke(),s.fillStyle=M.blue,s.beginPath(),s.arc(e.mouseX,e.mouseY,Vt,0,Math.PI*2),s.fill()}function to(s,e){if(typeof k!="boolean"){let t=k.points;s.fillStyle=M.blue,s.beginPath(),t.forEach(r=>{s.arc(r.x,r.y,ge,0,Math.PI*2)}),s.fill();let o=We(e),n=_t[o],a=e.cnv.style;a.cursor!==n&&(a.cursor=n)}}function so(s){let e=yn(s);if(typeof e!="boolean"){ae.innerHTML="",k=e;let t=c("number-display",{value:k.getAsSegment().length.toFixed(1)},"Length:\xA0"),o=c("range-slider-number",{min:15,max:Math.max(s.worldSize.width,s.worldSize.height),step:1,value:k.length.toFixed(1),onChange:r=>{typeof k!="boolean"&&(k.length=r)}},"Start length"),n;k instanceof C&&!(k instanceof B)?n=c("range-slider-number",{min:2e3,max:1e5,value:k.springConstant,step:200,onChange:r=>{k instanceof C&&(k.springConstant=r)}},"Spring stiffness"):n=c("div",null);let a=c("angle-display",{value:0},"Orientation:\xA0");a.hideNumber(),ae.append(c("number-display",{value:k instanceof B?"stick":"spring"},"Type:\xA0"),t,a,o,n,c("check-box",{checked:k.rotationLocked,onChange:r=>{typeof k!="boolean"&&(r?k.lockRotation():k.unlockRotation())}},"Locked"),c("button-btn",{bgColor:M["Imperial Red"],textColor:"white",onClick:()=>{typeof k!="boolean"&&(s.physics.removeObjFromSystem(k),Ve(s),O=()=>{},d=!1,k=!1)}},"Delete")),O=()=>{if(typeof k=="boolean")return;t.value=k.getAsSegment().length.toFixed(1);let r=k.getAsSegment();a.value=i.sub(r.b,r.a).heading}}else k=!1,Ve(s)}function no(s,e){if(s.strokeStyle=M["Roman Silver"],s.setLineDash([5,3.5]),Y==="rotate-texture"){let t=new i(e.mouseX,e.mouseY);s.beginPath(),s.moveTo(S.x,S.y),s.lineTo(t.x,t.y),s.stroke(),s.fillStyle=M.blue,s.setLineDash([]),s.beginPath(),s.arc(S.x,S.y,qe,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(t.x,t.y,qe,0,Math.PI*2),s.closePath(),s.fill();return}s.beginPath(),s.moveTo(S.x,S.y-Gt),s.lineTo(S.x,S.y),s.stroke(),s.beginPath(),s.moveTo(S.x,S.y),s.lineTo(S.x+pe,S.y+pe),s.stroke(),s.setLineDash([]),s.fillStyle=M.blue,s.beginPath(),s.arc(S.x,S.y,un,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(S.x,S.y-Gt,qe,0,Math.PI*2),s.closePath(),s.fill(),s.beginPath(),s.arc(S.x+pe,S.y+pe,fn,0,Math.PI*2),s.closePath(),s.fill()}var oo={name:"Select",description:"",element:ae,drawFunc(s,e){var a,r;be instanceof x&&((a=this.startInteractionFunc)==null||a.call(this,s)),ie instanceof C&&((r=this.startInteractionFunc)==null||r.call(this,s));let t=pn(s),o=yn(s),n=s.cnv.getContext("2d");if(n.save(),n.strokeStyle="orange",n.fillStyle="#00000000",n.setLineDash([]),n.lineWidth=4,typeof d!="boolean")if(s.renderer.renderBody(d,n),n.globalAlpha=.6,s.physics.getSpringsWithBody(d).forEach(l=>{n.fillStyle="#00000000",n.strokeStyle="#FFFFFF",l instanceof B?s.renderer.renderStick(l,n):l instanceof C&&s.renderer.renderSpring(l,n)}),n.globalAlpha=1,typeof V!="boolean"){let l=n.createPattern(V,Xe);xe%=Math.PI*2;let h=new DOMMatrix([re,0,0,re,S.x,S.y]);h.rotateSelf(0,0,xe*180/Math.PI),l.setTransform(h),n.fillStyle=l,n.strokeStyle="#00000000",s.renderer.renderBody(d,n),no(n,s),Ut(s);let f=We(s),m=_t[f],u=s.cnv.style;u.cursor!==m&&(u.cursor=m)}else(d.m===0||s.timeMultiplier===0)&&(Ut(s),eo(n,s));else{let l=s.cnv.style;l.cursor!=="default"&&(l.cursor="default")}if(typeof k!="boolean")n.fillStyle="#00000000",k instanceof B?s.renderer.renderStick(k,n):k instanceof C&&s.renderer.renderSpring(k,n),n.globalAlpha=.6,n.strokeStyle="#FFFFFF",k.objects.forEach(l=>s.renderer.renderBody(l,n)),n.globalAlpha=1,s.timeMultiplier===0&&(Ut(s),to(n,s));else if(typeof d=="boolean"){let l=s.cnv.style;l.cursor!=="default"&&(l.cursor="default")}ye instanceof x&&(n.strokeStyle="yellow",n.fillStyle="#00000000",n.setLineDash([3,5]),s.renderer.renderBody(ye,n)),te instanceof C&&(n.strokeStyle="yellow",n.fillStyle="#00000000",n.setLineDash([3,5]),te instanceof B?s.renderer.renderStick(te,n):s.renderer.renderSpring(te,n)),n.strokeStyle="yellow",n.fillStyle="#00000000",n.setLineDash([3,5]),typeof t!="boolean"?s.renderer.renderBody(t,n):typeof o!="boolean"&&(n.fillStyle="#00000000",o instanceof B?s.renderer.renderStick(o,n):s.renderer.renderSpring(o,n)),n.restore(),O==null||O()},startInteractionFunc(s){let e=We(s);if(e!=="none"){Y=e,An(e);return}Y="none";let t=pn(s);if(t instanceof x&&d!==t&&e==="none"){ae.innerHTML="",d=t,k=!1;let o=c("range-slider-number",{min:.1,max:25,step:.05,value:Number.parseFloat(d.density.toFixed(2)),onChange:v=>{d instanceof x&&(d.density=v),O==null||O()}},"Density");d.m===0&&o.disable();let n=c("check-box",{checked:d.m===0,onChange:v=>{d instanceof x&&(v?(o.disable(),d.density=0,d.vel=new i(0,0),d.ang=0,o.value=0):(o.enable(),d.density=1,o.value=d.density),O==null||O())}},"Fixed down"),a=c("number-display",{value:d.shape.r!==0?"circle":"polygon"},"Type:\xA0"),r=c("number-display",{value:d.m.toFixed(2)},"Mass:\xA0"),l=c("number-display",{value:d.pos.x.toFixed(2)},"X coord:\xA0"),h=c("number-display",{value:d.pos.y.toFixed(2)},"Y coord:\xA0"),f=c("angle-display",{value:d.rotation.toFixed(2)},"Rotation:\xA0"),m=c("number-display",{value:d.texture==="none"?"none":"set"},"Texture:\xA0"),u=c("file-input",{accept:"image/*",onFile:v=>{if(v.type.includes("image")){let T=new FileReader;T.readAsDataURL(v),T.onload=()=>{if(typeof T.result!="string")return;let L=new Image;L.onload=()=>{createImageBitmap(L).then(I=>{var _;d instanceof x?(s.timeMultiplier!==0&&((_=document.getElementById("pause"))==null||_.click()),V=I,re=Math.max(d.boundingBox.x.size()/I.width,d.boundingBox.y.size()/I.height),S.x=d.boundingBox.x.min,S.y=d.boundingBox.y.min,xe=0,d.texture="none"):V=!1})},L.src=T.result}}}},"Select image"),p=c("apply-cancel",{visible:!0,onApply:()=>{if(typeof d=="boolean"||typeof V=="boolean")return;let v=i.sub(S,d.pos);v.rotate(-d.rotation),d.textureTransform={scale:re,rotation:xe-d.rotation,offset:v},d.texture=V,d.textureRepeat=Xe,V=!1},onCancel:()=>{V=!1}}),g=c("button-btn",{textColor:"white",onClick:()=>{if(typeof d!="boolean"&&d.texture!=="none"){V=d.texture,d.texture="none",re=d.textureTransform.scale,xe=d.textureTransform.rotation+d.rotation;let v=d.textureTransform.offset.copy;v.rotate(d.rotation),v.add(d.pos),S.x=v.x,S.y=v.y}}},"Edit texture");g.smallMargin(),d.texture!=="none"?g.show():g.hide();let y=c("button-btn",{bgColor:M["Imperial Red"],textColor:"white",onClick:()=>{typeof d!="boolean"&&(d.texture="none")}},"Remove texture");y.smallMargin(),d.texture!=="none"?y.show():y.hide();let b=["repeat","repeat-x","repeat-y","no-repeat"];Xe=d.textureRepeat;let w=c("drop-down",{entries:b,value:Xe,onChoice:v=>{b.includes(v)&&(Xe=v,typeof d!="boolean"&&(d.textureRepeat=v))}},"\u25BC\xA0Texture mode");O=()=>{d instanceof x&&(l.value!=d.pos.x&&(l.value=d.pos.x.toFixed(2)),h.value!=d.pos.y&&(h.value=d.pos.y.toFixed(2)),r.value!=d.m&&(r.value=d.m.toFixed(2)),f.value=d.rotation.toFixed(2),m.value!==d.texture&&(m.value=d.texture==="none"?"none":"set"),typeof V!="boolean"?p.visible=!0:p.visible=!1,d.texture!=="none"?y.hidden&&y.show():y.hidden||y.hide(),d.texture!=="none"?g.hidden&&g.show():g.hidden||g.hide())},ae.append(a,r,f,l,h,n,o,c("range-slider-number",{min:0,max:.98,step:.02,value:d.k,onChange:v=>{d instanceof x&&(d.k=v)}},"Bounciness"),c("range-slider-number",{min:0,max:2,step:.1,value:d.fc,onChange:v=>{d instanceof x&&(d.fc=v)}},"Coefficient of friction"),c("color-picker",{value:d.style,onChange:v=>{d instanceof x&&(d.style=v)}},"Color:"),m,w,u,p,g,y,c("button-btn",{bgColor:M["Imperial Red"],textColor:"white",onClick:()=>{typeof d!="boolean"&&(s.physics.removeObjFromSystem(d),Ve(s),O=()=>{},d=!1,k=!1)}},"Delete"))}else typeof t=="boolean"&&e==="none"&&(d=t,O=()=>{},so(s))},endInteractionFunc(s){Y="none"},deactivated(){d=!1,k=!1,O=()=>{}},activated(s){Ve(s)}},xn=oo;var vn=[Gs,xn,$s,Js,cs,ls,As];var wn=class{constructor(){this.textures=[]}renderBody(e,t){if(e.shape.r!==0)t.beginPath(),t.arc(e.pos.x,e.pos.y,e.shape.r,0,Math.PI*2),t.stroke(),t.fill();else{t.beginPath(),t.moveTo(e.shape.points[0].x,e.shape.points[0].y);for(let o=1;o<e.shape.points.length;o+=1)t.lineTo(e.shape.points[o].x,e.shape.points[o].y);t.closePath(),t.stroke(),t.fill()}}renderSpring(e,t){let o=e.points,n=o[0].x,a=o[0].y,r=o[1].x,l=o[1].y,h=new i(r-n,l-a),f=h.copy;h.rotate(Math.PI/2),h.setMag(5);let m=new i(n,a),u=Math.floor(e.length/10);for(let p=1;p<=u;p+=1)p===u&&(h=new i(0,0)),t.beginPath(),t.moveTo(m.x,m.y),t.lineTo(n+p/u*f.x+h.x,a+p/u*f.y+h.y),t.stroke(),m=new i(n+p/u*f.x+h.x,a+p/u*f.y+h.y),h.mult(-1);t.strokeStyle="black",e.points.forEach(p=>{t.beginPath(),t.arc(p.x,p.y,2.5,0,Math.PI*2),t.fill(),t.stroke()})}renderStick(e,t){let o=e.points;t.beginPath(),t.moveTo(o[0].x,o[0].y),t.lineTo(o[1].x,o[1].y),t.stroke(),t.strokeStyle="black",e.points.forEach(n=>{t.beginPath(),t.arc(n.x,n.y,2.5,0,Math.PI*2),t.fill(),t.stroke()})}},kn=wn;var Q=vn,Ge=Q.map(s=>s.name),Mn=class{constructor(){this.resizeCanvas=()=>{let e=this.canvasHolder.getBoundingClientRect();this.cnv.width=e.width,this.cnv.height=window.innerHeight-e.top;let t=window.devicePixelRatio||1,o=e;this.cnv.width=o.width*t,this.cnv.height=o.height*t,this.cnv.style.width=`${o.width}px`,this.cnv.style.height=`${o.height}px`,this.scaling=this.cnv.height/this.worldSize.height,this.scaling/=t,this.scaling*=.9,this.viewOffsetX=.01*this.cnv.width,this.viewOffsetY=.03*this.cnv.height;let n=this.cnv.getContext("2d");n&&(n.scale(t,t),n.lineWidth=t),this.defaultSize=(this.cnv.width+this.cnv.height)/80};this.drawFunction=()=>{var n,a;Number.isFinite(this.lastFrameTime)||(this.lastFrameTime=performance.now());let e=performance.now()-this.lastFrameTime;Number.isFinite(e)||(e=0),e/=1e3,e=Math.min(e,.04166666666);let t=this.cnv.getContext("2d");t.fillStyle=M.Beige,t.fillRect(0,0,this.cnv.width,this.cnv.height),t.save(),t.translate(this.viewOffsetX,this.viewOffsetY),t.scale(this.scaling,this.scaling),this.physicsDraw(),(a=(n=Q[this.mode]).drawFunc)==null||a.call(n,this,e*this.timeMultiplier),t.restore(),this.collisionData=[],e*=this.timeMultiplier;let o=this.physics.bodies.find(r=>r.m!==0);o&&(this.right&&(o.ang=Math.min(o.ang+300*e,15)),this.left&&(o.ang=Math.max(o.ang-300*e,-15))),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.collisionData.push(...this.physics.update(e/5)),this.lastFrameTime=performance.now(),requestAnimationFrame(this.drawFunction),this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY};this.startInteraction=(e,t)=>{var o,n;this.mouseX=e/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=t/this.scaling-this.viewOffsetY/this.scaling,this.oldMouseX=this.mouseX,this.oldMouseY=this.mouseY,this.choosed=this.physics.getObjectAtCoordinates(this.mouseX,this.mouseY,4),!this.choosed&&typeof this.choosed=="boolean"&&(this.choosed={x:this.mouseX,y:this.mouseY,pinPoint:!0}),this.lastX=this.mouseX,this.lastY=this.mouseY,this.mouseDown=!0,(n=(o=Q[this.mode]).startInteractionFunc)==null||n.call(o,this)};this.endInteraction=(e,t)=>{var o,n;this.mouseX=e/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=t/this.scaling-this.viewOffsetY/this.scaling,(n=(o=Q[this.mode]).endInteractionFunc)==null||n.call(o,this),this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.discardInteraction=()=>{this.lastX=0,this.lastY=0,this.mouseDown=!1,this.choosed=!1};this.keyGotDown=e=>{let t=e.key;t==="s"&&this.spawnNewtonsCradle(this.cnv.width/2,this.cnv.height/2,.5,this.physics),t==="a"&&(this.scaling+=.01),t==="d"&&(this.scaling-=.01),t==="j"&&(this.viewOffsetX-=10),t==="l"&&(this.viewOffsetX+=10),t==="k"&&(this.viewOffsetY-=10),t==="i"&&(this.viewOffsetY+=10),t==="ArrowRight"&&(this.right=!0),t==="ArrowLeft"&&(this.left=!0)};this.keyGotUp=e=>{let t=e.key;t==="ArrowRight"&&(this.right=!1),t==="ArrowLeft"&&(this.left=!1)};this.startTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();return e.touches.length>1?(this.discardInteraction(),e.touches.length===2&&(this.touchIDs.push(e.touches[0].identifier),this.touchIDs.push(e.touches[1].identifier),this.touchCoords.push(new i(e.touches[0].clientX-t.left,e.touches[0].clientY-t.top)),this.touchCoords.push(new i(e.touches[1].clientX-t.left,e.touches[1].clientY-t.top))),e.touches.length>2&&(this.touchIDs=[],this.touchCoords=[]),!1):(this.startInteraction(e.changedTouches[0].clientX-t.left,e.changedTouches[0].clientY-t.top),!1)};this.endTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();return e.touches.length<=1&&(this.touchIDs=[],this.touchCoords=[]),this.endInteraction(e.changedTouches[0].clientX-t.left,e.changedTouches[0].clientY-t.top),!1};this.moveTouch=e=>{e.preventDefault();let t=this.canvasHolder.getBoundingClientRect();if(e.touches.length===2){let o=[];return e.touches.item(0).identifier===this.touchIDs[0]?(o.push(e.touches.item(0)),o.push(e.touches.item(1))):(o.push(e.touches.item(1)),o.push(e.touches.item(0))),o=o.map(n=>new i(n.clientX-t.left,n.clientY-t.top)),this.processMultiTouchGesture(this.touchCoords,o),this.touchCoords=o,!1}return e.touches.length>2||(this.mouseX=e.changedTouches[0].clientX-t.left,this.mouseY=e.changedTouches[0].clientY-t.top,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling),!1};this.processMultiTouchGesture=(e,t)=>{let o=i.add(e[1],e[0]);o.mult(.5);let n=i.add(t[1],t[0]);n.mult(.5);let a=i.dist(e[1],e[0]),r=i.dist(t[1],t[0]),l=Math.sqrt(r/a),h=i.add(o,n);h.mult(.5);let f=i.sub(n,o);f.mult(l),this.scaleAround(h,l),this.viewOffsetX+=f.x,this.viewOffsetY+=f.y};this.scaleAround=(e,t)=>{this.viewOffsetX=e.x-(e.x-this.viewOffsetX)*t,this.viewOffsetY=e.y-(e.y-this.viewOffsetY)*t,this.scaling*=t};this.startMouse=e=>(e.button===0&&this.startInteraction(e.offsetX,e.offsetY),e.button===2&&(this.rightButtonDown=new i(e.offsetX,e.offsetY),this.cnv.style.cursor="all-scroll"),!1);this.endMouse=e=>(e.button===0&&this.endInteraction(e.offsetX,e.offsetY),e.button===2&&(this.rightButtonDown=!1,this.cnv.style.cursor="default"),!1);this.handleMouseMovement=e=>{if(this.mouseX=e.offsetX,this.mouseY=e.offsetY,this.mouseX=this.mouseX/this.scaling-this.viewOffsetX/this.scaling,this.mouseY=this.mouseY/this.scaling-this.viewOffsetY/this.scaling,this.rightButtonDown){let t=new i(e.offsetX,e.offsetY),o=i.sub(t,this.rightButtonDown);this.viewOffsetX+=o.x,this.viewOffsetY+=o.y,this.rightButtonDown=t}};this.handleMouseWheel=e=>{e.preventDefault();let t=new i(e.offsetX,e.offsetY),o=5e-4;e.deltaMode===WheelEvent.DOM_DELTA_LINE&&(o/=16);let n=1-e.deltaY*o;this.scaleAround(t,n)};this.convertToPhysicsSpace=e=>new i(e.x/this.scaling-this.viewOffsetX/this.scaling,e.y/this.scaling-this.viewOffsetY/this.scaling);this.convertToCanvasSpace=e=>new i(e.x*this.scaling+this.viewOffsetX,e.y*this.scaling+this.viewOffsetY);this.physicsDraw=()=>{let e=this.cnv.getContext("2d");if(e){e.fillStyle=M.Independence,e.fillRect(0,0,this.worldSize.width,this.worldSize.height);let t=n=>{if(n.m===0&&(e.strokeStyle="#00000000"),n.shape.r!==0){let a=n;e.beginPath(),e.arc(a.pos.x,a.pos.y,a.shape.r,0,2*Math.PI),e.stroke(),e.fill(),n.m!==0&&(e.beginPath(),e.moveTo(a.pos.x,a.pos.y),e.lineTo(a.pos.x+a.shape.r*Math.cos(a.rotation),a.pos.y+a.shape.r*Math.sin(a.rotation)),e.stroke())}else e.beginPath(),e.moveTo(n.shape.points[n.shape.points.length-1].x,n.shape.points[n.shape.points.length-1].y),n.shape.points.forEach(a=>{e.lineTo(a.x,a.y)}),e.stroke(),e.fill(),n.m!==0&&(e.beginPath(),e.arc(n.pos.x,n.pos.y,1.5,0,Math.PI*2),e.stroke()),this.showAxes&&(e.strokeStyle="black",n.axes.forEach(a=>{e.beginPath(),e.moveTo(n.pos.x,n.pos.y),e.lineTo(n.pos.x+a.x*30,n.pos.y+a.y*30),e.stroke()}))};this.physics.bodies.forEach(n=>{e.fillStyle=n.style,e.strokeStyle="black",t(n)}),this.physics.bodies.forEach(n=>{if(n.texture==="none")return;let a=n.textureTransform,r=a.offset.copy;r.rotate(n.rotation),r.add(n.pos);let l=new DOMMatrix([a.scale,0,0,a.scale,r.x,r.y]);l.rotateSelf(0,0,(a.rotation+n.rotation)*180/Math.PI);let h=e.createPattern(n.texture,n.textureRepeat);h.setTransform(l),e.fillStyle=h,e.strokeStyle="#00000000",t(n)}),e.save(),e.lineWidth=2,this.physics.springs.forEach(n=>{n instanceof C&&!(n instanceof B)?(e.strokeStyle=M.blue,e.fillStyle=M.blue,this.renderer.renderSpring(n,e)):(e.strokeStyle=M.blue,e.fillStyle=M.blue,this.renderer.renderStick(n,e))}),e.restore(),e.strokeStyle="rgba(255, 255, 255, 0.2)",this.showBoundingBoxes&&this.physics.bodies.forEach(n=>{e.strokeRect(n.boundingBox.x.min,n.boundingBox.y.min,n.boundingBox.x.max-n.boundingBox.x.min,n.boundingBox.y.max-n.boundingBox.y.min)}),e.fillStyle=M["Maximum Yellow Red"],e.strokeStyle=M["Maximum Yellow Red"];let o=e.lineWidth;e.lineWidth=4,this.drawCollisions&&this.collisionData.forEach(n=>{e.beginPath(),e.moveTo(n.cp.x,n.cp.y),e.lineTo(n.cp.x+n.n.x*30,n.cp.y+n.n.y*30),e.stroke(),e.beginPath(),e.arc(n.cp.x,n.cp.y,4,0,Math.PI*2),e.fill()}),e.lineWidth=o}};this.spawnNewtonsCradle=(e,t,o,n)=>{let a=[],r=25,l=250,h=8;a.push(new x(P.Circle(o*r,new i(e,t)),1,1,0));let f=1;for(let m=0;m<h-1;m+=1)a.push(new x(P.Circle(o*r,new i(e+f*o*r*1.01*2,t)),1,1,0)),f*=-1,f>0&&(f+=1),m===h-2&&(a[a.length-1].vel.x=-Math.sign(f)*o*r*8);a.forEach(m=>{n.addBody(m);let u=new B(l);u.attachObject(m),u.pinHere(m.pos.x,m.pos.y-l),n.addSpring(u),u.lockRotation()})};this.modeButtonClicked=e=>{let t=e.target.id.replace("-btn",""),o=Ge.indexOf(t);this.switchToMode(o)};this.switchToMode=e=>{var n,a,r,l;let t=document.getElementById(`${Ge[this.mode]}-btn`);t&&t.classList.remove("bg-pink-darker"),this.sidebar.innerHTML="",(a=(n=Q[this.mode]).deactivated)==null||a.call(n,this),(l=(r=Q[e]).activated)==null||l.call(r,this);let o=document.getElementById(`${Ge[e]}-btn`);o&&o.classList.add("bg-pink-darker"),this.modeTitleHolder.innerText=Q[e].name,this.mode=e,this.sidebar.appendChild(Q[this.mode].element)};this.setupModes=()=>{let e=document.getElementById("button-holder");Ge.forEach((t,o)=>{var a,r;let n=document.createElement("div");n.classList.add("big-button"),n.id=`${t}-btn`,n.textContent=Q[o].name,(r=(a=Q[o]).init)==null||r.call(a,this),n.onclick=this.modeButtonClicked,e&&e.appendChild(n)}),this.switchToMode(this.mode)};this.setTimeMultiplier=e=>{Number.isFinite(e)&&e>=0&&(this.timeMultiplier=e,e===0?this.pauseBtn.classList.add("bg-pink-darker"):this.pauseBtn.classList.remove("bg-pink-darker"))};this.getTimeMultiplier=()=>this.timeMultiplier;this.setPhysics=e=>{e instanceof de&&(this.physics=e)};this.getPhysics=()=>this.physics;this.physics=new de,this.mouseX=0,this.mouseY=0,this.oldMouseX=0,this.oldMouseY=0,this.mouseDown=!1,this.defaultSize=30,this.k=.5,this.fc=2,this.springConstant=2e3,this.scaling=1,this.viewOffsetX=0,this.viewOffsetY=0,this.mode=0,this.lastX=0,this.lastY=0,this.touchIDs=[],this.touchCoords=[],this.rightButtonDown=!1,this.timeMultiplier=1,this.lastFrameTime=performance.now(),this.choosed=!1,this.drawCollisions=!1,this.showAxes=!1,this.worldSize={width:0,height:0},this.collisionData=[],this.showBoundingBoxes=!1,this.renderer=new kn,this.left=!1,this.right=!1,this.cnv=document.getElementById("defaulCanvas0"),this.canvasHolder=document.getElementById("canvas-holder"),this.sidebar=document.getElementById("sidebar"),this.modeTitleHolder=document.getElementById("mode-title-text"),this.pauseBtn=document.getElementById("pause"),this.setWorldSize({width:2e3,height:1e3}),this.physics.setGravity(new i(0,1e3)),this.physics.setAirFriction(.9),this.cnv.addEventListener("touchstart",this.startTouch,!1),this.cnv.addEventListener("touchend",this.endTouch,!1),this.cnv.addEventListener("touchmove",this.moveTouch,!1),this.cnv.addEventListener("mousedown",this.startMouse,!1),this.cnv.addEventListener("mouseup",this.endMouse,!1),this.cnv.addEventListener("mousemove",this.handleMouseMovement,!1),this.cnv.addEventListener("wheel",this.handleMouseWheel),this.cnv.addEventListener("contextmenu",e=>e.preventDefault()),document.addEventListener("keydown",this.keyGotDown,!1),document.addEventListener("keyup",this.keyGotUp,!1),window.addEventListener("resize",this.resizeCanvas,!1),this.resizeCanvas(),this.setupModes(),Qe(this),requestAnimationFrame(this.drawFunction)}setWorldSize(e){this.physics.setBounds(0,0,e.width,e.height),this.worldSize=e}},Sn=Mn;window.onload=()=>{window.editorApp=new Sn,"serviceWorker"in navigator&&navigator.serviceWorker.register("serviceworker.js").then(()=>{},s=>{console.log("ServiceWorker registration failed: ",s)})};})();
