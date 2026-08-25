export function BackgroundEffects() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-[0.22] contrast-[1.05] saturate-[0.85]"
        style={{
          backgroundImage: "url('/images/alchemist.png')",
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-[1] bg-vignette" />

      <div className="pointer-events-none fixed inset-0 z-[2] bg-noise" />

      <div
        className="pointer-events-none fixed inset-5 z-[3] animate-entrance animate-fade-in"
        style={{ "--delay": "0ms" } as React.CSSProperties}
      >
        <span className="absolute top-0 left-0 h-[22px] w-[22px] border border-gold border-r-0 border-b-0 opacity-55" />
        <span className="absolute top-0 right-0 h-[22px] w-[22px] border border-gold border-b-0 border-l-0 opacity-55" />
        <span className="absolute bottom-0 left-0 h-[22px] w-[22px] border border-gold border-t-0 border-r-0 opacity-55" />
        <span className="absolute right-0 bottom-0 h-[22px] w-[22px] border border-gold border-t-0 border-l-0 opacity-55" />
      </div>
    </>
  );
}
