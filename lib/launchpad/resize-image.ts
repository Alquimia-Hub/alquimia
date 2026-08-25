import { LOGO_SIZE_PX } from "./constants";

export async function resizeToSquareWebp(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);

  try {
    const side = Math.min(bitmap.width, bitmap.height);
    const offsetX = (bitmap.width - side) / 2;
    const offsetY = (bitmap.height - side) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = LOGO_SIZE_PX;
    canvas.height = LOGO_SIZE_PX;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("No se pudo procesar la imagen");
    }

    context.drawImage(
      bitmap,
      offsetX,
      offsetY,
      side,
      side,
      0,
      0,
      LOGO_SIZE_PX,
      LOGO_SIZE_PX
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.9);
    });

    if (!blob) {
      throw new Error("No se pudo procesar la imagen");
    }

    return new File([blob], "logo.webp", { type: "image/webp" });
  } finally {
    bitmap.close();
  }
}
