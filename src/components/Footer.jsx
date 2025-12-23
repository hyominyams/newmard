export default function Footer() {
  const homepageUrl = "https://homepage-omega-three.vercel.app/";

  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12 text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">Newmard</p>
            <p className="mt-3 text-sm text-slate-300/80">
              디지털 노마드를 위한 도시 탐색 랜딩 페이지
            </p>
            <p className="mt-5 text-xs text-slate-300/70">
              © {new Date().getFullYear()} Park. 모든 권리 보유.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-white">연락처</p>
            <ul className="mt-4 grid gap-3 text-sm text-slate-200/90">
              <li className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-slate-300/70">이메일</span>
                <a
                  className="text-right font-semibold text-slate-100 hover:text-white hover:underline"
                  href="mailto:jhjhpark0800@gmail.com"
                >
                  jhjhpark0800@gmail.com
                </a>
              </li>
              <li className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-slate-300/70">위치</span>
                <span className="text-right font-semibold text-slate-100">대한민국</span>
              </li>
              <li className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-slate-300/70">전화번호</span>
                <a
                  className="text-right font-semibold text-slate-100 hover:text-white hover:underline"
                  href="tel:061-000-0000"
                >
                  061-000-0000
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-white">소셜</p>
            <p className="mt-3 text-sm text-slate-300/80">
              아래 버튼은 제작자 개인 홈페이지로 연결돼요.
            </p>
            <nav aria-label="소셜 링크" className="mt-4 flex flex-wrap gap-2">
              <a
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-light/30"
                href={homepageUrl}
                target="_blank"
                rel="noreferrer"
              >
                홈페이지
              </a>
              <a
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-light/30"
                href={homepageUrl}
                target="_blank"
                rel="noreferrer"
              >
                포트폴리오
              </a>
              <a
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-light/30"
                href={homepageUrl}
                target="_blank"
                rel="noreferrer"
              >
                프로필
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-300/70">
          <p>Newmard는 데모/포트폴리오 목적으로 제작되었습니다.</p>
          <a
            className="hover:text-white hover:underline"
            href={homepageUrl}
            target="_blank"
            rel="noreferrer"
          >
            제작자 홈페이지 방문
          </a>
        </div>
      </div>
    </footer>
  );
}
