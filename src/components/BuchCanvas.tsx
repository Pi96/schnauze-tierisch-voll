/** @jsxImportSource react */
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PresentationControls, Bounds, ContactShadows, Html } from "@react-three/drei";

// Modell-Wrapper: lädt /models/buch.glb
function BookModel() {
  // Pfad unbedingt mit Slash starten, weil die Datei in /public liegt:
  const { scene } = useGLTF("/models/buch.glb"); // 404? -> Pfad prüfen
  // Optional: scene.scale.set(1.2,1.2,1.2) oder scene.rotation.y = Math.PI/8
  return <primitive object={scene} />;
}
useGLTF.preload("/models/buch.glb");

export default function BuchCanvas() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/80 shadow-xl" style={{ height: 420 }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [2.5, 1.8, 3.2], fov: 45 }}
      >
        {/* Licht */}
        <hemisphereLight intensity={0.65} />
        <directionalLight intensity={1.0} position={[3, 5, 2]} />

        <Suspense fallback={<Html center>Modell lädt…</Html>}>
          {/* Bedienelemente */}
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
