import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await API.get("/employees");
      return res.data.employees || [];
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
      return [];
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    fetchEmployees().then((data) => {
      if (mounted) {
        setEmployees(data);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [fetchEmployees]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await API.delete(`/employees/${id}`);

      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  if (loading) {
    return (
      <p className="text-center p-6 text-gray-500 text-lg">
        Loading employees…
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-5">
        <Link
          to="/dashboard"
          className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employees</h1>

        <Link
          to="/employees/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Employee
        </Link>
      </div>

      {employees.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No employees found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {emp.first_name} {emp.last_name}
              </h2>

              <p className="text-gray-600 mt-1">📧 {emp.email}</p>
              <p className="text-gray-600">📞 {emp.phone || "N/A"}</p>

              <p className="text-gray-400 text-sm mt-2">
                Added: {new Date(emp.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/employees/edit/${emp.id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(emp.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

                <Link
                  to={`/employees/${emp.id}/assign-teams`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                >
                  Teams
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
