/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import HeaderDots from './HeaderDots';
import OverlayMenu from './OverlayMenu';
import { playBirdOnce } from '../lib/sound';

export default function MenuClient() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onFirst = () => { playBirdOnce(); window.removeEventListener('click', onFirst); };
    window.addEventListener('click', onFirst, { once: true });
    return () => window.removeEventListener('click', onFirst);
  }, []);
  return (
    <>
      <HeaderDots onOpen={() => setOpen(true)} />
      <OverlayMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
