"""Flask server"""
import sys
from json import dumps
from flask_cors import CORS
from flask import Flask, request
from functions import get_k_core_by_id, get_name_list, get_author_detail
import graph as GR

min_year, max_year, year_offset, edges, authors = GR.read_graph(
    "..\\..\\tempGraph.json",
    "..\\..\\authors.json"
)
APP = Flask(__name__)
CORS(APP)


@APP.route('/echo/post/', methods=['GET'])
def echo2():
    """ Description of function """
    return dumps({
        'echo' : 'Hwllo World',
    })

@APP.route('/id/', methods=['GET'])
def app_get_k_core_by_id():
    id = request.args.get('id')
    start = request.args.get('start')
    end = request.args.get('end')
    k = request.args.get('k')
    try:
        result = get_k_core_by_id(edges, year_offset, authors, int(start), int(end), int(min_year), int(max_year), id, int(k))
    except ValueError as exception:
        return dumps({
            "code": 400,
            "message": str(exception),
        }), 400
    return dumps(result)

@APP.route('/name/', methods=['GET'])
def app_get_name_list():
    name = request.args.get('name')
    start = request.args.get('start')
    end = request.args.get('end')
    result = get_name_list(authors, name, int(start) - min_year, int(end) - min_year, year_offset, edges)
    return dumps(result)

@APP.route('/author/', methods=['GET'])
def app_get_name_detail():
    id = request.args.get('id')
    result = get_author_detail(authors, id, {}, {})
    return dumps(result)

if __name__ == "__main__":
    APP.run(port=(sys.argv[1] if len(sys.argv) > 1 else 5000))