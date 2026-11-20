// Profile Image Processing & Preset Avatar Utilities for MEM Fitness
import { APP_IMAGES } from "./appImages";

export interface PresetAvatar {
  id: string;
  name: string;
  category: "Athletic" | "Mind" | "Vedic" | "Energy";
  tag: string;
  image: string;
  accent: string;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: "sprinter-avatar",
    name: "Supersonic Sprinter",
    category: "Athletic",
    tag: "Speed & HIIT",
    image: APP_IMAGES.aiBodySprinter,
    accent: "#CCFF00"
  },
  {
    id: "lifter-avatar",
    name: "Titan Powerlifter",
    category: "Athletic",
    tag: "Strength & Mass",
    image: APP_IMAGES.aiBodyLifter,
    accent: "#3BB1FF"
  },
  {
    id: "agility-avatar",
    name: "Apex Agility",
    category: "Athletic",
    tag: "Flex & Mobility",
    image: APP_IMAGES.aiBodyAgility,
    accent: "#00E5FF"
  },
  {
    id: "zen-avatar",
    name: "Cognitive Flow",
    category: "Mind",
    tag: "Mindset & Focus",
    image: APP_IMAGES.aiBodyZen,
    accent: "#9D4EDD"
  },
  {
    id: "surya-avatar",
    name: "Surya Radiant",
    category: "Vedic",
    tag: "Solar Energy",
    image: APP_IMAGES.aarogyaSuryaNamaskarArt,
    accent: "#FF9933"
  },
  {
    id: "lotus-avatar",
    name: "Padmasana Inner Peace",
    category: "Vedic",
    tag: "Serenity & Asana",
    image: APP_IMAGES.aarogyaPadmasanaLotusArt,
    accent: "#FFD700"
  },
  {
    id: "scanner-avatar",
    name: "Metabolic Biometric",
    category: "Energy",
    tag: "Bio-Tracker",
    image: APP_IMAGES.aiBodyScanner,
    accent: "#CCFF00"
  },
  {
    id: "dhyana-avatar",
    name: "Dhyana Master",
    category: "Mind",
    tag: "Pranayama & Zen",
    image: APP_IMAGES.aarogyaDhyanaMeditationArt,
    accent: "#00E676"
  }
];

/**
 * Compresses and square-crops any uploaded user photo file in browser memory
 * Keeps the resulting base64 lightweight (<50KB) and perfectly circular/square
 */
export async function processProfileImageFile(file: File, maxDimension = 320, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate mime type
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please upload a valid image file (PNG, JPG, WEBP)"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image data"));
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }

          // Compute square crop coordinates (centered)
          const minSide = Math.min(img.width, img.height);
          const startX = (img.width - minSide) / 2;
          const startY = (img.height - minSide) / 2;

          const targetSize = Math.min(minSide, maxDimension);
          canvas.width = targetSize;
          canvas.height = targetSize;

          // Draw cropped & resized image
          ctx.drawImage(
            img,
            startX,
            startY,
            minSide,
            minSide,
            0,
            0,
            targetSize,
            targetSize
          );

          // Export as compressed WebP or JPEG
          let outputType = "image/webp";
          if (!canvas.toDataURL("image/webp").startsWith("data:image/webp")) {
            outputType = "image/jpeg";
          }
          
          const compressedDataUrl = canvas.toDataURL(outputType, quality);
          resolve(compressedDataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
