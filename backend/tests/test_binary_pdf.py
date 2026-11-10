import sys
from pathlib import Path
from pypdf import PdfWriter

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.pdf_parser import PDFParser

# Generate a small 2-page PDF
pdf_path = backend_dir.parent / "data" / "sample_papers" / "generated_test.pdf"
writer = PdfWriter()
writer.add_blank_page(width=612, height=792)
writer.add_blank_page(width=612, height=792)

with open(pdf_path, "wb") as f:
    writer.write(f)

print(f"Generated test binary PDF: {pdf_path.name}")
pages, meta = PDFParser.extract_text_and_metadata(pdf_path)
print(f"✓ Parsed binary PDF successfully! Total pages: {meta['total_pages']}")
print("PDF test complete!")

if pdf_path.exists():
    pdf_path.unlink()
