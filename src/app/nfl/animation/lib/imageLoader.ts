export class ImageLoader {
  static async load(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = document.createElement('img');
      image.src = url;
      image.style.display = 'none';
      document.body.appendChild(image);
      image.addEventListener('load', () => resolve(image));
    });
  }
}
