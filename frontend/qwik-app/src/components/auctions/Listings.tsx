import {
  Resource,
  component$,
  useResource$,
  useSignal,
} from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { getData } from '~/server/auctions';

export default component$(() => {
  const query = useSignal(useLocation().url.search);

  const data = useResource$(async () => {
    return await getData(query.value);
  });

  return (
    <>
      <Resource
        value={data}
        onPending={() => <h3>Loading</h3>}
        onResolved={(data) => (data.totalCount ? <>Data</> : <p>No data</p>)}
      />
    </>
  );
});
