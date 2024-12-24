"use client"
import { useState, useContext } from 'react';
import { CardContext } from '../app/page';
import TaskItem from './TaskItem';


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


export default function Card({ title, index, tasks }: { title: string; index: number; tasks: Task[] }) {
    const context = useContext(CardContext);
    const [showOptions, setShowOptions] = useState(false);
    const [newTaskText, setNewTaskText] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleText, setTitleText] = useState(title);

    const handleAddTask = () => {
        if (newTaskText.trim() && context) {
            context.addTask(index, newTaskText);
            setNewTaskText("");
        }
    };

    const handleTitleSubmit = () => {
        if (titleText.trim() && context) {
            context.updateTitle(index, titleText);
            setIsEditingTitle(false);
        }
    };

    const handleTitleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleSubmit();
        }
    };




    return (
        <div>
            <div className="bg-gray-200 h-auto min-h-[250px] w-[220px] mt-[50px] ml-[20px] rounded-2xl p-4">
                <div className="flex justify-between">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={titleText}
                            onChange={(e) => setTitleText(e.target.value)}
                            onBlur={handleTitleSubmit}
                            onKeyDown={handleTitleKeyPress}
                            className="pl-[29px] bg-white rounded-lg text-sm w-32"
                            autoFocus
                        />
                    ) : (
                        <h3
                            className="pl-[29px] cursor-pointer hover:text-blue-600"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {title}
                        </h3>
                    )}

                    <div className="relative">
                        <img src="./dots.png" alt="not" height="10" width="25" onClick={() => setShowOptions(!showOptions)} />
                        {
                            showOptions &&
                            (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                                    <button
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ml-[40px]"
                                        onClick={() => {
                                            context?.deleteCard(index);
                                            setShowOptions(false);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
                <div className="mt-4">
                    <ul className="space-y-2">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                cardIndex={index}

                            />
                        ))}
                    </ul>
                    <div className="flex items-center gap-2 border-2 border-gray-300 rounded-2xl p-1 mt-2">
                        <button
                            onClick={handleAddTask}
                            className=" p-1 pb-2 bg-brown-500 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
                        >
                            +
                        </button>
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            className=" py-1 px-1 flex-1 border-1 bg-transparent placeholder-brown-700 text-brown-700 text-sm focus:outline-none"
                            placeholder="Add Task"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


