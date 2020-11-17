// INIT
const grid = document.querySelector('.game__grid');
const tiles = [...document.querySelectorAll('.tile')];
const emptyTile = document.querySelector('.empty');
const title = document.querySelector('.title');
const areaKeys = {
  A: ['B', 'E'],
  B: ['A', 'C', 'F'],
  C: ['D', 'G', 'B'],
  D: ['C', 'H'],
  E: ['A', 'F', 'I'],
  F: ['B', 'E', 'G', 'J'],
  G: ['F', 'H', 'C', 'K'],
  H: ['D', 'G', 'L'],
  I: ['E', 'J', 'M'],
  J: ['F', 'I', 'K', 'N'],
  K: ['J', 'G', 'L', 'O'],
  L: ['H', 'K', 'P'],
  M: ['I', 'N'],
  N: ['M', 'J', 'O'],
  O: ['N', 'K', 'P'],
  P: ['O', 'L']
};
// END INIT

// listeners
tiles.forEach(tile => {
  tile.addEventListener('click', _ => {
    const tileArea = tile.style.getPropertyValue('--area');
    const emptyTileArea = emptyTile.style.getPropertyValue('--area');

    emptyTile.style.setProperty('--area', tileArea);
    tile.style.setProperty('--area', emptyTileArea);

    moveTiles(tileArea);
  });
});

const moveTiles = area => {
  tiles.forEach(tile => {
    const tileArea = tile.style.getPropertyValue('--area');
    const targetAreaKeys = areaKeys[area];

    if (targetAreaKeys.includes(tileArea)) {
      tile.disabled = false;
    } else {
      tile.disabled = true;
    }

    checkPuzzleEnd(tiles);
  });
};

const checkPuzzleEnd = tiles => {
  // current order. e.x B,C,G,F,G,H...
  const orderedTiles = tiles
    .map(tile => tile.style.getPropertyValue('--area'))
    .toString();

  // win condition: A,B,C,D,E,F,G...
  const completedOrderedTiles = Object.keys(areaKeys).toString();

  if (orderedTiles === completedOrderedTiles) {
    title.textContent = 'You did it.';
    title.style.visibility = 'visible';
    grid.style.pointerEvents = 'none';
  } else {
    title.style.visibility = 'hidden';
  }
};

// Inversion calculator
const inversionCount = array =>
  array.reduce((accumulator, current, index, array) => {
    return array
      .slice(index)
      .filter(item => {
        return item < current;
      })
      .map(item => {
        return [current, item];
      })
      .concat(accumulator);
  }, []).length;

const shuffledKeys = keys => Object.keys(keys).sort(() => 0.5 - Math.random());

// Shuffle keys until the puzzle is actually solvable.
// A.K.A. Solvability of the Tiles Game
// https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
let startingAreas = Object.keys(areaKeys);

while (
  inversionCount(startingAreas) % 2 == 1 ||
  inversionCount(startingAreas) == 0
) {
  startingAreas = shuffledKeys(areaKeys);
}

// Shuffle style ares
// comment this if you want to see the win screen.
tiles.forEach((tile, index) => {
  tile.style.setProperty('--area', startingAreas[index]);
});

// start game with random area positrions
moveTiles(emptyTile.style.getPropertyValue('--area'));
