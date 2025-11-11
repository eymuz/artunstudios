// === PuddleMovement.js ===
const PuddleMovement = (() => {
  let yaw = 0, player = null, camera = null, speed = 0.1, turn = 0.1;
  function attach(p, c, opts = {}) {
    player = p; camera = c;
    if (opts.speed) speed = opts.speed;
    if (opts.turn) turn = opts.turn;
    window.addEventListener('keydown', keyHandler);
  }
  function keyHandler(e) {
    if (!player || !camera) return;
    if (e.key === 'a') yaw += turn;
    if (e.key === 'd') yaw -= turn;
    const s = Math.sin(yaw) * speed, c = Math.cos(yaw) * speed;
    if (e.key === 'w') { player.position.x += s; player.position.z += c; }
    if (e.key === 's') { player.position.x -= s; player.position.z -= c; }
    camera.rotation.y = yaw;
  }
  return { attach };
})();
