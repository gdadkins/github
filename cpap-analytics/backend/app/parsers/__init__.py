"""
CPAP Data Parsers

This module contains parsers for different CPAP device manufacturers.
Currently supports:
- ResMed AirSense 10/11 series
- Philips DreamStation (planned)
"""

from .resmed import ResMedParser

__all__ = ["ResMedParser"]
