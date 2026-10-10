import GridBackground from "./grid-background";
import NoiseOverlay from "./noise-overlay";
import ParticleField from "./particle-field";

/** Fixed atmosphere: drifting lime and purple light, a faint grid, grain, and embers. */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute -top-[25vmax] -right-[20vmax] h-[75vmax] w-[75vmax] animate-drift rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(192,254,0,0.13), transparent 62%)",
        }}
      />
      <div
        className="absolute -bottom-[30vmax] -left-[25vmax] h-[85vmax] w-[85vmax] animate-drift rounded-full [animation-delay:-11s]"
        style={{
          background:
            "radial-gradient(circle, rgba(120,47,255,0.28), transparent 62%)",
        }}
      />
      <GridBackground
        opacity={1}
        className="[mask-image:radial-gradient(ellipse_at_50%_30%,#000,transparent_72%)]"
      />
      <NoiseOverlay opacity={0.035} />
      <ParticleField />
    </div>
  );
}
