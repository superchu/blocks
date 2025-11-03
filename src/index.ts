/*
 * Blocks game by Oscar Wallhult
 *
 */

enum GameState {
  Playing,
  Paused,
  GameOver
}

enum Key {
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
  Space = 32,
  P = 80,
}

const BLOCKS = [
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [
    [0, 2, 0],
    [0, 2, 0],
    [0, 2, 2],
  ],
  [
    [3, 3, 0],
    [0, 3, 3],
    [0, 0, 0],
  ],
  [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 5, 0],
    [0, 0, 5, 0],
    [0, 0, 5, 0],
    [0, 0, 5, 0],
  ],
  [
    [6, 6],
    [6, 6],
  ],
  [
    [0, 7, 0],
    [7, 7, 7],
    [0, 0, 0],
  ]
];

type BlockType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const COLORS = {
  1: { main: '#ff9423', highlight: '#ffb362', shadow: '#cf6d07', inner: '#e78218' },
  2: { main: '#b923ff', highlight: '#cd62ff', shadow: '#8f07cf', inner: '#a417e6' },
  3: { main: '#919191', highlight: '#b0b0b0', shadow: '#6b6b6b', inner: '#7c7b7b' },
  4: { main: '#238eff', highlight: '#62aeff', shadow: '#0768cf', inner: '#187ee7' },
  5: { main: '#23ff61', highlight: '#62ff8f', shadow: '#07cf3e', inner: '#18e74e' },
  6: { main: '#ff4423', highlight: '#ff7a62', shadow: '#cf2307', inner: '#e73018' },
  7: { main: '#ffc423', highlight: '#ffd562', shadow: '#cf9807', inner: '#e7af18' },

  // Shadow-block
  8: { main: '#fff', highlight: '#fff', shadow: '#fff', inner: '#fff' }
};

const BLOCK_PREVIEW_OFFSET = {
  1: { x: 8, y: 5 },
  2: { x: 3, y: 5 },
  3: { x: 5, y: 10, },
  4: { x: 5, y: 10 },
  5: { x: -5, y: 0 },
  6: { x: 10, y: 10 },
  7: { x: 5, y: 10 },
  8: { x: 0, y: 0 },
}

enum Direction {
  Left,
  Right,
  Down
}

const BLOCK_SIZE = 20;
const ROW_POINTS = [0, 40, 100, 300, 1200];
const LOCK_DELAY = 2;

export default class Blocks {
  private readonly _container: HTMLElement;
  private readonly _canvas: HTMLCanvasElement;
  private readonly _ctx: CanvasRenderingContext2D;
  private readonly _framerate: number = 1000 / 100;
  private _gameTime: number = 0;
  private _gameState: GameState = GameState.Paused;

  private _block: BlockType[][] | null = null;
  private _nextBlock: BlockType[][] | null = null;

  private get nextBlock(): BlockType[][] {
    if (!this._nextBlock) {
      this._nextBlock = BLOCKS[Math.floor(Math.random() * BLOCKS.length)] as BlockType[][];
    }

    return this._nextBlock;
  }

  private get block(): BlockType[][] {
    if (!this._block) {
      this._block = this.nextBlock;
      this._yPos = this._offset;
      this._xPos = Math.floor(((this.width / BLOCK_SIZE) - this._block[0].length) / 2);
      this._newX = this._xPos;

      this._nextBlock = null;
    }

    return this._block;
  }

  private get shadowBlockY(): number {
    let rows = 0;
    while (this.isValidPosition(this.block, this._xPos, this._yPos + rows + 1)) {
      rows++;
    }

    return this._yPos + rows;
  }

  private _offset: number = 2;
  private _newX: number = 0;
  private _xPos: number = 0;
  private _yPos: number = 0;
  private _rows: BlockType[][] = [];
  private _level: number = 0;
  private _score: number = 0;
  private _lockDelay: number = 0;
  private _lastUpdate: number = Date.now();
  private _pointers: Map<number, any> = new Map();

