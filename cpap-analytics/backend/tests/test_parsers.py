import pytest
import tempfile
import os
from pathlib import Path
from datetime import datetime, timedelta
from unittest.mock import patch, mock_open
import struct

from app.parsers.resmed import ResMedParser, CPAPSession


@pytest.mark.unit
@pytest.mark.parser
class TestCPAPSession:
    """Test CPAPSession data class."""

    def test_quality_score_calculation(self):
        """Test quality score calculation with different metrics."""
        # Perfect session
        perfect_session = CPAPSession(
            session_id="test1",
            start_time=datetime.now(),
            end_time=datetime.now() + timedelta(hours=8),
            duration_minutes=480,  # 8 hours
            ahi=2.0,  # Good AHI
            total_apneas=10,
            obstructive_apneas=8,
            central_apneas=2,
            hypopneas=0,
            mask_leak_avg=5.0,
            mask_leak_95=12.0,  # Good leak rate
            pressure_min=8.0,
            pressure_95=11.0,
            pressure_max=13.0
        )
        
        score = perfect_session.quality_score()
        assert score >= 85  # Should be high quality
        
        # Poor session
        poor_session = CPAPSession(
            session_id="test2",
            start_time=datetime.now(),
            end_time=datetime.now() + timedelta(hours=4),
            duration_minutes=240,  # Short duration
            ahi=15.0,  # High AHI
            total_apneas=60,
            obstructive_apneas=50,
            central_apneas=10,
            hypopneas=0,
            mask_leak_avg=25.0,
            mask_leak_95=40.0,  # High leak rate
            pressure_min=8.0,
            pressure_95=11.0,
            pressure_max=13.0
        )
        
        score = poor_session.quality_score()
        assert score <= 50  # Should be low quality

    def test_to_dict_structure(self):
        """Test that to_dict returns proper structure."""
        session = CPAPSession(
            session_id="test_session",
            start_time=datetime(2025, 1, 1, 22, 30),
            end_time=datetime(2025, 1, 2, 6, 30),
            duration_minutes=480,
            ahi=3.5,
            total_apneas=14,
            obstructive_apneas=10,
            central_apneas=2,
            hypopneas=2,
            mask_leak_avg=8.5,
            mask_leak_95=15.2,
            pressure_min=8.0,
            pressure_95=11.5,
            pressure_max=13.2,
            minute_vent_avg=7.5,
            resp_rate_avg=16.0,
            tidal_volume_avg=520.0
        )
        
        result = session.to_dict()
        
        # Check top-level structure
        assert "session_id" in result
        assert "date" in result
        assert "start_time" in result
        assert "end_time" in result
        assert "duration_minutes" in result
        assert "duration_hours" in result
        assert "metrics" in result
        assert "quality_score" in result
        
        # Check metrics structure
        metrics = result["metrics"]
        assert "ahi" in metrics
        assert "ahi_breakdown" in metrics
        assert "leak_rate" in metrics
        assert "pressure" in metrics
        assert "respiratory" in metrics
        
        # Check specific values
        assert result["duration_hours"] == 8.0
        assert result["date"] == "2025-01-01"
        assert metrics["ahi"] == 3.5


