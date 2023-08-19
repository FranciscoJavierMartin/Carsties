import { component$ } from '@builder.io/qwik';
import { Image } from '@unpic/qwik';

export default component$<{ imageUrl: string }>(({ imageUrl }) => {
  // TODO: Fix images height
  return (
    <Image
      src={imageUrl}
      alt='image'
      fill
      priority
      class={`
        object-cover 
        group-hover:opacity-75
        duration-700
        ease-in-out
        grayscale-0
        blur-0
        scale-100
      `}
      sizes='(max-width:768px) 100vw, (max-width: 1200px) 50vw, 25vw'
      width='356'
      layout='fullWidth'
      aspectRatio='auto'
    />
  );
});
