# 3D Tetris 
After taking a React Three Fiber course and watching the movie Tetris, I wanted to create a replicate with R3F and solidy my understanding. As well as practice implementing gaming logic. 

## What I've learned: 

## Features: 
WASD keys to move left right or down, spacebar to place definititevely down - done
blocks cannot go below the base - done
blocks cannot move out side of a 10 block z-axis range - done
blocks must fall from a specified height - done
Blcoks cannot be placed where another exists - done
once the blocks hit the ground level they cannot be moved - done
once the blocks hits the top of another block that is placed they cannot be moved - done
once a block is locked, generate a new one - done
on a timer the block should move down one by its own accord - done
assign random colours - done 
if the y axis is the same and the blocks are locked and there are more than fivem, remove line - done
when a line is removed the blocks above it should all move down one row - done 
when a line of blocks is removed the score goes up - done
when the line is met it's game over and an overlay appears with a replay button - done
when the replay button is clicked the score goes to zero and the blocks start to fall - done

if there is a gap on the line, as in the y axis x axis values are not consistently incremented or decremented by one then it's not a complete line 

TO DO:
the place that the block is potioned above shouold illuminate to indicate placement
the edges of the blocks should be a darker colour
blocks should be different shapes randomly 
block must be able to rotate, pressing R
There is an upper limit, defined by a visual line
add a pause feature


bugs
the space bar press to send to the bottom doesn't work 