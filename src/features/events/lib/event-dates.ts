export function localEventDateTime(value: string | null, timeZone: string) {
  if (!value) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return (
    part('year') +
    '-' +
    part('month') +
    '-' +
    part('day') +
    'T' +
    part('hour') +
    ':' +
    part('minute')
  );
}
export function eventDateTimeToIso(value: string, timeZone: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
    throw new Error('Choose a valid date and time.');
  const target = Date.parse(value + ':00Z');
  if (!Number.isFinite(target))
    throw new Error('Choose a valid date and time.');
  let instant = target;
  for (let step = 0; step < 3; step++) {
    const displayed = localEventDateTime(
      new Date(instant).toISOString(),
      timeZone
    );
    const difference = Date.parse(displayed + ':00Z') - target;
    instant -= difference;
    if (!difference) break;
  }
  const result = new Date(instant).toISOString();
  if (localEventDateTime(result, timeZone) !== value)
    throw new Error(
      'This local time is unavailable in the selected timezone. Choose another time.'
    );
  return result;
}
