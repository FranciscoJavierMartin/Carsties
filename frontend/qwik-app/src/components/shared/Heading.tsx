import { component$ } from '@builder.io/qwik';

type HeadingProps = {
  title: string;
  subtitle?: string;
  center?: boolean;
};

export default component$<HeadingProps>(({ title, subtitle, center }) => {
  return (
    <div class={center ? 'text-center' : 'text-start'}>
      <div class='text-2xl font-bold'>{title}</div>
      <div class='font-light text-neutral-500 mt-2'>{subtitle}</div>
    </div>
  );
});
