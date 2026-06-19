/**
 * Compresses an image blob to save user data, speed up R2 uploads,
 * and optimize OpenAI token usage. Target width: 1024px (ideal for Vision APIs).
 */
export async function optimizePhoto(fileBlob: Blob, targetWidth = 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(fileBlob);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement('canvas');
      const scaleFactor = targetWidth / img.width;
      
      // Only scale down if the image is wider than target width
      if (scaleFactor < 1) {
        canvas.width = targetWidth;
        canvas.height = img.height * scaleFactor;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Falha ao inicializar contexto 2D para otimização.'));
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(
        (compressedBlob) => {
          if (compressedBlob) resolve(compressedBlob);
          else reject(new Error('Erro na compressão da imagem.'));
        },
        'image/jpeg',
        0.82 // Optimal sweet-spot for quality vs compression file-size
      );
    };

    img.onerror = () => reject(new Error('Falha ao carregar imagem para otimização.'));
  });
}
