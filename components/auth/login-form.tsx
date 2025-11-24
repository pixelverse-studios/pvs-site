'use client'

import { GoogleLoginButton } from '@/components/auth/google-login-button'

export function LoginForm() {
  return (
    <main className="relative flex min-h-screen overflow-hidden">
      {/* LEFT SIDE - Immersive Brand Experience */}
      <div className="relative hidden lg:flex lg:w-[55%] xl:w-[60%] items-center justify-center overflow-hidden bg-gradient-to-br from-[#3f00e9] via-[#7c3aed] to-[#c947ff] dark:from-[#2d0099] dark:via-[#5b21b6] dark:to-[#9333ea]">

        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-400/30 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-fuchsia-400/30 via-transparent to-transparent" />
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          {/* Large rotating hexagon */}
          <div className="absolute left-[15%] top-[20%] h-64 w-64 animate-spin-slow opacity-20">
            <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" stroke="white" strokeWidth="0.5">
              <path d="M50 2 L93.3 27.5 L93.3 72.5 L50 98 L6.7 72.5 L6.7 27.5 Z" />
            </svg>
          </div>

          {/* Medium floating circle */}
          <div className="absolute right-[20%] top-[35%] h-32 w-32 animate-float-diagonal opacity-30 rounded-full border border-white/40 backdrop-blur-sm" />

          {/* Small triangle */}
          <div className="absolute left-[25%] bottom-[25%] h-24 w-24 animate-float-reverse opacity-25">
            <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" stroke="white" strokeWidth="1">
              <path d="M50 10 L90 90 L10 90 Z" />
            </svg>
          </div>

          {/* Extra geometric accent */}
          <div className="absolute right-[15%] bottom-[40%] h-20 w-20 animate-float-slow opacity-20 rotate-45 border border-white/50" />

          {/* Glowing orbs for depth */}
          <div className="absolute left-[30%] top-[50%] h-40 w-40 animate-pulse-glow rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-[25%] bottom-[30%] h-56 w-56 animate-pulse-glow rounded-full bg-fuchsia-300/10 blur-3xl" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12 text-white">
          <div className="animate-slide-up">
            <div className="mb-8 inline-block">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <span className="text-2xl font-bold">PV</span>
                </div>
                <span className="text-3xl font-bold tracking-tight">PixelVerse</span>
              </div>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight">
              Your Digital
              <br />
              <span className="bg-gradient-to-r from-white via-purple-100 to-fuchsia-100 bg-clip-text text-transparent">
                Gateway
              </span>
            </h1>

            <p className="text-lg leading-relaxed text-white/90">
              Step into the future of web design. Access your dashboard to manage projects, track analytics, and bring your creative vision to life.
            </p>

            <div className="mt-12 flex gap-8 text-sm">
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="mb-2 text-3xl font-bold">60+</div>
                <div className="text-white/70">Projects Delivered</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="mb-2 text-3xl font-bold">100%</div>
                <div className="text-white/70">Custom Code</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="mb-2 text-3xl font-bold">24/7</div>
                <div className="text-white/70">Team Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Clean Authentication */}
      <div className="relative flex flex-1 items-center justify-center bg-[var(--pv-bg)] px-6 py-12 lg:px-12">

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--pv-text) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md animate-fade-in-right">

          {/* Mobile logo */}
          <div className="mb-12 lg:hidden text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--pv-primary)] to-[var(--pv-primary-2)] bg-clip-text text-transparent">
              PixelVerse
            </h1>
            <p className="mt-2 text-sm text-[var(--pv-text-muted)]">Access your dashboard</p>
          </div>

          {/* Main card */}
          <div className="space-y-8">

            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-[var(--pv-text)] tracking-tight">
                Welcome back
              </h2>
              <p className="text-[var(--pv-text-muted)]">
                Sign in with your Google account to continue
              </p>
            </div>

            {/* Divider with proper dark mode */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--pv-border)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--pv-bg)] px-4 text-[var(--pv-text-muted)] font-medium tracking-wider">
                  Team Authentication
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="space-y-6">
              <GoogleLoginButton />

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-[var(--pv-text-muted)]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span>Secured by Google OAuth 2.0</span>
              </div>
            </div>

            {/* Footer notice */}
            <div className="rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-3 text-center">
              <p className="text-sm text-[var(--pv-text-muted)]">
                This dashboard is only accessible to <span className="font-semibold text-[var(--pv-text)]">PixelVerse Studios</span> team members.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-diagonal {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(20px, -20px); }
          66% { transform: translate(-15px, 15px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-10px, 20px) rotate(5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -10px) scale(1.1); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        :global(.animate-spin-slow) {
          animation: spin-slow 40s linear infinite;
        }
        :global(.animate-float-diagonal) {
          animation: float-diagonal 18s ease-in-out infinite;
        }
        :global(.animate-float-reverse) {
          animation: float-reverse 22s ease-in-out infinite;
        }
        :global(.animate-float-slow) {
          animation: float-slow 15s ease-in-out infinite;
        }
        :global(.animate-pulse-glow) {
          animation: pulse-glow 10s ease-in-out infinite;
        }
        :global(.animate-slide-up) {
          animation: slide-up 1s ease-out;
        }
        :global(.animate-fade-in) {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }
        :global(.animate-fade-in-right) {
          animation: fade-in-right 0.8s ease-out;
        }
      `}</style>
    </main>
  )
}
