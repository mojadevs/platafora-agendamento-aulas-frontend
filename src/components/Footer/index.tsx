export default function Footer() {
  return (
    <footer className="w-full bg-[#4e96d1e6] border-t border-gray-300 shadow-dm">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-200 text-sm">
        © {new Date().getFullYear()} JadeDrive — Todos os direitos reservados
      </div>
    </footer>
  );
}