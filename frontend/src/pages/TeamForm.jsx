import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../api/api";

const TeamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!isEditing) return;

    const loadTeam = async () => {
      try {
        const res = await API.get(`/teams/${id}`);
        setForm({
          name: res.data.team.name || "",
          description: res.data.team.description || "",
        });
      } catch (err) {
        console.error("Team fetch error:", err);
      }
    };

    loadTeam();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await API.put(`/teams/${id}`, form);
        alert("Team updated successfully!");
      } else {
        await API.post("/teams", form);
        alert("Team created successfully!");
      }

      navigate("/teams");
    } catch (err) {
      console.error("Error saving team:", err);
      alert("Error saving team");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Team" : "Add Team"}
          </h1>

          <Link
            to="/teams"
            className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-900 transition"
          >
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-700 font-semibold">Team Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter description"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-800 transition"
          >
            {isEditing ? "Update Team" : "Create Team"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
