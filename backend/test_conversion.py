#!/usr/bin/env python3
"""
Test script for the Python backend Word to PDF conversion
"""
import requests
import os

def test_conversion():
    # Check if test file exists
    test_file = 'test.docx'
    if not os.path.exists(test_file):
        print("❌ Test file 'test.docx' not found. Please create a test Word document.")
        return

    # Test the conversion endpoint
    url = 'http://localhost:5000/convert'

    try:
        with open(test_file, 'rb') as f:
            files = {'file': (test_file, f, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
            response = requests.post(url, files=files)

        if response.status_code == 200:
            result = response.json()
            print("✅ Conversion successful!")
            print(f"📄 Download URL: {result['downloadUrl']}")
            print(f"📁 Filename: {result['filename']}")
        else:
            print(f"❌ Conversion failed with status {response.status_code}")
            print(f"Error: {response.json()}")

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure the Python server is running on port 5000")
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")

if __name__ == '__main__':
    print("Testing Python backend Word to PDF conversion...")
    test_conversion()