  constructor(selector: string, private width: number, private height: number) {
    this._container = document.querySelector(selector) as HTMLElement;
    this._canvas = document.createElement('canvas');
    this._canvas.width = this.width;
    this._canvas.height = this.height;
    this._ctx = this._canvas.getContext('2d')!;
    this._container.appendChild(this._canvas);

    this._ctx.imageSmoothingEnabled = false;
    this._ctx.textRendering = 'geometricPrecision';

    this.reset();
    this.bindInputs();
    this.mainloop();
  }

  private reset() {
    this._lockDelay = 0;
    this._block = null;
    this._level = 0;
    this._score = 0;

    this._xPos = (this.width / BLOCK_SIZE) / 2;
    this._yPos = this._offset;
    this.fillRows();

    this._gameState = GameState.Playing;
  }

  private bindInputs() {
    document.addEventListener('keydown', e => this.onKeyDown(e));
    document.addEventListener('pointerdown', e => this.onPointerDown(e));
    document.addEventListener('pointerup', e => this.onPointerUp(e));
    document.addEventListener('pointercancel', e => this.onPointerUp(e));
    document.addEventListener('pointermove', e => this.onPointerMove(e));

    document.addEventListener('touchstart', e => this.onTouchStart(e), { passive: false });
  }

  private onTouchStart(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  private onPointerDown(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    const touch = {
      pageX: e.pageX,
      pageY: e.pageY,
      didMove: false,
    };
    this._pointers.set(e.pointerId, touch);
  }

  private onPointerUp(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    const touch = this._pointers.get(e.pointerId);

    if (this._gameState === GameState.Playing && !touch?.didMove) {
      this.rotateBlock(Direction.Right);
    }

    this._pointers.delete(e.pointerId);

    if (this._gameState === GameState.GameOver) {
      this.reset();
    }
  }

  private onPointerMove(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    const touch = this._pointers.get(e.pointerId);
    if (!touch) {
      return;
    }

    const newTouch = {
      pageX: e.pageX,
      pageY: e.pageY,
      didMove: touch.didMove,
    };

    const xDiff = (newTouch.pageX - touch.pageX) / BLOCK_SIZE;
    const yDiff = (newTouch.pageY - touch.pageY) / BLOCK_SIZE;

    const sense = .5;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff < -sense) {
        this.move(this.block, Direction.Left);
        newTouch.didMove = true;
        this._pointers.set(e.pointerId, newTouch);
      } else if (xDiff > sense) {
        this.move(this.block, Direction.Right);
        newTouch.didMove = true;
        this._pointers.set(e.pointerId, newTouch);
      }
    } else {
      if (!newTouch.didMove) {
        if (yDiff > 2) {
          this.dropBlock();
          newTouch.didMove = true;
          this._pointers.set(e.pointerId, newTouch);
          return;
        }
      } else if (yDiff > sense) {
        this.move(this.block, Direction.Down);
        this._pointers.set(e.pointerId, newTouch);
      }
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    const isPlaying = this._gameState === GameState.Playing;
    if (e.keyCode === Key.P) {
      if (isPlaying) {
        this._gameState = GameState.Paused;
      } else {
        this._gameState = GameState.Playing;
      }
    }

    if (!isPlaying) {
      if (this._gameState === GameState.GameOver) {
        this.reset();
      }

      return;
    }

    switch (e.keyCode) {
      case Key.Up:
        this.rotateBlock(Direction.Right);
        break;
      case Key.Down:
        this.move(this.block, Direction.Down);
        break;
      case Key.Left:
        this.move(this.block, Direction.Left);
        break;
      case Key.Right:
        this.move(this.block, Direction.Right);
        break;
      case Key.Space:
        this.dropBlock();
        break;
    }
  }

  private move(block: number[][], direction: Direction) {
    if (direction === Direction.Down) {
      let newY = this._yPos + 1;

      if (this.isValidPosition(block, this._newX, newY)) {
        this._yPos = newY;
        this._score++;
      }
    } else {
      let newX = this._xPos + (direction === Direction.Left ? -1 : 1);

      if (this.isValidPosition(block, newX, this._yPos)) {
        this._newX = newX;
      }
    }
  }

