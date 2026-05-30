import { useState, useCallback, useMemo } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const DEFAULT_FILTERS = { search: "", status: "all", priority: "all", sortBy: "createdAt", sortDir: "desc" };

const computeStats = (tasks) => ({
  total:      tasks.length,
  todo:       tasks.filter(t => t.status === "todo").length,
  inProgress: tasks.filter(t => t.status === "in_progress").length,
  completed:  tasks.filter(t => t.status === "completed").length,
  overdue:    tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== "completed").length,
});

const useTasks = () => {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Stats calculées en temps réel depuis tasks — jamais besoin de refresh
  const stats = useMemo(() => computeStats(tasks), [tasks]);

  const fetchTasks = useCallback(async (overrideFilters) => {
    setLoading(true);
    try {
      const params = overrideFilters || filters;
      const { data } = await api.get("/tasks", { params });
      setTasks(data.tasks);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = useCallback(async (taskData) => {
    try {
      const { data } = await api.post("/tasks", taskData);
      setTasks(prev => [data.task, ...prev]); // stats se recalculent automatiquement
      toast.success("Task created!");
      return { success: true, task: data.task };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
      return { success: false };
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      setTasks(prev => prev.map(t => t._id === id ? data.task : t)); // stats se recalculent
      toast.success("Task updated!");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
      return { success: false };
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id)); // stats se recalculent
      toast.success("Task deleted");
      return { success: true };
    } catch {
      toast.error("Failed to delete task");
      return { success: false };
    }
  }, []);

  const clearCompleted = useCallback(async () => {
    try {
      await api.delete("/tasks/completed/all");
      setTasks(prev => prev.filter(t => t.status !== "completed")); // stats se recalculent
      toast.success("Completed tasks cleared");
    } catch {
      toast.error("Failed to clear tasks");
    }
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const filteredTasks = useMemo(() => {
    let list = [...tasks];
    const q = filters.search.toLowerCase().trim();
    if (q) list = list.filter(t => t.title.toLowerCase().startsWith(q));
    if (filters.status   !== "all") list = list.filter(t => t.status   === filters.status);
    if (filters.priority !== "all") list = list.filter(t => t.priority === filters.priority);

    const pOrder = { high: 0, medium: 1, low: 2 };
    list.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === "deadline") {
        cmp = new Date(a.deadline || "9999") - new Date(b.deadline || "9999");
      } else if (filters.sortBy === "priority") {
        cmp = pOrder[a.priority] - pOrder[b.priority];
      } else {
        cmp = new Date(a.createdAt) - new Date(b.createdAt);
      }
      return filters.sortDir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [tasks, filters]);

  return {
    tasks: filteredTasks,
    stats,
    loading,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearCompleted,
    updateFilter,
    resetFilters,
  };
};

export default useTasks;