import { faker } from '@faker-js/faker';

import { LoaderFunctionArgs, json } from '@remix-run/node';
import { ClientLoaderFunctionArgs } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
  const q = new URL(request.url).searchParams.get('q');
  return json({
    results: q
      ? users.filter((user) =>
          user.name.toLowerCase().includes(q?.toLowerCase() ?? '')
        )
      : [],
  });
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener('abort', (e) => {
        clearTimeout(timeout);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        reject(e.target?.reason);
      });
    }
  });
}

export async function clientLoader({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  console.log('------ client loader ------');
  await wait(500, request.signal);
  console.log('------ server loader ------');
  return await serverLoader();
}

type Person = { id: string; name: string };

const users: Person[] = Array.from({ length: 100 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
}));
