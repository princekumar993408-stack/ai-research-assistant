import re
from typing import Dict, Any, List

class CitationGenerator:
    """Generates standardized academic citations and Markdown notes."""

    @staticmethod
    def generate_all_formats(metadata: Dict[str, Any]) -> Dict[str, str]:
        title = metadata.get("title", "Untitled Research Paper")
        authors = metadata.get("authors", ["Author, A."])
        year = metadata.get("year", 2026)
        doc_id = metadata.get("doc_id", "paper")

        # Format Authors for APA (e.g., "Kumar, P., & Smith, J.")
        apa_authors = CitationGenerator._format_apa_authors(authors)
        # Format Authors for IEEE (e.g., "P. Kumar and J. Smith")
        ieee_authors = CitationGenerator._format_ieee_authors(authors)

        apa = f"{apa_authors} ({year}). {title}."
        ieee = f"{ieee_authors}, \"{title},\" {year}."

        # BibTeX key
        first_author_clean = re.sub(r'\W+', '', authors[0].split()[-1].lower()) if authors else "research"
        bib_key = f"{first_author_clean}{year}_{doc_id[:6]}"
        bib_authors = " and ".join(authors)

        bibtex = (
            f"@article{{{bib_key},\n"
            f"  author    = {{{bib_authors}}},\n"
            f"  title     = {{{title}}},\n"
            f"  year      = {{{year}}},\n"
            f"  journal   = {{Research Archive / Pre-print}}\n"
            f"}}"
        )

        return {
            "apa": apa,
            "ieee": ieee,
            "bibtex": bibtex
        }

    @staticmethod
    def export_markdown_notes(metadata: Dict[str, Any], summary: Dict[str, Any]) -> str:
        """Exports structured markdown research notes."""
        title = metadata.get("title", "Research Notes")
        authors = ", ".join(metadata.get("authors", ["Unknown Author"]))
        year = metadata.get("year", 2026)
        pages = metadata.get("total_pages", 0)

        citations = CitationGenerator.generate_all_formats(metadata)

        findings_md = "\n".join(f"- {f}" for f in summary.get("key_findings", []))

        notes = f"""# 📑 Research Paper Notes: {title}

**Authors**: {authors}  
**Year**: {year}  
**Document Length**: {pages} pages  
**Export Date**: {metadata.get('upload_timestamp', 'N/A')}  

---

## 📌 Executive Summary
{summary.get('summary', 'No summary generated.')}

## 🔬 Methodology
{summary.get('methodology', 'Standard empirical computational methodology.')}

## 🎯 Key Findings & Contributions
{findings_md if findings_md else '- Refer to full paper text.'}

## ⚠️ Limitations & Boundary Conditions
{summary.get('limitations', 'Refer to author discussion section.')}

---

## 📚 Standardized Citations

### APA 7th Edition
> {citations['apa']}

### IEEE Format
> {citations['ieee']}

### BibTeX Entry
```bibtex
{citations['bibtex']}
```
"""
        return notes

    @staticmethod
    def _format_apa_authors(authors: List[str]) -> str:
        if not authors:
            return "Author, A."
        if len(authors) == 1:
            return authors[0]
        return ", ".join(authors[:-1]) + ", & " + authors[-1]

    @staticmethod
    def _format_ieee_authors(authors: List[str]) -> str:
        if not authors:
            return "A. Author"
        if len(authors) == 1:
            return authors[0]
        return ", ".join(authors[:-1]) + " and " + authors[-1]

