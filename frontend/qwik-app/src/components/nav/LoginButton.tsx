import { component$, $ } from '@builder.io/qwik';
import ButtonOutline from '~/components/shared/ButtonOutline';
import { useAuthSignin } from '~/routes/plugin@auth';

export default component$(() => {
  const signIn = useAuthSignin();

  return (
    <ButtonOutline
      onClick={$(() =>
        signIn.submit({
          providerId: 'id-server',
          options: { callbackUrl: '/' },
        })
      )}
    >
      Login
    </ButtonOutline>
  );
});
