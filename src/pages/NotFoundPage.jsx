import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight">404</h1>
      <p className="mt-2 text-base text-slate-500">Pagina pe care o cauți nu există.</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition"
      >
        Înapoi la pagina principală
      </Link>
    </div>
  );
}