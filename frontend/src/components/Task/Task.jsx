import React, { useContext } from "react";
import moment from "moment";
import "./task.css"; 
import TaskContext from "../../context/TaskContext";
import TokenContext from "../../context/TokenContext";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../Axios/axios";

function Task({ task, id }) {
  const { tasks, dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);

  const handleRemove = async (e) => {
    e.preventDefault();

    const mongoId = tasks?.[id]?._id;
    if (!mongoId) {
      console.error("No Mongo _id found for index", id, tasks?.[id]);
      alert("Unable to delete: missing task id.");
      return;
    }

    try {
      await axios.delete("/task/removeTask", {
        data: { id: mongoId },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      dispatch({ type: "REMOVE_TASK", id });
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to delete task. Please try again."
      );
    }
  };

  const handleMarkDone = () => {
    dispatch({ type: "MARK_DONE", id }); 
  };

  const completed = !!task?.completed;

  return (
    <article
      className={[
        "group relative flex items-start gap-4 rounded-2xl bg-white",
        "p-5 md:p-6 ring-1 ring-black/5 shadow-sm transition",
        "hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-200",
        "mb-4 last:mb-0 md:mb-5",
        completed ? "opacity-90" : "",
      ].join(" ")}
    >
      <label
        htmlFor={`task-${id}`}
        className="flex cursor-pointer select-none items-start gap-3"
      >
        <input
          id={`task-${id}`}
          type="checkbox"
          checked={completed}
          onChange={handleMarkDone}
          className="peer sr-only"
        />

        <span
          aria-hidden="true"
          className={[
            "grid h-6 w-6 place-content-center rounded-md border border-slate-300 bg-white",
            "transition peer-checked:border-indigo-600 peer-checked:bg-indigo-600",
            "shadow-sm",
          ].join(" ")}
        >
          <svg
            className="h-4 w-4 opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>

        <div className="min-w-0">
          <h4
            className={[
              "mb-0.5 break-words text-base md:text-lg font-semibold text-slate-900",
              completed ? "line-through text-slate-500" : "",
            ].join(" ")}
          >
            {task?.title}
          </h4>

          {task?.description ? (
            <p
              className={[
                "break-words text-sm text-slate-600",
                completed ? "line-through text-slate-400" : "",
              ].join(" ")}
            >
              {task.description}
            </p>
          ) : null}

          <div className="mt-2 flex items-center gap-1.5 text-xs italic text-slate-500">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>
              {task?.createdAt ? moment(task.createdAt).fromNow() : "just now"}
            </span>
          </div>
        </div>
      </label>

      <div className="ml-auto -mr-1 self-start">
        <button
          type="button"
          onClick={handleRemove}
          aria-label="Delete task"
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-full",
            "text-red-600/90 hover:text-red-700 hover:bg-red-50",
            "active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300",
            "transition",
          ].join(" ")}
        >
          <DeleteIcon fontSize="small" />
        </button>
      </div>
    </article>
  );
}

export default Task;