@pytest.mark.unit
@pytest.mark.parser
class TestResMedParser:
    """Test ResMed parser functionality."""

    def create_mock_sd_card(self, temp_dir):
        """Create a mock SD card structure."""
        datalog_dir = temp_dir / "DATALOG"
        datalog_dir.mkdir()
        
        # Create mock files
        (datalog_dir / "20250101.BRP").touch()
        (datalog_dir / "20250102.BRP").touch()
        (datalog_dir / "sample.edf").touch()
        
        return temp_dir

    def test_init_valid_sd_card(self):
        """Test parser initialization with valid SD card."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            self.create_mock_sd_card(temp_path)
            
            parser = ResMedParser(str(temp_path))
            assert parser.sd_path == temp_path
            assert parser.data_path == temp_path / "DATALOG"

    def test_init_invalid_sd_card(self):
        """Test parser initialization with invalid SD card."""
        with tempfile.TemporaryDirectory() as temp_dir:
            with pytest.raises(ValueError, match="No DATALOG directory found"):
                ResMedParser(temp_dir)

    def test_validate_sd_card_valid(self):
        """Test SD card validation with valid structure."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            self.create_mock_sd_card(temp_path)
            
            parser = ResMedParser(str(temp_path))
            assert parser.validate_sd_card() is True

    def test_validate_sd_card_invalid(self):
        """Test SD card validation with invalid structure."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            datalog_dir = temp_path / "DATALOG"
            datalog_dir.mkdir()  # Empty DATALOG directory
            
            parser = ResMedParser(str(temp_path))
            assert parser.validate_sd_card() is False

    @patch('builtins.open', new_callable=mock_open)
    def test_parse_brp_file_valid_filename(self, mock_file):
        """Test parsing BRP file with valid date filename."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            self.create_mock_sd_card(temp_path)
            
            parser = ResMedParser(str(temp_path))
            
            # Mock the file content
            mock_file.return_value.read.return_value = b'mock_data'
            
            file_path = temp_path / "DATALOG" / "20250115.BRP"
            session = parser._parse_brp_file(mock_file.return_value, file_path)
            
            assert session is not None
            assert session.session_id == "resmed_20250115"
            assert session.start_time.date() == datetime(2025, 1, 15).date()

    def test_parse_brp_file_invalid_filename(self):
        """Test parsing BRP file with invalid filename falls back to file time."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            self.create_mock_sd_card(temp_path)
            
            parser = ResMedParser(str(temp_path))
            
            # Create a file with invalid name
            invalid_file = temp_path / "DATALOG" / "invalid.BRP"
            invalid_file.touch()
            
            with patch('builtins.open', mock_open()):
                session = parser._parse_brp_file(open(invalid_file, 'rb'), invalid_file)
                
                assert session is not None
                assert session.session_id == "resmed_invalid"

    def test_deduplicate_sessions(self):
        """Test session deduplication logic."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            self.create_mock_sd_card(temp_path)
            
            parser = ResMedParser(str(temp_path))
            
            # Create sessions with similar times
            session1 = CPAPSession(
                session_id="1",
                start_time=datetime(2025, 1, 1, 22, 30),
                end_time=datetime(2025, 1, 2, 6, 30),
                duration_minutes=480,
                ahi=3.0,
                total_apneas=12,
                obstructive_apneas=10,
                central_apneas=2,
                hypopneas=0,
                mask_leak_avg=8.0,
                mask_leak_95=15.0,
                pressure_min=8.0,
                pressure_95=11.0,
                pressure_max=13.0
            )
            
            # Duplicate with slightly different time (same hour)
            session2 = CPAPSession(
                session_id="2",
                start_time=datetime(2025, 1, 1, 22, 45),  # 15 minutes later
                end_time=datetime(2025, 1, 2, 6, 45),
                duration_minutes=480,
                ahi=3.0,
                total_apneas=12,
                obstructive_apneas=10,
                central_apneas=2,
                hypopneas=0,
                mask_leak_avg=8.0,
                mask_leak_95=15.0,
                pressure_min=8.0,
                pressure_95=11.0,
                pressure_max=13.0
            )
            
            # Different day session
            session3 = CPAPSession(
                session_id="3",
                start_time=datetime(2025, 1, 2, 22, 30),
                end_time=datetime(2025, 1, 3, 6, 30),
                duration_minutes=480,
                ahi=3.0,
                total_apneas=12,
                obstructive_apneas=10,
                central_apneas=2,
                hypopneas=0,
                mask_leak_avg=8.0,
                mask_leak_95=15.0,
                pressure_min=8.0,
                pressure_95=11.0,
                pressure_max=13.0
            )
            
            sessions = [session1, session2, session3]
            unique_sessions = parser._deduplicate_sessions(sessions)
            
            # Should remove the duplicate (session2)
            assert len(unique_sessions) == 2
            session_ids = [s.session_id for s in unique_sessions]
            assert "1" in session_ids
            assert "3" in session_ids

    def test_get_device_info_default(self):
        """Test device info extraction with default values."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            self.create_mock_sd_card(temp_path)
            
            parser = ResMedParser(str(temp_path))
            device_info = parser.get_device_info()
            
            assert device_info["manufacturer"] == "ResMed"
            assert device_info["model"] == "AirSense 10"
            assert "serial_number" in device_info
            assert "firmware_version" in device_info

    def test_get_device_info_with_info_file(self):
        """Test device info extraction when info files are present."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            self.create_mock_sd_card(temp_path)
            
            # Add mock info file
            (temp_path / "DATALOG" / "DEVICE_INFO").touch()
            
            parser = ResMedParser(str(temp_path))
            device_info = parser.get_device_info()
            
            assert device_info["model"] == "AirSense 10 AutoSet"


