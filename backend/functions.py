import graph as GR
import numpy as np

def get_name_list(authors, name, start, end, year_offset, edges):
    haveEdge = GR.checkEdges(authors, start, end, year_offset, edges)
    result = []
    lower = name.lower()
    for i in range(len(authors)):
        if lower in authors[i].lower() and haveEdge[i]:
            result.append({'id': i, 'name':authors[i]})
    return {'names': result}

def get_k_core_by_id(edges, year_offset, authors, start, end, min_year, max_year, id, k):
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
    degrees, neighbors, node_offsets, labels = GR.query_ego_graph(edges, year_offset, start - min_year, end - min_year, len(authors), int(id))
    # calculation
    node_count = len(labels)
    nodes, offset_degree = GR.k_core(degrees, neighbors, node_offsets, node_count, k)
    #nodes, offset_degree = GR.core_decomposition(degrees, neighbors, node_offsets, node_count)
    # querying
    if k >= len(offset_degree):
        print(f'{k}-core not exist for this node')
        print('')
        return {'elements': [], 'author': authors[int(id)]}
    return GR.generate_graph(nodes, offset_degree, neighbors, node_offsets, labels, authors, k, int(id))

