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

type BlockColor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const COLORS = {
  1: '#fc9f4f',
  2: '#c0a3f5',
  3: '#8a96ad',
  4: '#a8d0fe',
  5: '#90bf5e',
  6: '#ff7586',
  7: '#ffd45c'
};

enum Direction {
  Left,
  Right,
  Down
}

const BLOCK_SIZE = 10;
const ROW_POINTS = [0, 40, 100, 300, 1200];
const LOCK_DELAY = 2;

export default class Blocks {
  private readonly container: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private gameTime: number = 0;
  private gameState: GameState = GameState.Paused;

  private _block: BlockColor[][] | null = null;
  private get block(): BlockColor[][] {
    if (!this._block) {
      this.yPos = 0;
      this._block = BLOCKS[Math.floor(Math.random() * BLOCKS.length)] as BlockColor[][];
      this.xPos = Math.floor(((this.width / BLOCK_SIZE) - this._block[0].length) / 2);
      this.newX = this.xPos;
    }

    return this._block;
  }

  private newX: number = 0;
  private xPos: number = 0;
  private yPos: number = 0;
  private rows: BlockColor[][] = [];
  private level: number = 0;
  private score: number = 0;
  private lockDelay: number = 0;

  constructor(selector: string, private width: number, private height: number) {
    this.container = document.querySelector(selector) as HTMLElement;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d')!;
    this.container.appendChild(this.canvas);

    this.reset();
    this.bindKeys();
    this.mainloop();
  }

  private reset() {
    this.lockDelay = 0;
    this._block = null;
    this.level = 0;
    this.score = 0;

    this.xPos = (this.width / BLOCK_SIZE) / 2;
    this.yPos = 0;
    this.fillRows();

    this.gameState = GameState.Playing;
  }

  private bindKeys() {
    document.addEventListener('keydown', e => this.onKeyDown(e));
  }

  private onKeyDown(e: KeyboardEvent) {
    const isPlaying = this.gameState === GameState.Playing;
    if (e.keyCode === Key.P) {
      if (isPlaying) {
        this.gameState = GameState.Paused;
      } else {
        this.gameState = GameState.Playing;
      }
    }

    if (!isPlaying) {
      if (this.gameState === GameState.GameOver) {
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
      let newY = this.yPos + 1;

      if (this.isValidPosition(block, this.newX, newY)) {
        this.yPos = newY;
        this.score++;
      }
    } else {
      let newX = this.xPos + (direction === Direction.Left ? -1 : 1);

      if (this.isValidPosition(block, newX, this.yPos)) {
        this.newX = newX;
      }
    }
  }

  private dropBlock() {
    let rows = 0;
    while (this.isValidPosition(this.block, this.xPos, this.yPos + rows + 1)) {
      rows++;
    }
    this.yPos += rows;
    this.score += rows * 2;
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
          } else if (this.rows[yPos + rowY][xPos + rowX]) {
            isValid = false;
          }
        }
      });
    });

    return isValid;
  }

  private mergeCurrentBlock() {
    const { block, xPos, yPos, rows } = this;

    block.forEach((row, rowY) => {
      row.forEach((column, rowX) => {
        if (column !== 0) {
          const x = xPos + rowX;
          const y = yPos + rowY;

          rows[yPos + rowY][xPos + rowX] = column;
        }
      });
    });

    this.yPos = 0;
    this._block = null;
    this.lockDelay = 0;
  }

  private fillRows() {
    const { rows, width, height } = this;

    for (let y = 0; y < height / BLOCK_SIZE; y++) {
      rows[y] = [];
      for (let x = 0; x < width / BLOCK_SIZE; x++) {
        rows[y][x] = 0;
      }
    }
  }

  private rotateBlock(direction: Direction) {
    const newBlock: BlockColor[][] = [];

    this.block.forEach((row, y) => {
      row.forEach((column, x) => {
        let yy = direction === Direction.Right ? x : this.block.length - 1 - x;
        let xx = direction === Direction.Right ? this.block.length - 1 - y : y;
        newBlock[yy] = newBlock[yy] || [];
        newBlock[yy][xx] = column;
      });

    });

    if (this.isValidPosition(newBlock, this.newX, this.yPos)) {
      this._block = newBlock;
    }
  }

  private clearFullRows() {
    let rowCount = 0;
    const rows = [...this.rows];
    rows.forEach((row, index) => {
      if (!row.some(column => column === 0)) {
        this.rows.splice(index, 1);
        this.rows.unshift(row.map(column => 0 as BlockColor));
        rowCount++;
      }
    });

    this.score += (Math.floor(this.level) + 1) * ROW_POINTS[rowCount];
    this.level += rowCount / 10;
  }

  private mainloop() {
    if (this.gameState === GameState.Playing) {
      this.gameTime++;
      this.update(this.gameTime);
    }
    this.render(this.gameTime, this.ctx);
    window.requestAnimationFrame(() => this.mainloop());
  }

  update(gameTime: number) {
    this.xPos = this.newX;
    const speed = Math.max(1, 10 - Math.floor(this.level));

    if (gameTime % speed === 0) {
      let newY = this.yPos + 1;
      if (this.isValidPosition(this.block, this.xPos, newY)) {
        this.yPos = newY;
      } else if (this.yPos === 0) {
        this.gameState = GameState.GameOver;
      } else {
        if (this.lockDelay >= LOCK_DELAY) {
          this.mergeCurrentBlock();
        }
        this.lockDelay++;
      }

      this.clearFullRows();
    }
  }

  renderBlock(x: number, y: number, color: BlockColor, ctx: CanvasRenderingContext2D) {
    if (color !== 0) {
      ctx.fillStyle = COLORS[color];
      ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }

  renderCurrentBlock(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.xPos * BLOCK_SIZE, this.yPos * BLOCK_SIZE);

    // Render currentBlock
    this.block.forEach((row, y) => {
      row.forEach((column, x) => this.renderBlock(x, y, column, ctx));
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
    ctx.fillStyle = '#d2f0ea';
    ctx.fillRect(0, 0, this.width, this.height);

    // Render rows
    this.rows.forEach((row, y) => {
      row.forEach((column, x) => this.renderBlock(x, y, column, ctx));
    });

    if (this.block) {
      this.renderCurrentBlock(ctx);
    }

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#505e79';
    ctx.fillText(`${this.score}`, 10, 20);


    if (this.gameState === GameState.GameOver) {
      this.renderGameOver(ctx);
    }
  }
}

window.onload = () => {
  new Blocks('#gameContainer', 260, 400);
};