@pytest.mark.integration
@pytest.mark.parser
class TestResMedParserIntegration:
    """Integration tests for ResmedParser with realistic data."""

    def test_full_parsing_workflow(self):
        """Test complete parsing workflow with mock SD card."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            datalog_dir = temp_path / "DATALOG"
            datalog_dir.mkdir()
            
            # Create multiple mock BRP files
            for i in range(5):
                date = datetime(2025, 1, 1) + timedelta(days=i)
                filename = date.strftime("%Y%m%d.BRP")
                (datalog_dir / filename).touch()
            
            parser = ResMedParser(str(temp_path))
            
            # Mock file parsing to return valid sessions
            with patch.object(parser, '_parse_brp_file') as mock_parse:
                def mock_parse_func(file_handle, file_path):
                    # Extract date from filename
                    filename = file_path.stem
                    session_date = datetime.strptime(filename, '%Y%m%d')
                    
                    return CPAPSession(
                        session_id=f"resmed_{filename}",
                        start_time=session_date.replace(hour=22, minute=30),
                        end_time=session_date.replace(hour=6, minute=30) + timedelta(days=1),
                        duration_minutes=480,
                        ahi=2.5 + (hash(filename) % 10) / 10,  # Vary AHI
                        total_apneas=10 + (hash(filename) % 5),
                        obstructive_apneas=8,
                        central_apneas=2,
                        hypopneas=0,
                        mask_leak_avg=8.0,
                        mask_leak_95=15.0,
                        pressure_min=8.0,
                        pressure_95=11.0,
                        pressure_max=13.0
                    )
                
                mock_parse.side_effect = mock_parse_func
                
                sessions = parser.parse_all_sessions()
                
                assert len(sessions) == 5
                assert all(isinstance(s, CPAPSession) for s in sessions)
                
                # Check sessions are sorted by date
                for i in range(len(sessions) - 1):
                    assert sessions[i].start_time <= sessions[i + 1].start_time

    def test_export_sessions_json(self):
        """Test JSON export functionality."""
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            datalog_dir = temp_path / "DATALOG"
            datalog_dir.mkdir()
            
            # Create a single mock file
            (datalog_dir / "20250101.BRP").touch()
            
            parser = ResMedParser(str(temp_path))
            
            # Mock parsing to return a session
            mock_session = CPAPSession(
                session_id="test_export",
                start_time=datetime(2025, 1, 1, 22, 30),
                end_time=datetime(2025, 1, 2, 6, 30),
                duration_minutes=480,
                ahi=3.0,
                total_apneas=12,
                obstructive_apneas=10,
                central_apneas=2,
                hypopneas=0,
                mask_leak_avg=8.0,
                mask_leak_95=15.0,
                pressure_min=8.0,
                pressure_95=11.0,
                pressure_max=13.0
            )
            
            parser.sessions = [mock_session]
            
            json_data = parser.export_sessions_json()
            
            assert len(json_data) == 1
            assert json_data[0]["session_id"] == "test_export"
            assert json_data[0]["date"] == "2025-01-01"
            assert "metrics" in json_data[0]
            assert "quality_score" in json_data[0]


@pytest.mark.property
class TestResMedParserProperties:
    """Property-based tests for parser robustness."""

    def test_quality_score_range_property(self):
        """Property test: quality score should always be 0-100."""
        from hypothesis import given, strategies as st
        
        @given(
            ahi=st.floats(min_value=0, max_value=100),
            leak_95=st.floats(min_value=0, max_value=100),
            duration=st.floats(min_value=60, max_value=960)  # 1-16 hours
        )
        def test_score_range(ahi, leak_95, duration):
            session = CPAPSession(
                session_id="prop_test",
                start_time=datetime.now(),
                end_time=datetime.now() + timedelta(minutes=duration),
                duration_minutes=duration,
                ahi=ahi,
                total_apneas=10,
                obstructive_apneas=8,
                central_apneas=2,
                hypopneas=0,
                mask_leak_avg=leak_95 * 0.8,  # Average usually lower than 95th percentile
                mask_leak_95=leak_95,
                pressure_min=8.0,
                pressure_95=11.0,
                pressure_max=13.0
            )
            
            score = session.quality_score()
            assert 0 <= score <= 100
        
        test_score_range()

    def test_session_duration_consistency(self):
        """Property test: duration should be consistent between start/end times and duration_minutes."""
        from hypothesis import given, strategies as st
        
        @given(
            start_hour=st.integers(min_value=20, max_value=23),
            duration_hours=st.floats(min_value=4, max_value=12)
        )
        def test_duration_consistency(start_hour, duration_hours):
            start_time = datetime(2025, 1, 1, start_hour, 30)
            end_time = start_time + timedelta(hours=duration_hours)
            duration_minutes = duration_hours * 60
            
            session = CPAPSession(
                session_id="duration_test",
                start_time=start_time,
                end_time=end_time,
                duration_minutes=duration_minutes,
                ahi=5.0,
                total_apneas=20,
                obstructive_apneas=15,
                central_apneas=3,
                hypopneas=2,
                mask_leak_avg=8.0,
                mask_leak_95=15.0,
                pressure_min=8.0,
                pressure_95=11.0,
                pressure_max=13.0
            )
            
            calculated_duration = (session.end_time - session.start_time).total_seconds() / 60
            assert abs(calculated_duration - session.duration_minutes) < 1  # Allow 1 minute tolerance
        
        test_duration_consistency()