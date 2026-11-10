import os
import re
from pathlib import Path
from typing import Dict, List, Any, Tuple
import datetime

class PDFParser:
    """Extracts clean text, page demarcations, and metadata from scientific PDFs."""

    @staticmethod
    def extract_text_and_metadata(file_path: Path) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """
        Parses a PDF file into page-by-page text dictionaries and extracts metadata.
        Returns:
            pages: List[{"page_number": int, "text": str}]
            metadata: Dict containing title, authors, year, total_pages, etc.
        """
        pages = []
        raw_metadata = {}
        
        is_pdf = file_path.suffix.lower() == '.pdf'
        parsed_via_pypdf = False

        if is_pdf:
            try:
                import pypdf
                reader = pypdf.PdfReader(str(file_path))
                total_pages = len(reader.pages)
                
                info = reader.metadata or {}
                title = info.get("/Title")
                author = info.get("/Author")
                
                for i, page in enumerate(reader.pages):
                    page_text = page.extract_text() or ""
                    cleaned = PDFParser._clean_text(page_text)
                    if cleaned:
                        pages.append({
                            "page_number": i + 1,
                            "text": cleaned
                        })
                parsed_via_pypdf = True
            except Exception:
                parsed_via_pypdf = False

        if not parsed_via_pypdf:
            # Plain text / Markdown / fallback parser
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                content = f.read()
            # Split by form-feed or common page delimiters
            raw_pages = content.split("\x0c") if "\x0c" in content else [content]
            total_pages = len(raw_pages)
            title = file_path.stem
            author = "Unknown Researcher"
            for i, p in enumerate(raw_pages):
                cleaned = PDFParser._clean_text(p)
                if cleaned:
                    pages.append({
                        "page_number": i + 1,
                        "text": cleaned
                    })

        # Heuristic metadata extraction if title or authors were empty
        first_page_text = pages[0]["text"] if pages else ""
        extracted_title = title or PDFParser._infer_title(first_page_text, file_path.stem)
        extracted_authors = [author] if author else PDFParser._infer_authors(first_page_text)
        extracted_year = PDFParser._infer_year(first_page_text)

        metadata = {
            "title": extracted_title,
            "authors": extracted_authors,
            "year": extracted_year,
            "total_pages": len(pages),
            "file_size_bytes": file_path.stat().st_size if file_path.exists() else 0,
            "filename": file_path.name
        }

        return pages, metadata

    @staticmethod
    def _clean_text(text: str) -> str:
        """Removes hyphenation artifacts, cleans up non-printable chars and extra spaces."""
        if not text:
            return ""
        # Fix line breaks within words (e.g., "algo-\nrithm" -> "algorithm")
        text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
        # Normalize whitespace
        text = re.sub(r'\r\n|\r', '\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        # Eliminate excessive consecutive newlines
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()

    @staticmethod
    def _infer_title(first_page: str, fallback: str) -> str:
        """Infers paper title from the top lines of the first page."""
        lines = [line.strip() for line in first_page.split('\n') if len(line.strip()) > 5]
        if lines:
            # Usually the first 1-2 prominent non-header lines represent the title
            candidate = lines[0]
            if len(candidate) < 15 and len(lines) > 1:
                candidate = f"{candidate} {lines[1]}"
            return candidate[:150]
        return fallback.replace("_", " ").title()

    @staticmethod
    def _infer_authors(first_page: str) -> List[str]:
        """Looks for author cues or returns default."""
        # Simple heuristic looking for name patterns or returns empty
        match = re.search(r'(?:By|Authors?):\s*([^\n]+)', first_page, re.IGNORECASE)
        if match:
            raw = match.group(1)
            return [a.strip() for a in re.split(r'[,;]| and ', raw) if a.strip()]
        return ["Research Author"]

    @staticmethod
    def _infer_year(first_page: str) -> int:
        """Extracts publication year if found."""
        years = re.findall(r'\b(20[0-2][0-9]|19[89][0-9])\b', first_page)
        if years:
            return int(years[0])
        return datetime.datetime.now().year

