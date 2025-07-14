export function dateSubtract(a?: Date, b?: Date) {
  if (!a || !b) return 0;
  try {
    const diff = new Date(a).getTime() - new Date(b).getTime();
    return diff;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.log(err);
    return 0;
  }
}
