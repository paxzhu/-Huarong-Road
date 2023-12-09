from random import randrange, randint
import numpy as np
import heapq

def create_dest(m, n):
    dest = np.arange(1, m*n+1).reshape(m, n)
    dest[-1][-1] = 0
    return dest.tolist()

def shuffle(m, n):
    shuffled = np.arange(m*n)
    np.random.shuffle(shuffled)
    return (np.reshape(shuffled, (m ,n))).tolist()

def heuristic(dest):
    m, n = len(dest), len(dest[0])
    locs = [0] * (m*n)
    for i in range(m):
        for j in range(n):
            locs[dest[i][j]] = (i, j)
    def manhattans(puzzle):
        distance = 0
        for i in range(m):
            for j in range(n):
                x, y = locs[puzzle[i][j]]
                manhattan = abs(x-i)+abs(y-j)
                distance += manhattan
        return distance
    return manhattans
            
def locate_zero(puzzle):
    for i in range(len(puzzle)):
        for j in range(len(puzzle[0])):
            if puzzle[i][j] == 0:
                return i, j

def neighbors(status):
    puzzle = to_list(status)
    i, j = locate_zero(puzzle)
    neis = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    for di, dj in neis:
        x, y = i+di, j+dj
        if 0 <= x < len(puzzle) and 0 <= y < len(puzzle[0]):
            puzzle[i][j], puzzle[x][y] = puzzle[x][y], puzzle[i][j]
            yield to_tuple(puzzle), puzzle[i][j] # next_status, slide_block
            puzzle[i][j], puzzle[x][y] = puzzle[x][y], puzzle[i][j]

def to_tuple(puzzle):
    return tuple(tuple(row) for row in puzzle)

def to_list(puzzle):
    return list(list(row) for row in puzzle)

def trace_to_dest(visited, dest):
    path = [dest]
    clicks = []
    while visited[dest][0]:
        pre_status, pre_click = visited[dest]
        path.append(pre_status)
        clicks.append(pre_click)
        dest = pre_status
    return path[::-1], clicks[::-1]

def astar(puzzle, dest):
    manhattans = heuristic(dest)
    start = to_tuple(puzzle)
    target = to_tuple(dest)
    heap = [(0 + manhattans(puzzle), 0, start)] # (depth+manhattan, depth, status)
    visited = {start:(None, None)}
    while heap:
        evaluate, depth, status = heapq.heappop(heap)
        if status == target:
            break
        for nei, block in neighbors(status):
            if nei not in visited:
                visited[nei] = (status, block)
                heap.append((depth + 1 + manhattans(nei), depth+1, nei))
    if target not in visited:
        print("invalid puzzle")
        return None
    path, click_order = trace_to_dest(visited, target)
    return path, click_order