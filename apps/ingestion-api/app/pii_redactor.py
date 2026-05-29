import re
from typing import NamedTuple

class RedactionResult(NamedTuple):
    redacted_text: set
    pii_types_found: list[str]
    redaction_count: int

PII_PATTERNS = [
    {
        "name": "email",
        "pattern": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
        "replacement": "[EMAIL]"
    },
    {
        "name": "phone",
        # Matches Indian and international formats like 9876543210, +91-9876543210
        "pattern": r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        "replacement": "[PHONE]"
    },
    {
        "name": "credit_card",
        # Matches 16 digit card numbers with optional spaces/dashes
        "pattern": r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
        "replacement": "[CREDIT_CARD]"
    },
    {
        "name": "password",
        # Matches things like password=secret or password: secret
        "pattern": r'(password|passwd|pwd)\s*[:=]\s*\S+',
        "replacement": "[REDACTED]",
    },
    {
        "name": "api_key",
        # Matches long alphanumeric strings that look like API keys
        "pattern": r'\b[A-Za-z0-9]{32,}\b',
        "replacement": "[API_KEY]"
    }
]

def redact(text: str) -> RedactionResult:
    if not text:
        return RedactionResult(
            redacted_text=text,
            pii_types_found=[],
            redaction_count=0
        )
    
    redacted = text
    found_types = []
    total_count=0

    for pii in PII_PATTERNS:
        matches = re.findall(pii["pattern"], redacted, flags=re.IGNORECASE)
        if matches:
            found_types.append(pii["name"])
            total_count += len(matches)
            redacted = re.sub(
                pii["pattern"],
                pii["replacement"],
                redacted,
                flags=re.IGNORECASE
            )

    return RedactionResult(
        redacted_text=redacted,
        pii_types_found=found_types,
        redaction_count=total_count
    )