  private dropBlock() {
    let rows = 0;
    while (this.isValidPosition(this.block, this._xPos, this._yPos + rows + 1)) {
      rows++;
    }
    this._yPos += rows;
    this._score += rows * 2;

    // No lock-delay when dropping
    this.mergeCurrentBlock();
  }

  private isValidPosition(block: number[][], xPos: number, yPos: number): boolean {
    let isValid = true;
    block.forEach((row, rowY) => {
      row.forEach((column, rowX) => {
        if (column !== 0) {
          const x = xPos + rowX;
          const y = yPos + rowY;

          if (x < 0) {
            isValid = false;
          } else if (x >= this.width / BLOCK_SIZE) {
            isValid = false;
          } else if (y >= this.height / BLOCK_SIZE) {
            isValid = false;
          } else if (this._rows[yPos + rowY][xPos + rowX]) {
            isValid = false;
          }
        }
      });
    });

    return isValid;
  }

  private mergeCurrentBlock() {
    const { block, _xPos: xPos, _yPos: yPos, _rows: rows } = this;

    block.forEach((row, rowY) => {
      row.forEach((column, rowX) => {
        if (column !== 0) {

          rows[yPos + rowY][xPos + rowX] = column;
        }
      });
    });

    this._yPos = this._offset;
    this._block = null;
    this._lockDelay = 0;
  }

  private fillRows() {
    const { _rows: rows, width, height } = this;

    for (let y = 0; y < height / BLOCK_SIZE; y++) {
      rows[y] = [];
      for (let x = 0; x < width / BLOCK_SIZE; x++) {
        rows[y][x] = 0;
      }
    }
  }

  private rotateBlock(direction: Direction) {
    const newBlock: BlockType[][] = [];

    this.block.forEach((row, y) => {
      row.forEach((column, x) => {
        const yy = direction === Direction.Right ? x : this.block.length - 1 - x;
        const xx = direction === Direction.Right ? this.block.length - 1 - y : y;
        newBlock[yy] = newBlock[yy] || [];
        newBlock[yy][xx] = column;
      });

    });

    if (this.isValidPosition(newBlock, this._newX, this._yPos)) {
      this._block = newBlock;
    }
  }

  private clearFullRows() {
    let rowCount = 0;
    const rows = [...this._rows];
    rows.forEach((row, index) => {
      if (!row.some(column => column === 0)) {
        this._rows.splice(index, 1);
        this._rows.unshift(row.map(() => 0 as BlockType));
        rowCount++;
      }
    });

    this._score += (Math.floor(this._level) + 1) * ROW_POINTS[rowCount];
    this._level += rowCount / 10;
  }

  private mainloop() {
    const deltaTime = Date.now() - this._lastUpdate;

    if (this._gameState === GameState.Playing) {
      if (deltaTime >= this._framerate) {
        this._lastUpdate = Date.now();
        this._gameTime++;
        this.update(this._gameTime);
      }
    }
    this.render(this._gameTime, this._ctx);
    window.requestAnimationFrame(() => this.mainloop());
  }

  update(gameTime: number) {
    this._xPos = this._newX;
    const speed = Math.max(1, 20 - Math.floor(this._level));

    if (gameTime % speed === 0) {
      let newY = this._yPos + 1;
      if (this.isValidPosition(this.block, this._xPos, newY)) {
        this._yPos = newY;
      } else if (this._yPos === this._offset) {
        this._gameState = GameState.GameOver;
      } else {
        if (this._lockDelay >= LOCK_DELAY) {
          this.mergeCurrentBlock();
        }
        this._lockDelay++;
      }

      this.clearFullRows();
    }
  }

