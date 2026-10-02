export interface ParticlePoint {
  x: number;
  y: number;
  z: number;
  originX: number;
  originY: number;
  originZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  isCyan: boolean;
  driftPhase: number;
  driftSpeed: number;
}

export class Particle {
  x: number;
  y: number;
  z: number;
  originX: number;
  originY: number;
  originZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  isCyan: boolean;
  driftPhase: number;
  driftSpeed: number;

  constructor(point: ParticlePoint) {
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;
    this.originX = point.originX;
    this.originY = point.originY;
    this.originZ = point.originZ;
    this.vx = point.vx || 0;
    this.vy = point.vy || 0;
    this.vz = point.vz || 0;
    this.size = point.size;
    this.alpha = point.alpha;
    this.baseAlpha = point.baseAlpha;
    this.color = point.color;
    this.isCyan = point.isCyan;
    this.driftPhase = point.driftPhase ?? Math.random() * Math.PI * 2;
    this.driftSpeed = point.driftSpeed ?? (0.01 + Math.random() * 0.02);
  }

  // Update particle with spring return to origin, mouse repulsion, and subtle organic float
  update(
    mouseX: number | null,
    mouseY: number | null,
    repelRadius: number = 85,
    repelStrength: number = 4.0,
    springStiffness: number = 0.08,
    damping: number = 0.86,
    time: number = 0
  ) {
    // Subtle organic floating drift
    const driftX = Math.sin(time * this.driftSpeed + this.driftPhase) * 0.4;
    const driftY = Math.cos(time * this.driftSpeed * 0.8 + this.driftPhase) * 0.4;

    const targetX = this.originX + driftX;
    const targetY = this.originY + driftY;

    // Mouse repulsion force
    if (mouseX !== null && mouseY !== null) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < repelRadius && dist > 0.1) {
        const force = (1 - dist / repelRadius) * repelStrength;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
      }
    }

    // Spring return force towards origin
    const springX = (targetX - this.x) * springStiffness;
    const springY = (targetY - this.y) * springStiffness;

    this.vx = (this.vx + springX) * damping;
    this.vy = (this.vy + springY) * damping;

    this.x += this.vx;
    this.y += this.vy;
  }
}
