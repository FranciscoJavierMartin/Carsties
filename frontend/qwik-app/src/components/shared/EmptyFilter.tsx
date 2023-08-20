import { component$, useContext } from '@builder.io/qwik';
import Heading from '~/components/shared/Heading';
import ButtonOutline from '~/components/shared/ButtonOutline';
import { searchContext } from '~/store/searchAuctions';

type EmptyFilterProps = {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  showLogin?: boolean;
  callbackUrl?: string;
};

export default component$<EmptyFilterProps>(
  ({
    title = 'No matches for this filter',
    subtitle = 'Try changing or resetting the filter',
    showReset,
    showLogin,
    callbackUrl,
  }) => {
    const reset = useContext(searchContext).reset;

    return (
      <div class='h-[40] flex flex-col gap-2 justify-center items-center shadow-lg p-3'>
        <Heading title={title} subtitle={subtitle} center />
        <div class='mt-4'>
          {showReset && (
            <ButtonOutline onClick={reset}>Remove filters</ButtonOutline>
          )}
          {showLogin && <ButtonOutline>Login</ButtonOutline>}
        </div>
      </div>
    );
  }
);
