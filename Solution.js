var Board = require("./Board");
var PriorityQueue = require("./node_modules/js-priority-queue/priority-queue");
class Solution {
  constructor(initialPositions) {
    this.board = new Board(
      0,
      this.findSlidePos(initialPositions),
      initialPositions
    );
    this.initialState = this.board.hash;
    this.explored = new Set([]);
    this.pathTo = {};
    this.decodeBoard = {};
    this.decodeMove = {};
    this.pathTo[this.initialState] = this.initialState;
    this.decodeBoard[this.initialState] = this.board;
    this.decodeMove[this.initialState] = 0;
  }

  //Find the position of the 0 (slider)
  findSlidePos(positions) {
    return positions.findIndex(element => {
      return element === 0;
    });
  }

  //Check if the current state is the solution
  isSolution(board) {
    return board.hash === 29377357956;
  }

  //DFS iterative approach
  mainDFS() {
    let frontier = [this.board];
    let state;
    while (frontier.length !== 0) {
      state = frontier.pop();
      let nextMoves = state.nextMoves();
      this.explored.add(state.hash);

      if (this.isSolution(state)) {
        state.show();
        return state;
      }
      for (let move of nextMoves) {
        if (!this.explored.has(move.hash)) {
          this.decodeBoard[move.hash] = move;
          this.decodeMove[move.hash] = move.moveLedTo;
          this.pathTo[move.hash] = state.hash;
          frontier.push(move);
          this.explored.add(move.hash);
        }
      }
    }
  }

  //BFS iterative version
  mainBFS() {
    let frontier = [this.board];
    let state;
    while (frontier.length !== 0) {
      state = frontier.splice(0, 1)[0];
      let nextMoves = state.nextMoves();
      this.explored.add(state.hash);

      if (this.isSolution(state)) {
        state.show();

        return state;
      }
      for (let move of nextMoves) {
        if (!this.explored.has(move.hash)) {
          this.decodeBoard[move.hash] = move;
          this.decodeMove[move.hash] = move.moveLedTo;
          this.pathTo[move.hash] = state.hash;
          frontier.push(move);
          this.explored.add(move.hash);
        }
      }
    }
  }

  // Greedy Search
  mainGreedySearch() {
    // Prioritize based on the cost from n to goal
    let frontier = new PriorityQueue({
      comparator: function(a, b) {
        return a.manhattan - b.manhattan;
      }
    });

    frontier.queue(this.board);
    let state;

    while (frontier.length !== 0) {
      state = frontier.dequeue();
      let nextMoves = state.nextMoves();
      this.explored.add(state.hash);

      if (this.isSolution(state)) {
        state.show();
        return state;
      }

      for (let move of nextMoves) {
        if (!this.explored.has(move.hash)) {
          this.decodeBoard[move.hash] = move;
          this.decodeMove[move.hash] = move.moveLedTo;
          this.pathTo[move.hash] = state.hash;
          frontier.queue(move);
          this.explored.add(move.hash);
        }
      }
    }
  }

  // A* Search
  mainAStar() {
    // Prioritize based on the cost from n to source and n to goal
    let frontier = new PriorityQueue({
      comparator: function(a, b) {
        return a.getTotalCost() - b.getTotalCost();
      }
    });

    frontier.queue(this.board);
    let state;

    while (frontier.length !== 0) {
      state = frontier.dequeue();
      let nextMoves = state.nextMoves();
      this.explored.add(state.hash);

      if (this.isSolution(state)) {
        state.show();
        return state;
      }

      for (let move of nextMoves) {
        if (!this.explored.has(move.hash)) {
          move.moveCount += state.moveCount + 1;
          this.decodeBoard[move.hash] = move;
          this.decodeMove[move.hash] = move.moveLedTo;
          this.pathTo[move.hash] = state.hash;
          frontier.queue(move);
          this.explored.add(move.hash);
        }
      }
    }
  }

  // Dijskstra Search
  mainDS() {
    // Prioritize based on the cost from source to goal
    let frontier = new PriorityQueue({
      comparator: function(a, b) {
        return a.moveCount - b.moveCount;
      }
    });

    frontier.queue(this.board);
    let state;

    while (frontier.length !== 0) {
      state = frontier.dequeue();
      let nextMoves = state.nextMoves();
      this.explored.add(state.hash);

      if (this.isSolution(state)) {
        state.show();
        return state;
      }

      for (let move of nextMoves) {
        if (!this.explored.has(move.hash)) {
          move.moveCount += state.moveCount + 1;
          this.decodeBoard[move.hash] = move;
          this.decodeMove[move.hash] = move.moveLedTo;
          this.pathTo[move.hash] = state.hash;
          frontier.queue(move);
          this.explored.add(move.hash);
        }
      }
    }
  }

  //Print out the solution
  printSolutionPath() {
    let i = 0;
    let current = this.pathTo[29377357956];
    i++;
    while (current !== this.initialState) {
      this.decodeBoard[current].show();
      current = this.pathTo[current];
      i++;
    }
    this.decodeBoard[current].show();
    console.log(i);
  }

  //Get the sequence of moves that lead to the solution (inverse order)
  getSolutionPath() {
    let solutions = [];
    let current = 29377357956;
    while (current !== this.initialState) {
      solutions.push(this.decodeMove[current]);
      current = this.pathTo[current];
    }
    solutions.push(this.decodeMove[current]);
    return solutions;
  }
}
module.exports = Solution;
