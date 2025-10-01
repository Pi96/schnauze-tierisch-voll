/** @jsxImportSource react */
import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PresentationControls, ContactShadows, Html, PerspectiveCamera } from "@react-three/drei";

function BookModel() {
  const { scene } = useGLTF("/models/buch.glb");
  // Hier positionierst & skalierst du das Buch
  scene.scale.set(0.02, 0.02, 0.02);     // ⬅️ kleiner/größer
  scene.position.set(0, -0.2, 0);     // ⬅️ hoch/runter/links/rechts (x,y,z)
  scene.rotation.set(0, 0.35, 0);     // ⬅️ leicht eindrehen
  return <primitive object={scene} />;
}

if (typeof window !== "undefined") {
  // @ts-ignore
  useGLTF.preload("/models/buch.glb");
}

export default function BuchCanvas() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="rounded-2xl bg-white/80 shadow-xl" style={{ height: 520 }} />;

  return (
    <div className="rounded-2xl overflow-hidden bg-white/80 shadow-xl" style={{ height: 520 }}>
      <Canvas dpr={[1, 2]}>
        {/* Fixe Kamera – kein Auto-Fit mehr */}
        <PerspectiveCamera makeDefault position={[2.6, 1.6, 3.1]} fov={45} />

        {/* Licht */}
        <hemisphereLight intensity={0.65} />
        <directionalLight intensity={1.0} position={[3, 5, 2]} />

        <Suspense fallback={<Html center>Modell lädt…</Html>}>
          {/* Leichte Interaktion, aber ohne Zoom-„Sprünge“ */}
          <PresentationControls speed={1.1} global>
            <BookModel />
          </PresentationControls>
          <ContactShadows position={[0, -0.001, 0]} opacity={0.3} blur={2.5} scale={10} />
        </Suspense>

        {/* OrbitControls: Zielpunkt und Distanzen begrenzen */}
        <OrbitControls
          target={[0, 0.2, 0]}     // ⬅️ wohin die Kamera „schaut“
          minDistance={2.2}
          maxDistance={4.2}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
