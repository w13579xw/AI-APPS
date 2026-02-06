export enum GameState {
  IDLE = 'IDLE',         // Initial screen
  WAITING = 'WAITING',   // Red screen, waiting for random time
  NOW = 'NOW',           // Green screen, user must click
  RESULT = 'RESULT',     // Showing the result of the click
  TOO_EARLY = 'TOO_EARLY' // User clicked on Red
}

export interface Score {
  id: string;
  ms: number;
  timestamp: number;
}