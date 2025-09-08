const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-3 bg-white shadow-1xl">
      <div className="flex items-center gap-2">
        <img className="w-7 h-7" src="/icon.png" alt="Logo" />
        <h1 className="text-xl font-bold">GenAI Stack</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-300 text-white">
          S
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
