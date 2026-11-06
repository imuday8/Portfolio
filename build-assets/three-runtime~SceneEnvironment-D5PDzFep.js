import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{r as t}from"./three-runtime~index-DqlbP2cJ.js";import{A as n,Ar as r,F as i,Ga as a,Rn as o,U as s,Yt as c,ar as l,bt as u,do as d,ea as f,io as p,ir as m,j as h,kr as g,mr as _,no as v,ro as y,ta as b,to as x,tr as S,vt as C}from"./three-runtime~SceneEnvironment-BF58tRDi.js";import{a as w,c as T,f as E}from"./three-runtime~SceneEnvironment-B8-8M-f2.js";import{t as D}from"./three-runtime~SceneEnvironment-CvVTau-c.js";var O=e(t()),k=parseInt(`187`.replace(/\D+/g,``)),A=class extends b{constructor(e=new v){super({uniforms:{inputBuffer:new a(null),depthBuffer:new a(null),resolution:new a(new v),texelSize:new a(new v),halfTexelSize:new a(new v),kernel:new a(0),scale:new a(1),cameraNear:new a(0),cameraFar:new a(1),minDepthThreshold:new a(0),maxDepthThreshold:new a(1),depthScale:new a(0),depthToBlurRatioBias:new a(.25)},fragmentShader:`#include <common>
        #include <dithering_pars_fragment>      
        uniform sampler2D inputBuffer;
        uniform sampler2D depthBuffer;
        uniform float cameraNear;
        uniform float cameraFar;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          float depthFactor = 0.0;
          
          #ifdef USE_DEPTH
            vec4 depth = texture2D(depthBuffer, vUv);
            depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
            depthFactor *= depthScale;
            depthFactor = max(0.0, min(1.0, depthFactor + 0.25));
          #endif
          
          vec4 sum = texture2D(inputBuffer, mix(vUv0, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv1, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv2, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv3, vUv, depthFactor));
          gl_FragColor = sum * 0.25 ;

          #include <dithering_fragment>
          #include <tonemapping_fragment>
          #include <${k>=154?`colorspace_fragment`:`encodings_fragment`}>
        }`,vertexShader:`uniform vec2 texelSize;
        uniform vec2 halfTexelSize;
        uniform float kernel;
        uniform float scale;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          vec2 uv = position.xy * 0.5 + 0.5;
          vUv = uv;

          vec2 dUv = (texelSize * vec2(kernel) + halfTexelSize) * scale;
          vUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);
          vUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);
          vUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);
          vUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);

          gl_Position = vec4(position.xy, 1.0, 1.0);
        }`,blending:0,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t),this.uniforms.halfTexelSize.value.set(e,t).multiplyScalar(.5)}setResolution(e){this.uniforms.resolution.value.copy(e)}},j=class{constructor({gl:e,resolution:t,width:r=500,height:a=500,minDepthThreshold:s=0,maxDepthThreshold:u=1,depthScale:p=0,depthToBlurRatioBias:m=.25}){this.renderToScreen=!1,this.renderTargetA=new d(t,t,{minFilter:o,magFilter:o,stencilBuffer:!1,depthBuffer:!1,type:c}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new A,this.convolutionMaterial.setTexelSize(1/r,1/a),this.convolutionMaterial.setResolution(new v(r,a)),this.scene=new f,this.camera=new i,this.convolutionMaterial.uniforms.minDepthThreshold.value=s,this.convolutionMaterial.uniforms.maxDepthThreshold.value=u,this.convolutionMaterial.uniforms.depthScale.value=p,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=m,this.convolutionMaterial.defines.USE_DEPTH=p>0;let g=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),_=new Float32Array([0,0,2,0,0,2]),y=new h;y.setAttribute(`position`,new n(g,3)),y.setAttribute(`uv`,new n(_,2)),this.screen=new l(y,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(e,t,n){let r=this.scene,i=this.camera,a=this.renderTargetA,o=this.renderTargetB,s=this.convolutionMaterial,c=s.uniforms;c.depthBuffer.value=t.depthTexture;let l=s.kernel,u=t,d,f,p;for(f=0,p=l.length-1;f<p;++f)d=f&1?o:a,c.kernel.value=l[f],c.inputBuffer.value=u.texture,e.setRenderTarget(d),e.render(r,i),u=d;c.kernel.value=l[f],c.inputBuffer.value=u.texture,e.setRenderTarget(this.renderToScreen?null:n),e.render(r,i)}},M=class extends _{constructor(e={}){super(e),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(e)}onBeforeCompile(e){var t;(t=e.defines)!=null&&t.USE_UV||(e.defines.USE_UV=``),e.uniforms.hasBlur=this._hasBlur,e.uniforms.tDiffuse=this._tDiffuse,e.uniforms.tDepth=this._tDepth,e.uniforms.distortionMap=this._distortionMap,e.uniforms.tDiffuseBlur=this._tDiffuseBlur,e.uniforms.textureMatrix=this._textureMatrix,e.uniforms.mirror=this._mirror,e.uniforms.mixBlur=this._mixBlur,e.uniforms.mixStrength=this._blurStrength,e.uniforms.minDepthThreshold=this._minDepthThreshold,e.uniforms.maxDepthThreshold=this._maxDepthThreshold,e.uniforms.depthScale=this._depthScale,e.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,e.uniforms.distortion=this._distortion,e.uniforms.mixContrast=this._mixContrast,e.vertexShader=`
        uniform mat4 textureMatrix;
        varying vec4 my_vUv;
      ${e.vertexShader}`,e.vertexShader=e.vertexShader.replace(`#include <project_vertex>`,`#include <project_vertex>
        my_vUv = textureMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`),e.fragmentShader=`
        uniform sampler2D tDiffuse;
        uniform sampler2D tDiffuseBlur;
        uniform sampler2D tDepth;
        uniform sampler2D distortionMap;
        uniform float distortion;
        uniform float cameraNear;
			  uniform float cameraFar;
        uniform bool hasBlur;
        uniform float mixBlur;
        uniform float mirror;
        uniform float mixStrength;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float mixContrast;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec4 my_vUv;
        ${e.fragmentShader}`,e.fragmentShader=e.fragmentShader.replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>

      float distortionFactor = 0.0;
      #ifdef USE_DISTORTION
        distortionFactor = texture2D(distortionMap, vUv).r * distortion;
      #endif

      vec4 new_vUv = my_vUv;
      new_vUv.x += distortionFactor;
      new_vUv.y += distortionFactor;

      vec4 base = texture2DProj(tDiffuse, new_vUv);
      vec4 blur = texture2DProj(tDiffuseBlur, new_vUv);

      vec4 merge = base;

      #ifdef USE_NORMALMAP
        vec2 normal_uv = vec2(0.0);
        vec4 normalColor = texture2D(normalMap, vUv * normalScale);
        vec3 my_normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
        vec3 coord = new_vUv.xyz / new_vUv.w;
        normal_uv = coord.xy + coord.z * my_normal.xz * 0.05;
        vec4 base_normal = texture2D(tDiffuse, normal_uv);
        vec4 blur_normal = texture2D(tDiffuseBlur, normal_uv);
        merge = base_normal;
        blur = blur_normal;
      #endif

      float depthFactor = 0.0001;
      float blurFactor = 0.0;

      #ifdef USE_DEPTH
        vec4 depth = texture2DProj(tDepth, new_vUv);
        depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
        depthFactor *= depthScale;
        depthFactor = max(0.0001, min(1.0, depthFactor));

        #ifdef USE_BLUR
          blur = blur * min(1.0, depthFactor + depthToBlurRatioBias);
          merge = merge * min(1.0, depthFactor + 0.5);
        #else
          merge = merge * depthFactor;
        #endif

      #endif

      float reflectorRoughnessFactor = roughness;
      #ifdef USE_ROUGHNESSMAP
        vec4 reflectorTexelRoughness = texture2D( roughnessMap, vUv );
        reflectorRoughnessFactor *= reflectorTexelRoughness.g;
      #endif

      #ifdef USE_BLUR
        blurFactor = min(1.0, mixBlur * reflectorRoughnessFactor);
        merge = mix(merge, blur, blurFactor);
      #endif

      vec4 newMerge = vec4(0.0, 0.0, 0.0, 1.0);
      newMerge.r = (merge.r - 0.5) * mixContrast + 0.5;
      newMerge.g = (merge.g - 0.5) * mixContrast + 0.5;
      newMerge.b = (merge.b - 0.5) * mixContrast + 0.5;

      diffuseColor.rgb = diffuseColor.rgb * ((1.0 - min(1.0, mirror)) + newMerge.rgb * mixStrength);
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(e){this._tDiffuse.value=e}get tDepth(){return this._tDepth.value}set tDepth(e){this._tDepth.value=e}get distortionMap(){return this._distortionMap.value}set distortionMap(e){this._distortionMap.value=e}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(e){this._tDiffuseBlur.value=e}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(e){this._textureMatrix.value=e}get hasBlur(){return this._hasBlur.value}set hasBlur(e){this._hasBlur.value=e}get mirror(){return this._mirror.value}set mirror(e){this._mirror.value=e}get mixBlur(){return this._mixBlur.value}set mixBlur(e){this._mixBlur.value=e}get mixStrength(){return this._blurStrength.value}set mixStrength(e){this._blurStrength.value=e}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(e){this._minDepthThreshold.value=e}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(e){this._maxDepthThreshold.value=e}get depthScale(){return this._depthScale.value}set depthScale(e){this._depthScale.value=e}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(e){this._depthToBlurRatioBias.value=e}get distortion(){return this._distortion.value}set distortion(e){this._distortion.value=e}get mixContrast(){return this._mixContrast.value}set mixContrast(e){this._mixContrast.value=e}},N=O.forwardRef(({mixBlur:e=0,mixStrength:t=1,resolution:n=256,blur:i=[0,0],minDepthThreshold:a=.9,maxDepthThreshold:s=1,depthScale:l=0,depthToBlurRatioBias:f=.25,mirror:h=0,distortion:_=1,mixContrast:v=1,distortionMap:b,reflectorOffset:S=0,...k},A)=>{w({MeshReflectorMaterialImpl:M});let N=E(({gl:e})=>e),P=E(({camera:e})=>e),F=E(({scene:e})=>e);i=Array.isArray(i)?i:[i,i];let I=i[0]+i[1]>0,L=i[0],R=i[1],z=O.useRef(null);O.useImperativeHandle(A,()=>z.current,[]);let[B]=O.useState(()=>new r),[V]=O.useState(()=>new y),[H]=O.useState(()=>new y),[U]=O.useState(()=>new y),[W]=O.useState(()=>new m),[G]=O.useState(()=>new y(0,0,-1)),[K]=O.useState(()=>new p),[q]=O.useState(()=>new y),[J]=O.useState(()=>new y),[Y]=O.useState(()=>new p),[X]=O.useState(()=>new m),[Z]=O.useState(()=>new g),ee=O.useCallback(()=>{var e;let t=z.current.parent||((e=z.current)==null||(e=e.__r3f.parent)==null?void 0:e.object);if(!t||(H.setFromMatrixPosition(t.matrixWorld),U.setFromMatrixPosition(P.matrixWorld),W.extractRotation(t.matrixWorld),V.set(0,0,1),V.applyMatrix4(W),H.addScaledVector(V,S),q.subVectors(H,U),q.dot(V)>0))return;q.reflect(V).negate(),q.add(H),W.extractRotation(P.matrixWorld),G.set(0,0,-1),G.applyMatrix4(W),G.add(U),J.subVectors(H,G),J.reflect(V).negate(),J.add(H),Z.position.copy(q),Z.up.set(0,1,0),Z.up.applyMatrix4(W),Z.up.reflect(V),Z.lookAt(J),Z.far=P.far,Z.updateMatrixWorld(),Z.projectionMatrix.copy(P.projectionMatrix),X.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),X.multiply(Z.projectionMatrix),X.multiply(Z.matrixWorldInverse),X.multiply(t.matrixWorld),B.setFromNormalAndCoplanarPoint(V,H),B.applyMatrix4(Z.matrixWorldInverse),K.set(B.normal.x,B.normal.y,B.normal.z,B.constant);let n=Z.projectionMatrix;Y.x=(Math.sign(K.x)+n.elements[8])/n.elements[0],Y.y=(Math.sign(K.y)+n.elements[9])/n.elements[5],Y.z=-1,Y.w=(1+n.elements[10])/n.elements[14],K.multiplyScalar(2/K.dot(Y)),n.elements[2]=K.x,n.elements[6]=K.y,n.elements[10]=K.z+1,n.elements[14]=K.w},[P,S]),[Q,te,ne,$]=O.useMemo(()=>{let r={minFilter:o,magFilter:o,type:c},i=new d(n,n,r);i.depthBuffer=!0,i.depthTexture=new u(n,n),i.depthTexture.format=C,i.depthTexture.type=x;let p=new d(n,n,r);return[i,p,new j({gl:N,resolution:n,width:L,height:R,minDepthThreshold:a,maxDepthThreshold:s,depthScale:l,depthToBlurRatioBias:f}),{mirror:h,textureMatrix:X,mixBlur:e,tDiffuse:i.texture,tDepth:i.depthTexture,tDiffuseBlur:p.texture,hasBlur:I,mixStrength:t,minDepthThreshold:a,maxDepthThreshold:s,depthScale:l,depthToBlurRatioBias:f,distortion:_,distortionMap:b,mixContrast:v,"defines-USE_BLUR":I?``:void 0,"defines-USE_DEPTH":l>0?``:void 0,"defines-USE_DISTORTION":b?``:void 0}]},[N,L,R,X,n,h,I,e,t,a,s,l,f,_,b,v]);return T(()=>{var e;let t=z.current.parent||((e=z.current)==null||(e=e.__r3f.parent)==null?void 0:e.object);if(!t)return;t.visible=!1;let n=N.xr.enabled,r=N.shadowMap.autoUpdate;ee(),N.xr.enabled=!1,N.shadowMap.autoUpdate=!1,N.setRenderTarget(Q),N.state.buffers.depth.setMask(!0),N.autoClear||N.clear(),N.render(F,Z),I&&ne.render(N,Q,te),N.xr.enabled=n,N.shadowMap.autoUpdate=r,t.visible=!0,N.setRenderTarget(null)}),O.createElement(`meshReflectorMaterialImpl`,D({attach:`material`,key:`key`+$[`defines-USE_BLUR`]+$[`defines-USE_DEPTH`]+$[`defines-USE_DISTORTION`],ref:z},$,k))}),P=class extends b{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${k>=154?`colorspace_fragment`:`encodings_fragment`}>
        }
      `})}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(e){this.uniforms.pixelRatio.value=e}},F=e=>e&&e.constructor===Float32Array,I=e=>[e.r,e.g,e.b],L=e=>e instanceof v||e instanceof y||e instanceof p,R=e=>Array.isArray(e)?e:L(e)?e.toArray():[e,e,e];function z(e,t,n){return O.useMemo(()=>{if(t!==void 0){if(F(t))return t;if(t instanceof s){let n=Array.from({length:e*3},()=>I(t)).flat();return Float32Array.from(n)}if(L(t)||Array.isArray(t)){let n=Array.from({length:e*3},()=>R(t)).flat();return Float32Array.from(n)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},n)},[t])}var B=O.forwardRef(({noise:e=1,count:t=100,speed:n=1,opacity:r=1,scale:i=1,size:a,color:o,children:c,...l},u)=>{O.useMemo(()=>w({SparklesImplMaterial:P}),[]);let d=O.useRef(null),f=E(e=>e.viewport.dpr),p=R(i),m=O.useMemo(()=>Float32Array.from(Array.from({length:t},()=>p.map(S.randFloatSpread)).flat()),[t,...p]),h=z(t,a,Math.random),g=z(t,r),_=z(t,n),v=z(t*3,e),y=z(o===void 0?t*3:t,F(o)?o:new s(o),()=>1);return T(e=>{d.current&&d.current.material&&(d.current.material.time=e.clock.elapsedTime)}),O.useImperativeHandle(u,()=>d.current,[]),O.createElement(`points`,D({key:`particle-${t}-${JSON.stringify(i)}`},l,{ref:d}),O.createElement(`bufferGeometry`,null,O.createElement(`bufferAttribute`,{attach:`attributes-position`,args:[m,3]}),O.createElement(`bufferAttribute`,{attach:`attributes-size`,args:[h,1]}),O.createElement(`bufferAttribute`,{attach:`attributes-opacity`,args:[g,1]}),O.createElement(`bufferAttribute`,{attach:`attributes-speed`,args:[_,1]}),O.createElement(`bufferAttribute`,{attach:`attributes-color`,args:[y,3]}),O.createElement(`bufferAttribute`,{attach:`attributes-noise`,args:[v,3]})),c||O.createElement(`sparklesImplMaterial`,{transparent:!0,pixelRatio:f,depthWrite:!1}))});export{N as n,B as t};