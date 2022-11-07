import graph as GR
import numpy as np
from datetime import datetime

def get_name_list(authors, name, start, end, year_offset, edges):
    haveEdge = GR.checkEdges(authors, start, end, year_offset, edges)
    result = []
    lower = name.lower()
    for i in range(len(authors)):
        if lower in authors[i].lower() and haveEdge[i]:
            result.append({'id': i, 'name':authors[i]})
    return {'names': result}

def get_k_core_by_id(neighbours, index, authors, start, end, min_year, max_year, id, k):
    if start < min_year:
        start = min_year
    if end > max_year:
        end = max_year
    if start > end:
        raise ValueError("Start year must be earlier or equal to end year")
    if not id.isnumeric():
        raise ValueError("ID must be a number")
    if int(id) >= len(authors):
        raise ValueError("No such person")
    time1 = datetime.now()
    degrees, neighborlist, labels = GR.query_ego_graph(neighbours, index, start - min_year, end - min_year, len(authors), int(id))
    # calculation
    time2 = datetime.now()
    node_count = len(labels)
    nodes, offset_degree = GR.k_core(degrees, neighborlist, node_count, k)
    #nodes, offset_degree = GR.core_decomposition(degrees, neighbors, node_offsets, node_count)
    # querying
    time3 = datetime.now()
    if k >= len(offset_degree):
        print(f'{k}-core not exist for this node')
        print('')
        return {'elements': [], 'author': authors[int(id)]}
    res = GR.generate_graph(nodes, offset_degree, neighborlist, labels, authors, k, int(id))
    time4 = datetime.now()
    print(time2 - time1)
    print(time3 - time2)
    print(time4 - time3)
    return res

def get_author_detail(authors, id, articles, detail):
    name = authors[int(id)]
    career = []
    articles = []
    return {
        'name': name,
        'id': id,
        'career': career,
        'articles': articles
    }


