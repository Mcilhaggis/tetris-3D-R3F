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
There is an upper limit, defined by a visual line - done
more than a single blok should be possible as a game play token - done

TO DO:
the place that the block is potioned above shouold illuminate to indicate placement
the edges of the blocks should be a darker colour
blocks that are gouped together should not fall seperated
blocks should be different shapes randomly 
block must be able to rotate, pressing R
add a pause feature
Make the game play 10 x 10 and both directions on the z plane can be a point
Add websockts and make a multiplayer, where each user has a colour and it's like connect four but not one after the other, once a block is placed generate a new block for the player who has placed 


What did I learn? 

THat State should be held at the highest point as much as possible. In controlling the locked state of the group I found that ineeded to raise it up to the app p[arent to be able ot easily ocmmunicate that each block should be locked to it's group memebers. This shouldhave been ste up from the starts.


bugs
the space bar press to send to the bottom doesn't work 