# ml_api/utils.py
import math
import numpy as np
import re
import base64

HEX_CHARS = set("0123456789abcdefABCDEF")
BASE64_RE = re.compile(r'^[A-Za-z0-9+/]+={0,2}$')

# -------------------------------
# Entropy
# -------------------------------
def shannon_entropy(data) -> float:
    if not data:
        return 0.0
    probs = [float(data.count(c)) / len(data) for c in set(data)]
    return -sum(p * math.log2(p) for p in probs)

# -------------------------------
# Helpers
# -------------------------------
def pct_chars_in_set(s, charset:set) -> float:
    if not s:
        return 0.0
    return sum(1 for c in s if c in charset) / len(s)

def looks_like_base64(s: str) -> bool:
    s2 = s.strip()
    return bool(BASE64_RE.match(s2)) and (len(s2) % 4 == 0)

# -------------------------------
# Feature extraction for TEXT
# -------------------------------
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

    return np.array(
        [length, letters, digits, hex_pct, base64_flag, entropy, avg_ord, pct_spaces],
        dtype=float
    )

# -------------------------------
# Feature extraction for FILE BYTES
# -------------------------------
def featurize_bytes(b: bytes):
    if not b:
        return np.zeros(8, dtype=float)

    length = len(b)
    byte_arr = np.frombuffer(b, dtype=np.uint8)

    letters = np.mean([(65 <= x <= 90 or 97 <= x <= 122) for x in byte_arr])
    digits = np.mean([(48 <= x <= 57) for x in byte_arr])

    hex_pct = np.mean([chr(x) in HEX_CHARS for x in byte_arr])
    entropy = shannon_entropy(byte_arr.tolist())
    avg_ord = float(np.mean(byte_arr))
    pct_spaces = np.mean([x == 32 for x in byte_arr])

    base64_flag = 0.0  # Binary files shouldn't trigger base64

    return np.array(
        [length, letters, digits, hex_pct, base64_flag, entropy, avg_ord, pct_spaces],
        dtype=float
    )
