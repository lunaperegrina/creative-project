import Link from "next/link";

export default function NotFound() {
  return (
    <div className="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center bg-mainPurple text-black">
      <h1 className="text-5xl font-bold">404</h1>
      <p>Não encontrado</p>
      <Link href="/" className="mt-4 text-2xl underline">
        Voltar
      </Link>
    </div>
  );
}
