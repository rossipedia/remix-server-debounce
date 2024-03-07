import { faker } from '@faker-js/faker';
import { LoaderFunctionArgs, json } from '@remix-run/node';

function delay(ms: number, signal?: AbortSignal) {
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
    });
  });
}

type Person = { id: string; name: string };

const users: Person[] = Array.from({ length: 100 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
}));

export async function loader({ request }: LoaderFunctionArgs) {
  await delay(500, request.signal);

  const q = new URL(request.url).searchParams.get('q');
  console.log('------ returning results ------');

  return json({
    results: q
      ? users.filter((user) =>
          user.name.toLowerCase().includes(q?.toLowerCase() ?? '')
        )
      : [],
  });
}
