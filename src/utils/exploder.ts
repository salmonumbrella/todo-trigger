type Particle = {
  x: number;
  y: number;
  speed: number;
  rotation: number;
  opacity: number;
  radius: number;
  friction: number;
  yVel: number;
  gravity: number;
  color: string;
};

const render = ({
  particles,
  ctx,
  width,
  height,
}: {
  particles: Particle[];
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}) => {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p) => {
    p.x += p.speed * Math.cos((p.rotation * Math.PI) / 180);
    p.y += p.speed * Math.sin((p.rotation * Math.PI) / 180);

    p.opacity -= 0.01;
    p.speed *= p.friction;
    p.radius *= p.friction;
    p.yVel += p.gravity;
    p.y += p.yVel;

    if (p.opacity < 0 || p.radius < 0) {
      return;
    }

    ctx.beginPath();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  });
};

const randomBetween = (min: number, max: number, withDecimals?: boolean) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(withDecimals ? 3 : 0));

const explode = (x: number, y: number) => {
  const colors = ["#ffc000", "#ff3b3b", "#ff8400"];
  const bubbles = 25;
  const particles: Particle[] = [];
  const ratio = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  canvas.style.position = "absolute";
  canvas.style.left = `${x - 100}px`;
  canvas.style.top = `${y - 100}px`;
  canvas.style.pointerEvents = "none";
  canvas.style.width = "200px";
  canvas.style.height = "200px";
  canvas.style.zIndex = "10000";
  canvas.width = 200 * ratio;
  canvas.height = 200 * ratio;
  document.body.appendChild(canvas);

  for (let i = 0; i < bubbles; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: randomBetween(20, 30),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: randomBetween(0, 360, true),
      speed: randomBetween(8, 12),
      friction: 0.9,
      opacity: randomBetween(0, 0.5, true),
      yVel: 0,
      gravity: 0.1,
    });
  }

  let rafId = 0;
  let isActive = true;
  const draw = () => {
    if (!isActive) {
      return;
    }
    render({ particles, ctx, width: canvas.width, height: canvas.height });
    rafId = requestAnimationFrame(draw);
  };

  draw();
  setTimeout(() => {
    isActive = false;
    cancelAnimationFrame(rafId);
    canvas.remove();
  }, 1000);
};

export default explode;
