import graph as GR

min_year, max_year, year_offset, edges, authors = GR.read_graph()

while True:
    print(f'the time window starts from {min_year}, ends at {max_year}')
    start = int(input(f"Enter start year between {min_year} and {max_year}: "))
    while start < min_year or start > max_year:
        start = int(input(f"Incorrect! Enter start year between {min_year} and {max_year}: "))
    end = int(input(f"Enter end year between {start} and {max_year}: "))
    while end < start or end > max_year:
        send = int(input(f"Incorrect! Enter end year between {min_year} and {max_year}: "))
    center = input("Please input the name of the center of the ego-network(id): ")
    k = int(input('please input k value: '))
    degrees, neighbors, node_offsets, labels = GR.query_ego_graph(edges, year_offset, start - min_year, end - min_year, len(authors), int(center))
    # calculation
    node_count = len(labels)
    nodes, offset_degree = GR.k_core(degrees, neighbors, node_offsets, node_count, k)
    #nodes, offset_degree = GR.core_decomposition(degrees, neighbors, node_offsets, node_count)
    # querying
    if k >= len(offset_degree):
        print(f'{k}-core not exist for this node')
        print('')
        continue
    for i in range(offset_degree[k], offset_degree[len(offset_degree)-1]):
        print(f"   -   {labels[nodes[i]]}")
    print(f"--- {offset_degree[-1] - offset_degree[k]} nodes")
    GR.generate_graph(nodes, offset_degree, neighbors, node_offsets, labels, authors, k)
    print('')