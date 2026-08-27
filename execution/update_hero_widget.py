import os

FRONTEND_DIR = "frontend"
SRC_DIR = os.path.join(FRONTEND_DIR, "src")
COMPONENTS_DIR = os.path.join(SRC_DIR, "components")
HERO_WIDGET_DIR = os.path.join(COMPONENTS_DIR, "HeroWidget")

HERO_WIDGET_JSX = """import React, { useEffect, useState } from 'react';
import styles from './HeroWidget.module.css';

// These are placeholder images (high quality football images).
// You can replace these URLs with the paths to your own local pictures later!
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1518605368461-1e1c750b69bc?q=80&w=2074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop"
];

export default function HeroWidget() {
  const [heroData, setHeroData] = useState({
    headline: 'CREATE YOUR FOOTBALL LEGACY',
    rank: 'Global Rank: 4,521',
    rating: 'Team OVR: 86',
    status: 'Season 1 Active'
  });

  const [currentBgImage, setCurrentBgImage] = useState("");

  useEffect(() => {
    // Pick a random image on mount/refresh
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    setCurrentBgImage(BACKGROUND_IMAGES[randomIndex]);

    // TODO: Phase 2 REST Wiring
    /*
    fetch('/api/v1/dashboard/hero')
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(err => console.error("Error fetching hero data", err));
    */
  }, []);

  const handlePlayMatch = () => {
    console.log("PLAY MATCH clicked! Navigation pending Phase 2.");
    alert("Draft Room coming soon!");
  };

  const handleCreateRoom = () => {
    console.log("CREATE ROOM clicked!");
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        
        {/* Dynamic Background Image */}
        <div 
          className={styles.playerCompositePlaceholder}
          style={{ backgroundImage: `url(${currentBgImage})` }}
        >
        </div>
        
        <div className={styles.heroOverlay}>
          <div className={styles.statsPanel}>
            <span className={styles.statItem}>{heroData.status}</span>
            <span className={styles.statItem}>{heroData.rating}</span>
            <span className={styles.statItem}>{heroData.rank}</span>
          </div>
          <h1 className={styles.headline}>{heroData.headline}</h1>
          <div className={styles.secondaryActions}>
            <button className={styles.secondaryBtn} onClick={handleCreateRoom}>
              Create Room
            </button>
          </div>
        </div>
      </div>

      {/* Overlapping Primary CTA */}
      <button className={styles.primaryCta} onClick={handlePlayMatch}>
        PLAY MATCH
      </button>
    </div>
  );
}
"""

HERO_WIDGET_CSS = """.heroContainer {
  position: relative;
  width: 100%;
  margin-bottom: 5rem; /* Space for the overlapping button */
  display: flex;
  justify-content: center;
  animation: fadeIn 0.8s ease-out;
}

.heroContent {
  position: relative;
  width: 100%;
  height: 440px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-card);
  border: var(--border-subtle);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.playerCompositePlaceholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1a2234;
  /* CRITICAL: object-fit cover equivalent for backgrounds to prevent stretching */
  background-size: cover;
  background-position: center 20%; /* Keep focus near the top-center of the image */
  background-repeat: no-repeat;
  z-index: 1;
}

.heroOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* Very dark gradient at bottom for text readability, fading to transparent */
  background: linear-gradient(0deg, rgba(10,14,20,1) 5%, rgba(10,14,20,0.6) 50%, rgba(10,14,20,0.1) 100%);
  padding: 2rem;
}

.statsPanel {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.statItem {
  background-color: rgba(10, 14, 20, 0.6);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
}

.headline {
  font-size: 4.5rem;
  font-weight: 900;
  text-align: center;
  margin-top: auto;
  margin-bottom: 2.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 1);
  color: #ffffff;
  line-height: 1.1;
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: -1px;
}

.secondaryActions {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
}

.secondaryBtn {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.6rem 1.8rem;
  border-radius: var(--radius-card);
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(4px);
}

.secondaryBtn:hover {
  background-color: var(--text-primary);
  color: var(--bg-primary);
  transform: translateY(-2px);
}

.primaryCta {
  position: absolute;
  bottom: -2rem; /* Overlap effect */
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: linear-gradient(135deg, var(--accent-lime) 0%, #6abf10 100%);
  color: var(--bg-primary);
  font-size: 1.8rem;
  font-weight: 900;
  padding: 1.2rem 5rem;
  border-radius: 40px;
  box-shadow: 0 10px 25px rgba(140, 255, 26, 0.4), inset 0 2px 0 rgba(255,255,255,0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.primaryCta:hover {
  transform: translateX(-50%) scale(1.05);
  box-shadow: 0 15px 30px rgba(140, 255, 26, 0.5), inset 0 2px 0 rgba(255,255,255,0.6);
}

.primaryCta:active {
  transform: translateX(-50%) scale(0.98);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .heroContent {
    height: 340px;
  }
  
  .headline {
    font-size: clamp(2.2rem, 8vw, 3.5rem);
    margin-bottom: 3.5rem;
  }
  
  .primaryCta {
    width: 85%;
    padding: 1rem 2rem;
    font-size: 1.4rem;
  }
  
  .statsPanel {
    display: none; 
  }
}
"""

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[+] Wrote {path}")

def update_hero():
    write_file(os.path.join(HERO_WIDGET_DIR, "HeroWidget.jsx"), HERO_WIDGET_JSX)
    write_file(os.path.join(HERO_WIDGET_DIR, "HeroWidget.module.css"), HERO_WIDGET_CSS)
    print("Hero Widget update complete!")

if __name__ == "__main__":
    update_hero()
