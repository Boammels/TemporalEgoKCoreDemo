import json
import numpy as np

def checkEdges(authors, start, end, year_offset, edges):
    haveEdges = np.zeros((len(authors),), dtype=bool)
    for i in edges[2*year_offset[start]:2*year_offset[end+1]]:
        haveEdges[i] = True
    return haveEdges


'''
@returns
    min-year, max-year -- the time window of the temporal graph
    year_offset: the offset for each year in the edges array
    edges -- 1d array to record the edges in the graph
    authors -- the name of the authors for each node
'''
def read_graph (graph, authors):
    f1 = open(graph, 'r')
    f2 = open(authors, 'r')
    graph = json.load(f1)
    authors = json.load(f2)
    # load from json files
    min_year = int(graph['min_year'])
    year_offset = np.zeros((len(graph['edge_count_by_year'])+1,), dtype=int)
    curr_offset = np.zeros((len(graph['edge_count_by_year'])+1,), dtype=int)
    for i in range(1,len(year_offset)):
        year_offset[i] = year_offset[i-1] + graph['edge_count_by_year'][i-1]
        curr_offset[i] = year_offset[i]
    edges = np.zeros(2*year_offset[-1], dtype=int)
    for line in graph['edges']:
        keys = line.split(',')
        p = int(keys[2]) - min_year
        edges[2*curr_offset[p]] = int(keys[0])
        edges[2*curr_offset[p] + 1] = int(keys[1])
        if edges[2*curr_offset[p]] == 1233 and edges[2*curr_offset[p]+1] == 1233:
            print(line)
        curr_offset[p] += 1
    # order the edges by year
    print('Input done!')
    return min_year, int(graph['max_year']), year_offset, edges, authors['authors']

'''
@ params
    edges -- an 1d array to store the edges' from and to nodes order by time
    time_offset -- the offset for every time stamp in the edges array
    ts -- the starting time stamp (inclusive)
    te -- the ending time stamp (exclusive)
    node_count -- the count of nodes in the graph
    center -- the label of the center node for the ego network
@ returns
    degrees -- 1d array to store the degree of each nodes
    neighbors -- the neighbor for each node
    offsets -- the offset of each node in the neighbors array
    labels -- the labels for the new ids of the remaining nodes, string
'''
def query_ego_graph(edges, time_offset, ts, te, node_count, center):
    in_ego = np.full((node_count,), -1, dtype=int)
    in_ego[center] = 0
    curr = 1
    for j in range(time_offset[ts], time_offset[te]):
        s = edges[2*j]
        e = edges[2*j+1]
        if s == center:
            if in_ego[e] == -1:
                in_ego[e] = curr
                curr += 1
        if e == center:
            if in_ego[s] == -1:
                in_ego[s] = curr
                curr += 1
    # mark every node in the ego network during the time period
    neighbors = []
    for i in range(curr):
        neighbors.append({})
    label = np.zeros((curr,), dtype=int)
    for i in range(node_count):
        if in_ego[i] != -1:
            label[in_ego[i]] = i
    # relabel the nodes
    for j in range(time_offset[ts], time_offset[te]):
        s = edges[2*j]
        e = edges[2*j+1]
        if in_ego[s] != -1 and in_ego[e] != -1:
            s_ = in_ego[s]
            e_ = in_ego[e]
            neighbors[s_][e_] = 1
            neighbors[e_][s_] = 1
    degrees = np.zeros((curr,), dtype=int)
    node_offset = np.zeros((curr+1,), dtype=int)
    curr_offset = np.zeros((curr+1,), dtype=int)
    for i in range(curr + 1):
        if (i != curr):
            degrees[i] = len(neighbors[i])
        if i > 0:
            node_offset[i] = node_offset[i-1] + degrees[i-1]
            curr_offset[i] = node_offset[i]
    neighborlist = np.zeros((node_offset[curr],), dtype=int)
    for u in range(curr):
        for v in neighbors[u].keys():
            neighborlist[curr_offset[u]] = v
            curr_offset[u] += 1
    print('Graph query done!')  
    return degrees, neighborlist, node_offset, label

