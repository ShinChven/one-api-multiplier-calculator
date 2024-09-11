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
  const [rows, setRows] = useState<{ modelName: string; inputPrice: number; outputPrice: number; modelMultiplier: number; completionMultiplier: number; }[]>(() => {
    const storedData = localStorage.getItem(localStorageKey);
    return storedData ? JSON.parse(storedData) : [];
  });

  useEffect(() => {
    if (rows.length > 0) {
      localStorage.setItem(localStorageKey, JSON.stringify(rows));
    }
  }, [rows]);

  const addRow = () => {
    setRows(prevRows => [...prevRows, { modelName: '', inputPrice: 0, outputPrice: 0, modelMultiplier: 0, completionMultiplier: 0 }]);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      [field]: field === 'modelName' ? value : parseFloat(value) || 0
    };
    setRows(newRows);
  };

  const calculateRow = (index: number) => {
    const { inputPrice, outputPrice } = rows[index];
    const { modelMultiplier, completionMultiplier } = calculateMultipliers(inputPrice, outputPrice);
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], modelMultiplier, completionMultiplier };
    setRows(newRows);
  };

  return (
    <div className="container">
      <div className="card">
        <button onClick={addRow}>+</button>
        <table>
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Input Price/1k Tokens</th>
              <th>Output Price/1k Tokens</th>
              <th>Model Multiplier</th>
              <th>Completion Multiplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={row.modelName}
                    onChange={(e) => handleInputChange(index, 'modelName', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.inputPrice}
                    onChange={(e) => handleInputChange(index, 'inputPrice', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.outputPrice}
                    onChange={(e) => handleInputChange(index, 'outputPrice', e.target.value)}
                  />
                </td>
                <td>{row.modelMultiplier.toFixed(4)}</td>
                <td>{row.completionMultiplier.toFixed(4)}</td>
                <td>
                  <button onClick={() => calculateRow(index)}>Calculate</button>
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