import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // adjust path if needed

export default function AddPlant() {
  const [plantTypes, setPlantTypes] = useState([]);
  const [formData, setFormData] = useState({
    plant_type_id: "",
    soil_type: "",
    nickname: "",
    date_planted: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch available plant types from plant_conditions
  useEffect(() => {
    async function fetchPlantTypes() {
      const { data, error } = await supabase
        .from("plant_conditions")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        console.error("❌ Error fetching plant types:", error);
        setMessage("Error loading plant types");
      } else {
        setPlantTypes(data);
      }
    }

    fetchPlantTypes();
  }, []);

  // Submit new plant
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Get current user session
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (!user) {
        setMessage("❌ No active session found. Please log in again.");
        setLoading(false);
        return;
      }

      // Insert plant into table
      const { error } = await supabase.from("plants").insert([
        {
          user_id: user.id,
          plant_conditions_id: formData.plant_type_id,
          soil_type: formData.soil_type,
          nickname: formData.nickname,
          date_planted: formData.date_planted,
        },
      ]);

      if (error) throw error;

      setMessage("✅ Plant added successfully!");
      setFormData({
        plant_type_id: "",
        soil_type: "",
        nickname: "",
        date_planted: "",
      });
    } catch (err) {
      console.error("Insert error:", err);
      setMessage("❌ Failed to add plant: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div >
      <h2>Add a New Plant 🌱</h2>

      <form onSubmit={handleSubmit}>
        {/* Plant Type */}
        <label>Plant Type</label>
        <select
          value={formData.plant_type_id}
          onChange={(e) => setFormData({ ...formData, plant_type_id: e.target.value })}
          required
        >
          <option value="">Select a plant...</option>
          {plantTypes.map((plant) => (
            <option key={plant.id} value={plant.id}>
              {plant.name}
            </option>
          ))}
        </select>

        {/* Soil Type */}
        <label >Soil Type</label>
        <input
          type="text"
          placeholder="e.g. Loamy"
          value={formData.soil_type}
          onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
          required
        />

        {/* Nickname */}
        <label className="font-medium">Nickname</label>
        <input
          type="text"
          placeholder="e.g. Backyard Tomato"
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          required
        />

        {/* Date Planted */}
        <label className="font-medium">Date Planted</label>
        <input
          type="date"
          value={formData.date_planted}
          onChange={(e) => setFormData({ ...formData, date_planted: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Plant"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