'''
@ params
    degrees -- 1d arrat to record the degree for each node
    neighbors -- 1d array to record all neighbors
    offset_node -- 1d array to record the starting index for a node in {neighbors} 
@ during calculation
    max_degree -- the max degree for all the nodes
    degree_list -- a list with length max degree, every element is a list of node ids of that degree
    position -- a list of indexes of each node in the array {nodes}, if position[1] = 3 then node 1 has a index of 3 in {nodes}
    degree_list_start -- a list of indexes shows the next empty index for each degree.
@ returns
    nodes -- a list of nodes in the order of degree ascending
    offset_degree -- id array to record the start index of each degree in {nodes}
'''
def core_decomposition(degrees, neighbors, offset_node, node_count):
    max_degree = 0
    for d in degrees:
        max_degree = max(d, max_degree)
    degree_list = []
    for i in range(max_degree + 1):
        degree_list.append(0)
    for d in degrees:
        degree_list[d] += 1
    offset = 0
    offset_degree = []
    for i in range(max_degree + 2):
        offset_degree.append(offset)
        if i > max_degree:
            break
        offset = offset + degree_list[i]
    degree_list_start = []
    for i in range(max_degree + 1):
        degree_list_start.append(offset_degree[i])
    nodes = []
    position = []
    for i in range(node_count):
        nodes.append(0)
        position.append(0)
    for i in range(node_count):
        position[i] = degree_list_start[degrees[i]]
        nodes[position[i]] = i
        degree_list_start[degrees[i]] += 1
    # main update calculation
    for i in range(node_count):
        v = nodes[i]
        for j in range(offset_node[v], offset_node[v+1]):
            u = neighbors[j]
            if degrees[u] > degrees[v]:
                du = degrees[u]
                pu = position[u]
                pw = offset_degree[du]
                w = nodes[pw]
                if u != w:
                    nodes[pu] = w
                    nodes[pw] = u
                    position[u] = pw
                    position[w] = pu
                offset_degree[du] += 1
                degrees[u] -= 1
    print("End of core decomposition calculation")
    return nodes, offset_degree

'''
@ params
    degrees -- 1d arrat to record the degree for each node
    neighbors -- 1d array to record all neighbors
    offset_node -- 1d array to record the starting index for a node in {neighbors} 
@ during calculation
    max_degree -- the max degree for all the nodes
    degree_list -- a list with length max degree, every element is a list of node ids of that degree
    position -- a list of indexes of each node in the array {nodes}, if position[1] = 3 then node 1 has a index of 3 in {nodes}
    degree_list_start -- a list of indexes shows the next empty index for each degree.
@ returns
    nodes -- a list of nodes in the order of degree ascending
    offset_degree -- id array to record the start index of each degree in {nodes}
'''
def k_core(degrees, neighbors, offset_node, node_count, k):
    max_degree = 0
    for d in degrees:
        max_degree = max(d, max_degree)
    degree_list = []
    for i in range(max_degree + 1):
        degree_list.append(0)
    for d in degrees:
        degree_list[d] += 1
    offset = 0
    offset_degree = []
    for i in range(max_degree + 2):
        offset_degree.append(offset)
        if i > max_degree:
            break
        offset = offset + degree_list[i]
    degree_list_start = []
    for i in range(max_degree + 1):
        degree_list_start.append(offset_degree[i])
    nodes = []
    position = []
    for i in range(node_count):
        nodes.append(0)
        position.append(0)
    for i in range(node_count):
        position[i] = degree_list_start[degrees[i]]
        nodes[position[i]] = i
        degree_list_start[degrees[i]] += 1
    # main update calculation
    for i in range(node_count):
        v = nodes[i]
        if degrees[v] >= k:
            break
        for j in range(offset_node[v], offset_node[v+1]):
            u = neighbors[j]
            if degrees[u] > degrees[v]:
                du = degrees[u]
                pu = position[u]
                pw = offset_degree[du]
                w = nodes[pw]
                if u != w:
                    nodes[pu] = w
                    nodes[pw] = u
                    position[u] = pw
                    position[w] = pu
                offset_degree[du] += 1
                degrees[u] -= 1
    print("End of k-core calculation")
    return nodes, offset_degree

'''
@params
    nodes -- a list of nodes in the order of degree ascending
    offset_degree -- id array to record the start index of each degree in {nodes}
    neighbors -- 1d array to record all neighbors
    node_offsets -- 1d array to record the starting index for a node in {neighbors}
    labels -- the original id for each node
    authors -- the name of the author for each node
    k -- the k value
'''
def generate_graph(nodes, offset_degree, neighbors, node_offsets, labels, authors, k, id):
    in_ego_core = np.zeros((len(nodes), ), dtype=bool)
    graph = []
    authors_list  = []
    for i in range(offset_degree[k], offset_degree[len(offset_degree)-1]):
        in_ego_core[nodes[i]] = True
        data = {
                'data': {
                    'id': str(labels[nodes[i]]),
                    'label': authors[labels[nodes[i]]]
                }
            }
        if nodes[i] == 0:
            data['selected'] = True
        graph.append(data)
        authors_list.append({'id': str(labels[nodes[i]]), 'name': authors[labels[nodes[i]]]})
    for i in range(len(labels)):
        for j in neighbors[node_offsets[i]:node_offsets[i+1]]:
            if i < j and in_ego_core[i] and in_ego_core[j]:
                graph.append({
                    'data': {
                        'source': str(labels[i]),
                        'target': str(labels[j])
                    },
                    'selectable': False
                })
    data_set = {'elements': graph, 'author': authors[id], 'author_list': authors_list}
    return data_set


