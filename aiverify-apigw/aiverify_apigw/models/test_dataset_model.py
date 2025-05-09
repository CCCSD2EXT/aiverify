from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from typing import Optional
from .base_model import BaseORMModel
from ..lib.constants import TestDatasetFileType, TestDatasetStatus


class TestDatasetModel(BaseORMModel):
    __tablename__ = "test_dataset"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    description: Mapped[Optional[str]]
    status: Mapped[TestDatasetStatus] = mapped_column(Enum(TestDatasetStatus), nullable=False)
    # filepath: Mapped[str] = mapped_column(String(2048), nullable=False)
    filename: Mapped[str] = mapped_column(String(2048), nullable=False, index=True)
    zip_hash: Mapped[Optional[str]]
    file_type: Mapped[TestDatasetFileType] = mapped_column(Enum(TestDatasetFileType))
    error_message: Mapped[Optional[str]]  # only for status == invalid
    size: Mapped[Optional[int]]
    num_rows: Mapped[Optional[int]]
    num_cols: Mapped[Optional[int]]
    data_columns: Mapped[Optional[bytes]] # array of data columns information
    serializer: Mapped[Optional[str]]
    data_format: Mapped[Optional[str]]
    # date times
    created_at: Mapped[Optional[datetime]]
    updated_at: Mapped[Optional[datetime]]
