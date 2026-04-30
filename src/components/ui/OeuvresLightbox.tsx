"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

interface Slide {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

interface Props {
  open: boolean;
  index: number;
  close: () => void;
  slides: Slide[];
}

export default function OeuvresLightbox({ open, index, close, slides }: Props) {
  return (
    <Lightbox
      open={open}
      index={index}
      close={close}
      slides={slides}
      plugins={[Zoom, Captions]}
      captions={{ descriptionTextAlign: "center" }}
      carousel={{ padding: "64px" }}
      styles={{
        container: { backgroundColor: "rgb(28, 25, 23)" },
      }}
    />
  );
}
