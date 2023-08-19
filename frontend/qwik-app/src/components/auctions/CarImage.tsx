import { component$ } from '@builder.io/qwik';
import { Image } from '@unpic/qwik';

export default component$<{ imageUrl: string }>(({ imageUrl }) => {
  return (
    <Image
      src={imageUrl}
      class={[
        'absolute',
        'duration-700',
        'ease-in-out',
        'group-hover:opacity-75',
        'h-full',
        'inset-0',
        'object-cover ',
        'text-transparent',
        'w-full',
        'grayscale-0 blue-0 scale-100',
      ]}
      alt='image'
      aspectRatio='auto'
      data-nimg='fill'
      decoding='async'
      sizes='(max-width:768px) 100vw, (max-width: 1200px) 50vw, 25vw'
    />
  );
});
