"use client";

import type { ReactNode } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

interface Slide {
  src: string;
  alt?: string;
  title?: ReactNode;
  description?: ReactNode;
}

interface Props {
  open: boolean;
  index: number;
  close: () => void;
  slides: Slide[];
}

export default function OeuvresLightbox({ open, index, close, slides }: Props) {
  // Sur petit écran, le padding de 64px réduisait la peinture à ~250px de
  // large : on le resserre pour laisser la place à l'œuvre. Le composant est
  // monté à l'ouverture, la valeur est donc fraîche à chaque fois.
  const isSmallScreen =
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;

  return (
    <Lightbox
      open={open}
      index={index}
      close={close}
      slides={slides}
      plugins={[Zoom, Captions]}
      captions={{ descriptionTextAlign: "center" }}
      zoom={{ doubleTapDelay: 300, doubleClickDelay: 500 }}
      carousel={{ padding: isSmallScreen ? "12px" : "64px" }}
      styles={{
        container: { backgroundColor: "rgb(28, 25, 23)" },
      }}
    />
  );
}
