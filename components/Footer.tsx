export function Footer() {
  return (
    <footer className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Glass Card */}
        <div
          className="rounded-3xl p-12 backdrop-blur-xl"
          style={{
            backgroundColor: 'rgba(100, 116, 139, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Column 1 — Logo + Social */}
            <div>
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">InventoryAI</span>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-6">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:scale-105 transition-transform duration-200"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:scale-105 transition-transform duration-200"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2 — Pages */}
            <div>
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                PAGES
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-white/80 transition-colors duration-150"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-white hover:text-white/80 transition-colors duration-150"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-white hover:text-white/80 transition-colors duration-150"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/signin"
                    className="text-white hover:text-white/80 transition-colors duration-150"
                  >
                    Sign In
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 — Information */}
            <div>
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                INFORMATION
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#contact"
                    className="text-white hover:text-white/80 transition-colors duration-150"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    className="text-white hover:text-white/80 transition-colors duration-150"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="text-white hover:text-white/80 transition-colors duration-150"
                  >
                    Terms of use
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
