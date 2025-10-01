/** @jsxImportSource react */
import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PresentationControls, Bounds, ContactShadows, Html } from "@react-three/drei";

function BookModel() {
  const { scene } = useGLTF("/models/buch.glb"); // 200 im Network?
  // Sichtbar machen, falls Scale/Kamera daneben liegt:
  scene.scale.set(1, 1, 1);
  scene.rotation.y = 0.35;
  return <primitive object={scene} />;
}

// Preload NUR im Browser (sonst knallt's beim SSR-Bundle)
if (typeof window !== "undefined") {
  // @ts-ignore
  useGLTF.preload("/models/buch.glb");
}

export default function BuchCanvas() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Platzhalterhöhe, damit Layout nicht springt
  if (!mounted) return <div className="rounded-2xl bg-white/80 shadow-xl" style={{ height: 520 }} />;

  return (
    <div className="rounded-2xl overflow-hidden bg-white/80 shadow-xl" style={{ height: 520 }}>
      <Canvas dpr={[1, 2]} camera={{ position: [2.5, 1.8, 3.2], fov: 45 }}>
        <hemisphereLight intensity={0.65} />
        <directionalLight intensity={1.0} position={[3, 5, 2]} />
        <Suspense fallback={<Html center>Modell lädt…</Html>}>
          <PresentationControls speed={1.2} global>
            <Bounds fit clip observe margin={1.2}>
              <BookModel />
            </Bounds>
          </PresentationControls>
          <ContactShadows position={[0, -0.001, 0]} opacity={0.3} blur={2.5} scale={10} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={1.5} maxDistance={6} />
      </Canvas>
    </div>
  );
}
