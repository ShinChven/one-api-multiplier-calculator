import React, { useState, useEffect } from 'react';
import './Calculator.css';

function calculateMultipliers(inputPrice: number, outputPrice: number) {
  if (isNaN(inputPrice) || isNaN(outputPrice)) {
    throw new Error('输入和输出价格必须为数字');
  }

  const basePrice = 0.002;
  const modelMultiplier = inputPrice / basePrice;
  const completionMultiplier = outputPrice / inputPrice;

  return {
    modelMultiplier,
    completionMultiplier
  };
}

const Calculator: React.FC = () => {
  const localStorageKey = 'calculatorData';
  const [rows, setRows] = useState<{
    modelName: string;
    inputPrice: number;
    outputPrice: number;
    modelMultiplier: number;
    completionMultiplier: number;
    editing: boolean;
  }[]>(() => {
    const storedData = localStorage.getItem(localStorageKey);
    return storedData ? JSON.parse(storedData) : [];
  });

  useEffect(() => { }, []); // Local storage effect removed

  const addRow = () => {
    setRows(prevRows => [...prevRows, { modelName: '', inputPrice: 0, outputPrice: 0, modelMultiplier: 0, completionMultiplier: 0, editing: true }]);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      [field]: field === 'modelName' ? value : parseFloat(value) || 0
    };

    if (field === 'inputPrice' || field === 'outputPrice') {
      const { inputPrice, outputPrice } = newRows[index];
      const { modelMultiplier, completionMultiplier } = calculateMultipliers(inputPrice, outputPrice);
      newRows[index] = { ...newRows[index], modelMultiplier, completionMultiplier };
    }

    setRows(newRows);
  };

  const toggleEdit = (index: number) => {
    const newRows = [...rows];
    newRows[index].editing = !newRows[index].editing;

    if (!newRows[index].editing) {
      // Save to localStorage when exiting edit mode
      localStorage.setItem(localStorageKey, JSON.stringify(newRows));
    }

    setRows(newRows);
  };

  const deleteRow = (index: number) => {
    setRows(prevRows => prevRows.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1>One-API Multiplier Calculator</h1>
      <div className="card">
        <button onClick={addRow}>➕</button>
        <p style={{ textAlign: 'center' }}>Price calculated per 1k Tokens</p>
        <table>
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Input Price</th>
              <th>Output Price</th>
              <th>Model Multiplier</th>
              <th>Completion Multiplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  {row.editing ? (
                    <input
                      type="text"
                      value={row.modelName}
                      onChange={(e) => handleInputChange(index, 'modelName', e.target.value)}
                    />
                  ) : (
                    <span>{row.modelName}</span>
                  )}
                </td>
                <td>
                  {row.editing ? (
                    <input
                      type="number"
                      value={row.inputPrice}
                      onChange={(e) => handleInputChange(index, 'inputPrice', e.target.value)}
                    />
                  ) : (
                    <span>{row.inputPrice.toFixed(2)}</span>
                  )}
                </td>
                <td>
                  {row.editing ? (
                    <input
                      type="number"
                      value={row.outputPrice}
                      onChange={(e) => handleInputChange(index, 'outputPrice', e.target.value)}
                    />
                  ) : (
                    <span>{row.outputPrice.toFixed(2)}</span>
                  )}
                </td>
                <td>{row.modelMultiplier.toFixed(4)}</td>
                <td>{row.completionMultiplier.toFixed(4)}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => toggleEdit(index)}>
                      {row.editing ? '💾' : '✏️'}
                    </button>
                    <button onClick={() => deleteRow(index)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calculator;