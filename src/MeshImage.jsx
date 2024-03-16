import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function MeshImage({ image, idx, targetScroll, actualScroll }) {
  const meshRef = useRef(null);

  useFrame(() => {
    const { width, height, top, left } = image.getBoundingClientRect();
    if (meshRef.current) {
      // TODO: Account for width of scrollbar in width offset calculation
      // SYNC MESH POSITION + SCALE WITH DOM IMAGE
      meshRef.current.position.x =
        left - (window.innerWidth - 16) / 2 + width / 2;
      meshRef.current.position.y = -top + window.innerHeight / 2 - height / 2;
      meshRef.current.scale.x = width;
      meshRef.current.scale.y = height;
      // UPDATE SHADER UNIFORM
      meshRef.current.material.uniforms.uOffset.value.set(
        0,
        -(targetScroll - actualScroll) * 0.0002
      );
    }
  });

  const uniforms = useMemo(() => {
    return {
      uTexture: {
        value: new THREE.TextureLoader().load(image.src),
      },
      uOffset: {
        value: new THREE.Vector2(0, 0),
      },
    };
  }, [image.src]);

  return (
    <mesh
      key={idx}
      ref={meshRef}
      position={[idx * 200, 0, 0]}
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        // wireframe={true}
        uniforms={uniforms}
        vertexShader={`
          uniform vec2 uOffset;

          varying vec2 vUv;

          float PI = 3.141592653589793238;

          vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
            position.x = position.x + (sin(uv.y * PI) * offset.x);
            position.y = position.y + (sin(uv.x * PI) * offset.y);
            return position;
          }

          void main() {
            vUv = uv;
            vec3 newPosition = position;
            newPosition = deformationCurve(newPosition, uv, uOffset);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform vec2 uOffset;
          varying vec2 vUv;

          vec3 rgbShift(sampler2D imageTexture, vec2 uv, vec2 offset) {
            float r = texture2D(imageTexture, uv + offset).r;
            vec2 gb = texture2D(imageTexture, uv).gb;
            return vec3(r, gb);
          }

          void main() {
            vec3 color = rgbShift(uTexture, vUv, uOffset);
            gl_FragColor = vec4(color, 1.0);
            // gl_FragColor = vec4(vUv.x, 0, vUv.y, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default MeshImage;
