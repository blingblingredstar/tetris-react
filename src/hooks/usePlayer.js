import { useState, useCallback } from 'react'

import { randomTetromino, TETROMINOS } from '../tetrominos'
import { STAGE_WIDTH, checkCollision } from '../gameHelper'

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    position: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  })

  const rotate = (matrix, direction) => {
    // Make rows become cols
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map((col) => col[index]),
    )
    // Reverse each row to get rotated matrix
    if (direction > 0) {
      return rotatedTetro.map((row) => row.reverse())
    } else {
      return rotatedTetro.reverse()
    }
  }

  const playerRotate = (stage, direction) => {
    const _player = JSON.parse(JSON.stringify(player))
    _player.tetromino = rotate(_player.tetromino, direction)

    const position = _player.position.x
    let offset = 1

    while (checkCollision(_player, stage, { x: 0, y: 0 })) {
      _player.position.x += offset
      offset = -(offset + (offset > 0 ? 1 : 0))
      if (offset > _player.tetromino[0].length) {
        rotate(_player.tetromino, -direction)
        _player.position.x = position
        return
      }
    }

    setPlayer(_player)
  }

  const updatePlayerPosition = ({ x, y, collided }) => {
    setPlayer((previous) => ({
      ...previous,
      position: {
        x: (previous.position.x += x),
        y: (previous.position.y += y),
      },
      collided,
    }))
  }

  const resetPlayer = useCallback(() => {
    setPlayer({
      position: {
        x: STAGE_WIDTH / 2 - 2,
        y: 0,
      },
      tetromino: randomTetromino().shape,
      collided: false,
    })
  }, [])
  return [player, updatePlayerPosition, resetPlayer, playerRotate]
}
