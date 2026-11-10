import sys
import subprocess
import argparse
from pathlib import Path

backend_dir = Path(__file__).resolve().parent / "backend"
frontend_dir = Path(__file__).resolve().parent / "frontend"
sys.path.insert(0, str(backend_dir))

def run_tests():
    print("=" * 60)
    print("🧪 Running AI Research Assistant Test Suite...")
    print("=" * 60)
    test_file = backend_dir / "tests" / "test_api_endpoints.py"
    subprocess.run([sys.executable, str(test_file)], check=True)

def start_backend(host="127.0.0.1", port=8000):
    import uvicorn
    print("=" * 60)
    print(f"🚀 Starting FastAPI backend on http://{host}:{port} ...")
    print(f"📖 Swagger OpenAPI Docs: http://{host}:{port}/docs")
    print("=" * 60)
    uvicorn.run("app.main:app", host=host, port=port, reload=True, app_dir=str(backend_dir))

def main():
    parser = argparse.ArgumentParser(description="AI Research Assistant Engineering Runner")
    parser.add_argument("--test", action="store_true", help="Run comprehensive unit and integration tests")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind backend")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind backend")
    args = parser.parse_args()

    if args.test:
        run_tests()
    else:
        start_backend(host=args.host, port=args.port)

if __name__ == "__main__":
    main()
