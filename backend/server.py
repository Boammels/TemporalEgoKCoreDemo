"""Flask server"""
import sys
from json import dumps
from flask_cors import CORS
from flask import Flask, request
from Error import AccessError

APP = Flask(__name__)
CORS(APP)
APP.run(port=(sys.argv[1] if len(sys.argv) > 1 else 5000))