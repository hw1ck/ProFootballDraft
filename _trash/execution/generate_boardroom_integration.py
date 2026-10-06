import os
import re

def update_file(path, pattern, replacement):
    with open(path, 'r') as f:
        content = f.read()
    
    new_content, count = re.subn(pattern, replacement, content, flags=re.DOTALL)
    if count == 0:
        print(f"Warning: Could not find pattern in {path}")
    else:
        with open(path, 'w') as f:
            f.write(new_content)
        print(f"Updated {path}")

def main():
    print("--- Starting BoardRoom Integration Generation ---")

    # 1. Update useSession.js
    update_file(
        "frontend/src/session/useSession.js",
        r"const completeSession = useCallback\(\(finalResults\) => \{",
        """const startBoardroom = useCallback((draftedSquad) => {
    setResults({ draftedSquad }); // Temporarily store it
    setSessionState('boardroom');
  }, []);

  const completeSession = useCallback((finalResults) => {"""
    )
    update_file(
        "frontend/src/session/useSession.js",
        r"completeSession\n\s*\}\;",
        "startBoardroom,\n    completeSession\n  };"
    )

    # 2. Update SessionManager.jsx
    update_file(
        "frontend/src/pages/Session/SessionManager.jsx",
        r"import ClassicDraftEngine from './ClassicDraftEngine';",
        "import ClassicDraftEngine from './ClassicDraftEngine';\nimport BoardRoom from '../BoardRoom/BoardRoom';"
    )
    update_file(
        "frontend/src/pages/Session/SessionManager.jsx",
        r"initSession, toggleReady, startReadyCheck, completeSession",
        "initSession, toggleReady, startReadyCheck, completeSession, startBoardroom"
    )
    update_file(
        "frontend/src/pages/Session/SessionManager.jsx",
        r"<ClassicDraftEngine config=\{config\} onComplete=\{\(res\) => completeSession\(res\)\} />",
        """<ClassicDraftEngine config={config} onComplete={(res) => {
              if (res.status === 'BOARDROOM') {
                startBoardroom(res.squad);
              } else {
                completeSession(res);
              }
            }} />"""
    )
    update_file(
        "frontend/src/pages/Session/SessionManager.jsx",
        r"\{sessionState === 'completed' && \(",
        """{sessionState === 'boardroom' && (
        <BoardRoom 
          initialLockerRoom={results?.draftedSquad} 
          onLockIn={(finalSquad) => {
            const starters = finalSquad.filter(p => p !== null);
            const avgOvr = Math.round(starters.reduce((acc, p) => acc + (p.overallRating || 0), 0) / starters.length) || 0;
            completeSession({ score: avgOvr, squad: starters, status: 'WIN' });
          }} 
        />
      )}
      {sessionState === 'completed' && ("""
    )

    # 3. Update useClassicDraft.js
    update_file(
        "frontend/src/pages/Session/useClassicDraft.js",
        r"const avgOvr = Math\.round\(newSquad\.reduce\(\(acc, p\) => acc \+ p\.overallRating, 0\) / newSquad\.length\);\n\s*onComplete\(\{ score: avgOvr, squad: newSquad, status: 'WIN' \}\);",
        "onComplete({ squad: newSquad, status: 'BOARDROOM' });"
    )
    update_file(
        "frontend/src/pages/Session/useClassicDraft.js",
        r"// Resolve match \(Average OVR\)",
        "// Transition to boardroom"
    )

    # 4. Update BoardRoom.jsx
    update_file(
        "frontend/src/pages/BoardRoom/BoardRoom.jsx",
        r"export default function BoardRoom\(\) \{",
        "export default function BoardRoom({ initialLockerRoom, onLockIn }) {"
    )
    update_file(
        "frontend/src/pages/BoardRoom/BoardRoom.jsx",
        r"const loadPlayers = async \(\) => \{\n\s*try \{",
        """const loadPlayers = async () => {
      if (initialLockerRoom) {
        setLockerRoom(initialLockerRoom);
        setLoading(false);
        return;
      }
      try {"""
    )
    update_file(
        "frontend/src/pages/BoardRoom/BoardRoom.jsx",
        r"onClearSquad=\{clearSquad\}\n\s*/>",
        "onClearSquad={clearSquad}\n                    onLockIn={() => onLockIn && onLockIn(squad)}\n                  />"
    )

    # 5. Update SidebarControls.jsx
    update_file(
        "frontend/src/components/SidebarControls/SidebarControls.jsx",
        r"export default function SidebarControls\(\{ selectedFormationName, onFormationChange, lockerRoom, onClearSquad \}\) \{",
        "export default function SidebarControls({ selectedFormationName, onFormationChange, lockerRoom, onClearSquad, onLockIn }) {"
    )
    update_file(
        "frontend/src/components/SidebarControls/SidebarControls.jsx",
        r"Drag players to the pitch to build your squad\n\s*</div>\n\s*</div>\n\s*</div>\n\s*\);\n\}",
        """Drag players to the pitch to build your squad
        </div>
      </div>
      
      {onLockIn && (
        <button 
          onClick={onLockIn}
          className="w-full mt-4 bg-accent-lime text-black font-bold text-lg py-4 rounded-xl uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
          style={{ boxShadow: '0 0 20px rgba(140, 255, 26, 0.3)' }}
        >
          Lock In Squad
        </button>
      )}
    </div>
  );
}"""
    )

    print("--- Done ---")

if __name__ == "__main__":
    main()
