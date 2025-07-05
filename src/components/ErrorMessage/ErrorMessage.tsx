export function ErrorMessage({ text }: { text: string }) {
  if (!text) return;
  return (
    <h1 className="text-red-500 text-semibold my-10 mx-auto items-center text-center">
      {text}
    </h1>
  );
}
