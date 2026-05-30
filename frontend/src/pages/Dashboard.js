import React, { useEffect, useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/layout/Navbar";
import StatsBar from "../components/tasks/StatsBar";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskCard from "../components/tasks/TaskCard";
import TaskModal from "../components/tasks/TaskModal";
import DeleteConfirmModal from "../components/tasks/DeleteConfirmModal";
import { Button, EmptyState, Spinner } from "../components/ui";
import useTasks from "../hooks/useTasks";

const Dashboard = () => {
  const { t } = useTheme();
  const {
    tasks, stats, loading, filters,
    fetchTasks, createTask, updateTask, deleteTask, clearCompleted,
    updateFilter, resetFilters,
  } = useTasks();

  const [modal, setModal]       = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchTasks(), filters.search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleSave = useCallback(async (formData) => {
    let result;
    if (modal && modal._id) {
      result = await updateTask(modal._id, formData);
    } else {
      result = await createTask(formData);
    }
    if (result.success) setModal(null);
  }, [modal, createTask, updateTask]);

  const handleDelete = useCallback(async () => {
    const result = await deleteTask(deleteId);
    if (result.success) setDeleteId(null);
  }, [deleteId, deleteTask]);

  const handleStatusChange = useCallback((id, status) => {
    updateTask(id, { status });
  }, [updateTask]);

  return (
    <div style={{ minHeight: "100vh", background: t.bg, transition: "background 0.3s" }}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>
        <StatsBar stats={stats} />

        <TaskFilters
          filters={filters}
          onFilter={updateFilter}
          onSort={(v) => updateFilter("sortBy", v)}
          onToggleDir={() => updateFilter("sortDir", filters.sortDir === "asc" ? "desc" : "asc")}
          onNew={() => setModal("new")}
        />

        {tasks.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: t.textMuted }}>
              Showing <strong style={{ color: t.text }}>{tasks.length}</strong> task{tasks.length !== 1 ? "s" : ""}
            </p>
            {stats.completed > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCompleted} style={{ color: "#ef4444", borderColor: "#fecaca" }}>
                Clear completed ({stats.completed})
              </Button>
            )}
          </div>
        )}

        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <Spinner size={36} />
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <EmptyState
            icon="📋"
            title={stats.total === 0 ? "No tasks yet" : "No tasks match your filters"}
            message={stats.total === 0 ? "Create your first task to get started" : "Try adjusting or clearing the filters"}
            action={
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {stats.total === 0
                  ? <Button onClick={() => setModal("new")}>+ Create First Task</Button>
                  : <Button variant="ghost" onClick={resetFilters}>Clear Filters</Button>
                }
              </div>
            }
          />
        )}

        {!loading && tasks.length > 0 && (
        <div
  style={{
    display: "flex",
    flexDirection: "column",
    maxWidth: 600,
    height: "450px",
    gap: 12,
    margin: "0 auto",
    overflowY: "auto", // ajoute une barre de défilement
  }}
>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => setModal(t)}
                onDelete={(id) => setDeleteId(id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {modal !== null && (
        <TaskModal
          task={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleteId && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;