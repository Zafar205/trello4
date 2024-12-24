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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 ">
            <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto ">
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        className="text-xl font-bold px-2 py-1 rounded border-2 border-transparent focus:border-blue-500 outline-none"
                    />
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <h3 className="text-lg font-semibold mb-2">Subtasks</h3>
                <ul className="space-y-2">
                    {subtasks.map(subtask => (
                        <li key={subtask.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => toggleSubtask(subtask.id)}
                                className="h-4 w-4"
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
                                    className="flex-1 px-2 py-1 rounded border border-gray-300 focus:border-blue-500 outline-none"
                                    autoFocus
                                />
                            ) : (
                                <span 
                                    className="flex-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                                    onClick={() => setEditingSubtaskId(subtask.id)}
                                >
                                    {subtask.text}
                                </span>
                            )}
                            <button
                                onClick={() => handleDeleteSubtask(subtask.id)}
                                className="text-red-500 hover:text-red-700 px-2"
                            >
                                <Trash2 size={14} />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="flex gap-2 mt-4">
                    <input
                        type="text"
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        className="flex-1 px-2 py-1 rounded-xl text-sm border border-gray-300"
                        placeholder="New subtask..."
                    />
                    <button
                        onClick={handleAddSubtask}
                        className="bg-blue-500 text-white px-2 py-1 rounded-xl"
                    >
                        Add Subtask
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl mt-4 w-full hover:bg-green-600"
                >
                    Save
                </button>
            </div>
        </div>
    );
}