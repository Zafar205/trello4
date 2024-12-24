import { useState } from "react";
import { Trash2 } from "lucide-react";

interface Task {
    text: string;
    id: string;
    subtasks: Subtask[];
}

interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}

export default function TaskModal({
    isOpen,
    onClose,
    task,
    cardIndex,
    onUpdateTask
}: {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    cardIndex: number;
    onUpdateTask: (taskId: string, newText: string, subtasks: Subtask[]) => void;
}) {
    const [newSubtaskText, setNewSubtaskText] = useState("");
    const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
    const [taskText, setTaskText] = useState(task.text);
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);

    const handleAddSubtask = () => {
        if (newSubtaskText.trim()) {
            const newSubtask: Subtask = {
                id: Date.now().toString(),
                text: newSubtaskText,
                completed: false,
            };
            setSubtasks([...subtasks, newSubtask]);
            setNewSubtaskText("");
        }
    };

    const handleDeleteSubtask = (subtaskId: string) => {
        setSubtasks(subtasks.filter(st => st.id !== subtaskId));
    };

    const toggleSubtask = (subtaskId: string) => {
        setSubtasks(
            subtasks.map(st =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
        );
    };

    const handleEditSubtask = (subtaskId: string, newText: string) => {
        setSubtasks(
            subtasks.map(st =>
                st.id === subtaskId ? { ...st, text: newText } : st
            )
        );
    };

    const handleSave = () => {
        onUpdateTask(task.id, taskText, subtasks);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 top-[-10px] flex items-center justify-center z-10">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div className="relative bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        className="text-xl font-bold px-3 py-1.5 rounded-lg border-2 border-transparent focus:border-blue-500 outline-none bg-gray-50"
                    />
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1"
                    >
                        ✕
                    </button>
                </div>
                <h3 className="text-lg font-semibold mb-3">Subtasks</h3>
                <ul className="space-y-2 mb-4">
                    {subtasks.map(subtask => (
                        <li key={subtask.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => toggleSubtask(subtask.id)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            {editingSubtaskId === subtask.id ? (
                                <input
                                    type="text"
                                    value={subtask.text}
                                    onChange={(e) => handleEditSubtask(subtask.id, e.target.value)}
                                    onBlur={() => setEditingSubtaskId(null)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setEditingSubtaskId(null);
                                        }
                                    }}
                                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
                                    autoFocus
                                />
                            ) : (
                                <span
                                    className="flex-1 cursor-pointer px-3 py-1.5 rounded-lg"
                                    onClick={() => setEditingSubtaskId(subtask.id)}
                                >
                                    {subtask.text}
                                </span>
                            )}
                            <button
                                onClick={() => handleDeleteSubtask(subtask.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2 border-2 border-gray-300 rounded-2xl p-1 my-2">
                    <button
                        onClick={handleAddSubtask}
                        className=" p-1 pb-2 bg-brown-500 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
                    >
                        +
                    </button>
                    <input
                        type="text"
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        className=" py-1 px-1 flex-1 border-1 bg-transparent placeholder-brown-700 text-brown-700 text-sm focus:outline-none"
                        placeholder="Add Task"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2.5 rounded-xl w-full hover:bg-green-600 font-medium transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}