import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const savedTasks = localStorage.getItem('reactTodo');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reactTodo', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (inputValue.trim() === '') {
      alert('Введите задачу');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      deleted: false
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, deleted: true } : task
    ));
  };

  const permanentDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const restoreFromDeleted = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, deleted: false, completed: false } : task
    ));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id && !task.deleted ? { ...task, completed: !task.completed } : task
    ));
  };

  const restoreTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: false } : task
    ));
  };

  const getFilteredTasks = () => {
    if (activeTab === 'active') {
      return tasks.filter(task => !task.completed && !task.deleted);
    } else if (activeTab === 'completed') {
      return tasks.filter(task => task.completed && !task.deleted);
    } else {
      return tasks.filter(task => task.deleted);
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="container">
      <h1>Мой To-Do List</h1>

      <div className="add-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите новую задачу..."
          autoComplete="off"
        />
        <button onClick={addTask}>Добавить</button>
      </div>

      <div className="tab-buttons">
        <button 
          className={activeTab === 'active' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('active')}
        >
          Активные
        </button>
        <button 
          className={activeTab === 'completed' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('completed')}
        >
          Завершенные
        </button>
        <button 
          className={activeTab === 'deleted' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('deleted')}
        >
          Удаленные
        </button>
      </div>

      <div className="tasks-container">
        {filteredTasks.length === 0 && (
          <div className="empty-message">
            {activeTab === 'active' && 'Нет активных задач'}
            {activeTab === 'completed' && 'Нет завершенных задач'}
            {activeTab === 'deleted' && 'Корзина пуста'}
          </div>
        )}

        {filteredTasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            {!task.deleted && (
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="task-checkbox"
              />
            )}
            <span className="task-text">{task.text}</span>
            {activeTab === 'completed' && !task.deleted && (
              <button onClick={() => restoreTask(task.id)} className="restore-btn">
                Восстановить
              </button>
            )}
            {activeTab === 'deleted' && (
              <>
                <button onClick={() => restoreFromDeleted(task.id)} className="restore-btn">
                  Восстановить
                </button>
                <button onClick={() => permanentDeleteTask(task.id)} className="permanent-delete-btn">
                  Удалить навсегда
                </button>
              </>
            )}
            {!task.deleted && activeTab !== 'deleted' && (
              <button onClick={() => deleteTask(task.id)} className="delete-btn">
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="nigmenu">
        Это итоговая работа по дисциплинам "МДК.02.01", "МДК.02.02", "Тема 5.2.4".<br />
        Работа выполнена студентом группы 24-ИС-12 Батюком Русланом.<br />
        Все задачи сохраняются в браузере. @ 2026
      </div>
    </div>
  );
}

export default App;