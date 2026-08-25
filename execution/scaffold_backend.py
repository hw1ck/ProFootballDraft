import os
import subprocess
import urllib.request
import zipfile
import io

def generate_spring_boot_project(base_path: str):
    """
    Downloads a Spring Boot project via Spring Initializr API.
    Dependencies: web, jpa, postgresql, websocket, lombok
    Java Version: 21
    """
    backend_path = os.path.join(base_path, 'backend')
    if os.path.exists(backend_path) and os.listdir(backend_path):
        print(f"[!] Directory {backend_path} already exists and is not empty. Skipping scaffolding.")
        return

    print("[+] Requesting Spring Boot project from start.spring.io...")
    
    url = (
        "https://start.spring.io/starter.zip?"
        "type=maven-project&"
        "language=java&"
        "baseDir=backend&"
        "groupId=com.profootballdraft&"
        "artifactId=backend&"
        "name=backend&"
        "description=ProFootballDraftBackend&"
        "packageName=com.profootballdraft.backend&"
        "packaging=jar&"
        "javaVersion=21&"
        "dependencies=web,data-jpa,postgresql,websocket,lombok,validation"
    )

    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            with zipfile.ZipFile(io.BytesIO(response.read())) as z:
                z.extractall(base_path)
        print(f"[+] Successfully generated Spring Boot backend in {backend_path}")
    except Exception as e:
        print(f"[-] Failed to generate Spring Boot project: {e}")

if __name__ == "__main__":
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    generate_spring_boot_project(project_root)
