import Link from "next/link";
export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="text-3xl font-semibold">Registro não encontrado</h1>
      <p className="my-5 text-stone-600">
        O endereço não corresponde a um registro publicado.
      </p>
      <Link href="/casos/" className="text-teal-800 underline">
        Consultar o índice de casos
      </Link>
    </div>
  );
}
