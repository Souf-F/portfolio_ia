import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
  ThreeScene — the hero sculpture.
  A faceted marble solid resting on a light shaft, lit by a warm
  gold key light with a cool rim. Rotates slowly; drifts toward
  the pointer. Degrades to nothing (poster handled in CSS) under
  reduced-motion or when WebGL is unavailable.
*/
export default function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // static poster from CSS shows instead

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // no WebGL — CSS poster remains
    }

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);

    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.4);
    camera.lookAt(0, 0.2, 0);

    /* ---- The sculpture: a faceted icosahedron of polished marble ---- */
    const geo = new THREE.IcosahedronGeometry(1.55, 1); // low detail = facets
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F6F2EA'),
      roughness: 0.32,
      metalness: 0.06,
      flatShading: true,
    });
    const solid = new THREE.Mesh(geo, mat);
    solid.castShadow = true;
    solid.position.y = 0.25;
    scene.add(solid);

    /* Thin gold wire that traces the facet edges — the precious detail */
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: new THREE.Color('#C9A96E'), transparent: true, opacity: 0.35 })
    );
    wire.position.copy(solid.position);
    scene.add(wire);

    /* ---- The plinth: a soft receiving floor ---- */
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.9;
    floor.receiveShadow = true;
    scene.add(floor);

    /* ---- Cathedral lighting: warm key, cool rim, soft ambient ---- */
    const ambient = new THREE.AmbientLight(0xfff6e8, 0.55);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffdca8, 2.1); // warm gold
    key.position.set(4, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.radius = 8;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xdfe6f0, 0.9); // cool rim
    rim.position.set(-5, 2, -3);
    scene.add(rim);

    const fill = new THREE.PointLight(0xffe9c4, 0.6, 20);
    fill.position.set(0, -1, 4);
    scene.add(fill);

    /* ---- Pointer parallax ---- */
    const target = { x: 0, y: 0 };
    const onPointer = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    /* ---- Render loop, paused when off-screen ---- */
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();

      solid.rotation.y += 0.0016;
      solid.rotation.x = Math.sin(t * 0.18) * 0.12;
      wire.rotation.copy(solid.rotation);

      // ease camera toward pointer for a floating parallax
      camera.position.x += (target.x * 0.55 - camera.position.x) * 0.03;
      camera.position.y += (0.4 - target.y * 0.35 - camera.position.y) * 0.03;
      camera.lookAt(0, 0.2, 0);

      renderer.render(scene, camera);
    };
    tick();

    /* ---- Resize ---- */
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      wire.geometry.dispose();
      wire.material.dispose();
      floor.geometry.dispose();
      floorMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="three-mount" aria-hidden="true" />;
}
