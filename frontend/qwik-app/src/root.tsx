import {
  component$,
  useContextProvider,
  useStore,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';
import { initFlowbite } from 'flowbite';
import { RouterHead } from './components/router-head/router-head';

import './global.css';
import type { SearchAuctionsStore } from '~/types';
import {
  initialAuctionsStore,
  reset,
  searchContext,
  setParams,
  setSearchValue,
} from '~/store/searchAuctions';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  const searchStore = useStore<SearchAuctionsStore>({
    ...initialAuctionsStore,
    reset,
    setParams,
    setSearchValue,
  });

  useContextProvider(searchContext, searchStore);

  useVisibleTask$(() => {
    initFlowbite();
  });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet='utf-8' />
        <link rel='manifest' href='/manifest.json' />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang='en'>
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
