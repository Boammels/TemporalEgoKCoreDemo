"""Flask server"""
import sys
from json import dumps
from flask_cors import CORS
from flask import Flask, request
import graph as GR

min_year, max_year, year_offset, edges, authors = GR.read_graph(
    "C:\\Users\\Simon\\Desktop\\Thesis\\DBLP2016\\tempGraph.json",
    "C:\\Users\\Simon\\Desktop\\Thesis\\DBLP2016\\authors.json"
)
APP = Flask(__name__)
CORS(APP)
APP.run(port=(sys.argv[1] if len(sys.argv) > 1 else 5000))

@APP.route('/echo/post', methods=['POST'])
def echo2():
    """ Description of function """
    return dumps({
        'echo' : 'Hwllo World',
    })