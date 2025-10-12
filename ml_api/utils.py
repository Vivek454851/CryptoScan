# ml_api/utils.py
import math
import numpy as np
import base64
import re

HEX_CHARS = set("0123456789abcdefABCDEF")
BASE64_RE = re.compile(r'^[A-Za-z0-9+/]+={0,2}$')

def shannon_entropy(s: str) -> float:
    if not s:
        return 0.0
    probs = [float(s.count(c)) / len(s) for c in set(s)]
    return -sum(p * math.log2(p) for p in probs)

def pct_chars_in_set(s: str, charset:set) -> float:
    if not s: return 0.0
    return sum(1 for c in s if c in charset) / len(s)

def looks_like_base64(s: str) -> bool:
    # simple check: no whitespace, valid base64 alphabet and optional padding
    s2 = s.strip()
    return bool(BASE64_RE.match(s2)) and (len(s2) % 4 == 0)

def featurize_text(s: str):
    s = s.strip()
    length = len(s)
    letters = sum(c.isalpha() for c in s) / (length + 1e-9)
    digits = sum(c.isdigit() for c in s) / (length + 1e-9)
    hex_pct = pct_chars_in_set(s, HEX_CHARS)
    base64_flag = 1.0 if looks_like_base64(s) else 0.0
    entropy = shannon_entropy(s)
    avg_ord = (sum(ord(c) for c in s) / (length + 1e-9)) if length else 0.0
    pct_spaces = sum(c.isspace() for c in s) / (length + 1e-9)

    return np.array([length, letters, digits, hex_pct, base64_flag, entropy, avg_ord, pct_spaces], dtype=float)
