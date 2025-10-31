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
  1: { main: '#ff9423', highlight: '#ffb362', shadow: '#cf6d07' },
  2: { main: '#b923ff', highlight: '#cd62ff', shadow: '#8f07cf' },
  3: { main: '#919191', highlight: '#b0b0b0', shadow: '#6b6b6b' },
  4: { main: '#238eff', highlight: '#62aeff', shadow: '#0768cf' },
  5: { main: '#23ff61', highlight: '#62ff8f', shadow: '#07cf3e' },
  6: { main: '#ff4423', highlight: '#ff7a62', shadow: '#cf2307' },
  7: { main: '#ffc423', highlight: '#ffd562', shadow: '#cf9807' },

  // Shadow-block
  8: { main: '#fff', highlight: '#fff', shadow: '#fff' }
};

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
  private get block(): BlockType[][] {
    if (!this._block) {
      this._yPos = 0;
      this._block = BLOCKS[Math.floor(Math.random() * BLOCKS.length)] as BlockType[][];
      this._xPos = Math.floor(((this.width / BLOCK_SIZE) - this._block[0].length) / 2);
      this._newX = this._xPos;
    }

    return this._block;
  }

  private get shadowBlockY(): number {
    var y = this._yPos;
    let rows = 0;
    while (this.isValidPosition(this.block, this._xPos, this._yPos + rows + 1)) {
      rows++;
    }

    return this._yPos + rows;
  }

  private _newX: number = 0;
  private _xPos: number = 0;
  private _yPos: number = 0;
  private _rows: BlockType[][] = [];
  private _level: number = 0;
  private _score: number = 0;
  private _lockDelay: number = 0;
  private _xDown: number | null = null;
  private _yDown: number | null = null;
  private _lastUpdate: number = Date.now();
  private _performingGesture = false;

  constructor(selector: string, private width: number, private height: number) {
    this._container = document.querySelector(selector) as HTMLElement;
    this._canvas = document.createElement('canvas');
    this._canvas.width = this.width;
    this._canvas.height = this.height;
    this._ctx = this._canvas.getContext('2d')!;
    this._container.appendChild(this._canvas);

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
    this._yPos = 0;
    this.fillRows();

    this._gameState = GameState.Playing;
  }

  private bindInputs() {
    document.addEventListener('keydown', e => this.onKeyDown(e));
    document.addEventListener('touchstart', e => this.onTouchStart(e));
    document.addEventListener('touchmove', e => this.onTouchMove(e));
    document.addEventListener('touchend', e => this.onTouchEnd(e));
    document.addEventListener('mousedown', e => this.onTap(e));
  }

  private onTap(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (this._gameState === GameState.Playing && !this._performingGesture) {
      this.rotateBlock(Direction.Right);
    }
  }

  private onTouchStart(e: TouchEvent) {
    e.preventDefault();
    const { clientX, clientY } = e.touches[0];
    this._xDown = clientX;
    this._yDown = clientY;
  }

  private onTouchMove(e: TouchEvent) {
    const { _xDown: xDown, _yDown: yDown } = this;
    if (!xDown || !yDown) {
      return;
    }

    const { clientX, clientY } = e.touches[0];
    const xDiff = xDown - clientX;
    const yDiff = yDown - clientY;
    const sense = 5;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > sense) {
        this.move(this.block, Direction.Left);
      } else if (xDiff < -sense) {
        this.move(this.block, Direction.Right);
      }
    } else {
      if (yDiff > sense) {
        // this.rotateBlock(Direction.Right);
      } else if (yDiff < -sense) {
        this.dropBlock();
      }
    }

    if (Math.abs(xDiff) > sense || Math.abs(yDiff) > sense) {
      this._performingGesture = true;
      this._xDown = clientX;
      this._yDown = clientY;
    }
  }

  private onTouchEnd(e: TouchEvent) {
    this._performingGesture = false;
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
          const x = xPos + rowX;
          const y = yPos + rowY;

          rows[yPos + rowY][xPos + rowX] = column;
        }
      });
    });

    this._yPos = 0;
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
        let yy = direction === Direction.Right ? x : this.block.length - 1 - x;
        let xx = direction === Direction.Right ? this.block.length - 1 - y : y;
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
        this._rows.unshift(row.map(column => 0 as BlockType));
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
      } else if (this._yPos === 0) {
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

  renderBlock(x: number, y: number, color: BlockType, ctx: CanvasRenderingContext2D, isShadowBlock: boolean = false) {
    ctx.save();
    // ctx.translate(x * BLOCK_SIZE, y * BLOCK_SIZE);
    ctx.translate((x * BLOCK_SIZE) + 1, (y * BLOCK_SIZE) + 1);

    const effectiveSize = BLOCK_SIZE - 2;

    const padding = (BLOCK_SIZE - effectiveSize) * 2;

    if (color !== 0) {
      const blockColor = isShadowBlock ? COLORS[8] : COLORS[color];
      ctx.fillStyle = blockColor.main;
      ctx.fillRect(0, 0, effectiveSize, effectiveSize);
      

      if (!isShadowBlock) {

        ctx.strokeStyle = blockColor.highlight;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(effectiveSize, 0);
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = blockColor.shadow;
        ctx.beginPath();
        ctx.moveTo(0, effectiveSize - 1);
        ctx.lineTo(effectiveSize, effectiveSize - 1);
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = 2;
        ctx.strokeRect(padding, padding, effectiveSize - padding * 2, effectiveSize - padding * 2 - 1);

        ctx.strokeStyle = blockColor.highlight;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(effectiveSize - 4, padding);
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding,effectiveSize - 4);
        ctx.stroke();
        ctx.closePath();
      }
    }
    ctx.restore();
  }

  renderCurrentBlock(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this._xPos * BLOCK_SIZE, this._yPos * BLOCK_SIZE);

    this.block.forEach((row, y) => {
      row.forEach((blockColor, x) => this.renderBlock(x, y, blockColor, ctx));
    });

    ctx.restore();
  }

  renderShadowBlock(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this._xPos * BLOCK_SIZE, this.shadowBlockY * BLOCK_SIZE);

    ctx.globalAlpha = .2;

    this.block.forEach((row, y) => {
      row.forEach((blockColor, x) => this.renderBlock(x, y, blockColor, ctx, true));
    });

    ctx.restore();
  }

  private renderGameOver(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, .8';
    ctx.fillRect(0, this.height / 2 - 30, this.width, 45);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#505e79';
    ctx.fillText('Game Over!', 76, 200);
  }

  render(gameTime: number, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#0b2948';
    ctx.fillRect(0, 0, this.width, this.height);

    // Render rows
    this._rows.forEach((row, y) => {
      row.forEach((column, x) => this.renderBlock(x, y, column, ctx));
    });

    if (this.block) {
      this.renderShadowBlock(ctx);
      this.renderCurrentBlock(ctx);
    }

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${this._score}`, 15, 30);

    if (this._gameState === GameState.GameOver) {
      this.renderGameOver(ctx);
    }
  }
}

window.onload = () => {
  new Blocks('#gameContainer', 260, 400);
};
