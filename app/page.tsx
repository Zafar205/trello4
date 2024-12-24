"use client"
import { createContext, useContext, useState } from 'react';
import "./globals.css";
import Card from "../components/Card";
interface Task {
  text: string;
  id : string;
}

interface CardObject {
  index: number;
  title: string;
  description: string;
  tasks: Task[];
}

interface CardContextType {
  cards: CardObject[];
  addCard: () => void;
  deleteCard: (index: number) => void;
  addTask: (cardIndex: number, taskText: string) => void;
  updateTitle: (index: number, title: string) => void;
  updateTask: (cardIndex: number, taskId: string, newText: string) => void;
}

export const CardContext = createContext<CardContextType | undefined>(undefined);


export default function Home() {
  const [cards, setCards] = useState<Array<CardObject>>([]);
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [globalTaskText, setGlobalTaskText] = useState("");
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const addCard = () => {
    if (!showTitleInput) {
      setShowTitleInput(true);
      return;
    }
    
    if (newCardTitle.trim()) {
      const newCard: CardObject = {
        title: newCardTitle,
        description: "This is a new card",
        index: cards.length,
        tasks: []
      };
      setCards([...cards, newCard]);
      setNewCardTitle("");
      setShowTitleInput(false);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCard();
    }
  };

  const deleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const addTask = (cardIndex: number, taskText: string) => {
    setCards(cards.map((card, i) => {
      if (i === cardIndex) {
        return {
          ...card,
          tasks: [...card.tasks, { text: taskText, id: Date.now().toString() }]
        };
      }
      return card;
    }));
  };

  const updateTask = (cardIndex: number, taskId: string, newText: string) => {
    setCards(cards.map((card, i) => {
      if (i === cardIndex) {
        return {
          ...card,
          tasks: card.tasks.map(task => 
            task.id === taskId ? { ...task, text: newText } : task
          )
        };
      }
      return card;
    }));
  };

  const handleGlobalAddTask = () => {
    if (selectedCardIndex !== null && globalTaskText.trim()) {
      addTask(selectedCardIndex, globalTaskText);
      setGlobalTaskText("");
    }
  };

  const updateTitle = (index: number, title: string) => {
    setCards(cards.map((card, i) => {
      if (i === index) {
        return {
          ...card,
          title
        };
      }
      return card;
    }));
  };

  const contextValue = {
    cards,
    addCard,
    deleteCard,
    addTask,
    updateTitle,
    updateTask
  };

  return (
    <CardContext.Provider value={contextValue}>
      <div className="flex flex-row m-[20px]">
        <input 
          type="text" 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
          placeholder="Write task details" 
          value={globalTaskText}
          onChange={(e) => setGlobalTaskText(e.target.value)}
        />
        <button 
          type="button" 
          className="text-white ml-2 mt-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-2xl text-sm px-5 py-2.5 me-2 mb-2"
          onClick={handleGlobalAddTask}
        >
          Add
        </button>
        <select 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-[300px] p-2.5 ml-2"
          onChange={(e) => setSelectedCardIndex(e.target.value ? parseInt(e.target.value) : null)}
          value={selectedCardIndex !== null ? selectedCardIndex : ""}
        >
          <option value="">Select Card</option>
          {cards.map((card, index) => (
            <option key={index} value={index}>{card.title}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-row flex-wrap">
        {cards.map((card, index) => (
          <div key={index} className="flex-shrink-0">
            <Card
              title={card.title}
              index={index}
              tasks={card.tasks}
            />
          </div>
        ))}
        <div className="flex-shrink-0">
          {showTitleInput ? (
            <div className="bg-gray-200 h-[60px] w-[220px] mt-[150px] ml-[100px] rounded-3xl p-4 flex items-center">
              <input
                type="text"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyPress={handleTitleKeyPress}
                className="w-full px-3 py-2 rounded-xl text-sm"
                placeholder="Enter card title..."
                autoFocus
              />
            </div>
          ) : (
            <button
              className="bg-slate-500 w-[150px] h-[50px] mt-[150px] ml-[100px] rounded-3xl text-white"
              onClick={addCard}
            >
              + Add Card
            </button>
          )}
        </div>
      </div>
    </CardContext.Provider>
  );
}