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
    print("--- Fixing Duplicates ---")

    # Fix ModeCard.jsx
    update_file(
        "frontend/src/components/ModeCard/ModeCard.jsx",
        r"import \{ useNavigate \} from 'react-router-dom';\nimport \{ useNavigate \} from 'react-router-dom';",
        "import { useNavigate } from 'react-router-dom';"
    )
    update_file(
        "frontend/src/components/ModeCard/ModeCard.jsx",
        r"const navigate = useNavigate\(\);\n\s*const navigate = useNavigate\(\);",
        "const navigate = useNavigate();"
    )

    # Fix SessionManager.jsx
    update_file(
        "frontend/src/pages/Session/SessionManager.jsx",
        r"import ClassicDraftEngine from '\./ClassicDraftEngine';\nimport BoardRoom from '\.\./BoardRoom/BoardRoom';\nimport ClassicDraftEngine from '\./ClassicDraftEngine';\nimport BoardRoom from '\.\./BoardRoom/BoardRoom';",
        "import ClassicDraftEngine from './ClassicDraftEngine';\nimport BoardRoom from '../BoardRoom/BoardRoom';"
    )

    print("--- Done ---")

if __name__ == "__main__":
    main()
