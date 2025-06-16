export default function SignupForm() {
  return (
    <form className="bg-white/5 backdrop-blur-md p-8 rounded-xl shadow-xl max-w-md w-full mx-auto mt-10 space-y-6 text-left">
      <div>
        <label className="block text-sm text-[var(--color-text-light)] mb-2">
          Full Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          className="w-full p-3 rounded-md bg-black/40 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-start)]"
        />
      </div>

      <div>
        <label className="block text-sm text-[var(--color-text-light)] mb-2">
          Email Address
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 rounded-md bg-black/40 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-start)]"
        />
      </div>

      <div>
        <label className="block text-sm text-[var(--color-text-light)] mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full p-3 rounded-md bg-black/40 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-start)]"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[var(--color-primary-start)] hover:bg-[var(--color-button-hover)] text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
      >
        Sign Up
      </button>
    </form>
  );
}
