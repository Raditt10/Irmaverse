from PIL import Image
import sys

def crop_transparent(image_path):
    try:
        img = Image.open(image_path)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Get the bounding box of the non-transparent area
        bbox = img.getbbox()
        if bbox:
            img_cropped = img.crop(bbox)
            img_cropped.save(image_path)
            print(f"Berhasil memotong whitespace pada {image_path}")
        else:
            print(f"Tidak ada whitespace yang bisa dipotong pada {image_path}")
    except Exception as e:
        print(f"Gagal memproses {image_path}: {e}")

if __name__ == '__main__':
    crop_transparent('public/model.webp')
    crop_transparent('public/model_1.webp')