  renderBlock(x: number, y: number, color: BlockType, ctx: CanvasRenderingContext2D, blockSize: number, isShadowBlock: boolean = false) {
    ctx.save();
    ctx.translate((x * blockSize) + 1, (y * blockSize) + 1);

    const effectiveSize = blockSize - 2;
    const padding = Math.floor(effectiveSize / 4);

    if (color !== 0) {
      const blockColor = isShadowBlock ? COLORS[8] : COLORS[color];
      ctx.fillStyle = blockColor.main;
      ctx.fillRect(0, 0, effectiveSize, effectiveSize);


      if (!isShadowBlock) {
        ctx.fillStyle = blockColor.highlight;
        ctx.fillRect(0, 0, effectiveSize, 1);

        ctx.fillStyle = blockColor.shadow;
        ctx.fillRect(0, effectiveSize - 1, effectiveSize, 1);

        ctx.strokeStyle = blockColor.inner;

        ctx.lineWidth = 0.1 * blockSize;
        ctx.strokeRect(padding, padding, effectiveSize - padding * 2, effectiveSize - padding * 2);
      }
    }
    ctx.restore();
  }

  renderCurrentBlock(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this._xPos * BLOCK_SIZE, this._yPos * BLOCK_SIZE);

    this.block.forEach((row, y) => {
      row.forEach((blockColor, x) => this.renderBlock(x, y, blockColor, ctx, BLOCK_SIZE));
    });

    ctx.restore();
  }

  renderShadowBlock(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this._xPos * BLOCK_SIZE, this.shadowBlockY * BLOCK_SIZE);

    ctx.globalAlpha = .2;

    this.block.forEach((row, y) => {
      row.forEach((blockColor, x) => this.renderBlock(x, y, blockColor, ctx, BLOCK_SIZE, true));
    });

    ctx.restore();
  }

  private renderGameOver(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = .8;
    ctx.fillStyle = '#04172b';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalAlpha = 1;

    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#fff';

    const gameOverText = 'GAME OVER!';
    const gameOverTextSize = ctx.measureText(gameOverText);

    ctx.fillText(gameOverText, (this.width - gameOverTextSize.width) / 2, this._offset * BLOCK_SIZE + (this.height / 2 - 40));

    ctx.font = 'bold 15px sans-serif';

    const scoreText = `SCORE: ${this._score}`;
    const scoreTextSize = ctx.measureText(scoreText);
    ctx.fillText(scoreText, (this.width - scoreTextSize.width) / 2, this._offset * BLOCK_SIZE + (this.height / 2 - 10));
  }

  private renderNextBlock(ctx: CanvasRenderingContext2D) {

    const blockType = this.nextBlock[0].find(Boolean);

    if (!blockType) {
      return;
    }

    const size = 10;
    ctx.save();

    ctx.translate(this.width - size * 4 - 1, 1);

    const { x, y } = BLOCK_PREVIEW_OFFSET[blockType] ?? { x: 0, y :0};

    ctx.translate(x, y);

    this.nextBlock.forEach((row, y) => {
      row.forEach((blockColor, x) => this.renderBlock(x, y, blockColor, ctx, size));
    });

    ctx.restore();
  }

  render(gameTime: number, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#04172B';
    ctx.fillRect(0, 0, this.width, this._offset * BLOCK_SIZE);

    ctx.globalAlpha = .5;

    ctx.fillStyle = '#002D5A';
    ctx.fillRect(0, this._offset * BLOCK_SIZE, this.width, this.height - this._offset * BLOCK_SIZE);

    ctx.globalAlpha = 1;

    // Render rows
    this._rows.forEach((row, y) => {
      row.forEach((column, x) => this.renderBlock(x, y, column, ctx, BLOCK_SIZE));
    });

    if (this.block) {
      this.renderShadowBlock(ctx);
      this.renderCurrentBlock(ctx);
    }

    if (this.nextBlock) {
      this.renderNextBlock(ctx);
    }

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${this._score}`, 15, 26);

    if (this._gameState === GameState.GameOver) {
      this.renderGameOver(ctx);
    }
  }
}

window.onload = () => {
  new Blocks('#gameContainer', 260, 460);
};
