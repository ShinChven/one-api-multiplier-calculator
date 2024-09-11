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
    return storedData ? JSON.parse(storedData).map((row: any) => ({
      ...row,
      originalValues: row.editing ? {
        modelName: row.modelName,
        inputPrice: row.inputPrice,
        outputPrice: row.outputPrice,
      } : null
    })) : [];
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
      newRows[index].originalValues = {
        modelName: newRows[index].modelName,
        inputPrice: newRows[index].inputPrice,
        outputPrice: newRows[index].outputPrice,
      };
    }
    newRows[index].editing = !newRows[index].editing;

    if (!newRows[index].editing) {
      localStorage.setItem(localStorageKey, JSON.stringify(newRows.map(row => ({...row, originalValues: null}))));
    }

    setRows(newRows);
  };

  const cancelEdit = (index: number) => {
    const newRows = [...rows];
    if (newRows[index].originalValues) {
      newRows[index] = {
        ...newRows[index],
        ...newRows[index].originalValues,
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
        <div style={{ textAlign: 'left' }}>
          <p>Price calculated per 1k Tokens</p>
          <p>
            <a href="https://github.com/songquanpeng" target="_blank" rel="noopener noreferrer">One-API</a> 是一个开源的 AI API 聚合程序，它支持 OpenAI、Google、Anthropic 等多个 API 提供商。One-API 通过一个统一的 API 接口，让用户可以方便地在不同的 API 提供商之间切换，并且提供用户计费功能，可以为每个用户的 API 请求计算价格。
          </p>
          <p>
            倍率：在 One-API 的模型定价体系中，以 $0.002 1K tokens 为1倍，换算成 1M tokens 为 $2。补全倍率：补全倍率是指输出为输入的倍率，即输出的价格是输入的倍数。例如，输入价格为 $10，输出价格为 $30，那么输出价格是输入价格的 3 倍，补全倍率为 3。用户分组倍率：one-api 的运行和维护需要一定的服务器成本，因此可以设置一个分组倍率让相关用户在使用时分摊这部分成本。额度 = 分组倍率 * 模型倍率 * （提示 token 数 + 补全 token 数 * 补全倍率）
          </p>
          <p>
            这里放一个 token 计费计算器方便大家使用：<a href="https://docsbot.ai/tools/gpt-openai-api-pricing-calculator" target="_blank" rel="noopener noreferrer">https://docsbot.ai/tools/gpt-openai-api-pricing-calculator</a>
          </p>
        </div>
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
                        <button onClick={() => cancelEdit(index)}>❌</button>
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