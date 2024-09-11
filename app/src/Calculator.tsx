import React, { useState } from 'react';
import './Calculator.css';

function calculateMultipliers(inputPrice: number, outputPrice: number) {
  if (isNaN(inputPrice) || isNaN(outputPrice)) {
    throw new Error('Input and output prices must be numbers');
  }

  if (inputPrice === 0) {
    throw new Error('Input price cannot be zero to calculate multipliers');
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
    originalValues: {
      modelName: string;
      inputPrice: number;
      outputPrice: number;
    } | null;
  }[]>(() => {
    const storedData = localStorage.getItem(localStorageKey);
    return storedData ? JSON.parse(storedData).map((row: any) => ({ ...row, originalValues: null })) : [];
  });

  const addRow = () => {
    setRows(prevRows => [...prevRows, { modelName: '', inputPrice: 0, outputPrice: 0, modelMultiplier: 0, completionMultiplier: 0, editing: true, originalValues: null }]);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      [field]: field === 'modelName' ? value : parseFloat(value) || 0
    };

    if (field === 'inputPrice' || field === 'outputPrice') {
      const { inputPrice, outputPrice } = newRows[index];
      try {
        const { modelMultiplier, completionMultiplier } = calculateMultipliers(inputPrice, outputPrice);
        newRows[index] = { ...newRows[index], modelMultiplier, completionMultiplier };
      } catch (error: any) {
        console.error(error.message);
        newRows[index] = { ...newRows[index], modelMultiplier: 0, completionMultiplier: 0 };
      }
    }

    setRows(newRows);
  };

  const toggleEdit = (index: number) => {
    const newRows = [...rows];
    if (!newRows[index].editing) {
      // Entering edit mode: store original values
      newRows[index].originalValues = {
        modelName: newRows[index].modelName,
        inputPrice: newRows[index].inputPrice,
        outputPrice: newRows[index].outputPrice,
      };
    }
    newRows[index].editing = !newRows[index].editing;


    if (!newRows[index].editing) {
      // Save to localStorage when exiting edit mode (save button clicked)
      localStorage.setItem(localStorageKey, JSON.stringify(newRows.map(row => ({...row, originalValues: null})))); // Remove originalValues when saving
    }

    setRows(newRows);
  };


  const cancelEdit = (index: number) => {
    const newRows = [...rows];
    if (newRows[index].originalValues) {
      newRows[index] = {
        ...newRows[index],
        ...newRows[index].originalValues, // Restore original values
        editing: false,
        originalValues: null,
      };
    }
    setRows(newRows);
  };

  const deleteRow = (index: number) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      setRows(prevRows => prevRows.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container">
      <h1>One-API Multiplier Calculator</h1>
      <div className="card">
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
                    {row.editing ? (
                      <>
                        <button onClick={() => toggleEdit(index)}>💾</button>
                        <button onClick={() => cancelEdit(index)}>❌</button> {/* Cancel button */}
                      </>
                    ) : (
                      <>
                        <button onClick={() => toggleEdit(index)}>✏️</button>
                        <button onClick={() => deleteRow(index)}>🗑️</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="add-button-container">
          <button onClick={addRow}>➕</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;