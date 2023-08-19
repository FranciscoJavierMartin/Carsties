import { Resource, component$, useResource$ } from '@builder.io/qwik';
import { getData } from '~/server/auctions';

export default component$(() => {
  const data = useResource$(async () => {
    await getData('');

    return 'Completed';
  });

  return (
    <>
      <h1>Listings</h1>
      <Resource
        value={data}
        onPending={() => <p>Loading</p>}
        onResolved={(data) => <p>{data}</p>}
      />
    </>
  );
});
