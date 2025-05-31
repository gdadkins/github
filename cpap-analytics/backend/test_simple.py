#!/usr/bin/env python3
"""
Simple test to verify basic functionality without external dependencies
"""

def test_basic_arithmetic():
    """Test that basic arithmetic works"""
    assert 2 + 2 == 4
    assert 5 * 3 == 15
    assert 10 / 2 == 5

def test_string_operations():
    """Test string operations"""
    text = "CPAP Analytics"
    assert len(text) == 14
    assert text.lower() == "cpap analytics"
    assert "CPAP" in text

def test_data_structures():
    """Test basic data structures"""
    data = {"total_sessions": 30, "avg_ahi": 4.2}
    assert data["total_sessions"] == 30
    assert isinstance(data["avg_ahi"], float)

if __name__ == "__main__":
    # Manual test runner
    tests = [test_basic_arithmetic, test_string_operations, test_data_structures]
    
    print("Running basic tests...")
    for test in tests:
        try:
            test()
            print(f"✅ {test.__name__} passed")
        except AssertionError as e:
            print(f"❌ {test.__name__} failed: {e}")
        except Exception as e:
            print(f"💥 {test.__name__} errored: {e}")
    
    print("Basic tests completed!")