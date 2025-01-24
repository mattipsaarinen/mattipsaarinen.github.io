import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useTheme } from "../contexts/ThemeContext";

interface PopulationData {
  year: number;
  age: number;
  male: number;
  female: number;
  total: number;
}

interface PopulationPyramidThreeJSProps {
  countryCode: string | null;
}

const NUM_PARTICLES = 10000;

export function PopulationPyramidThreeJS({
  countryCode,
}: PopulationPyramidThreeJSProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<PopulationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState(2023);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Fetch and process data
  useEffect(() => {
    async function fetchData() {
      if (!countryCode) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/data/snapshots/population/${countryCode}.json`
        );
        if (!response.ok) throw new Error("Failed to fetch population data");

        const rawData = await response.json();
        const processedData = rawData
          .filter((d: any[]) => d[0] === selectedYear)
          .map((d: any[]) => ({
            year: d[0],
            age: d[1],
            male: d[2],
            female: d[3],
            total: d[4],
          }));

        setData(processedData.sort((a, b) => a.age - b.age));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [countryCode, selectedYear]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      theme === "light"
        ? 0xfff0f0 // Light red in light mode
        : 0x2a2424 // Darker red in dark mode
    );
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [theme]);

  // Update particles when data changes
  useEffect(() => {
    if (!sceneRef.current || !data.length) return;

    // Clear existing particles
    sceneRef.current.children = sceneRef.current.children.filter(
      (child) => !(child instanceof THREE.Points)
    );

    // Calculate total population for sampling
    const totalPopulation = data.reduce((sum, d) => sum + d.total, 0);

    // Create geometry for particles
    const positions = new Float32Array(NUM_PARTICLES * 3);
    const colors = new Float32Array(NUM_PARTICLES * 3);

    let currentIndex = 0;

    // Sample points based on population distribution
    for (let i = 0; i < NUM_PARTICLES; i++) {
      // Random sampling
      const random = Math.random() * totalPopulation;
      let sum = 0;
      let selectedData: PopulationData | null = null;

      // Find the age group for this particle
      for (const d of data) {
        sum += d.total;
        if (random <= sum) {
          selectedData = d;
          break;
        }
      }

      if (!selectedData) continue;

      // Determine if this particle represents male or female
      const isMale = Math.random() < selectedData.male / selectedData.total;

      // Calculate position
      const x = isMale
        ? -Math.random() * 2 // Male side (negative X)
        : Math.random() * 2; // Female side (positive X)
      const y = (selectedData.age / 100) * 4 - 2; // Scale age to position
      const z = (Math.random() - 0.5) * 0.5; // Add some depth

      positions[currentIndex] = x;
      positions[currentIndex + 1] = y;
      positions[currentIndex + 2] = z;

      // Set colors (blue for male, pink for female)
      if (isMale) {
        colors[currentIndex] = 0.3; // R
        colors[currentIndex + 1] = 0.5; // G
        colors[currentIndex + 2] = 1.0; // B
      } else {
        colors[currentIndex] = 1.0; // R
        colors[currentIndex + 1] = 0.3; // G
        colors[currentIndex + 2] = 0.5; // B
      }

      currentIndex += 3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const points = new THREE.Points(geometry, material);
    sceneRef.current.add(points);
  }, [data]);

  // Handle resize
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!countryCode) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "1rem" }}>Year: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            backgroundColor: "var(--background-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--text-secondary)",
          }}
        >
          {Array.from({ length: 74 }, (_, i) => 2023 - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div
        ref={containerRef}
        style={{
          width: "800px",
          height: "500px",
          backgroundColor: theme === "light" ? "#fff0f0" : "#2a2424",
          borderRadius: "8px", // Optional: rounded corners
        }}
      />
    </div>
  );
}
