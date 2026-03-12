import { useState, useEffect } from 'react';
import { getAllEdges } from '../api/navigationApi';

export const useNavigation = () => {
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllEdges().then(({ data, error }) => {
      if (error) setError(error.message);
      else setEdges(data || []);
      setLoading(false);
    });
  }, []);

  // ─── Build Adjacency Graph ──────────────────────────────────────
  const buildGraph = (edgeList) => {
    const graph = {};
    edgeList.forEach(edge => {
      const fromId = edge.from_location_id;
      if (!graph[fromId]) graph[fromId] = [];
      graph[fromId].push({
        toId: edge.to_location_id,
        edge
      });
    });
    return graph;
  };

  // ─── BFS Algorithm ──────────────────────────────────────────────
  const findPath = (startLocationId, endLocationId) => {
    if (!startLocationId || !endLocationId) return null;
    if (startLocationId === endLocationId) return [];

    const graph = buildGraph(edges);
    const queue = [[startLocationId, []]];
    const visited = new Set();

    while (queue.length > 0) {
      const [current, path] = queue.shift();

      if (current === endLocationId) return path; // ✅ Found!
      if (visited.has(current)) continue;
      visited.add(current);

      const neighbors = graph[current] || [];
      neighbors.forEach(({ toId, edge }) => {
        if (!visited.has(toId)) {
          queue.push([toId, [...path, edge]]);
        }
      });
    }

    return null; // No path found
  };

  // ─── Get All Unique Location Nodes ──────────────────────────────
  const getConnectedLocations = () => {
    const locationMap = {};
    edges.forEach(edge => {
      if (edge.from_location) {
        locationMap[edge.from_location.id] = edge.from_location;
      }
      if (edge.to_location) {
        locationMap[edge.to_location.id] = edge.to_location;
      }
    });
    return Object.values(locationMap).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  // ─── Check if a location has any routes ─────────────────────────
  const hasRoutes = (locationId) => {
    return edges.some(
      edge =>
        edge.from_location_id === locationId ||
        edge.to_location_id === locationId
    );
  };

  // ─── Get all destinations reachable from a start ────────────────
  const getReachableDestinations = (startLocationId) => {
    if (!startLocationId) return [];
    const graph = buildGraph(edges);
    const visited = new Set();
    const queue = [startLocationId];
    const reachable = [];

    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);

      if (current !== startLocationId) {
        const loc = edges
          .flatMap(e => [e.from_location, e.to_location])
          .find(l => l?.id === current);
        if (loc) reachable.push(loc);
      }

      const neighbors = graph[current] || [];
      neighbors.forEach(({ toId }) => {
        if (!visited.has(toId)) queue.push(toId);
      });
    }

    return reachable.sort((a, b) => a.name.localeCompare(b.name));
  };

  return {
    edges,
    loading,
    error,
    findPath,
    getConnectedLocations,
    getReachableDestinations,
    hasRoutes
  };
};