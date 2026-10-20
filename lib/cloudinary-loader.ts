"use client";

import type { ImageLoaderProps } from "next/image";

const CLOUDINARY_HOST = "https://res.cloudinary.com/";
// A URL path segment made only of Cloudinary transformation parameters, e.g. "f_auto,q_auto,w_400".
const TRANSFORM_SEGMENT = /^(?:(?:a|ar|b|bo|c|co|dpr|e|f|fl|g|h|l|o|q|r|t|u|w|x|y|z)_[^,/]+)(?:,(?:a|ar|b|bo|c|co|dpr|e|f|fl|g|h|l|o|q|r|t|u|w|x|y|z)_[^,/]+)*$/;

/**
 * Builds a Cloudinary delivery URL with f_auto, q_auto and the requested width.
 * `src` may be a Cloudinary public ID ("products/blender-black") or a full
 * res.cloudinary.com URL. Local files ("/brand/logo.svg") pass through.
 */
export function cloudinaryUrl(
  { src, width, quality }: ImageLoaderProps,
  cloudName: string | undefined,
): string {
  if (src.startsWith("/")) {
    return `${src}?w=${width}`;
  }

  const q = quality ? `q_${quality}` : "q_auto";
  const transforms = `f_auto,${q},c_limit,w_${width}`;

  if (src.startsWith(CLOUDINARY_HOST)) {
    // https://res.cloudinary.com/<cloud>/image/upload/[<transforms>/][v123/]<public_id>
    const match = src.match(/^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.+)$/);
    if (!match) return src;
    const [, cloud, rest] = match;
    const parts = rest.split("/");
    // Replace any transformation segment already in the URL with ours.
    if (parts.length > 1 && TRANSFORM_SEGMENT.test(parts[0])) {
      parts.shift();
    }
    return `${CLOUDINARY_HOST}${cloud}/image/upload/${transforms}/${parts.join("/")}`;
  }

  if (/^https?:\/\//.test(src)) {
    return src;
  }

  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set; cannot load Cloudinary images.");
  }
  const publicId = src.replace(/^\/+/, "");
  return `${CLOUDINARY_HOST}${cloudName}/image/upload/${transforms}/${publicId}`;
}

export default function cloudinaryLoader(props: ImageLoaderProps): string {
  return cloudinaryUrl(props, process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || undefined);
}
