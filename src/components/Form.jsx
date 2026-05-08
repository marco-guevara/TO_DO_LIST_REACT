import { useCallback, useEffect, useState } from "react";
import List from "./List";
import tasks from "../utils/tasks.json";

export default function Form() {
  const [list, setList] = useState(getInitialTasks);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  function getInitialTasks() {
    return tasks.map((task) => {
      return {
        id: task.id,
        title: task.task,
        content: task.content || "",
        completed: false,
      };
    });
  }

  const handleReorder = useCallback((dragId, overId) => {
    setList((prev) => {
      const dragIndex = prev.findIndex((task) => task.id === dragId);
      const overIndex = prev.findIndex((task) => task.id === overId);

      if (dragIndex === -1 || overIndex === -1) return prev;
      if (prev[dragIndex].completed !== prev[overIndex].completed) return prev;

      const newList = [...prev];
      const [dragTask] = newList.splice(dragIndex, 1);
      newList.splice(overIndex, 0, dragTask);

      return newList;
    });
  }, [setList]);

  useEffect(() => {
    if (!title && !content) return;

    const timeout = setTimeout(() => {
      setTitle("");
      setContent("");
      setError("");
    }, 20000);

    return () => clearTimeout(timeout);
  }, [title, content]);

  useEffect(() => {
    if (!successMessage) return;

    const timeout = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [successMessage]);

  useEffect(() => {
    if (!draggingId) return;

    const handlePointerMove = (e) => {
      setDragOffset(e.clientY - dragStartY);

      const taskElement = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest("[data-task-id]");

      if (!taskElement) return;

      const overId = Number(taskElement.dataset.taskId);

      if (overId && overId !== draggingId) {
        handleReorder(draggingId, overId);
      }
    };

    const handlePointerUp = () => {
      setDraggingId(null);
      setDragOffset(0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [dragStartY, draggingId, handleReorder]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim().length < 6) {
      setError("La tarea debe tener al menos 6 caracteres");
      return;
    }

    if (editingId) {
      setList((prev) =>
        prev.map((task) => {
          if (task.id === editingId) {
            return {
              ...task,
              title: title.trim(),
              content: content.trim(),
            };
          }

          return task;
        })
      );
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        completed: false,
      };

      setList((prev) => [newTask, ...prev]);
      setSuccessMessage("tarea a\u00f1adida");
    }

    setTitle("");
    setContent("");
    setError("");
  };

  const handleDelete = (deleteId) => {
    if (deletingIds.includes(deleteId)) return;

    setDeletingIds((prev) => [...prev, deleteId]);

    setTimeout(() => {
      setList((prev) => prev.filter((task) => task.id !== deleteId));
      setDeletingIds((prev) => prev.filter((id) => id !== deleteId));
    }, 260);
  };

  const handleReset = () => {
    setList(getInitialTasks());
    setTitle("");
    setContent("");
    setError("");
    setSuccessMessage("");
    setEditingId(null);
    setShowClearConfirm(false);
    setDeletingIds([]);
    setDraggingId(null);
    setDragOffset(0);
  };

  const handleClear = () => {
    setList([]);
    setTitle("");
    setContent("");
    setError("");
    setSuccessMessage("");
    setEditingId(null);
    setShowClearConfirm(false);
    setDeletingIds([]);
    setDraggingId(null);
    setDragOffset(0);
  };

  const handleToggleCompleted = (id) => {
    setList((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }

        return task;
      })
    );
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setContent(task.content);
    setEditingId(task.id);
    setError("");
  };

  const handleCancelEdit = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
    setError("");
  };

  const handleDragStart = (id, startY) => {
    setDraggingId(id);
    setDragStartY(startY);
    setDragOffset(0);
  };

  const hasText = title.trim().length > 0;
  const pendingTasks = list.filter((task) => !task.completed);
  const completedTasks = list.filter((task) => task.completed);

  return (
    <main className="todo-page">
      <section className="todo-shell">
        <div className="todo-header">
          <p className="eyebrow">Daily focus</p>
          <h1>To-do list</h1>
          <p className="subtitle">Organize, edit and complete your tasks.</p>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task..."
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content..."
          />

          {error && <p className="error">{error}</p>}

          <div className="form-actions">
            {hasText && (
              <button className="primary-button" type="submit">
                {editingId ? "SAVE" : "ADD"}
              </button>
            )}

            {editingId && (
              <button
                className="ghost-button"
                type="button"
                onClick={handleCancelEdit}
              >
                CANCEL
              </button>
            )}
          </div>
        </form>

        {successMessage && <p className="success">{successMessage}</p>}

        <div className="list-header">
          <h2>Tasks</h2>
          <div className="list-actions">
            <button className="ghost-button" type="button" onClick={handleReset}>
              RESET
            </button>
            <button
              className="danger-button action-button"
              type="button"
              onClick={() => setShowClearConfirm(true)}
              disabled={list.length === 0}
            >
              CLEAR
            </button>
          </div>
        </div>

        <section className="task-section">
          <h3 className="section-title">Pending</h3>
          {pendingTasks.length > 0 ? (
            <ul className="task-list">
              <List
                list={pendingTasks}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                handleToggleCompleted={handleToggleCompleted}
                deletingIds={deletingIds}
                draggingId={draggingId}
                dragOffset={dragOffset}
                handleDragStart={handleDragStart}
              />
            </ul>
          ) : (
            <p className="empty-message">No pending tasks.</p>
          )}
        </section>

        {completedTasks.length > 0 && (
          <section className="task-section done-section">
            <h3 className="section-title">Done</h3>
            <ul className="task-list">
              <List
                list={completedTasks}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                handleToggleCompleted={handleToggleCompleted}
                deletingIds={deletingIds}
                draggingId={draggingId}
                dragOffset={dragOffset}
                handleDragStart={handleDragStart}
              />
            </ul>
          </section>
        )}
      </section>

      {showClearConfirm && (
        <div className="modal-backdrop">
          <div className="confirm-modal">
            <h2>Clear all tasks?</h2>
            <p>
              This will remove the pre-rendered tasks and every task you added.
            </p>
            <div className="modal-actions">
              <button className="ghost-button" type="button" onClick={handleClear}>
                YES, CLEAR
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={() => setShowClearConfirm(false)}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
