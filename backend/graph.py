import json
import numpy as np

def max_min_three (a,b,c):
    if a >= b:
        if c >= a:
            return c, a, b
        elif b >= c:
            return a, b, c
        else:
            return a, c, b
    else:
        if c >= b:
            return c, b, a 
        elif a >= c:
            return b, a, c
        else:
            return b, c, a

def indexCreate(edges, time_offset, n, time):
    index = []
    neighbours = []
    for i in range(n):
        index.append({})
        neighbours.append({})
    for t in range(time):
        print(f'{t} of {time}')
        for i in range(time_offset[t], time_offset[t+1]):
            s = edges[i*2]
            e = edges[i*2+1]
            neighbours[e][s] = t
            neighbours[s][e] = t
            for m in neighbours[s].keys():
                if m in neighbours[e]:
                    end, _, start = max_min_three(neighbours[s][m], neighbours[e][m], t)
                    c, b, a = max_min_three(s, e, m)
                    if (b, c) in index[a]:
                        skip = False
                        for (s_t, e_t) in index[a][(b, c)]:
                            if s_t >= start and e_t <= end:
                                skip = True
                        if not skip:
                            index[a][(b, c)].append((start, end))
                    else:
                        index[a][(b, c)] = [(start, end)]
    return neighbours, index


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
def query_ego_graph(neighbours, index, ts, te, node_count, center):
    in_ego = np.full((node_count,), -1, dtype=int)
    in_ego[center] = 0
    curr = 1
    neighborlist = [[]]
    nodes = list(neighbours[center].keys())
    for i in range(len(nodes)):
        node1 = nodes[i]
        for j in range(i+1, len(nodes)):
            node2 = nodes[j]
            maxi, midi, mini = max_min_three(node1, node2, center)
            if (midi, maxi) in index[mini]:
                for (st, et) in index[mini][(midi, maxi)]:
                    if ts <= st and te >= et:
                        if in_ego[node1] == -1:
                            in_ego[node1] = curr
                            neighborlist.append([0])
                            neighborlist[0].append(curr)
                            curr += 1
                        if in_ego[node2] == -1:
                            in_ego[node2] = curr
                            neighborlist.append([0])
                            neighborlist[0].append(curr)
                            curr += 1
                        neighborlist[in_ego[node1]].append(in_ego[node2])
                        neighborlist[in_ego[node2]].append(in_ego[node1])
                    break
    label = np.zeros((curr,), dtype=int)
    degrees = np.zeros((curr,), dtype=int)
    for i in range(node_count):
        if in_ego[i] != -1:
            label[in_ego[i]] = i
            degrees[in_ego[i]] = len(neighborlist[in_ego[i]])
    print(neighborlist)
    print(degrees)
    print('end of ego query')
    return degrees, neighborlist, label

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
def k_core(degrees, neighbors, node_count, k):
    print(neighbors)
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
        for u in neighbors[v]:
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
    print(offset_degree)
    print(nodes)
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
def generate_graph(nodes, offset_degree, neighbors, labels, authors, k, id):
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
        for j in neighbors[i]:
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


