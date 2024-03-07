import { useFetcher } from '@remix-run/react';
import type { loader as apiLoader } from './api';

export default function Index() {
  const fetcher = useFetcher<typeof apiLoader>();

  const isSubmittingQuery =
    fetcher.state !== 'idle' && !!fetcher.formData?.get('q');

  const hasResults =
    fetcher.state === 'idle' && fetcher.data && fetcher.data.results.length > 0;

  return (
    <div className="w-full h-full flex justify-center">
      <fieldset className="w-[500px] inline-flex flex-col gap-2 rounded border-slate-300 border border-solid shadow-xl p-4">
        <legend>Search:</legend>
        <div>
          <input
            className="w-full"
            type="text"
            name="value"
            placeholder="Value"
            onChange={(e) => {
              fetcher.submit(
                { q: e.target.value },
                { action: '/api', method: 'GET' }
              );
            }}
          />
        </div>
        {isSubmittingQuery && <div className="text-cyan-500">Loading...</div>}
        {hasResults && (
          <ul className="max-h-[300px] overflow-y-scroll">
            {hasResults &&
              fetcher.data?.results.map(({ id, name }) => (
                <li key={id}>{name}</li>
              ))}
          </ul>
        )}
      </fieldset>
    </div>
  );
}
