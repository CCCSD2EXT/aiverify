from pathlib import PurePath, Path
import io
import re
import hashlib


class InvalidFilename(Exception):
    """Raised when the filename is invalid"""

    pass


def check_valid_filename(filename: str):
    # return PurePath(filename).stem.isalnum
    if not filename[0].isalnum():
        return False
    # filename must be alphanumeric plus charters ./
    # sanitized = re.fullmatch(r'[a-zA-Z0-9_./]*', filename)
    # return sanitized is not None
    return re.search(r"\.\.", filename) is None and re.search(r"[^a-zA-Z0-9._\-/]", filename.replace("\\", "/")) is None


def check_file_size(size: int):
    return size <= 4294967296 # 4 gb


def append_filename(filename: str, append_name: str) -> str:
    fpath = PurePath(filename)
    return fpath.stem + append_name + fpath.suffix


def get_suffix(filename: str) -> str:
    return PurePath(filename).suffix.lower()


def get_stem(filename: str) -> str:
    return PurePath(filename).stem


def get_file_digest(contents: io.BytesIO):
    contents.seek(0)
    return hashlib.file_digest(contents, "sha256").digest()


def sanitize_filename(filename: str) -> str:
    if not filename[0].isalnum():
        raise InvalidFilename("The first character of the filename must be alphanumeric.")

    # Use regex to replace invalid characters
    sanitized = re.sub(r"[^a-zA-Z0-9./_]", "", filename)
    return sanitized


def compute_file_hash(file_path: Path) -> str:
    """
    Compute the SHA-256 hash of a file.

    Args:
        file_path (Path): The path of the file to hash

    Returns:
        str: The SHA-256 hash of the file
    """
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()
