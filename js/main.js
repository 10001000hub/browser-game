const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ここにゲームの描画・更新処理を書く
  ctx.fillStyle = '#e94560';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Game Start!', canvas.width / 2, canvas.height / 2);

  requestAnimationFrame(gameLoop);
}

gameLoop();
