import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleGlobeProps {
  mouseX?: number;
  mouseY?: number;
  /** Overall size multiplier for the globe. 1 = default. Increase to make it bigger without moving the camera. */
  scale?: number;
}

export const ParticleGlobe: React.FC<ParticleGlobeProps> = ({ mouseX = 0, mouseY = 0, scale = 1.35 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animId: number;
    globeGroup: THREE.Group;
    orbitGroup: THREE.Group;
    targetRotX: number;
    targetRotY: number;
    currentRotX: number;
    currentRotY: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let W = mountRef.current.clientWidth;
    let H = mountRef.current.clientHeight;
    if (!W || W <= 0) W = 500;
    if (!H || H <= 0) H = 500;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
    camera.position.z = 4.0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const worldGroup = new THREE.Group();
    worldGroup.scale.setScalar(scale);
    scene.add(worldGroup);

    const globeGroup = new THREE.Group();
    const orbitGroup = new THREE.Group();
    worldGroup.add(globeGroup);
    worldGroup.add(orbitGroup);

    // --- Particle sphere (fibonacci distribution, jittered so it reads as scattered "data points" not a perfect grid) ---
    const particleCount = window.innerWidth < 768 ? 1600 : 3200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const spherePts: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(1 - (2 * i) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      // heavier jitter than before so points feel scattered, like the reference
      const r = 1.0 + (Math.random() - 0.5) * 0.12;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      spherePts.push(new THREE.Vector3(x, y, z));

      // Mostly dim blue-white dust, a smaller number of brighter cyan points
      const isCyan = Math.random() > 0.55;
      const dim = 0.35 + Math.random() * 0.4;
      colors[i * 3 + 0] = isCyan ? 0.0 * dim + 0.1 : 0.75;
      colors[i * 3 + 1] = isCyan ? 0.85 * dim + 0.15 : 0.85;
      colors[i * 3 + 2] = isCyan ? 1.0 * dim + 0.2 : 0.95;
      sizes[i] = 0.4 + Math.random() * 1.6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.016,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    globeGroup.add(new THREE.Points(geo, mat));

    // --- Background starfield extending beyond the globe silhouette ---
    const starCount = 900;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const r = 1.3 + Math.random() * 1.8; // well beyond the sphere radius
      starPos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.01,
      color: 0xbfe9ff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    // Stars stay fixed relative to camera (don't rotate with the globe)
    scene.add(new THREE.Points(starGeo, starMat));

    // --- Triangulated "network" lines: connect each point to a few of its nearest neighbors ---
    // This produces the irregular constellation-mesh look instead of a clean lat/long wireframe.
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4fd8ff,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
    });

    const linePositions: number[] = [];
    const NEIGHBORS_PER_POINT = 2;
    const SAMPLE_STRIDE = 3; // only build edges from a subset of points to keep the mesh sparse
    const MAX_DIST = 0.35;

    for (let i = 0; i < spherePts.length; i += SAMPLE_STRIDE) {
      const p = spherePts[i];
      // find nearby candidates within a limited window for performance
      const candidates: { idx: number; d: number }[] = [];
      for (let j = 0; j < spherePts.length; j += 5) {
        if (j === i) continue;
        const d = p.distanceTo(spherePts[j]);
        if (d < MAX_DIST) candidates.push({ idx: j, d });
      }
      candidates.sort((a, b) => a.d - b.d);
      for (let k = 0; k < Math.min(NEIGHBORS_PER_POINT, candidates.length); k++) {
        const q = spherePts[candidates[k].idx];
        linePositions.push(p.x, p.y, p.z, q.x, q.y, q.z);
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    const networkLines = new THREE.LineSegments(lineGeo, lineMat);
    globeGroup.add(networkLines);

    // --- A handful of long-range arcs sweeping across the globe (echoes the big diagonal streaks in the reference) ---
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    for (let a = 0; a < 2; a++) {
      const start = spherePts[Math.floor(Math.random() * spherePts.length)];
      const end = spherePts[Math.floor(Math.random() * spherePts.length)];
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(1.25);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts = curve.getPoints(40);
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      globeGroup.add(new THREE.Line(g, arcMat));
    }

    // --- Orbital rings (kept subtle, echoing the faint sweeping ellipses in the reference) ---
    const createOrbit = (
      radius: number,
      rotationX: number,
      rotationY: number,
      rotationZ: number,
      opac: number
    ) => {
      const pts: THREE.Vector3[] = [];
      const segs = 128;

      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;

        pts.push(
          new THREE.Vector3(
            radius * Math.cos(a),
            0,
            radius * Math.sin(a)
          )
        );
      }

      const g = new THREE.BufferGeometry().setFromPoints(pts);

      const m = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: opac,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      });

      const line = new THREE.Line(g, m);

      line.rotation.x = rotationX;
      line.rotation.y = rotationY;
      line.rotation.z = rotationZ;

      line.renderOrder = 10;

      orbitGroup.add(line);
    };

    createOrbit(1.08,  Math.PI / 5,  0,  0,  0);
    createOrbit(1.08,  Math.PI / 11,  0,  0,  0);
    createOrbit(1.08,  Math.PI / 3,  0,  Math.PI / 5,  0.22);
    createOrbit(1.12,  Math.PI / 7,  0,  Math.PI / 3,  0.15);
    createOrbit(1.18,  Math.PI / 9,  0,  Math.PI / 4,  0.12);

    // --- Bright glowing hub nodes (the standout flare points in the reference, e.g. the bright cluster on the right edge) ---
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x9ff2ff, transparent: true, opacity: 0.95 });
    const nodeSphere = new THREE.SphereGeometry(0.03, 8, 8);
    const nodes: { mesh: THREE.Mesh; angle: number; radius: number; speed: number; inclination: number }[] = [];

    const nodeConfig = [
      { angle: 0.8, radius: 1.15, speed: 0.008, inclination: Math.PI / 6 },
      { angle: 2.5, radius: 1.15, speed: 0.008, inclination: Math.PI / 6 },
      { angle: 1.2, radius: 1.28, speed: 0.005, inclination: Math.PI / 3 },
      { angle: 3.8, radius: 1.15, speed: 0.008, inclination: Math.PI / 6 },
      { angle: 5.2, radius: 1.28, speed: 0.005, inclination: Math.PI / 3 },
      { angle: 4.1, radius: 1.18, speed: 0.006, inclination: Math.PI / 4 },
    ];

    nodeConfig.forEach((cfg) => {
      const mesh = new THREE.Mesh(nodeSphere, nodeMat.clone());
      mesh.renderOrder = 20; // render on top of orbital rings
      worldGroup.add(mesh);
      nodes.push({ mesh, ...cfg });
    });

    let t = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const ref = sceneRef.current = {
      scene, camera, renderer, animId: 0,
      globeGroup, orbitGroup, targetRotX, targetRotY, currentRotX, currentRotY,
    };

    const animate = () => {
      ref.animId = requestAnimationFrame(animate);
      t += 0.01;

      // Auto-rotate globe slowly
      globeGroup.rotation.y += 0.0015;
      orbitGroup.rotation.y += 0.0008;

      // Smooth mouse damping
      ref.currentRotX += (ref.targetRotX - ref.currentRotX) * 0.04;
      ref.currentRotY += (ref.targetRotY - ref.currentRotY) * 0.04;
      globeGroup.rotation.x = ref.currentRotX;
      orbitGroup.rotation.x = ref.currentRotX;

      // Animate nodes along orbits
      nodes.forEach((node) => {
        node.angle += node.speed;
        const x = node.radius * Math.cos(node.angle);
        const z = node.radius * Math.sin(node.angle);
        const y = z * Math.sin(node.inclination);
        node.mesh.position.set(x, y, z * Math.cos(node.inclination));
        (node.mesh.material as THREE.MeshBasicMaterial).opacity = 0.6 + 0.4 * Math.sin(t * 2 + node.angle);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const W2 = mountRef.current.clientWidth || 500;
      const H2 = mountRef.current.clientHeight || 500;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(ref.animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update mouse influence
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.targetRotX = mouseY * 0.4;
      sceneRef.current.targetRotY = mouseX * 0.4;
    }
  }, [mouseX, mouseY]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 0 40px rgba(0, 240, 255, 0.22))' }}
    />
  );
};