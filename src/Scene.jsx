import MeshImage from './MeshImage';

function Scene({ images, targetScroll, actualScroll }) {
  return (
    <>
      {images.map((image, idx) => (
        <MeshImage
          key={idx}
          image={image}
          idx={idx}
          targetScroll={targetScroll}
          actualScroll={actualScroll}
        />
      ))}
    </>
  );
}

export default Scene;
