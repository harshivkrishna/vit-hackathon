import React, { useState } from "react";

const TreesByLocality = () => {
  const [locality, setLocality] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTreeData = async () => {
    if (!locality) {
      setError("Please enter a locality name.");
      return;
    }

    setLoading(true);
    setError(null);

    // Overpass API query to fetch trees by locality name
    const query = `
    [out:json];
    area["name"="${locality}"]["boundary"="administrative"]->.searchArea;
    (
      node["natural"="tree"](area.searchArea);  // Individual trees
      way["landuse"="forest"](area.searchArea); // Forested areas (ways)
      relation["landuse"="forest"](area.searchArea); // Complex forests (relations)
      way["natural"="wood"](area.searchArea);  // Woodland areas
      relation["natural"="wood"](area.searchArea); // Complex woodlands
      way["landuse"="orchard"](area.searchArea); // Orchards (e.g., fruit trees)
      relation["landuse"="orchard"](area.searchArea); // Complex orchards
    );
    out body;
    >;
    out skel qt;
  `;
  

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setTreeData(data.elements || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Tree Data by Locality</h1>
      <input
        type="text"
        placeholder="Enter locality name"
        value={locality}
        onChange={(e) => setLocality(e.target.value)}
      />
      <button onClick={fetchTreeData}>Fetch Tree Data</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && treeData.length > 0 && (
        <div>
          <h2>Number of Trees Found: {treeData.length}</h2>
        </div>
      )}

      {!loading && !error && treeData.length === 0 && <p>No trees found for this locality.</p>}
    </div>
  );
};

export default TreesByLocality;
