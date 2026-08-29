/**
 * Central registry of all gamemodes in the application.
 * The Session/Lobby architecture reads these configs dynamically to render 
 * the Setup UI and orchestrate handoffs.
 */

export const GAMEMODES = {
  mock_mode: {
    id: 'mock_mode',
    name: 'Mock Gamemode',
    description: 'A dummy gamemode used purely to validate the session and lobby handoff mechanics.',
    supportsSolo: true,
    supportsMultiplayer: true,
    multiplayerMode: 'parallel',
    playerCount: {
      fixed: false,
      min: 2,
      max: 10,
      default: 4
    },
    readyRequired: true,
    extraOptions: [
      {
        id: 'fastTimer',
        label: 'Fast Timer (15s)',
        type: 'boolean',
        defaultValue: false
      }
    ]
  }
};

export function getGamemodeDef(id) {
  return GAMEMODES[id] || null;
}
