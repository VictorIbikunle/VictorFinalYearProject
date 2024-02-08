import React, { useState } from 'react';

const Goal = ({ goalData, progressData, onStatusChange, onDeleteGoal }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStatusChange = (status) => {
    if (!isCompleted) {
      let newProgress = 0;
      switch (status) {
        case 'Doing well':
          newProgress = Math.min(progressData + 25, 100);
          break;
        case 'Making progress':
          newProgress = Math.min(progressData + 50, 100);
          break;
        case 'Reached goal':
          newProgress = 100;
          setIsCompleted(true);
          break;
        default:
          break;
      }
      onStatusChange(newProgress, isCompleted);
    }
  };

  return (
    <div>
      {goalData.name && (
        <div>
          <h3>{goalData.name}</h3>
          <p>{goalData.description}</p>
          <p>Start Date: {goalData.startDate}</p>
          <p>End Date: {goalData.endDate}</p>
          <div style={{ width: '100%', backgroundColor: '#ddd', marginTop: '10px' }}>
            <div
              style={{
                width: `${progressData}%`,
                height: '20px',
                backgroundColor: isCompleted ? '#4CAF50' : '#2196F3',
                textAlign: 'center',
                lineHeight: '20px',
                color: 'white',
              }}
            >
              {isCompleted ? 'Completed' : `${progressData}%`}
            </div>
          </div>
          <div>
            <button onClick={() => handleStatusChange('Doing well')} disabled={isCompleted}>
              Doing well
            </button>
            <button onClick={() => handleStatusChange('Making progress')} disabled={isCompleted}>
              Making progress
            </button>
            <button onClick={() => handleStatusChange('Reached goal')} disabled={isCompleted}>
              Reached goal
            </button>
            <button onClick={onDeleteGoal}>Delete Goal</button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [goals, setGoals] = useState([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  const [goalData, setGoalData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoalData({ ...goalData, [name]: value });
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      goalData: { ...goalData },
      progressData: 0,
    };
    setGoals([...goals, newGoal]);
    setCurrentGoalIndex(goals.length);
    setGoalData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleStatusChange = (newProgress, isCompleted) => {
    const updatedGoals = [...goals];
    updatedGoals[currentGoalIndex].progressData = newProgress;
    updatedGoals[currentGoalIndex].isCompleted = isCompleted;
    setGoals(updatedGoals);
  };

  const handleDeleteGoal = () => {
    const updatedGoals = [...goals];
    updatedGoals.splice(currentGoalIndex, 1);
    setGoals(updatedGoals);
    setGoalData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleNextGoal = () => {
    if (currentGoalIndex < goals.length - 1) {
      setCurrentGoalIndex(currentGoalIndex + 1);
    }
  };

  const handlePrevGoal = () => {
    if (currentGoalIndex > 0) {
      setCurrentGoalIndex(currentGoalIndex - 1);
    }
  };

  return (
    <div>
      <div>
        <h1>Goal Tracker</h1>
        <form onSubmit={handleGoalSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={goalData.name} onChange={handleInputChange} />
          </label>
          <label>
            Description:
            <input type="text" name="description" value={goalData.description} onChange={handleInputChange} />
          </label>
          <label>
            Start Date:
            <input type="date" name="startDate" value={goalData.startDate} onChange={handleInputChange} />
          </label>
          <label>
            End Date:
            <input type="date" name="endDate" value={goalData.endDate} onChange={handleInputChange} />
          </label>
          <button type="submit">Create Goal</button>
        </form>
      </div>

      <div>
        <Goal
          goalData={goals[currentGoalIndex]?.goalData || {}}
          progressData={goals[currentGoalIndex]?.progressData || 0}
          onStatusChange={handleStatusChange}
          onDeleteGoal={handleDeleteGoal}
        />
        <div>
          <button onClick={handlePrevGoal} disabled={currentGoalIndex === 0}>
            Previous Goal
          </button>
          <button onClick={handleNextGoal} disabled={currentGoalIndex === goals.length - 1}>
            Next Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
